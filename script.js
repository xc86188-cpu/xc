const rawShoeDatabase = [
  {
    brand: "Scarpa",
    model: "本能instinct VS",
    volume: "标准 RV",
    stiffness: "硬",
    scenes: ["野外抱石", "运动攀"],
    levels: ["全能进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）"],
    toe: ["希腊脚"],
    instep: ["适中脚背", "高脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["适中后跟"],
    baseOffset: 0,
    feature: "支撑足，耐磨，多场景适用，适中鞋型适合大部分脚型。",
  },
  {
    brand: "Scarpa",
    model: "本能instinct VS Women",
    volume: "窄 LV",
    stiffness: "适中",
    scenes: ["运动攀", "抱石", "野外抱石"],
    levels: ["全能进阶"],
    shape0: ["适中（2.6以上）", "窄（2.8以上）"],
    toe: ["希腊脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["适中后跟", "弧后跟"],
    baseOffset: 0,
    feature: "支撑足，摩擦力好，更有包裹感，多场景适用，适合小巧的脚型",
  },
  {
    brand: "Scarpa",
    model: "本能instinct VSR",
    volume: "标准 RV",
    stiffness: "适中",
    scenes: ["运动攀", "抱石"],
    levels: ["全能进阶", "新手进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）"],
    toe: ["希腊脚"],
    instep: ["适中脚背", "高脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["适中后跟"],
    baseOffset: 0,
    feature: "支撑足，比橙色本能更软更有摩擦力，更适合室内攀岩，适中鞋型适合大部分脚型。",
  },
  {
    brand: "Scarpa",
    model: "本能instinct VSR",
    volume: "窄 LV",
    stiffness: "适中",
    scenes: ["运动攀", "抱石"],
    levels: ["全能进阶", "新手进阶"],
    shape0: ["适中（2.6以上）", "窄（2.8以上）"],
    toe: ["希腊脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["适中后跟", "弧后跟"],
    baseOffset: 0,
    feature: "鞋子软且窄，更好的包裹感，颜值高受欢迎，多场景适用，适合小巧的脚型。鞋好撑，稍宽的脚也能勉强适配。",
  },
  {
    brand: "Scarpa",
    model: "黄龙Drago",
    volume: "标准 RV",
    stiffness: "软",
    scenes: ["抱石", "运动攀"],
    levels: ["竞技进阶"],
    shape0: ["窄（2.8以上）", "适中（2.6以上）"],
    toe: ["埃及脚"],
    instep: ["高脚背", "适中脚背"],
    arch: ["高足弓", "适中足弓"],
    heel: ["适中后跟", "弧后跟", "直后跟", "无后跟"],
    baseOffset: -1,
    feature: "高端竞技款，前掌窄，高不对称性和高足弓设计让鞋子充满进攻性，鞋子软易撑鞋",
  },
  {
    brand: "Scarpa",
    model: "白龙Drago LV",
    volume: "窄 LV",
    stiffness: "软",
    scenes: ["抱石", "运动攀"],
    levels: ["竞技进阶"],
    shape0: ["窄（2.8以上）"],
    toe: ["埃及脚"],
    instep: ["适中脚背"],
    arch: ["高足弓", "适中足弓"],
    heel: ["适中后跟", "弧后跟", "直后跟", "无后跟"],
    baseOffset: -1,
    feature: "高端竞技款，前掌窄，高不对称性和高足弓设计让鞋子充满进攻性，鞋子软易撑鞋。较黄龙更窄更紧凑",
  },
  {
    brand: "Scarpa",
    model: "黑龙Drago XT",
    volume: "窄 LV",
    stiffness: "软",
    scenes: ["抱石", "运动攀"],
    levels: ["竞技进阶"],
    shape0: ["窄（2.8以上）"],
    toe: ["埃及脚", "希腊脚"],
    instep: ["低脚背", "适中脚背"],
    arch: ["高足弓", "适中足弓"],
    heel: ["适中后跟", "弧后跟", "直后跟", "无后跟"],
    baseOffset: -0.5,
    feature: "高端竞技款，前掌窄，高不对称性和高足弓设计让鞋子充满进攻性，鞋子软易撑鞋。较黄、白龙，有更窄的后脚跟，以及增加了前掌魔术贴，让低脚背用户也可以有更好的包裹感",
  },
  {
    brand: "Lasportiva",
    model: "脸谱skwama M",
    volume: "宽 AV",
    stiffness: "软",
    scenes: ["运动攀", "抱石"],
    levels: ["全能进阶", "竞技进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）"],
    toe: ["希腊脚", "罗马脚", "埃及脚"],
    instep: ["低脚背", "适中脚背"],
    arch: ["高足弓", "适中足弓"],
    heel: ["弧后跟", "适中后跟"],
    baseOffset: -1.5,
    feature: "宽鞋头，对脚趾宽容度高，整体柔软又具备基础支撑，适应多场景和攀登方式。后跟硬挂脚支撑强。",
  },
  {
    brand: "Lasportiva",
    model: "脸谱skwama W",
    volume: "标准 RV",
    stiffness: "软",
    scenes: ["运动攀", "抱石"],
    levels: ["全能进阶", "竞技进阶"],
    shape0: ["适中（2.6以上）", "窄（2.8以上）"],
    toe: ["希腊脚", "罗马脚", "埃及脚"],
    instep: ["低脚背", "适中脚背"],
    arch: ["高足弓", "适中足弓"],
    heel: ["弧后跟", "适中后跟"],
    baseOffset: -1,
    feature: "宽鞋头，对脚趾宽容度高，整体柔软又具备基础支撑，适应多场景和攀登方式。后跟硬挂脚支撑强。",
  },
  {
    brand: "So iLL",
    model: "步伐Step",
    volume: "标准 RV",
    stiffness: "软",
    scenes: ["抱石", "运动攀"],
    levels: ["新手入门"],
    shape0: ["窄（2.8以上）", "适中（2.6以上）"],
    toe: ["埃及脚", "罗马脚", "希腊脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓", "高足弓"],
    heel: ["直后跟", "无后跟", "适中后跟", "弧后跟"],
    baseOffset: 1,
    feature: "柔软，极具包裹感，颜色多选择多，满足入门爱好者日常攀爬的多方需求。",
  },
  {
    brand: "So iLL",
    model: "白 扭矩Torque AV",
    volume: "宽 AV",
    stiffness: "适中",
    scenes: ["运动攀", "野外抱石", "抱石"],
    levels: ["全能进阶", "新手进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）"],
    toe: ["埃及脚", "希腊脚", "罗马脚"],
    instep: ["适中脚背", "低脚背", "高脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: 0.5,
    feature: "硬底软面，满足支撑的同时兼顾舒适度，直后跟圆鞋头兼顾了更多脚型。",
  },
  {
    brand: "So iLL",
    model: "绿 扭矩Torque RV",
    volume: "标准 RV",
    stiffness: "适中",
    scenes: ["运动攀", "野外抱石", "抱石"],
    levels: ["全能进阶", "新手进阶"],
    shape0: ["适中（2.6以上）"],
    toe: ["埃及脚", "希腊脚"],
    instep: ["适中脚背", "低脚背", "高脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["适中后跟", "弧后跟"],
    baseOffset: 1,
    feature: "硬底软面，满足支撑的同时兼顾舒适度，直后跟圆鞋头兼顾了更多脚型。",
  },
  {
    brand: "So iLL",
    model: "粉 扭矩Torque LV",
    volume: "窄 LV",
    stiffness: "适中",
    scenes: ["运动攀", "野外抱石", "抱石"],
    levels: ["全能进阶", "新手进阶"],
    shape0: ["窄（2.8以上）", "适中（2.6以上）"],
    toe: ["希腊脚", "埃及脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["适中后跟", "弧后跟"],
    baseOffset: 1.5,
    feature: "硬底软面，满足支撑的同时兼顾舒适度，直后跟圆鞋头兼顾了更多脚型。",
  },
  {
    brand: "So iLL",
    model: "绿Stay RV",
    volume: "窄 LV",
    stiffness: "软",
    scenes: ["抱石", "运动攀"],
    levels: ["新手进阶", "全能进阶"],
    shape0: ["窄（2.8以上）", "适中（2.6以上）"],
    toe: ["埃及脚", "希腊脚", "罗马脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["高足弓", "适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: 0.5,
    feature: "柔软有弹性的鞋面，让鞋子极具包裹感，直宽后跟提升脚后跟舒适度。",
  },
  {
    brand: "So iLL",
    model: "沙Stay RV",
    volume: "窄 LV",
    stiffness: "软",
    scenes: ["抱石", "运动攀"],
    levels: ["新手进阶", "全能进阶"],
    shape0: ["窄（2.8以上）"],
    toe: ["埃及脚", "希腊脚", "罗马脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: 0.5,
    feature: "柔软有弹性的鞋面，让鞋子极具包裹感，直宽后跟提升脚后跟舒适度。",
  },
  {
    brand: "Evolv",
    model: "Shaman（玫红/黄）",
    volume: "标准 RV",
    stiffness: "硬",
    scenes: ["运动攀", "野外抱石", "抱石"],
    levels: ["全能进阶", "新手进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["高脚背", "适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: 1,
    feature: "相对宽敞的鞋内空间，搭配 4.2mm 外底结实耐用，适合室内外多样场景。",
  },
  {
    brand: "Evolv",
    model: "Shaman2S",
    volume: "标准 RV",
    stiffness: "适中",
    scenes: ["运动攀", "抱石"],
    levels: ["全能进阶", "新手进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）", "窄（2.8以上）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["适中后跟", "弧后跟"],
    baseOffset: 0.5,
    feature: "较上一代更软、更有摩擦力、更有包裹感，在室内抱石场景更有优势。",
  },
  {
    brand: "Evolv",
    model: "Shaman Pro",
    volume: "标准 RV",
    stiffness: "硬",
    scenes: ["爬板", "运动攀", "野外抱石"],
    levels: ["全能进阶", "竞技进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["高脚背", "适中脚背", "低脚背"],
    arch: ["高足弓", "适中足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: 1,
    feature: "高足弓和大角度下弯，更有利于踩小点和大角度岩壁攀爬。",
  },
  {
    brand: "Evolv",
    model: "Shaman Trance",
    volume: "标准 RV",
    stiffness: "适中",
    scenes: ["爬板", "运动攀", "抱石"],
    levels: ["全能进阶", "新手进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）", "窄（2.8以上）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["高脚背", "适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟", "弧后跟"],
    baseOffset: 0.5,
    feature: "比 Pro 版更柔软更舒适，又比 2S 更进攻。",
  },
  {
    brand: "Evolv",
    model: "幻影Phantom",
    volume: "宽 AV",
    stiffness: "硬",
    scenes: ["运动攀", "野外抱石", "爬板"],
    levels: ["竞技进阶", "全能进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟", "弧后跟"],
    baseOffset: 1,
    feature: "",
  },
  {
    brand: "Evolv",
    model: "幻影Phantom Pro",
    volume: "宽 AV",
    stiffness: "硬",
    scenes: ["抱石", "运动攀", "野外抱石", "爬板"],
    levels: ["竞技进阶", "全能进阶"],
    shape0: ["适中（2.6以上）", "宽（2.5以下）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟", "弧后跟"],
    baseOffset: 0.5,
    feature: "",
  },
  {
    brand: "Evolv",
    model: "Defy",
    volume: "宽 AV",
    stiffness: "适中",
    scenes: ["运动攀", "抱石"],
    levels: ["新手入门"],
    shape0: ["宽（2.5以下）", "适中（2.6以上）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["高脚背", "适中脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: 1,
    feature: "",
  },
  {
    brand: "Evolv",
    model: "Defy Lace",
    volume: "宽 AV",
    stiffness: "硬",
    scenes: ["运动攀", "野外抱石", "抱石"],
    levels: ["新手入门"],
    shape0: ["宽（2.5以下）", "适中（2.6以上）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["高脚背", "适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: 1,
    feature: "",
  },
  {
    brand: "Evolv",
    model: "V6",
    volume: "宽 AV",
    stiffness: "硬",
    scenes: ["抱石", "运动攀", "野外抱石"],
    levels: ["新手进阶", "全能进阶"],
    shape0: ["宽（2.5以下）", "适中（2.6以上）"],
    toe: ["罗马脚", "希腊脚", "埃及脚"],
    instep: ["高脚背", "适中脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: 1,
    feature: "",
  },
  {
    brand: "Evolv",
    model: "Kira/Kronos",
    volume: "标准 RV",
    stiffness: "硬",
    scenes: ["运动攀", "抱石", "野外抱石"],
    levels: ["新手入门", "新手进阶"],
    shape0: ["适中（2.6以上）", "窄（2.8以上）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["适中脚背", "低脚背", "高脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: 0.5,
    feature: "",
  },
  {
    brand: "Evolv",
    model: "Yosemite",
    volume: "标准 RV",
    stiffness: "硬",
    scenes: ["野外抱石", "运动攀", "传统攀", "多段", "结组"],
    levels: ["竞技进阶"],
    shape0: ["适中（2.6以上）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["高脚背", "适中脚背", "低脚背"],
    arch: ["适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟", "弧后跟"],
    baseOffset: 0,
    feature: "",
  },
  {
    brand: "Tenaya",
    model: "indalo",
    volume: "标准 RV",
    stiffness: "适中",
    scenes: ["野外抱石", "运动攀", "多段", "结组"],
    levels: ["新手进阶", "全能进阶"],
    shape0: ["适中（2.6以上）", "窄（2.8以上）"],
    toe: ["罗马脚", "希腊脚", "埃及脚"],
    instep: ["高脚背", "适中脚背"],
    arch: ["高足弓", "适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: -1,
    feature: "",
  },
  {
    brand: "Tenaya",
    model: "mastia",
    volume: "标准 RV",
    stiffness: "适中",
    scenes: ["野外抱石", "运动攀", "抱石"],
    levels: ["新手进阶", "全能进阶"],
    shape0: ["适中（2.6以上）", "窄（2.8以上）"],
    toe: ["罗马脚", "希腊脚", "埃及脚"],
    instep: ["适中脚背", "低脚背"],
    arch: ["高足弓", "适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟"],
    baseOffset: -1,
    feature: "",
  },
  {
    brand: "Tenaya",
    model: "Arai/Tanta",
    volume: "标准 RV",
    stiffness: "适中",
    scenes: ["抱石", "运动攀"],
    levels: ["新手入门"],
    shape0: ["适中（2.6以上）", "窄（2.8以上）", "宽（2.5以下）"],
    toe: ["罗马脚", "埃及脚", "希腊脚"],
    instep: ["高脚背", "适中脚背", "低脚背"],
    arch: ["高足弓", "适中足弓", "低足弓"],
    heel: ["直后跟", "无后跟", "适中后跟", "弧后跟"],
    baseOffset: 0,
    feature: "",
  },
];

const FEEL_OPTIONS = [
  { key: "performance_plus", label: "极致包裹", delta: -1, note: "比表格基准再减 1 码" },
  { key: "performance", label: "适当包裹", delta: -0.5, note: "比表格基准再减 0.5 码" },
  { key: "balanced", label: "平衡推荐", delta: 0, note: "直接使用表格基准码" },
  { key: "comfort", label: "适当舒适", delta: 0.5, note: "比表格基准加 0.5 码" },
  { key: "comfort_plus", label: "极致舒适", delta: 1, note: "比表格基准加 1 码" },
];

const FILTER_CONFIG = {
  scene: { label: "场景", weight: 4.1, dataKey: "scenes" },
  level: { label: "阶段", weight: 2.2, dataKey: "levels" },
  shape0: { label: "前掌宽窄", weight: 4.5, dataKey: "shape0" },
  toe: { label: "脚趾", weight: 3.4, dataKey: "toe" },
  instep: { label: "脚背", weight: 3.2, dataKey: "instep" },
  arch: { label: "足弓", weight: 2.6, dataKey: "arch" },
  heel: { label: "后跟", weight: 2.4, dataKey: "heel" },
};

const MATCH_QUALITY_SCALE = 0.24;

const STEP_FLOW = [
  {
    key: "start",
    title: "准备开始",
    description: "点击开始后，一页一页完成选择。",
    progress: 0,
  },
  {
    key: "guide",
    title: "先判断脚长和脚型",
    description: "后面正式选择时，每页只做一个判断。",
    progress: 1,
  },
  {
    key: "scene",
    title: "攀爬场景",
    description: "这里可以多选，选完后再进入下一步。",
    progress: 2,
  },
  {
    key: "level",
    title: "阶段需求",
    description: "点击选项后会自动进入下一步。",
    progress: 3,
  },
  {
    key: "shape0",
    title: "前掌宽窄",
    description: "点击选项后会自动进入下一步。",
    progress: 4,
  },
  {
    key: "toe",
    title: "脚趾类型",
    description: "点击选项后会自动进入下一步。",
    progress: 5,
  },
  {
    key: "instep",
    title: "脚背高低",
    description: "点击选项后会自动进入下一步。",
    progress: 6,
  },
  {
    key: "arch",
    title: "足弓高低",
    description: "点击选项后会自动进入下一步。",
    progress: 7,
  },
  {
    key: "heel",
    title: "后跟轮廓",
    description: "点击选项后会自动进入下一步。",
    progress: 8,
  },
  {
    key: "sizeFeel",
    title: "鞋码与脚感",
    description: "填完平时鞋码后，点击查看结果。",
    progress: 9,
  },
];

const VALUE_LABELS = {
  shape0: {
    "宽（2.5以下）": "宽",
    "适中（2.6以上）": "适中",
    "窄（2.8以上）": "窄",
  },
};

const MULTI_SELECT_FIELDS = new Set(["scene"]);

const state = {
  scene: [],
  level: null,
  shape0: null,
  toe: null,
  instep: null,
  arch: null,
  heel: null,
  streetSize: null,
  feel: "balanced",
};

const answered = {
  scene: false,
  level: false,
  shape0: false,
  toe: false,
  instep: false,
  arch: false,
  heel: false,
};

let currentStepIndex = 0;
let autoNextTimer = null;
let lastResultTriggerAt = 0;
const RESULT_STORAGE_KEY = "banana_climbing_result_payload_v2";
const STATE_STORAGE_KEY = "banana_climbing_result_state_v2";
const WIZARD_PAGE_URL = "index-v2.html";
const RESULT_VIEW_QUERY_KEY = "view";
const RESULT_VIEW_QUERY_VALUE = "result";
const RESULT_STATE_HASH_PREFIX = "#state=";
const RESULT_PAYLOAD_HASH_PREFIX = "#payload=";

const wizardView = document.getElementById("wizardView");
const resultView = document.getElementById("resultView");
const topBar = document.getElementById("topBar");
const panels = Array.from(document.querySelectorAll(".step-panel"));
const optionButtons = Array.from(document.querySelectorAll(".option-button"));
const navButtons = Array.from(document.querySelectorAll("[data-nav]"));
const feelButtons = Array.from(document.querySelectorAll("[data-feel-filter]"));
const sizeStepButtons = Array.from(document.querySelectorAll("[data-size-step]"));
const progressTitle = document.getElementById("progressTitle");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const shoeCountStart = document.getElementById("shoeCountStart");
const streetSizeInput = document.getElementById("streetSizeInput");
const sizeError = document.getElementById("sizeError");
const viewResultButton = document.getElementById("viewResultButton");
const resultPageSummary = document.getElementById("resultPageSummary");
const resultPagePrimary = document.getElementById("resultPagePrimary");
const resultPageAlternatives = document.getElementById("resultPageAlternatives");
const resultPageEmpty = document.getElementById("resultPageEmpty");
const resultPageBody = document.getElementById("resultPageBody");
const resultBackButton = document.getElementById("resultBackButton");
const resultRestartButton = document.getElementById("resultRestartButton");
const resultEmptyBackButton = document.getElementById("resultEmptyBackButton");
const AUTO_NEXT_DELAY = window.matchMedia && window.matchMedia("(pointer: coarse)").matches ? 36 : 90;

function dedupe(values) {
  return values.filter((value, index, list) => value && list.indexOf(value) === index);
}

function normalizeScene(value) {
  if (value === "多段" || value === "结组") {
    return "多段/结组";
  }

  return value;
}

function normalizeHeel(value) {
  if (value === "直后跟" || value === "无后跟") {
    return "直后跟/无后跟";
  }

  return value;
}

function buildFallbackFeature(shoe) {
  const sceneText = shoe.scenes.slice(0, 3).join(" / ");
  return `${shoe.volume} 鞋楦，${shoe.stiffness} 底感，更偏向 ${sceneText}。`;
}

const shoeDatabase = rawShoeDatabase.map((shoe) => ({
  brand: shoe.brand,
  model: shoe.model,
  volume: shoe.volume,
  stiffness: shoe.stiffness,
  scenes: dedupe(shoe.scenes.map(normalizeScene)),
  levels: dedupe(shoe.levels),
  shape0: dedupe(shoe.shape0),
  toe: dedupe(shoe.toe),
  instep: dedupe(shoe.instep),
  arch: dedupe(shoe.arch),
  heel: dedupe(shoe.heel.map(normalizeHeel)),
  baseOffset: shoe.baseOffset,
  feature: shoe.feature || buildFallbackFeature(shoe),
}));

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getDisplayValue(key, value) {
  const group = VALUE_LABELS[key];
  if (group && group[value]) {
    return group[value];
  }

  return value;
}

function formatSize(value) {
  return Number(value).toFixed(1);
}

function roundToHalf(value) {
  return Math.round(value * 2) / 2;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatOffset(value) {
  const number = Number(value).toFixed(1).replace(".0", "");
  return value >= 0 ? `+${number}` : number;
}

function safeParse(rawValue) {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
}

function encodeBase64Unicode(value) {
  try {
    return window
      .btoa(unescape(encodeURIComponent(value)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  } catch (error) {
    return null;
  }
}

function decodeBase64Unicode(value) {
  if (!value) {
    return null;
  }

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "+");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return decodeURIComponent(escape(window.atob(padded)));
  } catch (error) {
    return null;
  }
}

function getFeelOption(key) {
  const option = FEEL_OPTIONS.find((item) => item.key === key);
  return option || FEEL_OPTIONS[2];
}

function isMultiSelectField(field) {
  return MULTI_SELECT_FIELDS.has(field);
}

function normalizeStateValue(field, value) {
  if (isMultiSelectField(field)) {
    if (Array.isArray(value)) {
      return dedupe(value.map(normalizeScene));
    }

    if (typeof value === "string" && value) {
      return [normalizeScene(value)];
    }

    return [];
  }

  return value ?? null;
}

function getSelectedValues(field) {
  if (isMultiSelectField(field)) {
    return Array.isArray(state[field]) ? state[field] : [];
  }

  return state[field] ? [state[field]] : [];
}

function hasSelectedValue(field) {
  return getSelectedValues(field).length > 0;
}

function getCurrentStepMeta() {
  return STEP_FLOW[currentStepIndex];
}

function updateProgress() {
  const meta = getCurrentStepMeta();
  const progress = meta.progress;

  progressTitle.textContent = meta.title;
  progressText.textContent = meta.description;

  if (progress === 0) {
    progressFill.style.width = "0%";
    return;
  }

  progressFill.style.width = `${(progress / 9) * 100}%`;
}

function syncPanels() {
  panels.forEach((panel, index) => {
    const isActive = index === currentStepIndex;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function syncOptionButtons() {
  optionButtons.forEach((button) => {
    const field = button.dataset.field;
    const value = button.dataset.value === "__skip__" ? null : button.dataset.value;
    const isSelected =
      value === null ? Boolean(answered[field]) && !hasSelectedValue(field) : getSelectedValues(field).includes(value);
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function syncFeelButtons() {
  feelButtons.forEach((button) => {
    const isSelected = button.dataset.feelFilter === state.feel;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function syncSizeInput() {
  if (state.streetSize === null) {
    if (document.activeElement !== streetSizeInput) {
      streetSizeInput.value = "";
    }
    return;
  }

  if (document.activeElement !== streetSizeInput) {
    streetSizeInput.value = formatSize(state.streetSize);
  }
}

function syncStreetSizeFromInput() {
  const rawValue = String(streetSizeInput.value || "").trim();
  if (!rawValue) {
    state.streetSize = null;
    return null;
  }

  const value = Number(rawValue.replace(",", "."));
  if (Number.isNaN(value)) {
    return state.streetSize;
  }

  updateStreetSize(value);
  return state.streetSize;
}

function scheduleAutoNext() {
  clearTimeout(autoNextTimer);
  autoNextTimer = window.setTimeout(() => {
    goToStepIndex(Math.min(currentStepIndex + 1, STEP_FLOW.length - 1));
  }, AUTO_NEXT_DELAY);
}

function goToStepIndex(index) {
  clearTimeout(autoNextTimer);
  currentStepIndex = clamp(index, 0, STEP_FLOW.length - 1);
  if (STEP_FLOW[currentStepIndex].key === "sizeFeel") {
    sizeError.hidden = true;
  }
  syncPanels();
  updateProgress();
  syncOptionButtons();
  syncFeelButtons();
  syncSizeInput();
}

function updateStreetSize(nextValue) {
  if (nextValue === null || Number.isNaN(nextValue)) {
    state.streetSize = null;
    return;
  }

  state.streetSize = clamp(roundToHalf(nextValue), 33, 48);
}

function getSelectionChips() {
  return Object.keys(FILTER_CONFIG)
    .flatMap((key) =>
      getSelectedValues(key).map((value) => `${FILTER_CONFIG[key].label} · ${getDisplayValue(key, value)}`),
    );
}

function buildSizePlan(baseOffset) {
  const baseSize = roundToHalf(state.streetSize + baseOffset);
  const options = FEEL_OPTIONS.map((option) => ({
    key: option.key,
    label: option.label,
    note: option.note,
    size: clamp(roundToHalf(baseSize + option.delta), 30, 50),
  }));
  const selected = options.find((option) => option.key === state.feel) || options[2];

  return {
    baseSize,
    options,
    selected,
  };
}

function createStateSnapshot() {
  return {
    scene: state.scene.slice(),
    level: state.level,
    shape0: state.shape0,
    toe: state.toe,
    instep: state.instep,
    arch: state.arch,
    heel: state.heel,
    streetSize: state.streetSize,
    feel: state.feel,
  };
}

function applyStateSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return false;
  }

  Object.keys(FILTER_CONFIG).forEach((key) => {
    const hasValue = Object.prototype.hasOwnProperty.call(snapshot, key);
    state[key] = hasValue ? normalizeStateValue(key, snapshot[key]) : normalizeStateValue(key, null);
    answered[key] = hasValue && hasSelectedValue(key);
  });

  if (Object.prototype.hasOwnProperty.call(snapshot, "streetSize")) {
    const nextStreetSize = Number(snapshot.streetSize);
    updateStreetSize(Number.isNaN(nextStreetSize) ? null : nextStreetSize);
  } else {
    state.streetSize = null;
  }

  if (typeof snapshot.feel === "string" && FEEL_OPTIONS.some((option) => option.key === snapshot.feel)) {
    state.feel = snapshot.feel;
  } else {
    state.feel = "balanced";
  }

  return state.streetSize !== null;
}

function getActiveFilterCount() {
  return Object.keys(FILTER_CONFIG).filter((key) => hasSelectedValue(key)).length;
}

function getMatchQualityFactor(values) {
  if (!Array.isArray(values) || !values.length) {
    return 0;
  }

  return 1 / values.length;
}

function evaluateShoe(shoe) {
  let score = 0;
  let maxScore = 0;
  const matched = [];
  const selectedScenes = getSelectedValues("scene");
  const comboBonus = selectedScenes.length && state.level ? 0.35 : 0;

  Object.keys(FILTER_CONFIG).forEach((key) => {
    const selectedValues = getSelectedValues(key);
    const config = FILTER_CONFIG[key];
    const shoeValues = shoe[config.dataKey] || [];

    if (!selectedValues.length) {
      return;
    }

    const weightPerValue = config.weight / selectedValues.length;

    selectedValues.forEach((selectedValue) => {
      maxScore += weightPerValue * (1 + MATCH_QUALITY_SCALE);

      if (Array.isArray(shoeValues) && shoeValues.includes(selectedValue)) {
        score += weightPerValue;
        score += weightPerValue * MATCH_QUALITY_SCALE * getMatchQualityFactor(shoeValues);
        matched.push(`${config.label} · ${getDisplayValue(key, selectedValue)}`);
      }
    });
  });

  if (comboBonus) {
    maxScore += comboBonus;
  }

  if (comboBonus && selectedScenes.some((scene) => shoe.scenes.includes(scene)) && shoe.levels.includes(state.level)) {
    score += comboBonus;
  }

  if (!getActiveFilterCount()) {
    score += shoe.scenes.length * 0.3;
    score += shoe.levels.includes("全能进阶") ? 1.2 : 0;
    score += shoe.levels.includes("新手进阶") ? 0.7 : 0;
    score += shoe.volume === "标准 RV" ? 0.3 : 0;
  }

  return {
    shoe: shoe,
    matched: matched,
    score: score,
    percentage: maxScore ? Math.min(100, Math.round((score / maxScore) * 100)) : null,
  };
}

function getRankedShoes() {
  return shoeDatabase
    .map(evaluateShoe)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.matched.length !== left.matched.length) {
        return right.matched.length - left.matched.length;
      }

      return left.shoe.baseOffset - right.shoe.baseOffset;
    });
}

function renderSummaryText(candidates, matchedCount) {
  return "";
}

function renderMatchTags(item) {
  if (item.matched.length) {
    return item.matched
      .slice(0, 5)
      .map((match) => `<span>${escapeHtml(match)}</span>`)
      .join("");
  }

  return `<span>按通用度推荐</span>`;
}

function buildCompactTags(shoe, limit = 3) {
  return [shoe.volume, shoe.stiffness].concat(shoe.scenes).filter(Boolean).slice(0, limit);
}

function shortenFeatureText(text, maxLength = 42) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "根据你的选择，这双鞋在包裹感、支撑和场景适配上更匹配。";
  }

  const firstSentence = normalized.split(/[。！？!?.]/)[0].trim();
  const candidate = firstSentence || normalized;
  if (candidate.length <= maxLength) {
    return candidate;
  }

  return `${candidate.slice(0, maxLength).trim()}...`;
}

function renderShoeThumbnail(shoe, variant = "primary") {
  return `
    <div class="shoe-mark shoe-mark--${variant}" aria-hidden="true">
      <img class="shoe-mark-logo" src="logo-banana-clean-160.png" alt="" />
    </div>
  `;
}

function renderPrimaryResult(item) {
  const plan = buildSizePlan(item.shoe.baseOffset);
  const tags = buildCompactTags(item.shoe);

  return `
    <p class="mini-kicker">首推鞋款</p>
    <div class="result-primary-body">
      <div class="result-card-head">
        ${renderShoeThumbnail(item.shoe, "primary")}
        <div class="result-card-copy">
          <div class="result-primary-header">
            <div>
              <h3>${escapeHtml(item.shoe.model)}</h3>
              <p class="brand-line">${escapeHtml(item.shoe.brand)}</p>
            </div>
          </div>

          <div class="tag-row result-card-tags">
            ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </div>

      <div class="size-box size-box--compact">
        <div class="size-main">
          <div>
            <p class="mini-kicker">主推荐尺码</p>
            <strong>EU ${formatSize(plan.selected.size)}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAlternativeResult(item, rank) {
  const plan = buildSizePlan(item.shoe.baseOffset);
  const tags = buildCompactTags(item.shoe, 2);

  return `
    <article class="alt-card">
      <div class="result-card-head">
        ${renderShoeThumbnail(item.shoe, "alt")}
        <div class="result-card-copy">
          <div class="alt-head">
            <div>
              <p class="result-rank">备选鞋款 ${rank}</p>
              <h3>${escapeHtml(item.shoe.model)}</h3>
              <p class="brand-line">${escapeHtml(item.shoe.brand)}</p>
            </div>
          </div>

          <div class="tag-row result-card-tags">
            ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>

          <p class="alt-size">建议试穿：EU ${formatSize(plan.selected.size)}</p>
        </div>
      </div>
    </article>
  `;
}

function buildResultPayload() {
  if (state.streetSize === null) {
    return null;
  }

  const ranked = getRankedShoes();
  const matched = getActiveFilterCount() ? ranked.filter((item) => item.matched.length > 0) : ranked;
  const candidates = (matched.length ? matched : ranked).slice(0, 3);
  const primary = candidates[0];
  const alternatives = candidates.slice(1);

  if (!primary) {
    return {
      summaryText: renderSummaryText(candidates, matched.length),
      primaryHtml: "",
      alternativesHtml: "",
      generatedAt: Date.now(),
    };
  }

  return {
    summaryText: renderSummaryText(candidates, matched.length),
    primaryHtml: renderPrimaryResult(primary),
    alternativesHtml: alternatives.map((item, index) => renderAlternativeResult(item, index + 1)).join(""),
    generatedAt: Date.now(),
  };
}

function computeResultPayloadFromSnapshot(snapshot) {
  if (!applyStateSnapshot(snapshot)) {
    return null;
  }

  return buildResultPayload();
}

function storeResultPayload(payload) {
  const serializedPayload = payload ? JSON.stringify(payload) : null;
  const serializedState = JSON.stringify(createStateSnapshot());

  try {
    if (serializedPayload) {
      window.sessionStorage.setItem(RESULT_STORAGE_KEY, serializedPayload);
    }
    window.sessionStorage.setItem(STATE_STORAGE_KEY, serializedState);
  } catch (error) {
    // Ignore and fall through to localStorage.
  }

  try {
    if (serializedPayload) {
      window.localStorage.setItem(RESULT_STORAGE_KEY, serializedPayload);
    }
    window.localStorage.setItem(STATE_STORAGE_KEY, serializedState);
  } catch (error) {
    // Ignore storage failures on locked-down previews.
  }

  try {
    window.name = JSON.stringify({
      resultState: createStateSnapshot(),
      resultPayload: payload || null,
    });
  } catch (error) {
    // Ignore window.name failures.
  }
}

function buildWizardPageUrl(params = {}, hash = "") {
  try {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });

    if (hash) {
      url.hash = hash.startsWith("#") ? hash : `#${hash}`;
    }

    return url.toString();
  } catch (error) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        searchParams.set(key, String(value));
      }
    });

    const query = searchParams.toString();
    const normalizedHash = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";
    return `${WIZARD_PAGE_URL}${query ? `?${query}` : ""}${normalizedHash}`;
  }
}

function syncRouteLinks() {
  const restartUrl = buildWizardPageUrl({ restart: 1 });
  const resumeUrl = buildWizardPageUrl({ resume: 1 });

  if (resultBackButton) {
    resultBackButton.href = resumeUrl;
  }

  if (resultRestartButton) {
    resultRestartButton.href = restartUrl;
  }

  if (resultEmptyBackButton) {
    resultEmptyBackButton.href = restartUrl;
  }
}

function buildResultPageUrl() {
  const encodedContext = encodeBase64Unicode(JSON.stringify(createStateSnapshot()));
  const hash = encodedContext ? `${RESULT_STATE_HASH_PREFIX}${encodedContext}` : "";
  return buildWizardPageUrl({ [RESULT_VIEW_QUERY_KEY]: RESULT_VIEW_QUERY_VALUE }, hash);
}

function clearStoredResultData() {
  try {
    window.sessionStorage.removeItem(RESULT_STORAGE_KEY);
    window.sessionStorage.removeItem(STATE_STORAGE_KEY);
  } catch (error) {
    // Ignore.
  }

  try {
    window.localStorage.removeItem(RESULT_STORAGE_KEY);
    window.localStorage.removeItem(STATE_STORAGE_KEY);
  } catch (error) {
    // Ignore.
  }

  try {
    window.name = "";
  } catch (error) {
    // Ignore.
  }
}

function readStateSnapshotFromHash() {
  const hash = window.location.hash || "";
  if (!hash.startsWith(RESULT_STATE_HASH_PREFIX)) {
    return null;
  }

  const decoded = decodeBase64Unicode(hash.slice(RESULT_STATE_HASH_PREFIX.length));
  return safeParse(decoded);
}

function readStoredWizardState() {
  const hashState = readStateSnapshotFromHash();
  if (hashState) {
    return hashState;
  }

  const sessionState = safeParse(
    (() => {
      try {
        return window.sessionStorage.getItem(STATE_STORAGE_KEY);
      } catch (error) {
        return null;
      }
    })(),
  );

  if (sessionState) {
    return sessionState;
  }

  const localState = safeParse(
    (() => {
      try {
        return window.localStorage.getItem(STATE_STORAGE_KEY);
      } catch (error) {
        return null;
      }
    })(),
  );

  if (localState) {
    return localState;
  }

  const bridgeState = safeParse(window.name);
  if (bridgeState && bridgeState.resultState) {
    return bridgeState.resultState;
  }

  return null;
}

function restoreWizardState(snapshot) {
  applyStateSnapshot(snapshot);
  if (sizeError) {
    sizeError.hidden = true;
  }
}

function hasRenderablePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return Boolean(
    (typeof payload.summaryText === "string" && payload.summaryText.trim()) ||
      (typeof payload.primaryHtml === "string" && payload.primaryHtml.trim()) ||
      (typeof payload.alternativesHtml === "string" && payload.alternativesHtml.trim()),
  );
}

function buildFallbackAlternativesHtml() {
  return `
    <article class="alt-card">
      <h3>暂无更多备选</h3>
      <p class="alt-note">当前条件下，系统优先展示最贴近的一组推荐。</p>
    </article>
  `;
}

function showResultEmptyState() {
  if (!resultPageEmpty || !resultPageBody || !resultPageSummary) {
    return;
  }

  resultPageEmpty.hidden = false;
  resultPageBody.hidden = true;
  resultPageSummary.textContent = "";
  resultPageSummary.hidden = true;
}

function showResultContent(payload) {
  if (!resultPageEmpty || !resultPageBody || !resultPageSummary || !resultPagePrimary || !resultPageAlternatives) {
    return;
  }

  resultPageEmpty.hidden = true;
  resultPageBody.hidden = false;
  resultPageSummary.textContent = payload.summaryText || "";
  resultPageSummary.hidden = !payload.summaryText;
  resultPagePrimary.innerHTML = payload.primaryHtml || "";
  resultPageAlternatives.innerHTML = payload.alternativesHtml || buildFallbackAlternativesHtml();
}

function renderResultRoute() {
  const snapshot = readStoredWizardState();
  if (!snapshot) {
    showResultEmptyState();
    return;
  }

  restoreWizardState(snapshot);
  const payload = buildResultPayload();
  if (!hasRenderablePayload(payload)) {
    showResultEmptyState();
    return;
  }

  showResultContent(payload);
}

function openResultRouteWithFallback(targetUrl) {
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const fallback = () => {
    try {
      const target = new URL(targetUrl, window.location.href);
      window.history.pushState({}, document.title, `${target.pathname}${target.search}${target.hash}`);
    } catch (error) {
      // Ignore history failures and still render in place.
    }

    syncRouteView(true);
    renderResultRoute();
  };

  try {
    window.location.assign(targetUrl);
  } catch (error) {
    fallback();
    return;
  }

  window.setTimeout(() => {
    const nextUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl === currentUrl) {
      fallback();
    }
  }, 240);
}

function syncRouteView(showResult) {
  if (topBar) {
    topBar.hidden = false;
  }

  if (wizardView) {
    wizardView.hidden = showResult;
  }

  if (resultView) {
    resultView.hidden = !showResult;
  }

  if (showResult) {
    window.scrollTo(0, 0);
  }
}

function stripQueryString() {
  if (!window.location.search) {
    return;
  }

  try {
    const url = new URL(window.location.href);
    let changed = false;

    ["restart", "resume"].forEach((key) => {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    });

    if (!changed) {
      return;
    }

    const cleanUrl = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, document.title, cleanUrl);
  } catch (error) {
    // Ignore environments that do not support history replacement.
  }
}

function initializeWizard() {
  const params = new URLSearchParams(window.location.search);
  const shouldRestart = params.get("restart") === "1";
  const shouldResume = params.get("resume") === "1";
  const shouldShowResult = params.get(RESULT_VIEW_QUERY_KEY) === RESULT_VIEW_QUERY_VALUE;

  if (shouldRestart) {
    clearStoredResultData();
  }

  syncCounts();
  syncRouteLinks();
  syncOptionButtons();
  syncFeelButtons();

  if (shouldShowResult) {
    syncRouteView(true);
    renderResultRoute();
    stripQueryString();
    return;
  }

  syncRouteView(false);

  if (shouldResume) {
    const storedState = readStoredWizardState();
    if (storedState) {
      restoreWizardState(storedState);
      goToStepIndex(STEP_FLOW.findIndex((step) => step.key === "sizeFeel"));
      stripQueryString();
      return;
    }
  }

  goToStepIndex(0);
  stripQueryString();
}

function showResultsIfReady() {
  syncStreetSizeFromInput();

  if (state.streetSize === null) {
    sizeError.hidden = false;
    return false;
  }

  sizeError.hidden = true;
  const payload = buildResultPayload();
  if (!payload) {
    return false;
  }

  storeResultPayload(payload);
  openResultRouteWithFallback(buildResultPageUrl());
  return true;
}

function syncCounts() {
  shoeCountStart.textContent = String(shoeDatabase.length);
}

function resetWizard() {
  state.scene = [];
  state.level = null;
  state.shape0 = null;
  state.toe = null;
  state.instep = null;
  state.arch = null;
  state.heel = null;
  state.streetSize = null;
  state.feel = "balanced";
  answered.scene = false;
  answered.level = false;
  answered.shape0 = false;
  answered.toe = false;
  answered.instep = false;
  answered.arch = false;
  answered.heel = false;
  sizeError.hidden = true;
  streetSizeInput.value = "";
  syncOptionButtons();
  syncFeelButtons();
  goToStepIndex(0);
}

function mountWizardPage() {
  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.dataset.field;
      const value = button.dataset.value === "__skip__" ? null : button.dataset.value;

      if (isMultiSelectField(field)) {
        const nextValues = new Set(getSelectedValues(field));
        if (nextValues.has(value)) {
          nextValues.delete(value);
        } else if (value) {
          nextValues.add(value);
        }
        state[field] = Array.from(nextValues);
        answered[field] = state[field].length > 0;
        syncOptionButtons();
        return;
      }

      state[field] = value;
      answered[field] = true;
      syncOptionButtons();
      scheduleAutoNext();
    });
  });

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.nav === "next") {
        goToStepIndex(currentStepIndex + 1);
        return;
      }

      if (button.dataset.nav === "prev") {
        goToStepIndex(currentStepIndex - 1);
      }
    });
  });

  feelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.feel = button.dataset.feelFilter;
      syncFeelButtons();
    });
  });

  sizeStepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.sizeStep);
      const currentValue = state.streetSize === null ? 39 : state.streetSize;
      updateStreetSize(currentValue + step);
      sizeError.hidden = true;
      syncSizeInput();
    });
  });

  const handleStreetSizeInput = () => {
    const nextStreetSize = syncStreetSizeFromInput();
    if (nextStreetSize !== null) {
      sizeError.hidden = true;
    }
  };

  streetSizeInput.addEventListener("input", handleStreetSizeInput);
  streetSizeInput.addEventListener("change", handleStreetSizeInput);

  streetSizeInput.addEventListener("blur", () => {
    syncStreetSizeFromInput();
    syncSizeInput();
  });

  streetSizeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      showResultsIfReady();
    }
  });

  const triggerResultView = (event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    const now = Date.now();
    if (now - lastResultTriggerAt < 400) {
      return;
    }

    lastResultTriggerAt = now;
    showResultsIfReady();
  };

  viewResultButton.addEventListener("click", triggerResultView);
  viewResultButton.addEventListener("touchend", triggerResultView, { passive: false });

  initializeWizard();
}

window.BananaClimbingCore = {
  RESULT_STORAGE_KEY,
  STATE_STORAGE_KEY,
  RESULT_STATE_HASH_PREFIX,
  RESULT_PAYLOAD_HASH_PREFIX,
  safeParse,
  decodeBase64Unicode,
  createStateSnapshot,
  applyStateSnapshot,
  computeResultPayloadFromSnapshot,
  buildResultPayload,
  clearStoredResultData,
  readStoredWizardState,
};

if (viewResultButton && streetSizeInput && sizeError && progressTitle && progressText && progressFill && shoeCountStart) {
  mountWizardPage();
}
