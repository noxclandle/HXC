import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getPublicProfile } from '@/lib/user';

export const dynamic = 'force-dynamic';

/**
 * メンバーの登録した名刺デザイン・情報を基に、SNSシェア用の美しいOGP画像を動的生成する
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new Response('Missing slug', { status: 400 });
    }

    // ユーザープロフィールの取得
    const profile = await getPublicProfile(slug);
    if (!profile) {
      return new Response('Profile not found', { status: 404 });
    }

    const displayName = profile.name || profile.handle_name || "MEMBER";
    const displayTitle = profile.profile?.title || "RESONANCE MEMBER";
    const displayCompany = profile.profile?.company || "HEXA RELATION";
    
    // 相対URLをSatoriが解凍できるように絶対URL化する
    const photoUrl = new URL(profile.photo_url || "/logo.png", req.url).toString();

    // 装備中のアセット（フレーム）に応じたテーマ色の決定
    const equipped = (profile.equipped_assets as any) || {};
    const frame = equipped.frame || "Obsidian";
    
    let borderColor = '#38bdf8'; // デフォルト: Azure (標準)
    let glowColor = 'rgba(56, 189, 248, 0.25)';
    let titleColor = '#38bdf8';
    
    if (frame === 'BlackCard' || frame === 'Apex') {
      borderColor = '#fb7185'; // Rose Gold
      glowColor = 'rgba(251, 113, 133, 0.25)';
      titleColor = '#fb7185';
    } else if (frame === 'Platinum' || frame === 'Executive') {
      borderColor = '#fb923c'; // Orange Gold
      glowColor = 'rgba(251, 146, 60, 0.25)';
      titleColor = '#fb923c';
    } else if (frame === 'Gold') {
      borderColor = '#fbbf24'; // Yellow Gold
      glowColor = 'rgba(251, 191, 36, 0.25)';
      titleColor = '#fbbf24';
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0c0c0c',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0c0c0c 100%)',
            position: 'relative',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* 背面のぼかしオーラ発光エフェクト (Satori互換の放射状グラデーションで自然なボケを表現) */}
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '350px',
              borderRadius: '200px',
              background: `radial-gradient(circle, ${glowColor} 0%, rgba(12, 12, 12, 0) 70%)`,
              top: '140px',
              left: '300px',
            }}
          />

          {/* 上部ブランディングヘッダー */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '900px',
              marginBottom: '35px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* ひし形ロゴアイコンの模写 */}
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  border: '1.5px solid #ffffff',
                  transform: 'rotate(45deg)',
                  marginRight: '14px',
                }}
              />
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 300,
                  letterSpacing: '0.4em',
                }}
              >
                HEXA RELATION
              </span>
            </div>
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.35)',
                fontSize: '11px',
                fontWeight: 200,
                letterSpacing: '0.3em',
              }}
            >
              IDENTITY RESONANCE
            </span>
          </div>

          {/* デジタル名刺本体プレビュー (Satori完全互換のクリーンなデザイン) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '900px',
              height: '440px',
              backgroundColor: '#050505',
              borderRadius: '28px',
              border: `1.5px solid ${borderColor}`,
              boxShadow: `0 0 50px ${glowColor}`,
              padding: '45px',
              position: 'relative',
              justifyContent: 'space-between',
            }}
          >
            {/* カード上段：会社名とホログラムマーク */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    color: '#ffffff',
                    fontSize: '20px',
                    fontWeight: 200,
                    letterSpacing: '0.25em',
                  }}
                >
                  {displayCompany}
                </span>
                <span
                  style={{
                    color: titleColor,
                    fontSize: '12px',
                    fontWeight: 300,
                    letterSpacing: '0.3em',
                    marginTop: '8px',
                  }}
                >
                  {displayTitle}
                </span>
              </div>
              
              {/* ホログラム印シール */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '28px',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    border: `1.2px solid ${borderColor}`,
                    transform: 'rotate(45deg)',
                  }}
                />
              </div>
            </div>

            {/* カード下段：氏名とプロフィール写真 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    color: '#ffffff',
                    fontSize: '48px',
                    fontWeight: 400,
                    letterSpacing: '0.08em',
                  }}
                >
                  {displayName}
                </span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.3)',
                    fontSize: '10px',
                    fontWeight: 200,
                    letterSpacing: '0.4em',
                    marginTop: '12px',
                  }}
                >
                  DIGITAL IDENTITY CARD
                </span>
              </div>

              {/* プロフィール画像アバター (Satori互換の丸型クリッピング) */}
              {profile.photo_url && (
                <div
                  style={{
                    width: '94px',
                    height: '94px',
                    borderRadius: '47px',
                    border: `1.5px solid ${borderColor}`,
                    overflow: 'hidden',
                    display: 'flex',
                    backgroundColor: '#111111',
                    boxShadow: `0 0 20px ${glowColor}`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={displayName}
                    style={{
                      width: '94px',
                      height: '94px',
                      borderRadius: '47px',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: unknown) {
    console.error("OGP generation failed:", error);
    return new Response('Failed to generate OGP image', { status: 500 });
  }
}
