import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { s3Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/lib/logger";

/**
 * Cloudflare R2への画像アップロードAPI
 * POST /api/upload
 * Body: FormData { file: File, type: "photo" | "logo" }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string || "asset";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "image/jpeg";
    const extension = contentType.split("/")[1] || "jpg";
    const fileName = `${type}/${session.user.id}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    const publicUrl = `${R2_PUBLIC_DOMAIN}/${fileName}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: unknown) {
    logger.error("Upload error", { error });
    return NextResponse.json({ error: "Failed to upload to R2" }, { status: 500 });
  }
}
