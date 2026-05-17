import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

async function migrateImage(base64Data: string, userId: string, type: "photo" | "logo") {
  if (!base64Data || !base64Data.startsWith("data:image")) return base64Data;

  try {
    // data:image/jpeg;base64,.... の形式からデータを抽出
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return base64Data;

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const extension = contentType.split("/")[1] || "jpg";
    const fileName = `${type}/${userId}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return `${PUBLIC_DOMAIN}/${fileName}`;
  } catch (err) {
    console.error(`Failed to migrate image for user ${userId}:`, err);
    return base64Data; // 失敗時は元のデータを返す
  }
}

async function main() {
  console.log("🚀 Starting migration from DB (Base64) to R2...");

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { photo_url: { startsWith: "data:image" } },
        { logo_url: { startsWith: "data:image" } }
      ]
    }
  });

  console.log(`📦 Found ${users.length} users with Base64 images.`);

  for (const user of users) {
    console.log(`Processing user: ${user.name || user.id}`);
    
    let updatedPhotoUrl = user.photo_url;
    let updatedLogoUrl = user.logo_url;

    if (user.photo_url?.startsWith("data:image")) {
      updatedPhotoUrl = await migrateImage(user.photo_url, user.id, "photo");
    }
    if (user.logo_url?.startsWith("data:image")) {
      updatedLogoUrl = await migrateImage(user.logo_url, user.id, "logo");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        photo_url: updatedPhotoUrl,
        logo_url: updatedLogoUrl
      }
    });

    console.log(`✅ Migrated images for user ${user.id}`);
  }

  console.log("✨ Migration completed successfully.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
