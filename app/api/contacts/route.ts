import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { checkAndAwardTitles } from "@/lib/game/titles";

/**
 * 相手の名刺をLibraryに保存するAPI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, handle, email, phone, address, notes, role } = data; // roleはOCRで取得した役職

    // 肩書きによるRTの重み付け判定 (新バランス)
    const isHighValue = /社長|代表|CEO|役員|Director|President/i.test(role || name || "");
    const rtBonus = isHighValue ? 100 : 20;

    // AIによるタグの自動生成
    const ai_tags = [];
    if (isHighValue) ai_tags.push("High-Value");
    if (/エンジニア|開発|Tech/i.test(notes || role || "")) ai_tags.push("Technical");
    if (/営業|Sales/i.test(notes || role || "")) ai_tags.push("Sales");
    if (notes && notes.length > 0) ai_tags.push("Analyzed");

    // ...

    const contact = await prisma.contact.create({
      data: {
        owner_id: session.user.id,
        name,
        handle_name: handle,
        email,
        phone,
        address,
        notes: role || notes,
        ai_tags, // 追加
        coord_x,
        coord_y,
      },
    });

    // RTの付与を実行
    await executeRTTransaction(
      session.user.id,
      rtBonus,
      "earn",
      `Met a ${isHighValue ? "High-Value Identity" : "Soul"}: ${name}`
    );

    // 称号のチェック
    const newlyUnlocked = await checkAndAwardTitles(session.user.id);

    return NextResponse.json({ 
      success: true, 
      contact,
      newlyUnlocked // フロントエンドでエフェクトを表示するために返す
    });
  } catch (error: any) {
// ...
    console.error("Failed to save contact:", error);
    return NextResponse.json({ error: "Failed to archive resonance." }, { status: 500 });
  }
}
