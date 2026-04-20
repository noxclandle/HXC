import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 相関図(Resonance Graph)用のデータを生成するAPI
 * GET /api/admin/graph/data
 */
export async function GET(req: NextRequest) {
  try {
    // 1. 全ユーザーの取得
    const users = await prisma.user.findMany({
      select: { id: true, handle_name: true, rank: true }
    });

    // 2. 名刺交換（Contacts）の取得
    const connections = await prisma.contact.findMany({
      select: { owner_id: true, name: true, handle_name: true }
    });

    // 3. グラフ形式に変換
    const nodes = users.map(u => ({
      id: u.id,
      label: u.handle_name || "Unknown",
      rank: u.rank,
      size: connections.filter(c => c.owner_id === u.id).length + 1 // 繋がりが多いほどサイズアップ
    }));

    const links = connections.map(c => {
      // 相手のIDを特定（handle_nameが一致するユーザーを探す簡易的な紐付け）
      const targetUser = users.find(u => u.handle_name === c.handle_name);
      return targetUser ? { source: c.owner_id, target: targetUser.id } : null;
    }).filter(Boolean);

    return NextResponse.json({ nodes, links });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch graph data." }, { status: 500 });
  }
}
