import { NextRequest, NextResponse } from "next/server";
import { sendDiscordNotification } from "@/lib/discord";

/**
 * Discord通知テスト用
 * 成功演出を含むHTMLを返す
 */
export async function GET(req: NextRequest) {
  try {
    await sendDiscordNotification("【HXC監視局】テスト：RTチャージを検知。ユーザーID: test-admin, 付与RT: 23,000");

    const html = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Resonance Established</title>
        <style>
          body { background-color: #050505; color: #fff; font-family: sans-serif; overflow: hidden; }
          .glow { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
        </style>
      </head>
      <body class="flex flex-col items-center justify-center min-h-screen p-6">
        <div class="max-w-md w-full text-center space-y-12">
          <div class="relative flex justify-center">
            <div class="absolute inset-0 bg-azure-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
            <svg width="80" height="80" viewBox="0 0 100 100" class="relative z-10 opacity-80">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="white" stroke-width="1" />
              <circle cx="50" cy="50" r="8" fill="white" />
            </svg>
          </div>

          <div class="space-y-4">
            <h1 class="text-[12px] tracking-[0.8em] uppercase opacity-40 font-bold ml-[0.8em]">Notification Sent</h1>
            <p class="text-[14px] tracking-[0.4em] uppercase font-light leading-relaxed">
              監視局への共鳴が完了しました。<br/>
              <span class="text-azure-400 opacity-80">Discordを確認してください。</span>
            </p>
          </div>

          <div class="pt-8">
            <a href="/inventory" class="px-8 py-3 border border-white/10 hover:border-white/40 text-[9px] tracking-[0.5em] uppercase transition-all opacity-30 hover:opacity-100">
              Return to Vault
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
