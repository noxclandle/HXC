"use client";

import { useEffect, useRef } from "react";

/**
 * 流入の観測(Arrival Observation)。
 *
 * SNS投稿のリンクには utm_* が付与されているが(~/dev/trendi/utm.py)、
 * 着地点であるこのサイト側に受け皿が存在しなかったため、
 * どの投稿が訪問者を連れてきたのかが一切測れていなかった。
 *
 * 依存パッケージを増やさないため、firebase SDK ではなく Firestore の REST API を
 * 直接叩く。既存の Hexa Relation の Firebase プロジェクトへ相乗りする形で、
 * hexa-relation.com/admin/ から他事業と横並びで観測できる。
 *
 * - 既存のコード・UI・描画には一切干渉しない(副作用は fetch のみ)
 * - 失敗しても握りつぶす。観測が落ちても製品が止まってはならない
 * - 個人が特定されうる情報は送らない。パスは第1階層のみに丸めて記録する
 *
 * 時計屋(とけいや) 役割1「導線」
 *   ~/dev/HexaRelation_Inc/DEPARTMENTS/tokeiya/ROLES/01_導線.md
 */

// Firebase の Web API キーは公開前提の識別子(アクセス制御は Firestore ルール側で行う)。
// hexa-relation.com 側でも同じキーがHTMLに含まれている。
const API_KEY = "AIzaSyDlovNerE44bGykzWDJkqmoD4fbSHnzveI";
const PROJECT = "hexa-relation";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const PAGE_ID = "hxc";

const str = (v: string | null) =>
  v ? { stringValue: v } : { nullValue: null };

export default function ArrivalObserver() {
  const done = useRef(false);

  useEffect(() => {
    // 1訪問につき1回だけ。開発時の二重実行やクライアント遷移で増やさない。
    if (done.current) return;
    done.current = true;
    try {
      if (sessionStorage.getItem("hxc_arrival_observed")) return;
      sessionStorage.setItem("hxc_arrival_observed", "1");
    } catch {
      // プライベートブラウズ等で sessionStorage が使えない場合はそのまま続行
    }

    try {
      const q = new URLSearchParams(window.location.search);
      const source = q.get("utm_source");
      const label = source
        ? [source, q.get("utm_medium"), q.get("utm_campaign"), q.get("utm_content")]
            .filter(Boolean)
            .join("/")
        : q.get("ref") || q.get("from") || document.referrer || "direct";

      // 個人のプロフィールURL等が残らないよう、パスは第1階層までに丸める
      const path = "/" + (window.location.pathname.split("/")[1] || "");

      const post = (url: string, body: unknown) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          keepalive: true,
        }).catch(() => {});

      // 流入元の記録
      post(`${BASE}/referrals/${PAGE_ID}/logs?key=${API_KEY}`, {
        fields: {
          referrer: { stringValue: label },
          utm_source: str(source),
          utm_medium: str(q.get("utm_medium")),
          utm_campaign: str(q.get("utm_campaign")),
          utm_content: str(q.get("utm_content")),
          path: { stringValue: path },
          timestamp: { timestampValue: new Date().toISOString() },
        },
      });

      // 訪問数の加算(hexa-relation.com 側と同じ analytics スキーマに合わせる)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      post(
        `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:commit?key=${API_KEY}`,
        {
          writes: [
            {
              update: {
                name: `projects/${PROJECT}/databases/(default)/documents/analytics/${PAGE_ID}`,
                fields: { lastVisit: { timestampValue: new Date().toISOString() } },
              },
              updateMask: { fieldPaths: ["lastVisit"] },
              updateTransforms: [
                { fieldPath: "hits", increment: { integerValue: "1" } },
                {
                  fieldPath: isMobile ? "mobileHits" : "pcHits",
                  increment: { integerValue: "1" },
                },
              ],
            },
          ],
        }
      );
    } catch {
      // 観測の失敗で製品の動作を止めない
    }
  }, []);

  return null;
}
