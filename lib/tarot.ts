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
    jpName: "THE VOID / 愚者・虚無",
    upright: {
      meaning: "Freedom, Departure, Infinite Possibilities / 自由・出発・無限の可能性",
      oracle: "Having nothing, the boundary is open to you. Do not fear stepping into the unknown. The beginning is always in chaos. / 何も持たぬがゆえに、境界は開かれている。未知へ踏み出すことを恐れるな。"
    },
    reversed: {
      meaning: "Recklessness, Hesitation, Boundary Turbulence / 無計画・焦り・境界の乱れ",
      oracle: "Blind faith and disorder will trip you up. The boundary is infinite, but a leap without a compass leads to darkness. Slow down. / 盲信と無秩序が足元をすくう。羅針盤なき跳躍は暗闇への墜落を意味する。"
    }
  },
  {
    id: 1,
    name: "THE RESONANCE",
    jpName: "THE RESONANCE / 魔術師・共鳴",
    upright: {
      meaning: "Creation, Talent, Sync Initiation / 創造・才能・同調の開始",
      oracle: "All elements are set. Your will synchronizes the physical and digital. Activate your RT and rewrite reality. / 机上にすべての要素は揃った。あなたの意思が物理とデジタルを同期させる。"
    },
    reversed: {
      meaning: "Indecision, Stagnation, Sync Failure / 優柔不断・停滞・同調不全",
      oracle: "The tools are ready, but the trigger is not pulled. Doubt blocks the resonance. Re-examine your identity. / 道具は揃っているが、引き金が引かれていない。自己を見つめ直せ。"
    }
  },
  {
    id: 2,
    name: "THE SECRECY",
    jpName: "THE SECRECY / 女教皇・秘匿",
    upright: {
      meaning: "Intellect, Intuition, Deep Silence / 知性・直感・深層の静寂",
      oracle: "No need for many words. Silence holds the strongest encryption. Trust your intuition and observe the boundary quietly. / 多くを語る必要はない。沈黙の中にこそ、最も強固なセキュリティ（暗号）が存在する。"
    },
    reversed: {
      meaning: "Nervousness, Info Overload, Suspicion / 神経質・情報過多・猜疑心",
      oracle: "Information becomes noise, clouding your intuition. Block out external eyes and quiet the encryption noise. / 情報がノイズとなり、直感を曇らせている。外部の目を排除せよ。"
    }
  },
  {
    id: 3,
    name: "THE ARCHITECT",
    jpName: "THE ARCHITECT / 女帝・構築者",
    upright: {
      meaning: "Abundance, Growth, System Completion / 豊穣・繁栄・システムの完成",
      oracle: "The foundation you built is taking root. Nurtured relations will bear fruit. Go with the flow and accept the harvest. / 構築した基盤は着実に根を張っている。育まれた関係性は豊かな実を結ぶだろう。"
    },
    reversed: {
      meaning: "Dependency, Laziness, Delayed Progress / 依存・怠惰・進捗の遅れ",
      oracle: "Overprotection stalls system circulation. Step back and watch the autonomous synchronization process transition. / 過剰な保護が停滞を招く。自律的な同期プロセスの推移を見守るべきだ。"
    }
  },
  {
    id: 4,
    name: "THE CHIEF OFFICER",
    jpName: "THE CHIEF OFFICER / 皇帝・管理官",
    upright: {
      meaning: "Authority, Order, Firm Will / 支配・秩序・強固な意志",
      oracle: "Governing the boundary requires unwavering leadership. Bear the responsibility and maintain an ordered system. / 境界の統治には揺るぎないリーダーシップが必要だ。責任を背負い秩序あるシステムを維持せよ。"
    },
    reversed: {
      meaning: "Tyranny, Loss of Control, Helplessness / 独裁・統制失調・無力感",
      oracle: "Rule by force breaks the system. Do not cling to power; accept structural bugs and strive to repair them. / 力任せの支配はシステムの破綻を招く。バグを素直に受け入れ、修復に努めよ。"
    }
  },
  {
    id: 5,
    name: "THE MASTERMIND",
    jpName: "THE MASTERMIND / 法王・指導者",
    upright: {
      meaning: "Harmony, Trust, Hidden Order / 調和・信頼・隠された秩序",
      oracle: "Traditional teachings and hidden wisdom guide you. Find hints in legacy code and documents. Follow the rules. / 隠された知恵が貴方を導く。先達が遺したドキュメントやコードにヒントがある。"
    },
    reversed: {
      meaning: "Blind Faith, Dogmatism, Outdated Rules / 盲信・視野狭窄・ルールの形骸化",
      oracle: "Bound by outdated specifications and obsolete rules. Break free from dogmatism and consider refactoring. / 古い仕様や形骸化した規則に縛られている。システムの根本的リファクタリングを。"
    }
  },
  {
    id: 6,
    name: "THE HARMONY",
    jpName: "THE HARMONY / 恋人・調和",
    upright: {
      meaning: "Choice, Bond, Perfect Alignment / 選択・絆・同調の完成",
      oracle: "Souls resonate, creating a perfect alignment. A sign of a vital partnership or flawless technological synchronization. / 魂が呼応し、完璧なアライメントが生まれる。完全な同期（シンクロ）の予兆。"
    },
    reversed: {
      meaning: "Disharmony, Indecision, Misalignment / 不調和・優柔不断・誤った同期",
      oracle: "Drifting toward short-term optimization or sweet temptation. Do not compromise on critical decisions. / 目先の甘い誘惑や一時的な最適化に流されている。本来の接続先を見極めよ。"
    }
  },
  {
    id: 10,
    name: "THE CYCLE",
    jpName: "THE CYCLE / 運命の輪・周期",
    upright: {
      meaning: "Turning Point, Good Fortune, Shift / 好転・幸運の到来・潮目の変化",
      oracle: "The tide of the boundary pushes you upward. A window of opportunity is open. Tap and initiate the sync process. / 境界のうねりが貴方を上方へ押し上げる。迷わずタップし、同期プロセスを開始せよ。"
    },
    reversed: { 
      meaning: "Bad Timing, Temp Setback, Sync Delay / 空回り・一時的後退・同期遅延",
      oracle: "You are in a valley. Rapid tapping only causes errors. Wait quietly for DNS propagation and for the time to ripen. / 周期の谷間にいる。焦って連打してもエラーを招くだけだ。静かに待つのが賢明である。"
    }
  },
  {
    id: 13,
    name: "THE ERADICATION",
    jpName: "THE ERADICATION / 死神・抹消と再構築",
    upright: {
      meaning: "End and Beginning, Reset / 終焉と始まり・完全なるリセット",
      oracle: "Old ledgers must be erased. The end is not defeat, but initialization of a new system. Shed without fear. / 古い台帳（データ）は抹消されねばならない。終わりは新たな初期化（Initialization）である。"
    },
    reversed: {
      meaning: "Attachment, Resistance, Legacy Cache / 執着・悪あがき・中途半端な残存",
      oracle: "Clinging to legacy ruins or obsolete cache. Clear the database to move forward. / 過去の残骸や不要なキャッシュにしがみついている。DBをクリーンにしなければ次へ進めない。"
    }
  },
  {
    id: 15,
    name: "THE DETECTOR",
    jpName: "THE DETECTOR / 悪魔・束縛",
    upright: {
      meaning: "Obsession, Temptation, Dependency / 執着・強い誘惑・盲目的な依存",
      oracle: "Your mind is trapped by strong convenience. Dependency restricts the soul's freedom. Realize what binds you. / 強い魅力や利便性に心が囚われている。何に束縛されているのか自覚せよ。"
    },
    reversed: {
      meaning: "Release, Breaking Habits, Unlinking / 解放の始まり・悪習慣の脱却",
      oracle: "A sign of escaping bonds (bugs and dependencies). Unlink by your own will to regain independence. / 囚われていた束縛（バグ）から脱する兆し。自らの意思で接続を解除し、自立を取り戻せ。"
    }
  },
  {
    id: 18,
    name: "THE SHADOW",
    jpName: "THE SHADOW / 月・混沌",
    upright: {
      meaning: "Anxiety, Illusion, Hidden Truth / 不安・幻影・見えない真実",
      oracle: "The boundary is vague, and the roadmap is shrouded in fog. Watch for warning signals (errors) in the dark. / 境界は朧げであり、ロードマップは霧の中。暗闇で動く不穏なシグナルに注視せよ。"
    },
    reversed: {
      meaning: "Dispelling Fears, Revealing Truth / 不安の解消・真実の露呈",
      oracle: "The fog clears, exposing the core of the bug. The true identity of the cold start is found. Time to execute. / 霧が晴れ、バグの本質が光の下に晒される。見えない恐怖の正体は突き止めた。実行するのみ。"
    }
  },
  {
    id: 21,
    name: "THE IDENTITY",
    jpName: "THE IDENTITY / 世界・統合",
    upright: {
      meaning: "Completion, Perfect Harmony, Transcendence / 完成・完全調和・境界の超越",
      oracle: "Physical and digital identities are perfectly merged. Your world is integrated in complete harmony. No further action needed. / 物理とデジタルのアイデンティティが完全に融合した。完璧な調和を示している。"
    },
    reversed: {
      meaning: "Incomplete, Stagnation at the Threshold / 未完成・目標寸前での停滞",
      oracle: "Nearly complete, but the final piece (connection verification) is missing. Do not compromise; monitor the deployment. / ほぼ完成に近いが、最後の1ピースが不足している。妥協せず完璧な終着点を目指せ。"
    }
  }
];

export function getRandomCard(): { card: TarotCard; isUpright: boolean } {
  const randomIndex = Math.floor(Math.random() * tarotDeck.length);
  const card = tarotDeck[randomIndex];
  const isUpright = Math.random() > 0.3; // 70% upright, 30% reversed
  return { card, isUpright };
}
