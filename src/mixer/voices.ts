export const SPEED_MIN = 0.6;
export const SPEED_MAX = 1.3;
export const SPEED_STEP = 0.05;
export const DEFAULT_SPEED = 0.9;
export const MAX_MIX_VOICES = 5;
export const MAX_TEXT_LENGTH = 1000;

// Kokoro picks its pronunciation rules from the first letter of a voice ID.
export const LANGUAGES = [
  { code: "a", shortName: "English (US)", tag: "en-US" },
  { code: "b", shortName: "English (UK)", tag: "en-GB" },
  { code: "e", shortName: "Spanish", tag: "es" },
  { code: "f", shortName: "French", tag: "fr" },
  { code: "h", shortName: "Hindi", tag: "hi" },
  { code: "i", shortName: "Italian", tag: "it" },
  { code: "j", shortName: "Japanese", tag: "ja" },
  { code: "p", shortName: "Portuguese (BR)", tag: "pt-BR" },
  { code: "z", shortName: "Chinese", tag: "zh" },
] as const;

// The languages to choose from in the mixer. American and British English
// share one, so their voices mix freely.
export const LANGUAGE_GROUPS: LanguageGroup[] = [
  { id: "en", name: "English", codes: ["a", "b"] },
  { id: "es", name: "Spanish", codes: ["e"] },
  { id: "fr", name: "French", codes: ["f"] },
  { id: "hi", name: "Hindi", codes: ["h"] },
  { id: "it", name: "Italian", codes: ["i"] },
  { id: "ja", name: "Japanese", codes: ["j"] },
  { id: "pt", name: "Portuguese", codes: ["p"] },
  { id: "zh", name: "Chinese", codes: ["z"] },
];

// Words that American and British pronunciation say differently.
const ENGLISH_SAMPLE =
  "Let's be honest, you came here to hear me say tomato. Pour a glass of water, forget your schedule, and dance in the garage. I can't stop you.";

// What the mixer reads for a mix that doesn't come from a preset.
export const SAMPLE_TEXTS: Record<LanguageCode, string> = {
  a: ENGLISH_SAMPLE,
  b: ENGLISH_SAMPLE,
  e: "Seamos sinceros, viniste a escuchar cómo sueno. Sírvete un café, olvídate del despertador y baila un poco en la cocina. Nadie te está mirando.",
  f: "Soyons honnêtes, tu es là pour écouter ma voix. Prends un croissant, oublie ton réveil et danse un peu dans la cuisine. Personne ne te regarde.",
  h: "सच कहूँ तो, आप यहाँ बस मेरी आवाज़ सुनने आए हैं। एक कप चाय लीजिए, अलार्म को भूल जाइए, और रसोई में थोड़ा नाच लीजिए। कोई नहीं देख रहा।",
  i: "Diciamocelo, sei qui solo per sentire la mia voce. Prenditi un caffè, dimentica la sveglia e balla un po' in cucina. Nessuno ti guarda.",
  j: "正直に言うと、わたしの声を聞きに来たんでしょ。お茶を一杯いれて、アラームのことは忘れて、台所で少し踊ってみましょう。誰も見ていませんよ。",
  p: "Vamos ser sinceros, você veio aqui para ouvir a minha voz. Pegue um cafezinho, esqueça o despertador e dance um pouco na cozinha. Ninguém está olhando.",
  z: "说实话，你就是来听听我的声音的吧。泡一杯茶，忘掉闹钟，在厨房里跳一小段舞。没有人在看你。",
};

// Grades come from the Kokoro voice list (hexgrad/Kokoro-82M VOICES.md).
// Spanish and Portuguese voices have no grade there.
export const VOICES: BaseVoice[] = [
  voice(
    "af_heart",
    "female",
    "A",
    "Medium, airy and gentle",
    "Hi, I'm Heart. I water my tomato plants every morning, and they never say thank you.",
  ),
  voice(
    "af_bella",
    "female",
    "A-",
    "High, light and gentle",
    "Bella here. I just learned to say schedule like a news anchor.",
  ),
  voice(
    "af_nicole",
    "female",
    "B-",
    "Warm, relaxed and slightly husky",
    "Nicole here. Come a little closer, I've got something calm to tell you.",
  ),
  voice(
    "af_aoede",
    "female",
    "C+",
    "Husky, low and breathy",
    "I'm Aoede. My voice sounds best after a glass of water and a long nap.",
  ),
  voice(
    "af_kore",
    "female",
    "C+",
    "Low, rich and grounded",
    "Kore speaking. I can't decide between a banana and a nap, so I'm having both.",
  ),
  voice(
    "af_sarah",
    "female",
    "C+",
    "Smooth, warm and balanced",
    "Hey, I'm Sarah. Let's take the scenic route and be late on purpose.",
  ),
  voice(
    "af_alloy",
    "female",
    "C",
    "Low, warm and resonant",
    "Alloy here. I read the weather forecast to my cat every morning.",
  ),
  voice(
    "af_nova",
    "female",
    "C",
    "Bright, crisp and energetic",
    "Nova here! I've had three coffees and I'm ready to read your whole schedule.",
  ),
  voice(
    "af_sky",
    "female",
    "C-",
    "Soft, breathy and gentle",
    "I'm Sky. Shh, the garage is finally quiet.",
  ),
  voice(
    "af_jessica",
    "female",
    "D",
    "Bright, crisp and upbeat",
    "Jessica here, and yes, I can say tomato faster than you.",
  ),
  voice(
    "af_river",
    "female",
    "D",
    "Clear, steady and slightly nasal",
    "River here. I count the leaves on my basil plant when I can't sleep.",
  ),
  voice(
    "am_fenrir",
    "male",
    "C+",
    "Deep, heavy and robust",
    "Fenrir here. I sound big, but I cry at every dog movie.",
  ),
  voice(
    "am_michael",
    "male",
    "C+",
    "Warm, grounded and unhurried",
    "Michael speaking. Grab a chair, there's no hurry today.",
  ),
  voice(
    "am_puck",
    "male",
    "C+",
    "Light, youthful and breathy",
    "Hey, Puck here! I tried to dance in the garage and knocked over a ladder.",
  ),
  voice(
    "am_echo",
    "male",
    "D",
    "Deep, flat and steady",
    "This is Echo. I said it once, and I'll say it again: water your plants.",
  ),
  voice(
    "am_eric",
    "male",
    "D",
    "Bright, clear and brisk",
    "Eric here. I've already finished my vitamins and my whole to-do list.",
  ),
  voice(
    "am_liam",
    "male",
    "D",
    "Light, airy and casual",
    "Liam here. Honestly, I can't remember the last time I set an alarm.",
  ),
  voice(
    "am_onyx",
    "male",
    "D",
    "Very low, gravelly and slow",
    "Onyx speaking. Slowly. Very slowly. There's no rush at all.",
  ),
  voice(
    "am_santa",
    "male",
    "D-",
    "Deep, warm and resonant",
    "Ho, ho, ho! Have you been watering your tomato plants this year?",
  ),
  voice(
    "am_adam",
    "male",
    "F+",
    "Deep, resonant and clear",
    "Adam here. I'm the voice that reads the instructions nobody reads.",
  ),
  voice(
    "bf_emma",
    "female",
    "B-",
    "Low, warm and unhurried",
    "Hello, I'm Emma. Shall we put the kettle on and ignore the schedule?",
  ),
  voice(
    "bf_isabella",
    "female",
    "C",
    "Bright, light and clear",
    "Isabella here. I've just had a lovely bath and a banana, in that order.",
  ),
  voice(
    "bf_alice",
    "female",
    "D",
    "Crisp, smooth and focused",
    "Alice speaking. I'd like a word with whoever ate the last biscuit.",
  ),
  voice(
    "bf_lily",
    "female",
    "D",
    "Low, gravelly and subdued",
    "Lily here. It's half past nine and I'm already in my pyjamas.",
  ),
  voice(
    "bm_fable",
    "male",
    "C",
    "Warm, clear and conversational",
    "Fable here. Let me tell you about the time I got lost in a garden centre.",
  ),
  voice(
    "bm_george",
    "male",
    "C",
    "Deep, resonant and smooth",
    "Good evening, George here. Tonight's programme: tea, toast, and an early night.",
  ),
  voice(
    "bm_lewis",
    "male",
    "D+",
    "Deep, raspy and dry",
    "Lewis here. I can't stand loud alarms, so I'll keep this quiet.",
  ),
  voice(
    "bm_daniel",
    "male",
    "D",
    "Deep, gravelly and slow",
    "Daniel speaking. Pour yourself a glass of water and sit down, this might take a while.",
  ),
  voice(
    "ef_dora",
    "female",
    null,
    "Warm, husky and unhurried",
    "Hola, soy Dora. Mi planta favorita es la que nunca riego.",
  ),
  voice(
    "em_alex",
    "male",
    null,
    "Smooth, mid-pitch and gentle",
    "Soy Álex, y hoy solo pienso en tortilla y siesta.",
  ),
  voice(
    "em_santa",
    "male",
    null,
    "Deep, gravelly and resonant",
    "¡Jo, jo, jo! ¿Has dejado galletas junto al árbol?",
  ),
  voice(
    "ff_siwis",
    "female",
    "B-",
    "Clear, bright and crisp",
    "Bonjour, je m'appelle Siwis, et je prends toujours un deuxième croissant.",
  ),
  voice(
    "hf_alpha",
    "female",
    "C",
    "Soft, breathy and warm",
    "नमस्ते, मैं अल्फ़ा हूँ, और मुझे बारिश में चाय सबसे अच्छी लगती है।",
  ),
  voice(
    "hf_beta",
    "female",
    "C",
    "Bright, firm and resonant",
    "मैं बीटा हूँ, और आज मैं बस आराम करूँगी।",
  ),
  voice(
    "hm_omega",
    "male",
    "C",
    "Deep, rich and steady",
    "नमस्ते, मैं ओमेगा हूँ, और मेरे पास समोसे के लिए हमेशा जगह होती है।",
  ),
  voice(
    "hm_psi",
    "male",
    "C",
    "Deep, gravelly and deliberate",
    "मैं साई हूँ, धीरे बोलता हूँ, और जल्दी सो जाता हूँ।",
  ),
  voice(
    "if_sara",
    "female",
    "C",
    "Bright, clear and slightly tense",
    "Ciao, sono Sara, e il mio caffè è sempre troppo caldo.",
  ),
  voice(
    "im_nicola",
    "male",
    "C",
    "Deep, resonant and warm",
    "Sono Nicola, e oggi il mio unico impegno è un pisolino.",
  ),
  voice(
    "jf_alpha",
    "female",
    "C+",
    "Clear, flat and mechanical",
    "こんにちは、アルファです。きょうは何もしない日です。",
  ),
  voice(
    "jf_gongitsune",
    "female",
    "C",
    "Soft, breathy and gentle",
    "ごんぎつねです。おやつの時間はまだですか。",
  ),
  voice(
    "jf_tebukuro",
    "female",
    "C",
    "High, bright and energetic",
    "てぶくろです。きょうはとても元気です！",
  ),
  voice(
    "jf_nezumi",
    "female",
    "C-",
    "Light, airy and gentle",
    "ねずみです。チーズがあれば、どこへでも行きます。",
  ),
  voice(
    "jm_kumo",
    "male",
    "C-",
    "Low, smooth and grounded",
    "くもです。空をながめて、ゆっくり休みましょう。",
  ),
  voice(
    "pf_dora",
    "female",
    null,
    "Light, clear and gentle",
    "Oi, eu sou a Dora, e o meu café está sempre esfriando.",
  ),
  voice(
    "pm_alex",
    "male",
    null,
    "Warm, breathy and relaxed",
    "Eu sou o Alex, e hoje só quero uma rede e um cafezinho.",
  ),
  voice(
    "pm_santa",
    "male",
    null,
    "Deep, rich and theatrical",
    "Ho, ho, ho! Você deixou biscoitos perto da árvore?",
  ),
  voice(
    "zf_xiaobei",
    "female",
    "D",
    "Clear, neutral and conversational",
    "你好，我是小北，今天只想喝茶。",
  ),
  voice(
    "zf_xiaoni",
    "female",
    "D",
    "Crisp, flat and direct",
    "我是小妮，我的猫比我还懒。",
  ),
  voice(
    "zf_xiaoxiao",
    "female",
    "D",
    "Warm, deep and resonant",
    "我是晓晓，先深呼吸，再吃点心。",
  ),
  voice(
    "zf_xiaoyi",
    "female",
    "D",
    "High, bright and energetic",
    "我是小艺，今天心情特别好！",
  ),
  voice(
    "zm_yunjian",
    "male",
    "D",
    "Deep, resonant and formal",
    "我是云健，说话很慢，走路更慢。",
  ),
  voice(
    "zm_yunxi",
    "male",
    "D",
    "Clear, mid-pitched and steady",
    "我是云希，我已经把闹钟关掉了。",
  ),
  voice(
    "zm_yunxia",
    "male",
    "D",
    "High, light and childlike",
    "我是云夏，我最喜欢吃冰淇淋！",
  ),
  voice(
    "zm_yunyang",
    "male",
    "D",
    "Warm, smooth and mid-low",
    "我是云扬，给你泡了一杯热茶。",
  ),
];

// Starting points: a few blends and single voices, each with its own text.
// English texts use words that American and British pronunciation say
// differently.
export const PRESETS: Preset[] = [
  {
    name: "Grace",
    voice: "af_nicole+af_aoede(0.2)",
    speed: 0.9,
    text: "Hi, I'm Grace. Today we're making pasta with fresh basil, oregano, and a very ripe tomato. Don't tell anyone, but I can't cook at all.",
  },
  {
    name: "Kate",
    voice: "af_nicole+af_aoede",
    speed: 0.85,
    text: "Hey, it's Kate. I took the long route past the zoo, and a zebra winked at me. Nobody believes me, but I know what I saw.",
  },
  {
    name: "Emily",
    voice: "bf_lily+af_nicole(0.3)",
    speed: 0.85,
    text: "Hello, Emily here. I've had a bath, a banana, and a cup of tea, and I'm rather proud of myself. That counts as a productive afternoon.",
  },
  {
    name: "James",
    voice: "bm_lewis+am_onyx(0.2)+af_aoede(0.2)",
    speed: 0.85,
    text: "Good evening, this is James. Tonight's programme: a slow walk to the garage, a short laugh, and absolutely no work. You can thank me later.",
  },
  {
    name: "Matthew",
    voice: "am_michael+af_aoede(0.5)",
    speed: 0.85,
    text: "Hey there, Matthew speaking. My doctor says I need more vitamins and fewer pizzas. We're still negotiating.",
  },
  {
    name: "Ben",
    voice: "am_echo",
    speed: 0.85,
    text: "This is Ben. I've read the whole schedule, and the only thing on it is a nap. Either way, I'm in.",
  },
  {
    name: "Santa",
    voice: "am_santa",
    speed: 0.9,
    text: "Ho, ho, ho! Santa here, and I've checked my list twice. Leave the cookies and a glass of water by the tree, and go to sleep. The reindeer can't land while you're watching.",
  },
  {
    name: "Carmen",
    voice: "ef_dora",
    speed: 0.85,
    text: "Hola, soy Carmen. Hoy toca siesta larga, café con leche y cero correos. Si alguien pregunta, estoy meditando.",
  },
  {
    name: "Diego",
    voice: "em_alex",
    speed: 0.85,
    text: "¿Qué tal? Soy Diego. Mi plan para hoy es sencillo: un paseo corto, una tortilla enorme y una siesta todavía más grande.",
  },
  {
    name: "Santa",
    voice: "em_santa",
    speed: 0.9,
    text: "¡Jo, jo, jo! Aquí Papá Noel. Ya revisé mi lista dos veces, así que deja las galletas junto al árbol y vete a dormir.",
  },
  {
    name: "Marie",
    voice: "ff_siwis",
    speed: 0.85,
    text: "Bonjour, c'est Marie. Aujourd'hui, au programme : un croissant, une sieste et zéro réunion. Si quelqu'un demande, je médite.",
  },
  {
    name: "Priya",
    voice: "hf_alpha",
    speed: 0.85,
    text: "नमस्ते, मैं प्रिया हूँ। आज का प्लान बहुत आसान है: गरम चाय, थोड़ी धूप, और कोई मीटिंग नहीं। अगर कोई पूछे, तो कहना मैं ध्यान कर रही हूँ।",
  },
  {
    name: "Ravi",
    voice: "hm_omega",
    speed: 0.85,
    text: "नमस्ते, मैं रवि हूँ। आज मैंने तय किया है कि बस समोसे खाऊँगा और आराम करूँगा। बाक़ी सब कल देखेंगे।",
  },
  {
    name: "Giulia",
    voice: "if_sara",
    speed: 0.85,
    text: "Ciao, sono Giulia. Oggi il programma è semplice: un caffè, una passeggiata e nessuna riunione. Se qualcuno chiede, sto meditando.",
  },
  {
    name: "Luca",
    voice: "im_nicola",
    speed: 0.85,
    text: "Ciao, sono Luca. Ho appena finito un piatto di pasta enorme e adesso mi serve un pisolino. È una questione di equilibrio.",
  },
  {
    name: "Naomi",
    voice: "jf_gongitsune",
    speed: 0.85,
    text: "こんにちは、ナオミです。今日の予定は、お茶とお昼寝だけです。誰かに聞かれたら、瞑想中だと言ってくださいね。",
  },
  {
    name: "Kenji",
    voice: "jm_kumo",
    speed: 0.85,
    text: "どうも、ケンジです。さっき大きなラーメンを食べたので、今は少し休憩中です。これも大事な練習ですよ。",
  },
  {
    name: "Ana",
    voice: "pf_dora",
    speed: 0.85,
    text: "Oi, eu sou a Ana. Hoje o plano é simples: rede, água de coco e nenhuma reunião. Se alguém ligar, diga que estou meditando.",
  },
  {
    name: "Pedro",
    voice: "pm_alex",
    speed: 0.85,
    text: "E aí, aqui é o Pedro. Acordei cedo, tomei um café bem forte e já estou pensando no almoço. Prioridades.",
  },
  {
    name: "Santa",
    voice: "pm_santa",
    speed: 0.9,
    text: "Ho, ho, ho! Aqui é o Papai Noel. Já conferi a minha lista duas vezes, então deixe os biscoitos perto da árvore e vá dormir.",
  },
  {
    name: "Li",
    voice: "zf_xiaobei",
    speed: 0.85,
    text: "大家好，我是小李。今天的计划很简单：喝杯茶，晒晒太阳，不开任何会。如果有人问，就说我在冥想。",
  },
  {
    name: "Wei",
    voice: "zm_yunjian",
    speed: 0.85,
    text: "大家好，我是小伟。刚吃完一大碗面，现在需要好好休息一下。这也是一种修行嘛。",
  },
];

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
export type LanguageGroup = { id: string; name: string; codes: LanguageCode[] };

export type BaseVoice = {
  id: string;
  name: string;
  language: LanguageCode;
  gender: "female" | "male";
  grade: string | null;
  description: string;
  // A short line in the voice's language for its preview button.
  preview: string;
};

type Preset = {
  name: string;
  voice: string;
  speed: number;
  text: string;
};

export function getVoice(id: string) {
  return VOICES.find((voice) => voice.id === id);
}

export function getLanguage(code: LanguageCode) {
  return LANGUAGES.find((language) => language.code === code)!;
}

export function getLanguageGroup(code: LanguageCode) {
  return LANGUAGE_GROUPS.find((group) => group.codes.includes(code))!;
}

export function inGroup(voice: BaseVoice, group: LanguageGroup) {
  return group.codes.includes(voice.language);
}

function voice(
  id: string,
  gender: BaseVoice["gender"],
  grade: string | null,
  description: string,
  preview: string,
): BaseVoice {
  const name = id.slice(3);
  return {
    id,
    name: name[0].toUpperCase() + name.slice(1),
    language: id[0] as LanguageCode,
    gender,
    grade,
    description,
    preview,
  };
}
