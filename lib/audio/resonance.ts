/**
 * 名刺受信時の共鳴音を生成・再生する
 * 複数のオシレーターを重ね、神秘的な「共鳴」を演出する
 */
export function playConnectionSound(type: string = "resonance") {
  if (typeof window === "undefined") return;

  const context = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = context.currentTime;

  const createOscillator = (freq: number, gainVal: number, duration: number, oscType: "sine" | "square" | "sawtooth" | "triangle" = "sine") => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    
    osc.type = oscType;
    osc.frequency.setValueAtTime(freq, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    osc.connect(gain);
    gain.connect(context.destination);
    
    osc.start(now);
    osc.stop(now + duration);
  };

  const id = type.toLowerCase();

  if (id === "click") {
    createOscillator(1200, 0.1, 0.1, "square");
    return;
  }
  if (id === "wind") {
    createOscillator(220, 0.05, 2.0);
    createOscillator(230, 0.03, 2.0);
    return;
  }
  if (id === "water") {
    createOscillator(1500, 0.1, 0.3, "sine");
    createOscillator(1800, 0.05, 0.2, "sine");
    return;
  }
  if (id === "crystal") {
    createOscillator(1046.5, 0.1, 1.5, "sine");
    createOscillator(1318.5, 0.08, 1.2, "sine");
    createOscillator(1568.0, 0.05, 1.0, "sine");
    return;
  }
  if (id === "deep") {
    createOscillator(60, 0.3, 2.5);
    createOscillator(120, 0.1, 2.0);
    return;
  }
  if (id === "heaven") {
    createOscillator(349, 0.1, 3.0);
    createOscillator(523, 0.05, 2.5);
    createOscillator(698, 0.03, 2.0);
    return;
  }
  if (id === "omega") {
    createOscillator(40, 0.4, 4.0);
    createOscillator(80, 0.2, 3.5);
    createOscillator(1000, 0.05, 1.0);
    return;
  }

  switch (id) {
    case "resonance":
      createOscillator(165, 0.15, 1.8);
      createOscillator(330, 0.1, 1.4);
      createOscillator(495, 0.05, 1.2);
      createOscillator(660, 0.03, 1.0);
      break;
    case "void":
      createOscillator(110, 0.2, 2.0);
      createOscillator(220, 0.1, 1.5);
      createOscillator(222, 0.05, 1.5);
      break;
    case "silver":
      createOscillator(880, 0.15, 1.2);
      createOscillator(1320, 0.1, 1.0);
      createOscillator(1760, 0.05, 0.8);
      break;
    default:
      createOscillator(440, 0.1, 1.5);
      createOscillator(660, 0.05, 1.2);
  }
}
