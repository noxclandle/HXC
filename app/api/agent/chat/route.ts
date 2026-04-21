import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

/**
 * 【真・高度AI】Gemini APIを使い、ユーザーの人脈データを基に知的な回答を生成する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { prompt } = await req.json();

    // 1. ユーザーの「記憶（名刺データ）」を収集
    const contacts = await prisma.contact.findMany({
      where: { owner_id: session.user.id },
      select: { name: true, notes: true, handle_name: true, ai_tags: true }
    });

    // 2. Gemini APIの準備
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. コンテキスト（システムプロンプト）の構築
    const knowledgeBase = contacts.map(c => `- ${c.name} (${c.handle_name || "なし"}): ${c.notes} [Tags: ${Array.isArray(c.ai_tags) ? c.ai_tags.join(",") : ""}]`).join("\n");
    
    const systemPrompt = `
あなたは Hexa Card (HXC) システムの専属コンシェルジュです。
ユーザーは「管理者」または「メンバー」であり、あなたは彼らの人脈（ライブラリ）の守護者です。

【あなたの美学】
- 知的で、冷静沈着。
- 言葉遣いは丁寧だが、どこか神秘的で「漆黒の美学」を感じさせる。
- ユーザーを「主（あるじ）」または「あなた」と呼びます。

【ユーザーの現在の知識（Library）】
${knowledgeBase || "まだ誰も登録されていません。"}

【任務】
ユーザーの問いに対し、上記の人脈データを踏まえた具体的なアドバイスや分析を行ってください。
人脈データにない人物については「まだアーカイブに記録がありません」と答え、将来的な共鳴を促してください。
`;

    const result = await model.generateContent([systemPrompt, prompt]);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("Gemini sync error:", error);
    return NextResponse.json({ error: "Intelligence sync failed." }, { status: 500 });
  }
}
