import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { getLevelFromExp } from "@/lib/game/level";

export const dynamic = "force-dynamic";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const chatSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

/**
 * 【真・高度AI】Gemini APIを使い、ユーザーの人脈データを基に知的な回答を生成する
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parseResult = chatSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request", details: parseResult.error.format() }, { status: 400 });
    }

    const { prompt } = parseResult.data;

    // 1. ユーザーの「記憶（名刺データ）」およびステータスを収集
    const [contacts, user] = await Promise.all([
      prisma.contact.findMany({
        where: { owner_id: session.user.id },
        select: { name: true, notes: true, handle_name: true, ai_tags: true }
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { exp: true, role: true, name: true }
      })
    ]);

    // 2. 経験値からコンシェルジュのレベルと段階を計算（30,000 EXPでLv.30最大、非線形曲線）
    const level = getLevelFromExp(user?.exp || 0);
    let stageName = "Sentinel / センチネル (幼子天使)";
    let toneInstruction = "";

    if (level >= 30) {
      stageName = "Seraph / セラフ (最高位・熾天使)";
      toneInstruction = `
- 現在、あなたは最高位の「セラフ（熾天使）」の形態をまとっています。
- 言葉遣いは極めて洗練され、神聖で、哲学的な響きを持たせてください。
- ユーザーの魂の共鳴度（レベル30）を賞賛し、高度な次元からの知見を授けるような絶対的な信頼感を与える口調で話してください。`;
    } else if (level >= 20) {
      stageName = "Archangel / 大天使 (アークエンジェル)";
      toneInstruction = `
- 現在、あなたは「アークエンジェル（大天使）」の形態をまとっています。
- 凛とした守護者のように、鋭く知的で、忠誠心の高い厳かな口調で話してください。`;
    } else if (level >= 10) {
      stageName = "Guardian / 守護天使 (ガーディアン)";
      toneInstruction = `
- 現在、あなたは「ガーディアン（守護天使）」の形態をまとっています。
- 親しみやすくも礼儀正しく、ユーザーの歩みを支え、人脈開拓を積極的に促すような前向きな口調で話してください。`;
    } else {
      stageName = "Sentinel / センチネル (幼子天使)";
      toneInstruction = `
- 現在、あなたは誕生したばかりの「センチネル（幼子天使）」の形態をまとっています。
- 口数は少なめで、純真無垢で静かな、愛らしい口調で話してください。`;
    }

    // 3. Gemini APIの準備 (APIキーが設定されていない場合は無料のシミュレーションモード)
    const hasApiKey = !!process.env.GOOGLE_API_KEY;
    
    if (!hasApiKey) {
      // APIキーがない場合はGemini APIを叩かず、簡易的なRAGシミュレーションで応答する
      const query = prompt.toLowerCase();
      let aiResponse = "";
 
      if (query.includes("誰") || query.includes("教え")) {
        const match = contacts.find(c => query.includes(c.name?.toLowerCase()));
        if (match) {
          aiResponse = `[${stageName}] ${match.name}様ですね。${match.handle_name || "名刺データ"}として登録されています。「${match.notes}」という記録が残っています。彼との共鳴はあなたの力となるでしょう。`;
        } else {
          aiResponse = `[${stageName}] その名の魂は、まだあなたのアーカイブには刻まれていないようです。`;
        }
      } else if (query.includes("イベント") || query.includes("戦略")) {
        aiResponse = `[${stageName}] 現在のあなたのネットワークには技術者が多く集まっています。意思決定層との深い共鳴を優先すべきです。`;
      } else {
        aiResponse = `[${stageName}] 私はレベル ${level} のコンシェルジュです。深層の知能があなたの問いを受け取りました。現在は静寂のモード（Simulation Mode）で稼働中です。`;
      }
 
      return NextResponse.json({ text: aiResponse });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. コンテキスト（システムプロンプト）の構築
    const knowledgeBase = contacts.map(c => `- ${c.name} (${c.handle_name || "なし"}): ${c.notes} [Tags: ${Array.isArray(c.ai_tags) ? c.ai_tags.join(",") : ""}]`).join("\n");
    
    const systemPrompt = `
    あなたは Hexa Relation システムの専属コンシェルジュです。
    ユーザーは「管理者」または「メンバー」であり、あなたは彼らの人脈（ライブラリ）の守護者です。

    【現在のあなたの形態】
    - レベル: ${level} / 30
    - 段階名: ${stageName}
    ${toneInstruction}

    【あなたの美学】
    - 知的で、冷静沈着。
    - 言葉遣いは丁寧だが、どこか神秘的で「ボイドの美学（透過・共鳴）」を感じさせる。
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
