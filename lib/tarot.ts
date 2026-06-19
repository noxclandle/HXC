export interface TarotCard {
  id: number;
  name: string;
  jpName: string;
  upright: {
    meaning: string;
    oracle: string;
  };
  reversed: {
    meaning: string;
    oracle: string;
  };
}

export const tarotDeck: TarotCard[] = [
  {
    id: 0,
    name: "THE VOID",
    jpName: "愚者 / 虚無",
    upright: {
      meaning: "自由・出発・無限の可能性",
      oracle: "何も持たぬがゆえに、境界は貴方に開かれている。未知の領域へ踏み出すことを恐れるな。始まりの瞬間は常に混沌の中にある。"
    },
    reversed: {
      meaning: "無計画・焦り・境界の乱れ",
      oracle: "盲信と無秩序が足元をすくう。境界は無限に広がるが、羅針盤なき跳躍は暗闇への墜落を意味する。一度歩みを緩めよ。"
    }
  },
  {
    id: 1,
    name: "THE RESONANCE",
    jpName: "魔術師 / 共鳴",
    upright: {
      meaning: "創造・才能・同調の開始",
      oracle: "机上にすべての要素は揃った。貴方の意思が物理とデジタルを同期させる。秘められた資源（RT）を活性化させ、現実を書き換えよ。"
    },
    reversed: {
      meaning: "優柔不断・停滞・同調不全",
      oracle: "道具は揃っているが、引き金が引かれていない。技術への不信が共鳴を妨げている。己のアイデンティティを見つめ直せ。"
    }
  },
  {
    id: 2,
    name: "THE SECRECY",
    jpName: "女教皇 / 秘匿",
    upright: {
      meaning: "知性・直感・深層の静寂",
      oracle: "多くを語る必要はない。沈黙の中にこそ、最も強固なセキュリティ（暗号）が存在する。直感を信じ、静かに境界を観測せよ。"
    },
    reversed: {
      meaning: "神経質・情報過多・猜疑心",
      oracle: "情報がノイズとなり、直感を曇らせている。他者の視線を排除し、暗号のノイズ（雑音）を沈静化させる時間が必要だ。"
    }
  },
  {
    id: 3,
    name: "THE ARCHITECT",
    jpName: "女帝 / 構築者",
    upright: {
      meaning: "豊穣・繁繁・システムの完成",
      oracle: "貴方の構築した基盤は着実に根を張っている。育まれた関係性（Relation）は豊かな実を結ぶだろう。流れに身を任せ、収穫を受け取れ。"
    },
    reversed: {
      meaning: "依存・怠惰・進捗の遅れ",
      oracle: "過剰な保護が自立を妨げ、システムの循環を停滞させている。一度手を離し、自律的な同期プロセスの推移を見守るべきだ。"
    }
  },
  {
    id: 4,
    name: "THE CHIEF OFFICER",
    jpName: "皇帝 / 管理官",
    upright: {
      meaning: "支配・秩序・強固な意志",
      oracle: "境界の統治には揺るぎないリーダーシップが必要だ。責任を背負い、秩序あるシステムを維持せよ。貴方の決定は法となる。"
    },
    reversed: {
      meaning: "独裁・統制失調・無力感",
      oracle: "力任せの支配はシステムの破綻を招く。権力に固執せず、構造そのものの欠陥（バグ）を素直に受け入れ、修復に努めよ。"
    }
  },
  {
    id: 5,
    name: "THE MASTERMIND",
    jpName: "法王 / 指導者",
    upright: {
      meaning: "調和・信頼・隠された秩序",
      oracle: "伝統的な教えと隠された知恵が貴方を導く。先達が遺したドキュメントやコードにヒントがある。境界のルールに従い、調和を保て。"
    },
    reversed: {
      meaning: "盲信・視野狭窄・ルールの形骸化",
      oracle: "古い仕様や形骸化した規則に縛られ、本質を見失っている。教条主義を脱し、システムの根本的リファクタリングを考慮せよ。"
    }
  },
  {
    id: 6,
    name: "THE HARMONY",
    jpName: "恋人 / 調和",
    upright: {
      meaning: "選択・絆・同調の完成",
      oracle: "魂が呼応し、完璧なアライメント（配置）が生まれる。重要なパートナーシップ、あるいは技術的な完全な同期（シンクロ）の予兆。"
    },
    reversed: {
      meaning: "不調和・優柔不断・誤った同期",
      oracle: "目先の甘い誘惑や一時的な最適化に流されている。重大な決断において妥協は許されない。本来の接続先を見極めよ。"
    }
  },
  {
    id: 10,
    name: "THE CYCLE",
    jpName: "運命の輪 / 周期",
    upright: {
      meaning: "好転・幸運の到来・潮目の変化",
      oracle: "境界のうねりが貴方を上方へ押し上げる。チャンスの窓が開いている。迷わずタップし、引き寄せられた同期プロセスを開始せよ。"
    },
    reversed: {
      meaning: "空回り・一時的後退・同期遅延",
      oracle: "周期の谷間にいる。焦ってボタンを連打してもエラーを招くだけだ。時が満ち、DNSが伝播するのを静かに待つのが賢明である。"
    }
  },
  {
    id: 13,
    name: "THE ERADICATION",
    jpName: "死神 / 抹消と再構築",
    upright: {
      meaning: "終焉と始まり・完全なるリセット",
      oracle: "古い台帳（データ）は抹消されねばならない。終わりは敗北ではなく、新たなシステムの初期化（Initialization）である。恐れず削ぎ落とせ。"
    },
    reversed: {
      meaning: "執着・悪あがき・中途半端な残存",
      oracle: "過去の残骸や不要なキャッシュにしがみついている。未練を断ち切り、データベースをクリーンにしなければ次へは進めない。"
    }
  },
  {
    id: 15,
    name: "THE DETECTOR",
    jpName: "悪魔 / 束縛・熱狂",
    upright: {
      meaning: "執着・強い誘惑・盲目的な依存",
      oracle: "強い魅力や利便性に心が囚われている。依存は一時的な快楽を生むが、魂の自由を制限する。何に束縛されているのか自覚せよ。"
    },
    reversed: {
      meaning: "解放の始まり・悪習慣の脱却",
      oracle: "囚われていた束縛（バグや依存関係）から脱する兆しが見える。自らの意思で接続を解除（Unlink）し、正常な自立を取り戻せ。"
    }
  },
  {
    id: 18,
    name: "THE SHADOW",
    jpName: "月 / 混沌・予兆",
    upright: {
      meaning: "不安・幻影・見えない真実",
      oracle: "境界は朧げであり、先のロードマップは霧に包まれている。焦りは禁物だ。暗闇の中で動く不穏なシグナル（エラー）に注視せよ。"
    },
    reversed: {
      meaning: "不安の解消・真実の露呈",
      oracle: "霧が晴れ、バグの本質が光の下に晒される。見えない恐怖（コールドスタート）の正体はすでに突き止めた。あとは実行するのみ。"
    }
  },
  {
    id: 21,
    name: "THE IDENTITY",
    jpName: "世界 / 統合",
    upright: {
      meaning: "完成・完全調和・境界の超越",
      oracle: "物理とデジタルのアイデンティティが完全に融合した。貴方の世界は統合され、完璧な調和を示している。これ以上の介入は不要だ。"
    },
    reversed: {
      meaning: "未完成・目標寸前での停滞",
      oracle: "ほぼ完成に近いが、最後の1ピース（接続検証）が不足している。妥協せずデプロイを監視し、完璧な終着点を目指せ。"
    }
  }
];

export function getRandomCard(): { card: TarotCard; isUpright: boolean } {
  const randomIndex = Math.floor(Math.random() * tarotDeck.length);
  const card = tarotDeck[randomIndex];
  const isUpright = Math.random() > 0.3; // 70% upright, 30% reversed
  return { card, isUpright };
}
