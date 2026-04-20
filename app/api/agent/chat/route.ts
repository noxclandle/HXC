import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * 【高度AI】ユーザーの人脈データを基に、知的な回答を生成する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { prompt } = await req.json();

    // 1. ユーザーの「記憶（名刺データ）」を収集
    const contacts = await prisma.contact.findMany({
      where: { owner_id: session.user.id },
      select: { name: true, notes: true, role: true, ai_tags: true }
    });

    // 2. コンテキストの構築（本来はここでGemini APIを叩く）
    // 簡易的なRAG（検索拡張生成）ロジックをシミュレーション
    const knowledge = contacts.map(c => `${c.name}(${c.role}): ${c.notes}`).join("\n");
    
    let aiResponse = "";
    const query = prompt.toLowerCase();

    if (query.includes("誰") || query.includes("教え")) {
      const match = contacts.find(c => query.includes(c.name?.toLowerCase()));
      if (match) {
        aiResponse = `${match.name}様ですね。${match.role}として登録されています。「${match.notes}」という記録が残っています。彼との共鳴はあなたの力となるでしょう。`;
      } else {
        aiResponse = "その名の魂は、まだあなたのアーカイブには刻まれていないようです。";
      }
    } else if (query.includes("イベント") || query.includes("戦略")) {
      aiResponse = "現在のあなたのネットワークには技術者が多く集まっています。次回のイベントでは、意思決定層（CEO/役員）との深い共鳴を優先すべきです。";
    } else {
      aiResponse = "深淵の知能があなたの問いを受け取りました。あなたの築き上げた人脈（星座）から最適な解を導き出します。";
    }

    return NextResponse.json({ text: aiResponse });
  } catch (error) {
    return NextResponse.json({ error: "Intelligence sync failed." }, { status: 500 });
  }
}
