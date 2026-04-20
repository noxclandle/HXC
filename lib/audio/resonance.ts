/**
 * 名刺受信時の共鳴音を生成・再生する
 * 将来的にはここで読み込む音声ファイルを変更可能にする
 */
export function playResonanceSound(type: "default" | "silver" | "void" = "default") {
  if (typeof window === "undefined") return;

  const context = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  
  // ランクやタイプによって周波数を変えることで「音」の格を変える
  switch (type) {
    case "void":
      oscillator.frequency.setValueAtTime(220, context.currentTime); // 低く深い音
      break;
    case "silver":
      oscillator.frequency.setValueAtTime(880, context.currentTime); // 高く鋭い音
      break;
    default:
      oscillator.frequency.setValueAtTime(440, context.currentTime); // 標準的なA音
  }

  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 1.5);
}
