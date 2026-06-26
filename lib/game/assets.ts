export interface Asset {
  id: string;
  name: string;
  type: "frame" | "sound" | "effect" | "angel" | "title" | "pointer" | "background" | "fontFamily" | "aura";
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  description: string;
  unlocked: boolean;
}

export const CATEGORIES = [
  { id: "frame", name: "フレーム", sub: "外枠" },
  { id: "aura", name: "オーラ", sub: "オーラ" },
  { id: "background", name: "背景", sub: "背景" },
  { id: "effect", name: "エフェクト", sub: "エフェクト" },
  { id: "title", name: "称号", sub: "称号" },
  { id: "pointer", name: "クリック演出", sub: "クリック演出" },
  { id: "sound", name: "音響", sub: "音響" },
];

export const ASSETS: Asset[] = [
  // --- Frames ---
  { id: "Obsidian", name: "Obsidian Edge", type: "frame", rarity: "common", description: "標準的な黒檀の外枠。誠実さの象徴。 / Standard obsidian edge.", unlocked: true },
  { id: "Linen", name: "Linen Texture", type: "frame", rarity: "common", description: "素朴な布の質感。 / Simple linen texture edge.", unlocked: true },
  { id: "Iron", name: "Industrial Iron", type: "frame", rarity: "common", description: "無骨な鉄の質感。 / Rugged industrial iron.", unlocked: true },
  { id: "MatteBlack", name: "Matte Black", type: "frame", rarity: "common", description: "光沢を抑えた漆黒。 / Non-reflective matte black.", unlocked: true },
  { id: "Silver", name: "Sterling Silver", type: "frame", rarity: "rare", description: "鈍い光沢を放つ銀の枠。 / Subtle sterling silver edge.", unlocked: false },
  { id: "Sakura", name: "Sakura Aura", type: "frame", rarity: "rare", description: "淡い紅色の残響を纏う枠。 / Gentle sakura pink edge.", unlocked: false },
  { id: "PearlWhite", name: "Pearl Essence", type: "frame", rarity: "rare", description: "真珠のような柔らかな輝き。 / Pearlescent soft glow.", unlocked: false },
  { id: "Moonlight", name: "Moonlight Silver", type: "frame", rarity: "rare", description: "月光を宿した静かな銀枠。 / Quiet moonlight silver edge.", unlocked: false },
  { id: "Silk", name: "Silk Ribbon", type: "frame", rarity: "rare", description: "絹のようになめらかな質感の枠。 / Smooth silk ribbon edge.", unlocked: false },
  { id: "Emerald", name: "Emerald Pulse", type: "frame", rarity: "rare", description: "生命力を感じさせる深緑の輝き。 / Deep emerald pulse.", unlocked: false },
  { id: "Glass", name: "Frosted Glass", type: "frame", rarity: "rare", description: "透過する曇りガラスの縁。 / Translucent frosted glass edge.", unlocked: false },
  { id: "Titanium", name: "Titanium Brush", type: "frame", rarity: "rare", description: "チタンのヘアライン加工。 / Brushed titanium texture.", unlocked: false },
  { id: "CarbonFiber", name: "Carbon Weave", type: "frame", rarity: "rare", description: "精密なカーボン織り。 / Precision carbon fiber weave.", unlocked: false },
  { id: "Copper", name: "Antique Copper", type: "frame", rarity: "rare", description: "古美た銅の色調。 / Antique copper finish.", unlocked: false },
  { id: "Gold", name: "Heritage Gold", type: "frame", rarity: "epic", description: "格式高い黄金の細工枠。 / Traditional heritage gold rim.", unlocked: false },
  { id: "RoseGold", name: "Rose Gold Elegance", type: "frame", rarity: "epic", description: "気品あるピンクゴールドの枠。 / Elegant rose gold rim.", unlocked: false },
  { id: "Grace", name: "Ethereal Grace", type: "frame", rarity: "epic", description: "繊細なレースを模した白の細工枠。 / Delicate ethereal white rim.", unlocked: false },
  { id: "Platinum", name: "Platinum Edge", type: "frame", rarity: "epic", description: "精巧な装飾が施された白金の縁。 / Precision platinum edge.", unlocked: false },
  { id: "Dynamic", name: "Azure Pulse", type: "frame", rarity: "epic", description: "知性を感じさせる蒼い脈動。 / Intelligent azure pulse.", unlocked: false },
  { id: "Crimson", name: "Crimson Guard", type: "frame", rarity: "epic", description: "情熱的な深紅の防壁。 / Passionate crimson guard.", unlocked: false },
  { id: "Marble", name: "Marble Pillar", type: "frame", rarity: "epic", description: "静謐な大理石の質感。 / Serene marble pillar edge.", unlocked: false },
  { id: "PrismLine", name: "Prism Line", type: "frame", rarity: "epic", description: "虹色の微細な反射。 / Shimmering prism line.", unlocked: false },
  { id: "Velvet", name: "Velvet Border", type: "frame", rarity: "epic", description: "柔らかな質調。 / Soft velvet border.", unlocked: false },
  { id: "Void", name: "Void Shell", type: "frame", rarity: "mythic", description: "全ての光を吸収する深層の枠。 / Light-absorbing void shell.", unlocked: false },
  { id: "ImperialGold", name: "Imperial Gold", type: "frame", rarity: "mythic", description: "圧倒的な威厳。頂点の黄金。 / Majestic imperial gold.", unlocked: false },
  { id: "Opal", name: "Opal Glow", type: "frame", rarity: "mythic", description: "乳白色の神秘的な輝き。 / Mystical opalescent glow.", unlocked: false },
  { id: "NebulaSteel", name: "Nebula Steel", type: "frame", rarity: "legendary", description: "星雲の残光を宿すチタン合金のフレーム。 / Titanium alloy rim carrying the afterglow of nebula.", unlocked: false },
  { id: "GildedRose", name: "Gilded Rose", type: "frame", rarity: "legendary", description: "金箔とピンクゴールドが交錯する細工枠。 / Ornate frame crafted with fine gold leaf and rose gold.", unlocked: false },

  // --- Backgrounds ---
  { id: "Default", name: "Solid Void", type: "background", rarity: "common", description: "標準のボイド背景。 / Standard solid void.", unlocked: true },
  { id: "Paper", name: "Handmade Paper", type: "background", rarity: "common", description: "温かみのある和紙。 / Warm textured handmade paper.", unlocked: true },
  { id: "Slate", name: "Natural Slate", type: "background", rarity: "common", description: "自然な岩肌。 / Natural slate stone texture.", unlocked: true },
  { id: "QuietGray", name: "Quiet Gray", type: "background", rarity: "common", description: "主張しない静かな灰。 / Unobtrusive quiet gray.", unlocked: true },
  { id: "PastelSakura", name: "Eternal Sakura", type: "background", rarity: "rare", description: "淡い桜色が舞う春の情景。 / Eternal cherry blossoms.", unlocked: false },
  { id: "PearlVeil", name: "Pearl Veil", type: "background", rarity: "rare", description: "真珠層のような虹色の光沢。 / Iridescent pearl veil.", unlocked: false },
  { id: "SilkSheet", name: "White Silk", type: "background", rarity: "rare", description: "高級な絹布のドレープ。 / High-end white silk drapes.", unlocked: false },
  { id: "Carbon", name: "Carbon Fiber", type: "background", rarity: "rare", description: "精密なカーボンテクスチャ。 / Precision carbon fiber texture.", unlocked: false },
  { id: "BrushedMetal", name: "Brushed Metal", type: "background", rarity: "rare", description: "ヘアライン加工の金属質。 / Hairline brushed metal surface.", unlocked: false },
  { id: "Stardust", name: "Stardust", type: "background", rarity: "rare", description: "微細な星屑の瞬き。 / Shimmering stardust pattern.", unlocked: false },
  { id: "InkWash", name: "Monochrome Ink", type: "background", rarity: "rare", description: "滲む墨の濃淡。 / Bleeding monochrome ink wash.", unlocked: false },
  { id: "SandDune", name: "Silent Dunes", type: "background", rarity: "rare", description: "静かな砂の陰影。 / Silent desert sand dunes.", unlocked: false },
  { id: "MorningMist", name: "Mist Veil", type: "background", rarity: "rare", description: "朝霧の帳。 / Gentle morning mist veil.", unlocked: false },
  { id: "RoseQuartzBG", name: "Quartz Texture", type: "background", rarity: "rare", description: "水晶のテクスチャ。 / Natural quartz crystal texture.", unlocked: false },
  { id: "GraceGradient", name: "Graceful Dawn", type: "background", rarity: "epic", description: "夜明けのような淡い紫と金の階調。 / Graceful purple-gold dawn.", unlocked: false },
  { id: "CrystalGlass", name: "Frozen Crystal", type: "background", rarity: "epic", description: "凍てついたクリスタルの輝き。 / Shimmering frozen crystal.", unlocked: false },
  { id: "MonochromeGrid", name: "Monochrome Grid", type: "background", rarity: "epic", description: "緻密な設計グリッド。 / Precise monochrome design grid.", unlocked: false },
  { id: "RoyalGold", name: "Royal Gold Dust", type: "background", rarity: "epic", description: "金粉が舞う格式高い空間。 / Atmospheric royal gold dust.", unlocked: false },
  { id: "Nebula", name: "Cosmic Nebula", type: "background", rarity: "epic", description: "静かなる宇宙の階調。 / Quiet cosmic nebula gradient.", unlocked: false },
  { id: "SilkBlur", name: "Silk Blur", type: "background", rarity: "epic", description: "滑らかな光の拡散。 / Smooth light diffusion on silk.", unlocked: false },
  { id: "DigitalFlow", name: "Digital Flow", type: "background", rarity: "epic", description: "情報の奔流。 / Infinite flow of digital data.", unlocked: false },
  { id: "DeepOcean", name: "Abyssal Blue", type: "background", rarity: "epic", description: "深い海の底。 / Abyssal deep ocean blue.", unlocked: false },
  { id: "NightCity", name: "City Lights", type: "background", rarity: "epic", description: "夜の街の残響。 / Echoes of city lights.", unlocked: false },
  { id: "Circuit", name: "Logical Flow", type: "background", rarity: "epic", description: "論理回路の鼓動。 / Logical circuit board pulse.", unlocked: false },
  { id: "PrismFractal", name: "Prism Fractal", type: "background", rarity: "mythic", description: "七色に屈折する光の幾何学。 / Prismatic light geometry.", unlocked: false },
  { id: "CosmicVoid", name: "Deep Space", type: "background", rarity: "mythic", description: "星なき宇宙の深淵。 / Starless deep space void.", unlocked: false },
  { id: "GoldenHour", name: "Golden Hour", type: "background", rarity: "legendary", description: "黄昏の静寂と微細な金粉が舞う背景。 / Silent twilight background shimmering with micro-gold dust.", unlocked: false },
  { id: "MonochromeCyber", name: "Monochrome Cyber", type: "background", rarity: "legendary", description: "モノトーンのグリッドと走査線が浮かぶ仮想空間。 / Virtual monochrome space with grids and subtle scanlines.", unlocked: false },

  // --- Effects ---
  { id: "None", name: "Clean", type: "effect", rarity: "common", description: "追加効果なし。純粋な情報の提示。 / No effect. Pure information.", unlocked: true },
  { id: "StaticDust", name: "Static Dust", type: "effect", rarity: "common", description: "固定された微細なノイズ。 / Fixed subtle noise.", unlocked: true },
  { id: "Vignette", name: "Soft Vignette", type: "effect", rarity: "common", description: "四隅を暗く落とす演出。 / Darkened corners.", unlocked: true },
  { id: "LightLeak", name: "Light Leak", type: "effect", rarity: "common", description: "微かな光の漏れ。 / Subtle light leak.", unlocked: true },
  { id: "Sparkle", name: "Fairy Dust", type: "effect", rarity: "rare", description: "幻想的に煌めく小さな光。 / Small, phantom sparkles.", unlocked: false },
  { id: "FallingFlowers", name: "Falling Grace", type: "effect", rarity: "rare", description: "天から舞い降りる白い花弁。 / White petals descending from above.", unlocked: false },
  { id: "Bubbles", name: "Champagne Bubbles", type: "effect", rarity: "rare", description: "華やかに立ち昇る気泡。 / Elegant rising bubbles.", unlocked: false },
  { id: "Glitch", name: "Digital Glitch", type: "effect", rarity: "rare", description: "技術的な洗練を感じさせるノイズ。 / Sophisticated digital noise.", unlocked: false },
  { id: "Petals", name: "Falling Petals", type: "effect", rarity: "rare", description: "静かに舞い散る花びら。 / Gently falling sakura petals.", unlocked: false },
  { id: "Snow", name: "Digital Snow", type: "effect", rarity: "rare", description: "静寂を演出する微細な粒子. / Fine digital snow particles.", unlocked: false },
  { id: "Rain", name: "Raindrops", type: "effect", rarity: "rare", description: "静かに降り注ぐ雨。 / Quiet falling rain.", unlocked: false },
  { id: "Fireflies", name: "Fireflies", type: "effect", rarity: "rare", description: "夜を舞う小さな光。 / Drifting fireflies.", unlocked: false },
  { id: "Leaves", name: "Autumn Breeze", type: "effect", rarity: "rare", description: "風に舞う木の葉。 / Wind-blown leaves.", unlocked: false },
  { id: "Dandelion", name: "Dandelion Seeds", type: "effect", rarity: "rare", description: "漂う綿毛。 / Floating dandelion seeds.", unlocked: false },
  { id: "Steam", name: "Mist Breath", type: "effect", rarity: "rare", description: "立ち昇る微かな霧。 / Rising mist breath.", unlocked: false },
  { id: "Feathers", name: "Angelic Feathers", type: "effect", rarity: "epic", description: "ゆっくりと漂う純白の羽。 / Pure white feathers drifting slowly.", unlocked: false },
  { id: "Ribbons", name: "Streaming Ribbons", type: "effect", rarity: "epic", description: "優雅に流れる光のリボン。 / Elegant ribbons of light.", unlocked: false },
  { id: "Aethereal", name: "Aethereal Diffusion", type: "effect", rarity: "epic", description: "境界を曖昧にするノイズ。 / Noise that blurs the boundaries.", unlocked: false },
  { id: "Scanline", name: "CRT Scanline", type: "effect", rarity: "epic", description: "レトロフューチャーな走査線。 / Retro-future scanlines.", unlocked: false },
  { id: "Interference", name: "Signal Interference", type: "effect", rarity: "epic", description: "静かな波紋の干渉。 / Quiet signal interference.", unlocked: false },
  { id: "Dust", name: "Cosmic Dust", type: "effect", rarity: "epic", description: "漂う宇宙の塵。 / Drifting cosmic dust.", unlocked: false },
  { id: "DigitalRain", name: "Matrix Rain", type: "effect", rarity: "epic", description: "落下するコードの雨。 / Falling code sequence.", unlocked: false },
  { id: "DataStream", name: "Data Stream", type: "effect", rarity: "epic", description: "横切る情報の断片。 / Crossing data fragments.", unlocked: false },
  { id: "Aurora", name: "Boreal Aurora", type: "effect", rarity: "mythic", description: "揺らめく極光の残響。 / Shimmering boreal echoes.", unlocked: false },
  { id: "Singularity", name: "Singularity", type: "effect", rarity: "mythic", description: "中心へと収束する時空の歪み。 / Space-time distortion converging to the center.", unlocked: false },
  { id: "Plasma", name: "Plasma Aura", type: "effect", rarity: "mythic", description: "揺らめく高エネルギー体。 / Shimmering high-energy plasma.", unlocked: false },
  { id: "PrismGlowEffect", name: "Prism Glow", type: "effect", rarity: "mythic", description: "屈折する光の粒子。 / Refracted light particles.", unlocked: false },
  { id: "RealityTear", name: "Reality Tear", type: "effect", rarity: "mythic", description: "空間の裂け目。 / A tear in space-time.", unlocked: false },
  { id: "Halo", name: "Celestial Halo", type: "effect", rarity: "mythic", description: "降り注ぐ天光。 / Descending celestial light.", unlocked: false },
  { id: "CherryPetals", name: "Cherry Petals", type: "effect", rarity: "legendary", description: "幻想的なピンクの花弁がゆっくりと舞い落ちる。 / Ethereal pink petals slowly drifting in the air.", unlocked: false },
  { id: "BinaryCascade", name: "Binary Cascade", type: "effect", rarity: "legendary", description: "仮想空間から降り注ぐ微細なデータコード。 / Subtle binary data streams cascading down.", unlocked: false },

  // --- Auras ---
  { id: "None", name: "No Aura", type: "aura", rarity: "common", description: "静寂。オーラを纏わない。 / Silence. No aura.", unlocked: true },
  { id: "DimGlow", name: "Dim Glow", type: "aura", rarity: "common", description: "微かな発光。 / Faint subtle glow.", unlocked: true },
  { id: "ShadowBorder", name: "Shadow Border", type: "aura", rarity: "common", description: "輪郭を落とす影。 / Outline shadow.", unlocked: true },
  { id: "Pulse", name: "Slow Pulse", type: "aura", rarity: "common", description: "ゆっくりとした明滅. / Slow fading pulse.", unlocked: true },
  { id: "WhiteMist", name: "White Mist", type: "aura", rarity: "rare", description: "境界から漏れ出す白い霧。 / White mist from boundaries.", unlocked: false },
  { id: "AzureFlame", name: "Azure Flame", type: "aura", rarity: "rare", description: "知性を燃やす蒼い炎。 / Intellectual azure flame.", unlocked: false },
  { id: "VioletHaze", name: "Violet Haze", type: "aura", rarity: "rare", description: "神秘的な紫の霞。 / Mystical violet haze.", unlocked: false },
  { id: "EmeraldDust", name: "Emerald Dust", type: "aura", rarity: "rare", description: "生命を育む緑の粒子。 / Life-nurturing emerald dust.", unlocked: false },
  { id: "SakuraRemembrance", name: "Sakura Remembrance", type: "aura", rarity: "rare", description: "記憶の奥底から舞い上がる、淡い桜色の旋風。 / A gentle pink whirlwind rising from the depths of memory.", unlocked: false },
  { id: "GoldenHalo", name: "Golden Halo", type: "aura", rarity: "epic", description: "神聖な黄金の輪郭。 / Sacred golden halo.", unlocked: false },
  { id: "CrimsonFlare", name: "Crimson Flare", type: "aura", rarity: "epic", description: "情熱が爆発する深紅の輝き。 / Explosive crimson flare.", unlocked: false },
  { id: "CyberGrid", name: "Cyber Grid", type: "aura", rarity: "epic", description: "電子の格子が漂う。 / Floating electronic grid.", unlocked: false },
  { id: "HolyChamber", name: "Holy Chamber", type: "aura", rarity: "epic", description: "厳かで洗練された光のラインが、輪郭を疾走する。 / Solemn and sophisticated lines of light racing along the borders.", unlocked: false },
  { id: "VoidEclipse", name: "Void Eclipse", type: "aura", rarity: "mythic", description: "光を飲み込むボイドのオーラ。 / Light-swallowing void eclipse.", unlocked: false },
  { id: "PrismGlow", name: "Prism Glow", type: "aura", rarity: "mythic", description: "全波長を網羅する究極の輝き。 / Ultimate prismatic glow.", unlocked: false },
  { id: "SingularityCore", name: "Singularity Core", type: "aura", rarity: "mythic", description: "全ての事象を屈折させる重力レンズと、輝く特異点の境界。 / A gravitational lensing border bending all phenomena around the singularity.", unlocked: false },
  { id: "StellarWind", name: "Stellar Wind", type: "aura", rarity: "legendary", description: "境界から吹き出す、星屑のような淡い輝き。 / Stardust-like soft glow blowing from the card boundaries.", unlocked: false },
  { id: "AbyssalEcho", name: "Abyssal Echo", type: "aura", rarity: "legendary", description: "深海から響く、蒼く穏やかな波動。 / Gentle blue echo expanding from the deep ocean.", unlocked: false },
  { id: "QuantumEntanglement", name: "Quantum Entanglement", type: "aura", rarity: "legendary", description: "双対する量子状態の絡み合いが生み出す、瞬く光の連鎖。 / A chain of blinking lights produced by entangled quantum states.", unlocked: false },
  { id: "NebulaDrift", name: "Nebula Drift", type: "aura", rarity: "legendary", description: "静かに流動する星雲ガスと、星々の光が織りなす宇宙の漂流。 / A cosmic drift of quietly flowing nebular gas and starlight.", unlocked: false },

  // --- Interactions (Formerly Pointers) ---
  { id: "Pure White Hex", name: "Standard Hex", type: "pointer", rarity: "common", description: "標準的な白い六角形の残響。 / Standard white hex trace.", unlocked: true },
  { id: "Dot", name: "Simple Dot", type: "pointer", rarity: "common", description: "小さな点の軌跡。 / Small simple dot.", unlocked: true },
  { id: "Cross", name: "Crosshair", type: "pointer", rarity: "common", description: "標的を示す十字。 / Target crosshair.", unlocked: true },
  { id: "Ring", name: "Echo Ring", type: "pointer", rarity: "common", description: "広がる波紋。 / Expanding echo ring.", unlocked: true },
  { id: "Azure Trace", name: "Azure Hex", type: "pointer", rarity: "rare", description: "知的な蒼い六角形。 / Intelligent azure hex trace.", unlocked: false },
  { id: "Emerald Trace", name: "Emerald Hex", type: "pointer", rarity: "rare", description: "生命力ある緑の六角形。 / Vital emerald hex trace.", unlocked: false },
  { id: "Ruby Trace", name: "Ruby Square", type: "pointer", rarity: "rare", description: "情熱的な紅い四角形。 / Passionate ruby square trace.", unlocked: false },
  { id: "Gold Trace", name: "Golden Hex", type: "pointer", rarity: "epic", description: "格式高い黄金の六角形。 / Noble golden hex trace.", unlocked: false },
  { id: "Violet Trace", name: "Violet Hex", type: "pointer", rarity: "epic", description: "神秘的な紫の六角形。 / Mystical violet hex trace.", unlocked: false },
  { id: "Crimson Trace", name: "Crimson Square", type: "pointer", rarity: "epic", description: "消えない残り火の四角形。 / Everlasting crimson square trace.", unlocked: false },
  { id: "Shadow Trace", name: "Void Square", type: "pointer", rarity: "epic", description: "空間を塗りつぶす漆黒の四角形。 / Space-filling void square trace.", unlocked: false },
  { id: "Prism Trace", name: "Prism Hex", type: "pointer", rarity: "mythic", description: "七色に屈折する究極の六角形。 / Ultimate prismatic hex trace.", unlocked: false },
  { id: "Void Trace", name: "Reality Tear", type: "pointer", rarity: "mythic", description: "空間を切り裂く特異点. / Space-tearing singularity trace.", unlocked: false },
  { id: "Nebula Trace", name: "Nebula Trace", type: "pointer", rarity: "legendary", description: "タップ時に星雲の残響が弾ける演出。 / Purplish nebula echo bursting upon touch.", unlocked: false },
  { id: "Solar Trace", name: "Solar Trace", type: "pointer", rarity: "legendary", description: "太陽の閃光が弾ける演出。 / Orange solar spark bursting upon touch.", unlocked: false },

  // --- Sounds ---
  { id: "resonance", name: "Resonance", type: "sound", rarity: "common", description: "標準的な共鳴音。 / Standard resonance sound.", unlocked: true },
  { id: "snap", name: "Snap", type: "sound", rarity: "common", description: "短く乾いた音。 / Short dry snap.", unlocked: true },
  { id: "tap", name: "Tap", type: "sound", rarity: "common", description: "軽い打撃音。 / Light tap.", unlocked: true },
  { id: "sweep", name: "Sweep", type: "sound", rarity: "common", description: "風を切る音。 / Sweeping air sound.", unlocked: true },
  { id: "click", name: "Mechanical", type: "sound", rarity: "rare", description: "精密な機械のクリック音。 / Precision mechanical click.", unlocked: false },
  { id: "wind", name: "Whisper", type: "sound", rarity: "rare", description: "微かな風の囁き。 / Faint whisper of wind.", unlocked: false },
  { id: "water", name: "Droplet", type: "sound", rarity: "rare", description: "静かな水滴の音。 / Quiet water droplet.", unlocked: false },
  { id: "silver", name: "Silver Bell", type: "sound", rarity: "epic", description: "透明感のある銀の鈴。 / Crystal clear silver bell.", unlocked: false },
  { id: "crystal", name: "Crystal Chord", type: "sound", rarity: "epic", description: "水晶が奏でる和音。 / Shimmering crystal chord.", unlocked: false },
  { id: "deep", name: "Deep Impact", type: "sound", rarity: "epic", description: "腹に響く重厚な低音。 / Deep impactful bass.", unlocked: false },
  { id: "heaven", name: "Angelic Choir", type: "sound", rarity: "epic", description: "天界の歌声の一節。 / A snippet of angelic choir.", unlocked: false },
  { id: "void", name: "Deep Resonance", type: "sound", rarity: "mythic", description: "深層からの呼び声。 / Call from the deep resonance.", unlocked: false },
  { id: "omega", name: "Eternal Chord", type: "sound", rarity: "mythic", description: "世界の終焉と始まりの音。 / Eternal chord of beginning and end.", unlocked: false },
  { id: "ether", name: "Ether Chime", type: "sound", rarity: "legendary", description: "高次元のエーテル波を感じさせる、澄み渡った高音。 / Shimmering high-frequency chime of ethereal origin.", unlocked: false },
  { id: "pulse", name: "Pulse Echo", type: "sound", rarity: "legendary", description: "規則正しく鼓動する、知的な電子脈動の残響。 / Intelligent electronic pulse echo beating rhythmically.", unlocked: false },

  // --- Titles ---
  { id: "ASSOCIATE", name: "ASSOCIATE", type: "title", rarity: "common", description: "初期称号。 / Initial title.", unlocked: true },
  { id: "Member", name: "Member", type: "title", rarity: "common", description: "アカウント作成の証。 / Proof of membership.", unlocked: true },
  { id: "Observer", name: "Observer", type: "title", rarity: "common", description: "世界の観測者。 / Observer of the world.", unlocked: true },
  { id: "Pioneer", name: "Pioneer", type: "title", rarity: "common", description: "開拓者。 / The pioneer.", unlocked: true },
  { id: "Collector", name: "Collector", type: "title", rarity: "rare", description: "10人との共鳴。 / 10 resonances achieved.", unlocked: false },
  { id: "Messenger", name: "Messenger", type: "title", rarity: "rare", description: "20人との共鳴。 / 20 resonances achieved.", unlocked: false },
  { id: "Connector", name: "Connector", type: "title", rarity: "rare", description: "世界を繋ぐ者。 / A connector of worlds.", unlocked: false },
  { id: "Void Voyager", name: "Void Voyager", type: "title", rarity: "epic", description: "50人との共鳴。 / 50 resonances achieved.", unlocked: false },
  { id: "Strategist", name: "Strategist", type: "title", rarity: "epic", description: "100人の人脈。 / 100 people networked.", unlocked: false },
  { id: "Tech Lead", name: "Tech Lead", type: "title", rarity: "epic", description: "技術者との深い絆。 / Deep bond with technicians.", unlocked: false },
  { id: "Headhunter", name: "Headhunter", type: "title", rarity: "epic", description: "重役層との共鳴。 / Resonance with executives.", unlocked: false },
  { id: "Gilded Soul", name: "Gilded Soul", type: "title", rarity: "epic", description: "富の象徴。 / A symbol of wealth.", unlocked: false },
  { id: "The Sovereign", name: "The Sovereign", type: "title", rarity: "mythic", description: "王権の象徴。 / Symbol of sovereignty.", unlocked: false },
  { id: "Mastermind", name: "Mastermind", type: "title", rarity: "mythic", description: "運営責任者。 / Operational mastermind.", unlocked: false },
  { id: "Manager", name: "Manager", type: "title", rarity: "mythic", description: "実務管理者。 / Practical manager.", unlocked: false },
  { id: "APEX", name: "APEX", type: "title", rarity: "mythic", description: "頂点のアイデンティティ。 / The apex of identity.", unlocked: false },
  { id: "Fixer", name: "Fixer", type: "title", rarity: "mythic", description: "創造主。 / The creator.", unlocked: false },
  { id: "HERETIC", name: "HERETIC", type: "title", rarity: "legendary", description: "固定された概念を覆し、新たな可能性を切り拓く者。 / One who subverts fixed concepts and carves new paths.", unlocked: false },
  { id: "NEXUS", name: "NEXUS", type: "title", rarity: "legendary", description: "あらゆる接続の中心に位置する、究極の連結点。 / The ultimate junction residing at the center of all connections.", unlocked: false }
];

export const getRarityStyles = (rarity: string) => {
  switch (rarity) {
    case "mythic": return "text-white border-white/40 bg-black shadow-[0_0_15px_rgba(255,255,255,0.2)]";
    case "legendary": return "text-rose-500 border-rose-500/20 bg-rose-50/5";
    case "epic": return "text-orange-500 border-orange-500/20 bg-orange-50/5";
    case "rare": return "text-purple-400 border-purple-500/20 bg-purple-50/5";
    case "common": return "text-white/40 border-white/5 bg-white/[0.01]";
    default: return "";
  }
};

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "mythic": return "rgba(255, 255, 255, 0.5)";
    case "legendary": return "rgba(244, 63, 94, 0.5)";
    case "epic": return "rgba(249, 115, 22, 0.5)";
    case "rare": return "rgba(168, 85, 247, 0.5)";
    case "common": return "rgba(224, 224, 224, 0.5)";
    default: return "rgba(224, 224, 224, 0.5)";
  }
};
