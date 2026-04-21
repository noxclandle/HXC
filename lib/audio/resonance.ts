/**
 * 名刺受信時の共鳴音を生成・再生する
 * 複数のオシレーターを重ね、神秘的な「共鳴」を演出する
 */
export function playResonanceSound(type: "default" | "silver" | "void" = "default") {
  if (typeof window === "undefined") return;

  const context = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = context.currentTime;

  // 複数の音を重ねて厚みのある音色を作る (Additive Synthesis)
  const createOscillator = (freq: number, gainVal: number, duration: number) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    
    // アタックとリリース (エンベロープ)
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    osc.connect(gain);
    gain.connect(context.destination);
    
    osc.start(now);
    osc.stop(now + duration);
  };

  switch (type) {
    case "void":
      createOscillator(110, 0.2, 2.0); // 深いベース
      createOscillator(220, 0.1, 1.5); // オクターブ
      createOscillator(222, 0.05, 1.5); // わずかにデチューンして揺らぎ
      break;
    case "silver":
      createOscillator(880, 0.15, 1.2); // 高いベルのような音
      createOscillator(1320, 0.1, 1.0); // 5度上の倍音
      createOscillator(1760, 0.05, 0.8); // 1オクターブ上の倍音
      break;
    default:
      createOscillator(440, 0.1, 1.5); // 標準的なA
      createOscillator(660, 0.05, 1.2); // 5度上
  }
}

