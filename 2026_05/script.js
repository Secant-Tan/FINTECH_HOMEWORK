/* ==============================================
   Health Supplement Advisor — Application Logic
   ============================================== */

// ── Constants ──────────────────────────────────

const STORAGE_KEY = "health_supplement_form_data";

const stepTitles = ["基本信息", "健康状况", "生活习惯", "确认提交"];
const stepHints = [
  "先了解你的基础状态，后面的推荐会更准确。",
  "这一页不会用于诊断，只用于识别补剂选择时需要谨慎的情况。",
  "请按最近 1-2 个月的真实状态填写，不需要追求完美答案。",
  "确认后生成报告，你可以随时重新评估。"
];

const riskOptions = [
  ["yes", "是"],
  ["no", "否"],
  ["unsure", "不确定"],
  ["private", "不愿透露"]
];

const frequencyOptions = [
  [0, "从不"],
  [1, "偶尔"],
  [2, "有时"],
  [3, "经常"],
  [4, "几乎总是"]
];

const goalLabels = {
  energy: "提升精力", skin: "皮肤与状态", eye: "护眼疲劳",
  fitness: "运动恢复", immunity: "免疫支持", general: "综合健康"
};

const healthRiskQuestions = [
  { id: "diabetes", text: "是否有糖尿病、血糖异常或糖化血红蛋白偏高？" },
  { id: "heartDisease", text: "是否有高血压、高血脂、心脏疾病或家族心血管风险？" },
  { id: "kidneyDisease", text: "是否有肾病、肾结石或肾功能异常？" },
  { id: "liverDisease", text: "是否有肝病、脂肪肝或肝功能异常？" },
  { id: "thyroid", text: "是否有甲状腺疾病或正在使用相关药物？" },
  { id: "anemia", text: "是否曾被告知贫血、缺铁、B12 或叶酸不足？" },
  { id: "longTermMedication", text: "是否正在长期服药或定期使用处方药？" },
  { id: "anticoagulant", text: "是否正在服用抗凝药、降糖药、降压药或降脂药？" },
  { id: "allergy", text: "是否存在鱼类、坚果、乳制品、大豆等食物过敏？" }
];

const lifestyleQuestions = [
  { id: "lateSleep", text: "我经常熬夜或入睡时间不稳定。", dimensions: ["sleep"] },
  { id: "fatigue", text: "我白天容易疲劳、犯困或注意力不集中。", dimensions: ["sleep", "stress"] },
  { id: "eyeStrain", text: "我长时间看屏幕，并感到眼睛干涩、酸胀或疲劳。", dimensions: ["eye"] },
  { id: "lowSunExposure", text: "我很少晒太阳，白天大多在室内。", dimensions: ["bone"] },
  { id: "lowVegetableFruit", text: "我很少吃新鲜蔬菜和水果。", dimensions: ["antioxidant", "fiber", "skin"] },
  { id: "lowFishNuts", text: "我很少吃鱼类、坚果、牛油果或橄榄油等优质脂肪。", dimensions: ["heart", "eye", "skin"] },
  { id: "lowDairy", text: "我很少吃奶制品、豆制品或其他钙来源食物。", dimensions: ["bone"] },
  { id: "highSugar", text: "我经常吃甜食、奶茶、含糖饮料或精制碳水。", dimensions: ["sugar", "skin"] },
  { id: "highSaltProcessed", text: "我经常吃重盐、腌制、油炸、外卖或加工食品。", dimensions: ["heart", "mineral"] },
  { id: "irregularMeals", text: "我三餐不规律，经常不吃早餐或晚餐很晚。", dimensions: ["sugar", "sleep", "digestive"] },
  { id: "lowWater", text: "我喝水较少，常靠咖啡、茶或饮料补水。", dimensions: ["hydration", "digestive", "skin"] },
  { id: "caffeine", text: "我下午或晚上仍会喝咖啡、浓茶或能量饮料。", dimensions: ["sleep", "stress"] },
  { id: "smoking", text: "我经常抽烟、电子烟或接触二手烟。", dimensions: ["antioxidant", "heart", "skin"] },
  { id: "alcohol", text: "我经常饮酒或周末集中饮酒。", dimensions: ["liver", "sleep"] },
  { id: "lowExercise", text: "我运动量不足，久坐时间较长。", dimensions: ["heart", "sleep", "stress"] },
  { id: "stress", text: "我近期压力较大，恢复感较差。", dimensions: ["stress", "sleep"] },
  { id: "lowFiber", text: "我肠胃不规律，或很少吃全谷物、豆类和高纤维食物。", dimensions: ["fiber", "digestive"] },
  { id: "skinHair", text: "我近期皮肤状态、头发或指甲状态让我比较在意。", dimensions: ["skin", "mineral"] },
  { id: "sickOften", text: "我换季、熬夜或压力大时容易不舒服。", dimensions: ["immune", "stress"] },
  { id: "cramps", text: "我偶尔有抽筋、肌肉紧张或运动后恢复慢。", dimensions: ["mineral", "fitness"] },
  { id: "training", text: "我近期有运动塑形、增肌或体能提升目标。", dimensions: ["fitness"] }
];

const goalSpecificQuestions = {
  energy: [
    { id: "energyAfternoonCrash", text: "我下午或饭后容易明显犯困、脑子变慢。", dimensions: ["sleep", "sugar"] },
    { id: "energyBreakfast", text: "我经常早餐吃得很少，或只喝咖啡/饮料应付。", dimensions: ["sugar", "digestive"] },
    { id: "energyProteinLow", text: "我每餐很少有鸡蛋、奶、鱼肉、豆制品等蛋白质来源。", dimensions: ["fitness", "sleep"] },
    { id: "energyIronSignal", text: "我容易头晕、手脚凉、脸色差，或曾担心过贫血。", dimensions: ["mineral", "sleep"] },
    { id: "energyMealGap", text: "我两餐之间经常间隔很久，容易饿到发慌或暴食。", dimensions: ["sugar", "digestive"] },
    { id: "energyOverwork", text: "我连续学习或工作后很难恢复，周末也缓不过来。", dimensions: ["stress", "sleep"] }
  ],
  skin: [
    { id: "skinDry", text: "我的皮肤容易干燥、暗沉，或换季状态波动明显。", dimensions: ["skin", "hydration"] },
    { id: "skinSun", text: "我白天外出较多，但防晒和遮阳做得不稳定。", dimensions: ["skin", "antioxidant"] },
    { id: "skinSugar", text: "我压力大或吃甜食后，皮肤状态更容易变差。", dimensions: ["skin", "sugar"] },
    { id: "skinAcne", text: "我近期更容易长痘、泛红，或皮肤屏障感觉不稳定。", dimensions: ["skin", "stress"] },
    { id: "skinProtein", text: "我为了控制体重，经常少吃肉蛋奶豆等蛋白质来源。", dimensions: ["skin", "fitness"] },
    { id: "skinOmega", text: "我很少吃鱼类、坚果、亚麻籽或橄榄油等脂肪来源。", dimensions: ["skin", "heart"] }
  ],
  eye: [
    { id: "eyeScreenHours", text: "我每天看电脑、平板或手机超过 6 小时。", dimensions: ["eye", "sleep"] },
    { id: "eyeDryNight", text: "晚上或空调环境下，我的眼睛更容易干涩。", dimensions: ["eye", "hydration"] },
    { id: "eyeDark", text: "我经常在光线较暗的环境下看屏幕。", dimensions: ["eye", "sleep"] },
    { id: "eyeBreak", text: "我很少主动让眼睛休息，一忙起来会连续盯屏很久。", dimensions: ["eye", "stress"] },
    { id: "eyeLeafy", text: "我很少吃深绿色蔬菜、玉米、蛋黄等护眼相关食物。", dimensions: ["eye", "antioxidant"] },
    { id: "eyeContact", text: "我经常戴隐形眼镜，或眼睛容易受环境刺激。", dimensions: ["eye", "hydration"] }
  ],
  fitness: [
    { id: "fitnessRecovery", text: "运动后酸痛恢复慢，影响下一次训练。", dimensions: ["fitness", "mineral"] },
    { id: "fitnessProtein", text: "我不确定自己每天蛋白质是否吃够。", dimensions: ["fitness"] },
    { id: "fitnessSweat", text: "我运动时出汗较多，运动后容易口渴或疲惫。", dimensions: ["hydration", "mineral", "fitness"] },
    { id: "fitnessStrength", text: "我每周有力量训练，但训练后精神和肌肉恢复一般。", dimensions: ["fitness", "sleep"] },
    { id: "fitnessDietCut", text: "我在减脂或控体重，担心吃多影响目标。", dimensions: ["sugar", "fitness"] },
    { id: "fitnessCramps", text: "我运动中或夜间偶尔抽筋、肌肉紧绷。", dimensions: ["mineral", "hydration"] }
  ],
  immunity: [
    { id: "immuneSleep", text: "只要连续熬夜或压力大，我就更容易不舒服。", dimensions: ["immune", "sleep", "stress"] },
    { id: "immuneOutdoor", text: "我日常户外活动少，很少晒太阳。", dimensions: ["immune", "bone"] },
    { id: "immuneProtein", text: "我近期食欲一般，蛋白质和蔬果摄入都不稳定。", dimensions: ["immune", "antioxidant", "fitness"] },
    { id: "immuneGut", text: "我肠胃状态不稳定，换季或压力大时更明显。", dimensions: ["immune", "digestive"] },
    { id: "immuneCrowd", text: "我经常处在人多、通勤、熬夜或高压力环境中。", dimensions: ["immune", "stress"] },
    { id: "immuneVitaminD", text: "我几乎没有关注过维生素 D、锌或蛋白质摄入是否足够。", dimensions: ["immune", "bone", "mineral"] }
  ],
  general: [
    { id: "generalCheck", text: "我不太清楚自己最近的血糖、血脂、维生素 D 或铁蛋白状态。", dimensions: ["bone", "mineral", "heart"] },
    { id: "generalRoutine", text: "我的作息、三餐和运动经常随工作学习节奏大幅波动。", dimensions: ["sleep", "digestive", "stress"] },
    { id: "generalSupplement", text: "我曾经断断续续吃过补剂，但不确定是否适合自己。", dimensions: ["mineral", "immune"] },
    { id: "generalFamily", text: "家人中有人有三高、心血管、糖尿病或骨质相关问题。", dimensions: ["heart", "sugar", "bone"] },
    { id: "generalEatingOut", text: "我经常外食或点外卖，很难控制油盐糖和蔬菜量。", dimensions: ["heart", "fiber", "sugar"] },
    { id: "generalPriority", text: "我希望先知道最值得优先调整的 2-3 个健康习惯。", dimensions: ["stress", "sleep"] }
  ]
};

// ── Conditional follow-up triggers (Feature 5) ─
const conditionalFollowUps = [
  { triggerId: "highSugar", threshold: 3, questions: [
    { id: "sugarStressLink", text: "我压力大或情绪低落时更想吃甜食或碳水。", dimensions: ["sugar", "stress"] }
  ]},
  { triggerId: "stress", threshold: 3, questions: [
    { id: "stressSleepLink", text: "压力直接影响了我的入睡速度或睡眠质量。", dimensions: ["stress", "sleep"] }
  ]},
  { triggerId: "lowExercise", threshold: 3, questions: [
    { id: "exerciseBarrier", text: "我因为时间不够或太累而很难开始运动。", dimensions: ["fitness", "stress"] }
  ]},
  { triggerId: "alcohol", threshold: 3, questions: [
    { id: "alcoholSocial", text: "我主要在社交应酬场合饮酒，有时难以推辞。", dimensions: ["liver", "stress"] }
  ]},
  { triggerId: "smoking", threshold: 2, questions: [
    { id: "smokingReduce", text: "我考虑过减少烟草/电子烟，但尚未找到替代方式。", dimensions: ["antioxidant", "heart"] }
  ]},
  { triggerId: "lowWater", threshold: 3, questions: [
    { id: "waterForgot", text: "我经常忘记喝水，忙起来半天都不喝一口。", dimensions: ["hydration", "digestive"] }
  ]}
];

const allQuestionDefs = [...lifestyleQuestions, ...Object.values(goalSpecificQuestions).flat()];
const questionTextMap = Object.fromEntries(allQuestionDefs.map(q => [q.id, q.text]));

// ── Supplement interactions (Feature 2) ────────
const supplementOptions = [
  { id: "vitaminD", label: "维生素 D" },
  { id: "calcium", label: "钙片" },
  { id: "iron", label: "铁剂" },
  { id: "zinc", label: "锌" },
  { id: "magnesium", label: "镁" },
  { id: "omega3", label: "Omega-3 / 鱼油" },
  { id: "vitaminC", label: "维生素 C" },
  { id: "bComplex", label: "B 族维生素" },
  { id: "proteinPowder", label: "蛋白粉" },
  { id: "creatine", label: "肌酸" }
];

const supplementInteractions = [
  { pair: ["calcium", "iron"], severity: "high", text: "钙会抑制铁吸收，建议错开至少 2 小时服用。" },
  { pair: ["calcium", "zinc"], severity: "medium", text: "高剂量钙可能影响锌吸收，建议分时段服用。" },
  { pair: ["iron", "zinc"], severity: "medium", text: "铁和锌存在吸收竞争，建议分开在不同餐次服用。" },
  { pair: ["vitaminC", "iron"], severity: "positive", text: "维生素 C 可以促进铁吸收，搭配服用效果更好。" },
  { pair: ["vitaminD", "calcium"], severity: "positive", text: "维生素 D 促进钙吸收，协同搭配效果更佳。" },
  { pair: ["magnesium", "calcium"], severity: "low", text: "镁和钙同服可能相互竞争吸收，睡眠前服镁、餐后服钙是常见做法。" },
  { pair: ["omega3", "vitaminD"], severity: "positive", text: "鱼油中的脂肪有助于脂溶性维生素 D 的吸收。" },
  { pair: ["proteinPowder", "iron"], severity: "low", text: "大量乳清蛋白可能影响铁吸收，建议错开 1 小时。" },
  { pair: ["vitaminD", "vitaminC"], severity: "none", text: "无已知冲突，可正常搭配。" }
];

function findInteractions(selectedIds) {
  if (selectedIds.length < 2) return [];
  const results = [];
  for (const inter of supplementInteractions) {
    if (selectedIds.includes(inter.pair[0]) && selectedIds.includes(inter.pair[1])) {
      results.push(inter);
    }
  }
  return results;
}

// ── Dimension meta (with meal plans - Feature 7) ─
const dimensionMeta = {
  sleep: {
    title: "睡眠与精力",
    nutrients: ["B 族维生素", "镁", "优质蛋白"],
    foods: ["鸡蛋", "瘦肉", "豆类", "全谷物", "深绿叶菜"],
    note: "你的睡眠节律或疲劳信号较明显。先稳定睡眠时间、减少晚间咖啡因和屏幕刺激，再考虑辅助营养。",
    reason: "睡眠不足会影响能量代谢、食欲控制和运动恢复。",
    action: "先连续 7 天固定起床时间，并把咖啡因尽量放在中午前。",
    mealPlan: { breakfast: "全麦吐司+水煮蛋+香蕉", lunch: "糙米饭+煎鸡胸+西兰花", dinner: "小米粥+嫩豆腐+蒜蓉菠菜" }
  },
  eye: {
    title: "屏幕用眼",
    nutrients: ["叶黄素", "玉米黄质", "Omega-3", "维生素 A 食物来源"],
    foods: ["菠菜", "羽衣甘蓝", "玉米", "鸡蛋黄", "深海鱼"],
    note: "长时间用眼会增加干涩和疲劳感。营养关注可以辅助，但持续疼痛、视力变化应做眼科检查。",
    reason: "屏幕时长、夜间用眼和优质脂肪不足会共同放大眼疲劳。",
    action: "每 40 分钟离屏 3-5 分钟，并增加深绿叶菜和蛋黄摄入。",
    mealPlan: { breakfast: "燕麦粥+蓝莓+水煮蛋", lunch: "杂粮饭+烤三文鱼+羽衣甘蓝沙拉", dinner: "蒸红薯+虾仁+胡萝卜炒蛋" }
  },
  bone: {
    title: "骨骼与维生素 D",
    nutrients: ["维生素 D", "钙", "镁"],
    foods: ["奶制品", "强化豆奶", "豆腐", "小鱼干", "鸡蛋"],
    note: "少晒太阳或钙来源不足时，可关注维生素 D 与钙摄入。更稳妥的方式是结合体检指标。",
    reason: "维生素 D 与钙摄入会影响骨骼、肌肉状态和免疫支持。",
    action: "优先确认日晒、奶豆制品和维生素 D 检测情况。",
    mealPlan: { breakfast: "牛奶+全麦面包+煎蛋", lunch: "麻婆豆腐+青菜+杂粮饭", dinner: "小鱼干紫菜汤+炒芥蓝+蒸蛋羹" }
  },
  antioxidant: {
    title: "蔬果与抗氧化",
    nutrients: ["维生素 C", "维生素 E", "多酚", "类胡萝卜素"],
    foods: ["柑橘", "莓果", "彩椒", "坚果", "番茄"],
    note: "蔬果摄入少或烟草暴露较多时，抗氧化饮食更值得优先补齐。",
    reason: "蔬果不足会减少维生素 C、多酚和类胡萝卜素来源。",
    action: "每天先补齐 2 种颜色的蔬果，再考虑额外补充。",
    mealPlan: { breakfast: "希腊酸奶+混合莓果+核桃", lunch: "彩椒炒鸡丁+番茄+糙米饭", dinner: "烤蔬菜拼盘+鹰嘴豆泥+全麦饼" }
  },
  heart: {
    title: "心血管饮食",
    nutrients: ["Omega-3", "膳食纤维", "钾来源食物"],
    foods: ["深海鱼", "燕麦", "豆类", "香蕉", "绿叶菜"],
    note: "重盐、加工食品、久坐或优质脂肪不足会影响心血管饮食质量。若有相关疾病或用药，请先咨询医生。",
    reason: "油盐糖、久坐和 BMI 偏高会共同影响心血管饮食风险。",
    action: "先把外卖频率、钠摄入和每周运动频率稳定下来。",
    mealPlan: { breakfast: "燕麦片+香蕉片+亚麻籽", lunch: "清蒸鱼+蒜蓉西兰花+糙米饭", dinner: "杂豆汤+凉拌黄瓜+全麦馒头" }
  },
  sugar: {
    title: "控糖与稳定能量",
    nutrients: ["膳食纤维", "低 GI 主食", "蛋白质搭配"],
    foods: ["燕麦", "杂豆", "糙米", "希腊酸奶", "坚果"],
    note: "甜食、含糖饮料和三餐不规律会让能量波动更明显。糖尿病用户不应自行用补剂替代治疗。",
    reason: "精制碳水和空腹咖啡会让饥饿感与困倦更明显。",
    action: "每餐用蛋白质、蔬菜和主食搭配，减少单独喝甜饮。",
    mealPlan: { breakfast: "希腊酸奶+坚果+少量燕麦", lunch: "鸡胸肉+藜麦+混合蔬菜", dinner: "豆腐菌菇汤+凉拌海带+杂粮饭" }
  },
  fiber: {
    title: "膳食纤维",
    nutrients: ["膳食纤维", "益生元", "发酵食品"],
    foods: ["燕麦", "豆类", "菌菇", "苹果", "酸奶"],
    note: "肠胃不规律时可逐步增加纤维和饮水，不建议突然大量补充纤维粉。",
    reason: "纤维和水分不足会让肠道节律、饱腹感和控糖都变差。",
    action: "从每天多一份豆类或燕麦开始，逐步增加而不是猛加。",
    mealPlan: { breakfast: "燕麦粥+苹果块+奇亚籽", lunch: "杂豆饭+菌菇炒肉片+青菜", dinner: "红薯+酸奶+凉拌木耳" }
  },
  digestive: {
    title: "肠胃节律",
    nutrients: ["益生元", "膳食纤维", "规律进餐"],
    foods: ["酸奶", "泡菜", "燕麦", "香蕉", "豆类"],
    note: "三餐不规律、喝水少和低纤维饮食会影响肠胃节律，先把饮食节奏稳住。",
    reason: "肠胃节律通常受三餐时间、压力、纤维和益生菌食物共同影响。",
    action: "先固定早餐或午餐时间，并记录一周排便和腹胀情况。",
    mealPlan: { breakfast: "香蕉+酸奶+全麦面包", lunch: "泡菜豆腐锅+杂粮饭", dinner: "南瓜小米粥+蒸鱼+焯菠菜" }
  },
  stress: {
    title: "压力与恢复",
    nutrients: ["镁", "B 族维生素", "蛋白质"],
    foods: ["坚果", "香蕉", "豆制品", "鸡蛋", "深绿叶菜"],
    note: "压力高时应同时关注睡眠、运动和情绪支持，补剂不能替代专业心理或医疗帮助。",
    reason: "高压力会影响睡眠、食欲、皮肤状态和免疫稳定性。",
    action: "每天安排 10 分钟低强度散步或拉伸，降低恢复负担。",
    mealPlan: { breakfast: "香蕉奶昔+全麦吐司+花生酱", lunch: "豆腐炒蛋+菠菜+藜麦", dinner: "南瓜汤+煎三文鱼+芦笋" }
  },
  liver: {
    title: "饮酒与肝脏负担",
    nutrients: ["均衡蛋白", "B 族维生素", "抗氧化食物"],
    foods: ["豆类", "鸡蛋", "蔬菜", "莓果", "全谷物"],
    note: "经常饮酒时最重要的是减少酒精摄入。有肝病或肝功能异常时不建议自行加用补剂。",
    reason: "酒精会增加肝脏代谢负担，也会影响睡眠质量。",
    action: "先减少频率和单次量，有肝功能异常时优先咨询医生。",
    mealPlan: { breakfast: "豆浆+全麦馒头+煮蛋", lunch: "青椒炒肉片+番茄+糙米饭", dinner: "菌菇蔬菜汤+蒸豆腐+拌黄瓜" }
  },
  skin: {
    title: "皮肤与状态感",
    nutrients: ["维生素 C", "锌", "Omega-3", "胶原蛋白相关蛋白质"],
    foods: ["鱼类", "鸡蛋", "柑橘", "坚果", "豆类"],
    note: "皮肤状态通常和睡眠、糖摄入、蛋白质与微量元素有关，先处理作息和饮食结构。",
    reason: "皮肤状态不是单一维生素问题，常和糖摄入、睡眠、蛋白质和脂肪酸有关。",
    action: "先减少高糖饮品，补齐蛋白质和深色蔬果。",
    mealPlan: { breakfast: "橙子+水煮蛋+核桃", lunch: "三文鱼+牛油果+杂粮饭", dinner: "番茄豆腐汤+清炒芥蓝+蒸鸡胸" }
  },
  immune: {
    title: "免疫支持",
    nutrients: ["维生素 C", "维生素 D", "锌", "蛋白质"],
    foods: ["柑橘", "鸡蛋", "鱼类", "瘦肉", "豆制品"],
    note: "换季容易不舒服时，可关注蛋白质、蔬果和维生素 D 状态，但不要追求超高剂量。",
    reason: "免疫支持依赖蛋白质、维生素 D、锌和睡眠共同作用。",
    action: "先稳定睡眠和蛋白质摄入，再考虑检测维生素 D。",
    mealPlan: { breakfast: "猕猴桃+鸡蛋+全麦面包", lunch: "瘦肉炒彩椒+紫菜汤+糙米饭", dinner: "蒜蓉西兰花+煎鱼+红薯" }
  },
  mineral: {
    title: "矿物质与肌肉状态",
    nutrients: ["镁", "钙", "锌", "铁"],
    foods: ["坚果", "奶制品", "红肉", "贝类", "豆类"],
    note: "抽筋、恢复慢或皮肤头发状态变化可能和矿物质摄入、训练负荷、睡眠有关。铁剂不建议自行长期服用。",
    reason: "镁、钙、锌、铁都可能相关，但是否补铁尤其需要指标支持。",
    action: "有贫血或缺铁担心时，优先看血常规、铁蛋白和 B12。",
    mealPlan: { breakfast: "牛奶+全麦面包+杏仁", lunch: "牛肉炒青椒+焯菠菜+糙米饭", dinner: "蛤蜊汤+豆腐+凉拌海带丝" }
  },
  hydration: {
    title: "补水与代谢",
    nutrients: ["水分", "电解质", "蔬果来源钾"],
    foods: ["白水", "低糖电解质饮品", "香蕉", "番茄", "绿叶菜"],
    note: "补水不足会影响精神状态、肠胃节律和皮肤状态。先建立稳定喝水习惯。",
    reason: "水分和电解质不足会影响训练感受、肠胃和皮肤状态。",
    action: "把饮料替换为水或低糖饮品，运动日注意补水。",
    mealPlan: { breakfast: "黄瓜+鸡蛋+全麦吐司", lunch: "番茄炒蛋+焯生菜+杂粮饭", dinner: "冬瓜汤+蒸鱼+凉拌莴笋" }
  },
  fitness: {
    title: "运动恢复",
    nutrients: ["蛋白质", "肌酸", "镁", "Omega-3"],
    foods: ["鸡蛋", "鱼类", "牛奶", "豆腐", "瘦肉"],
    note: "有训练目标时，蛋白质、总能量、睡眠和训练计划比单一补剂更关键。",
    reason: "训练恢复取决于蛋白质、碳水、睡眠和训练负荷匹配。",
    action: "先估算每餐蛋白质，再根据训练强度调整碳水和补水。",
    mealPlan: { breakfast: "牛奶+鸡蛋+燕麦+香蕉", lunch: "鸡胸肉+红薯+西兰花", dinner: "三文鱼+藜麦+菠菜沙拉" }
  }
};

// ── Complete goal → dimension mapping (fixed) ──
const goalDimensionBoost = {
  energy:    { dimensions: ["sleep"],      secondary: ["sugar"] },
  skin:      { dimensions: ["skin"],       secondary: ["antioxidant", "hydration"] },
  eye:       { dimensions: ["eye"],        secondary: [] },
  fitness:   { dimensions: ["fitness"],    secondary: ["mineral"] },
  immunity:  { dimensions: ["immune"],     secondary: ["antioxidant"] },
  general:   { dimensions: ["antioxidant", "fiber"], secondary: ["bone"] }
};

// ── State ──────────────────────────────────────
let currentStep = 0;

// ── DOM refs ───────────────────────────────────
const hero = document.querySelector("#hero");
const assessment = document.querySelector("#assessment");
const results = document.querySelector("#results");
const form = document.querySelector("#healthForm");
const steps = [...document.querySelectorAll(".form-step")];
const stepTitle = document.querySelector("#stepTitle");
const stepHint = document.querySelector("#stepHint");
const stepCount = document.querySelector("#stepCount");
const progressFill = document.querySelector("#progressFill");
const progressTrack = document.querySelector(".progress-track");
const stageItems = [...document.querySelectorAll("#stageMap span")];
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const submitBtn = document.querySelector("#submitBtn");
const formMessage = document.querySelector("#formMessage");
const summaryPage = document.querySelector("#summaryPage");
const detailReport = document.querySelector("#detailReport");
const detailReportBtn = document.querySelector("#detailReportBtn");
const toast = document.querySelector("#toast");

// ── Toast ──────────────────────────────────────
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}

// ── localStorage ───────────────────────────────
function saveFormData() {
  const data = new FormData(form);
  const obj = {};
  for (const [key, value] of data.entries()) {
    if (key === "goals") {
      if (!obj[key]) obj[key] = [];
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function restoreFormData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    for (const [key, value] of Object.entries(data)) {
      if (key === "goals" && Array.isArray(value)) {
        value.forEach((val) => {
          const cb = form.querySelector(`input[name="goals"][value="${val}"]`);
          if (cb) cb.checked = true;
        });
        continue;
      }
      const el = form.querySelector(`[name="${key}"]`);
      if (!el) continue;
      if (el.type === "radio") {
        const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
        if (radio) radio.checked = true;
      } else {
        el.value = value;
      }
    }
  } catch (_) { /* ignore */ }
}

function clearFormData() {
  localStorage.removeItem(STORAGE_KEY);
}

form.addEventListener("change", saveFormData);
form.addEventListener("input", saveFormData);

// ── Rendering helpers ─────────────────────────
function renderHealthRiskQuestions() {
  const container = document.querySelector("#healthRiskQuestions");
  container.innerHTML = healthRiskQuestions.map((q) => `
    <article class="question-card" data-question="${q.id}">
      <div class="question-title">${q.text}</div>
      <div class="option-row">
        ${riskOptions.map(([value, label]) => `
          <label class="choice">
            <input type="radio" name="${q.id}" value="${value}" required>
            ${label}
          </label>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function renderLifestyleQuestions() {
  const container = document.querySelector("#lifestyleQuestions");
  const questions = getActiveLifestyleQuestions();
  const selectedGoals = getSelectedGoals().map((g) => goalLabels[g]).join("、");

  // Build conditional follow-up info: { triggerId -> [followUpQuestionIds] }
  const followUpMap = {};
  conditionalFollowUps.forEach((t) => {
    followUpMap[t.triggerId] = t.questions;
  });

  container.innerHTML = questions.map((q) => {
    const isConditional = q.isConditional || false;
    const hiddenAttr = isConditional ? "hidden" : "";
    return `
    <article class="question-card ${q.sourceGoal ? "targeted-question" : ""} ${isConditional ? "conditional-question" : ""}"
        data-question="${q.id}" data-conditional-for="${q.conditionalFor || ""}" ${hiddenAttr}>
      <div class="question-meta">${q.sourceGoal ? `专项追问 · ${goalLabels[q.sourceGoal]}` : (isConditional ? "🔍 智能追问" : "基础生活习惯")}</div>
      <div class="question-title">${q.text}</div>
      <div class="option-row">
        ${frequencyOptions.map(([value, label]) => `
          <label class="choice">
            <input type="radio" name="${q.id}" value="${value}" required>
            ${label}
          </label>
        `).join("")}
      </div>
    </article>
    `;
  }).join("") + `
    <article class="question-card question-summary">
      <div class="question-meta">本页问题结构</div>
      <p>已根据你的目标${selectedGoals ? `「${selectedGoals}」` : ""}追加专项问题。本页共 ${questions.length} 个问题，其中 ${questions.filter((q) => q.sourceGoal).length} 个为目标专项追问，${questions.filter((q) => q.isConditional).length} 个为智能追问（回答特定问题后显示）。</p>
    </article>
  `;
}

function getSelectedGoals() {
  return [...form.querySelectorAll('input[name="goals"]:checked')].map((el) => el.value);
}

function getActiveLifestyleQuestions() {
  const selectedGoals = getSelectedGoals();
  const goalQuestions = selectedGoals.flatMap((goal) =>
    (goalSpecificQuestions[goal] || []).map((q) => ({ ...q, sourceGoal: goal }))
  );
  // Include all conditional follow-up questions (initially hidden)
  const conditionalQuestions = conditionalFollowUps.flatMap((t) =>
    t.questions.map((q) => ({ ...q, isConditional: true, conditionalFor: t.triggerId }))
  );
  const merged = [...lifestyleQuestions, ...goalQuestions, ...conditionalQuestions];
  return [...new Map(merged.map((q) => [q.id, q])).values()];
}

// ── Conditional follow-up handling (Feature 5) ─
function checkConditionalFollowUps() {
  conditionalFollowUps.forEach((trigger) => {
    const triggerInput = form.querySelector(`input[name="${trigger.triggerId}"]:checked`);
    const triggerValue = triggerInput ? Number(triggerInput.value) : -1;
    trigger.questions.forEach((q) => {
      const card = document.querySelector(`.conditional-question[data-question="${q.id}"]`);
      if (!card) return;
      if (triggerValue >= trigger.threshold) {
        card.hidden = false;
        card.style.animation = "softPop 0.35s ease both";
      } else {
        card.hidden = true;
        // Clear answer when hidden
        const radios = card.querySelectorAll('input[type="radio"]');
        radios.forEach((r) => { r.checked = false; });
      }
    });
  });
}

// Attach listener for conditional follow-ups on the lifestyle question container
document.addEventListener("change", (e) => {
  if (e.target.closest("#lifestyleQuestions")) {
    checkConditionalFollowUps();
  }
});

// ── Step navigation ────────────────────────────
function updateStep() {
  steps.forEach((step, i) => step.classList.toggle("active", i === currentStep));
  stageItems.forEach((item, i) => {
    item.classList.toggle("is-done", i < currentStep);
    item.classList.toggle("is-current", i === currentStep);
  });
  stepTitle.textContent = stepTitles[currentStep];
  stepHint.textContent = stepHints[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);
  stepCount.textContent = `${progressPercent}%`;
  progressFill.style.width = `${progressPercent}%`;
  progressTrack.setAttribute("aria-valuenow", progressPercent);
  prevBtn.hidden = currentStep === 0;
  nextBtn.hidden = currentStep === steps.length - 1;
  formMessage.textContent = "";
  stepTitle.focus({ preventScroll: true });
}

function scrollToSection(el) {
  const top = el.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({ top, behavior: "smooth" });
}

// ── Validation ─────────────────────────────────
function validateHeightWeight() {
  const heightEl = form.querySelector('[name="height"]');
  const weightEl = form.querySelector('[name="weight"]');
  const heightHint = document.querySelector("#heightHint");
  const weightHint = document.querySelector("#weightHint");
  let ok = true;
  const h = Number(heightEl.value);
  const w = Number(weightEl.value);

  if (heightEl.value && (h < 120 || h > 230)) {
    heightHint.textContent = "请输入合理的身高范围 (120-230 cm)";
    heightHint.classList.add("warn"); ok = false;
  } else if (heightEl.value && (h < 140 || h > 210)) {
    heightHint.textContent = "请确认身高是否正确？";
    heightHint.classList.add("warn");
  } else {
    heightHint.textContent = "";
    heightHint.classList.remove("warn");
  }

  if (weightEl.value && (w < 30 || w > 220)) {
    weightHint.textContent = "请输入合理的体重范围 (30-220 kg)";
    weightHint.classList.add("warn"); ok = false;
  } else if (weightEl.value && (w < 35 || w > 180)) {
    weightHint.textContent = "请确认体重是否正确？";
    weightHint.classList.add("warn");
  } else {
    weightHint.textContent = "";
    weightHint.classList.remove("warn");
  }
  return ok;
}

function validateCurrentStep() {
  const activeStep = steps[currentStep];
  const requiredControls = [...activeStep.querySelectorAll('select[required], input[required]:not([type=radio]):not([type=checkbox])')];
  // For radio groups, only check visible (non-hidden) ones
  const visibleRadios = [...activeStep.querySelectorAll('.question-card:not([hidden]) input[type=radio][required]')];
  const radioNames = [...new Set(visibleRadios.map((c) => c.name))];
  const missingRadioName = radioNames.find((name) => {
    const controls = activeStep.querySelectorAll(`input[name="${name}"]`);
    return ![...controls].some((c) => c.checked);
  });
  const names = [...new Set(requiredControls.map((c) => c.name))];
  const missingSelect = names.find((name) => {
    const el = activeStep.querySelector(`[name="${name}"]`);
    return el && !el.value;
  });

  activeStep.querySelectorAll(".field, .question-card").forEach((el) => el.classList.remove("is-missing"));

  const goalControls = [...activeStep.querySelectorAll('input[name="goals"]')];
  const missingGoals = goalControls.length > 0 && !goalControls.some((c) => c.checked);

  if (currentStep === 0) validateHeightWeight();

  if (!missingSelect && !missingRadioName && !missingGoals) return true;

  const missing = missingGoals ? goalControls[0]
    : (missingRadioName ? activeStep.querySelector(`input[name="${missingRadioName}"]`)
    : activeStep.querySelector(`[name="${missingSelect}"]`));
  const wrapper = missing.closest(".field, .question-card");
  wrapper.classList.add("is-missing");
  wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
  formMessage.textContent = "请先完成当前页问题，再进入下一步。";
  return false;
}

// ── Data collection ────────────────────────────
function getFormData() {
  const data = new FormData(form);
  const profile = {
    gender: data.get("gender"),
    ageGroup: data.get("ageGroup"),
    dietType: data.get("dietType"),
    height: Number(data.get("height") || 0),
    weight: Number(data.get("weight") || 0),
    goals: data.getAll("goals"),
    sleepHours: data.get("sleepHours"),
    exerciseFreq: data.get("exerciseFreq"),
    specialStatus: data.get("specialStatus"),
    checkup: data.get("checkup")
  };
  const healthRisks = Object.fromEntries(healthRiskQuestions.map((q) => [q.id, data.get(q.id)]));
  const lifestyle = {};
  getActiveLifestyleQuestions().forEach((q) => {
    lifestyle[q.id] = Number(data.get(q.id) || 0);
  });
  return { profile, healthRisks, lifestyle };
}

// ── Scoring ────────────────────────────────────
function calculateBmi(profile) {
  if (!profile.height || !profile.weight) return null;
  const meters = profile.height / 100;
  return Number((profile.weight / (meters * meters)).toFixed(1));
}

function calculateScores(answers) {
  const scores = Object.fromEntries(Object.keys(dimensionMeta).map((key) => [key, 0]));
  const bmi = calculateBmi(answers.profile);

  getActiveLifestyleQuestions().forEach((q) => {
    const value = answers.lifestyle[q.id] || 0;
    q.dimensions.forEach((dim) => { scores[dim] += value; });
  });

  if (answers.profile.sleepHours === "under5") scores.sleep += 4;
  if (answers.profile.sleepHours === "5-6") scores.sleep += 2;
  if (answers.profile.exerciseFreq === "none") { scores.heart += 3; scores.fitness += 2; }
  if (answers.profile.exerciseFreq === "1-2") scores.fitness += 1;
  if (answers.profile.dietType === "vegetarian") { scores.mineral += 2; scores.heart += 1; }
  if (answers.profile.dietType === "vegan") { scores.mineral += 3; scores.bone += 2; scores.heart += 1; }

  answers.profile.goals.forEach((goal) => {
    const boost = goalDimensionBoost[goal];
    if (!boost) return;
    boost.dimensions.forEach((dim) => { if (scores[dim] !== undefined) scores[dim] += 2; });
    boost.secondary.forEach((dim) => { if (scores[dim] !== undefined) scores[dim] += 1; });
  });

  if (bmi && bmi >= 24) { scores.fitness += 2; scores.heart += 2; scores.sugar += 1; }
  if (bmi && bmi < 18.5) { scores.fitness += 2; scores.mineral += 1; }
  if (answers.profile.checkup === "long" || answers.profile.checkup === "never") { scores.bone += 1; scores.mineral += 1; }

  return scores;
}

function getLevel(score) {
  if (score >= 8) return { label: "高关注", className: "high" };
  if (score >= 4) return { label: "中关注", className: "medium" };
  return { label: "低关注", className: "low" };
}

// ── Explanation trace (Feature 4) ──────────────
function buildExplanations(dimensionKey, answers) {
  const allQuestions = getActiveLifestyleQuestions();
  const contributors = allQuestions
    .filter((q) => q.dimensions.includes(dimensionKey) && answers.lifestyle[q.id] >= 3)
    .map((q) => ({ text: questionTextMap[q.id] || q.text, score: answers.lifestyle[q.id] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Also check profile factors
  const profileReasons = [];
  if (dimensionKey === "sleep" && answers.profile.sleepHours === "under5") profileReasons.push("自报睡眠少于 5 小时");
  if (dimensionKey === "sleep" && answers.profile.sleepHours === "5-6") profileReasons.push("自报睡眠 5-6 小时");
  if (dimensionKey === "fitness" && answers.profile.exerciseFreq === "none") profileReasons.push("自报几乎不运动");
  if (dimensionKey === "heart" && answers.profile.exerciseFreq === "none") profileReasons.push("缺乏运动影响心血管评估");
  if ((dimensionKey === "mineral" || dimensionKey === "bone") && answers.profile.dietType === "vegan") profileReasons.push("纯素饮食需关注该维度");
  if ((dimensionKey === "mineral") && answers.profile.dietType === "vegetarian") profileReasons.push("素食饮食需关注该维度");

  return { contributors, profileReasons };
}

// ── BMI gauge (Feature 6) ─────────────────────
function renderBmiGauge(bmi) {
  if (!bmi) return '<div class="bmi-gauge-placeholder">输入身高体重后查看 BMI 定位</div>';
  // Calculate marker position: scale 14-34 onto 0-100%
  const clamped = Math.max(14, Math.min(34, bmi));
  const pct = ((clamped - 14) / 20) * 100;
  const label = getBmiLabel(bmi);
  const zoneColors = ["#5d8fd6", "#5d8fd6", "#2ea87a", "#ffe600", "#ffe600", "#f08a5d", "#e04e3d"];
  return `
    <div class="bmi-gauge" aria-label="BMI 范围指示器，当前值 ${bmi}，处于${label}范围">
      <div class="bmi-gauge-bar">
        <div class="bmi-gauge-gradient"></div>
        <div class="bmi-gauge-marker" style="left: ${pct}%" aria-hidden="true"></div>
      </div>
      <div class="bmi-gauge-labels">
        <span>偏瘦</span><span>正常</span><span>偏高</span><span>较高</span>
      </div>
      <div class="bmi-gauge-value">BMI <strong>${bmi}</strong> · ${label}</div>
    </div>
  `;
}

// ── Supplement interaction rendering (Feature 2) ─
function renderSupplementInteraction() {
  return `
    <div class="supplement-interaction" id="supplementInteraction">
      <h4>我正在服用的补剂（选填，检测相互作用）</h4>
      <div class="supplement-options">
        ${supplementOptions.map((opt) => `
          <label class="choice chip-choice supplement-chip">
            <input type="checkbox" name="mySupplements" value="${opt.id}">
            ${opt.label}
          </label>
        `).join("")}
      </div>
      <div class="interaction-results" id="interactionResults" hidden></div>
    </div>
  `;
}

function updateSupplementInteractions() {
  const selected = [...document.querySelectorAll('input[name="mySupplements"]:checked')].map((el) => el.value);
  const container = document.querySelector("#interactionResults");
  if (selected.length < 2) {
    container.hidden = true;
    return;
  }
  const interactions = findInteractions(selected);
  if (interactions.length === 0) {
    container.innerHTML = '<p class="interaction-positive">当前选择的补剂之间未发现已知冲突。</p>';
    container.hidden = false;
    return;
  }
  container.hidden = false;
  container.innerHTML = interactions.map((inter) => {
    const cls = inter.severity === "high" ? "interaction-warn"
      : inter.severity === "medium" ? "interaction-caution"
      : inter.severity === "positive" ? "interaction-positive"
      : "interaction-none";
    const icon = inter.severity === "high" ? "⚠" : inter.severity === "medium" ? "⚡" : inter.severity === "positive" ? "✓" : "·";
    return `<div class="interaction-item ${cls}"><span class="interaction-icon">${icon}</span>${inter.text}</div>`;
  }).join("");
}

document.addEventListener("change", (e) => {
  if (e.target.name === "mySupplements") updateSupplementInteractions();
});

// ── Safety ─────────────────────────────────────
function isHighRisk(answers) {
  const riskValues = Object.values(answers.healthRisks);
  const criticalStatuses = ["pregnant", "preparing", "breastfeeding"];
  if (answers.profile.ageGroup === "under18") return true;
  if (answers.profile.ageGroup === "60plus") return true;
  if (criticalStatuses.includes(answers.profile.specialStatus)) return true;
  if (riskValues.includes("yes") || riskValues.includes("unsure")) return true;
  return false;
}

function getSafetyWarnings(answers) {
  const warnings = [];
  const riskValues = Object.values(answers.healthRisks);
  if (answers.profile.ageGroup === "under18") warnings.push("未成年人使用补剂应由监护人和医生共同确认，本报告仅提供饮食方向参考。");
  if (answers.profile.ageGroup === "60plus") warnings.push("60 岁以上用户更需要关注药物相互作用和基础疾病风险。");
  if (["pregnant", "preparing", "breastfeeding"].includes(answers.profile.specialStatus)) warnings.push("怀孕、备孕或哺乳阶段不建议自行选择高剂量补剂。");
  if (riskValues.includes("yes") || riskValues.includes("unsure")) warnings.push("你的回答中存在疾病、用药、不确定健康状态或过敏风险，建议先咨询医生或注册营养师。");
  if (answers.healthRisks.kidneyDisease === "yes" || answers.healthRisks.kidneyDisease === "unsure") warnings.push("肾病、肾结石或肾功能异常用户不应自行补充高钾、高镁或高蛋白类产品。");
  if (answers.healthRisks.liverDisease === "yes" || answers.healthRisks.liverDisease === "unsure") warnings.push("肝功能异常用户应避免自行叠加草本或高剂量脂溶性维生素。");
  if (answers.healthRisks.allergy === "yes" || answers.healthRisks.allergy === "unsure") warnings.push("存在食物过敏风险时，鱼油、坚果来源、乳制品或大豆来源补剂需谨慎确认成分。");
  return warnings;
}

// ── Recommendations ────────────────────────────
function buildRecommendations(scores, highRisk) {
  const entries = Object.entries(scores)
    .map(([key, score]) => ({ key, score, level: getLevel(score), ...dimensionMeta[key] }))
    .filter((item) => item.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  if (highRisk && entries.length > 0) {
    entries.forEach((item) => {
      item.note = "⚠ 你有需谨慎的健康因素，以下仅供参考，请务必优先咨询医生或注册营养师。 " + item.note;
      item.highRisk = true;
    });
  }
  return entries;
}

function getReportScores(scores) {
  const groups = [
    { label: "饮食", keys: ["sugar", "fiber", "digestive", "antioxidant"] },
    { label: "作息", keys: ["sleep", "hydration"] },
    { label: "运动", keys: ["fitness", "heart", "mineral"] },
    { label: "心理", keys: ["stress"] },
    { label: "体质", keys: ["bone", "immune", "skin", "liver", "eye"] }
  ];
  const items = groups.map((group) => {
    const raw = group.keys.reduce((total, key) => total + (scores[key] || 0), 0);
    const value = Math.max(35, Math.min(96, 100 - raw * 5));
    return { ...group, value };
  });
  const total = Math.round(items.reduce((sum, item) => sum + item.value, 0) / items.length);
  return { total, items };
}

function renderRadar(reportScores) {
  const cx = 125, cy = 118, maxRadius = 86;
  const sides = reportScores.items.length;
  const point = (index, radius) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / sides;
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  };
  const rings = [0.33, 0.66, 1].map((scale) =>
    `<polygon points="${reportScores.items.map((_, i) => point(i, maxRadius * scale)).join(" ")}" />`
  ).join("");
  const area = reportScores.items.map((_, i) => point(i, maxRadius * (reportScores.items[i].value / 100))).join(" ");
  const axes = reportScores.items.map((item, i) => {
    const [px, py] = point(i, maxRadius).split(",");
    const [tx, ty] = point(i, maxRadius + 24).split(",");
    return `<line x1="${cx}" y1="${cy}" x2="${px}" y2="${py}" /><text x="${tx}" y="${ty}">${item.label} ${item.value}</text>`;
  }).join("");
  return `<svg class="radar-chart" viewBox="0 0 250 245" role="img" aria-label="健康测评雷达图，综合评分 ${reportScores.total}">
    <g class="radar-grid">${rings}${axes}</g>
    <polygon class="radar-area" points="${area}" />
    <text class="radar-total" x="${cx}" y="${cy + 10}">${reportScores.total}</text></svg>`;
}

// ── Tiered actions (Feature 3) ──────────────────
function buildTieredActions(answers, recommendations, warnings, highRisk) {
  const critical = [];
  const tryActions = [];
  const maintain = [];

  if (highRisk) {
    critical.push({ text: "咨询医生或注册营养师，确认补剂安全性。", tier: "critical" });
  }
  if (warnings.length && !highRisk) {
    critical.push({ text: "先把安全提醒作为第一优先级，慢性疾病、用药、孕期或过敏风险需专业确认。", tier: "critical" });
  }
  if (recommendations.some((item) => item.key === "sleep")) {
    critical.push({ text: "连续 7 天固定起床时间，下午后减少咖啡因，睡前 30 分钟减少屏幕刺激。", tier: "critical" });
  }
  if (recommendations.some((item) => item.key === "sugar")) {
    tryActions.push({ text: "把含糖饮料替换为无糖饮品，主食搭配蛋白质和蔬菜。", tier: "try" });
  }
  if (recommendations.some((item) => item.key === "eye")) {
    tryActions.push({ text: "每用眼 30-40 分钟休息 3-5 分钟，增加深绿叶菜、鸡蛋黄或鱼类摄入。", tier: "try" });
  }
  if (recommendations.some((item) => item.key === "fiber" || item.key === "digestive")) {
    tryActions.push({ text: "每周逐步增加全谷物、豆类和蔬菜，同时提高饮水量。", tier: "try" });
  }
  if (recommendations.some((item) => item.key === "stress")) {
    tryActions.push({ text: "每天安排 10 分钟低强度散步或拉伸，降低恢复负担。", tier: "try" });
  }
  if (answers.profile.checkup === "long" || answers.profile.checkup === "never") {
    maintain.push({ text: "条件允许时，体检关注血糖、血脂、肝肾功能、维生素 D、铁蛋白或 B12。", tier: "maintain" });
  }
  if (!highRisk) {
    maintain.push({ text: "不要同时叠加多个高剂量复合补剂，注意维生素 A、D、E、K 的长期超量风险。", tier: "maintain" });
  }
  maintain.push({ text: "坚持均衡饮食、规律作息和适量运动，这是营养健康的基础。", tier: "maintain" });

  return { critical: critical.slice(0, 2), tryActions: tryActions.slice(0, 3), maintain: maintain.slice(0, 3) };
}

function renderTieredActions(tiered) {
  const renderItems = (items) => items.map((a) => `<li>${a.text}</li>`).join("");
  let html = "";
  if (tiered.critical.length) {
    html += `<div class="tier-card critical-tier"><h4>本周最重要</h4><ul>${renderItems(tiered.critical)}</ul></div>`;
  }
  if (tiered.tryActions.length) {
    html += `<div class="tier-card try-tier"><h4>本周可尝试</h4><ul>${renderItems(tiered.tryActions)}</ul></div>`;
  }
  if (tiered.maintain.length) {
    html += `<div class="tier-card maintain-tier"><h4>持续关注</h4><ul>${renderItems(tiered.maintain)}</ul></div>`;
  }
  return html;
}

// ── Meal plan rendering (Feature 7) ────────────
function renderMealPlan(item) {
  if (!item.mealPlan || item.highRisk) return "";
  return `
    <div class="mini-title">一日三餐示例</div>
    <div class="meal-plan">
      <div class="meal-slot"><span class="meal-label">早</span>${item.mealPlan.breakfast}</div>
      <div class="meal-slot"><span class="meal-label">午</span>${item.mealPlan.lunch}</div>
      <div class="meal-slot"><span class="meal-label">晚</span>${item.mealPlan.dinner}</div>
    </div>
  `;
}

// ── Score list rendering ───────────────────────
function renderScoreList(scores) {
  return Object.entries(scores)
    .map(([key, score]) => ({ key, score, title: dimensionMeta[key].title }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => {
      const width = Math.min(100, Math.round((item.score / 12) * 100));
      return `<div class="score-row"><span>${item.title}</span><strong>${item.score}</strong><div class="score-bar"><i style="width: ${width}%"></i></div></div>`;
    }).join("");
}

function getVisualTile(key, usedTiles) {
  const tileMap = {
    fitness: ["tile2-basketball", "tile-soccer", "tile2-soccer", "tile-run"],
    heart: ["tile2-cycle", "tile-run", "tile-hike"],
    bone: ["tile-sun", "tile2-hike", "tile2-stretch"],
    immune: ["tile-hike", "tile2-stretch", "tile2-meal"],
    skin: ["tile2-sunscreen", "tile-sunscreen", "tile-skincare"],
    antioxidant: ["tile2-meal", "tile-skincare", "tile-meal"],
    eye: ["tile2-eye", "tile-eye", "tile-calm"],
    sleep: ["tile2-sleep", "tile-sleep", "tile-calm"],
    stress: ["tile2-calm", "tile-calm", "tile2-hike"],
    fiber: ["tile2-meal", "tile-meal", "tile-breakfast"],
    digestive: ["tile2-water", "tile-water", "tile-meal"],
    sugar: ["tile2-breakfast", "tile-breakfast", "tile2-meal"],
    hydration: ["tile2-water", "tile-water", "tile2-stretch"],
    mineral: ["tile2-stretch", "tile-soccer", "tile2-basketball"],
    liver: ["tile2-breakfast", "tile-breakfast", "tile2-water"]
  };
  const orderedTiles = [
    "tile-run", "tile-soccer", "tile-sun", "tile-sunscreen", "tile-sleep",
    "tile-eye", "tile-meal", "tile-water", "tile-calm", "tile-breakfast",
    "tile-hike", "tile-skincare", "tile2-stretch", "tile2-cycle",
    "tile2-basketball", "tile2-meal", "tile2-eye", "tile2-sleep",
    "tile2-calm", "tile2-water", "tile2-sunscreen", "tile2-hike",
    "tile2-soccer", "tile2-breakfast"
  ];
  const preferred = tileMap[key] || ["tile-breakfast"];
  if (!usedTiles) return preferred[0];
  const selected = preferred.find((t) => !usedTiles.has(t))
    || orderedTiles.find((t) => !usedTiles.has(t))
    || preferred[0];
  usedTiles.add(selected);
  return selected;
}

function getBmiLabel(bmi) {
  if (!bmi) return "未计算";
  if (bmi < 18.5) return "偏低";
  if (bmi < 24) return "正常";
  if (bmi < 28) return "偏高";
  return "较高";
}

function buildSupplementPush(recommendations, highRisk) {
  if (highRisk) return ["请先咨询医生", "均衡饮食优先", "遵医嘱补充"];
  const seen = new Set();
  const nutrients = [];
  recommendations.forEach((item) => {
    item.nutrients.forEach((n) => { if (!seen.has(n)) { seen.add(n); nutrients.push(n); } });
  });
  return nutrients.slice(0, 6);
}

function buildSummaryAdvice(answers, recommendations, bmi, highRisk) {
  const advice = [];
  if (highRisk) {
    advice.push("你的健康问卷中有需要专业判断的情况，本报告仅作为饮食和生活方式参考，补剂选择必须咨询医生或注册营养师。");
    return advice;
  }
  const goals = answers.profile.goals;
  if (goals.includes("fitness") || (bmi && bmi >= 24)) {
    advice.push("你的身高体重与运动目标提示：运动恢复、蛋白质摄入和控糖饮食需要一起看，建议先稳定每餐蛋白质来源。");
  }
  if (goals.includes("skin")) advice.push("你选择了皮肤状态目标，报告会重点关注睡眠、糖摄入、蔬果抗氧化和补水情况。");
  if (goals.includes("eye")) advice.push("你选择了护眼目标，报告会额外结合屏幕时长、夜间用眼、优质脂肪和叶黄素来源。");
  if (goals.includes("energy")) advice.push("你选择了精力目标，报告会重点检查早餐、咖啡因、睡眠节律和餐后困倦。");
  if (recommendations[0]) advice.push(`当前最需要优先处理的是「${recommendations[0].title}」，建议先从生活习惯和饮食结构补齐，再考虑补剂。`);
  return advice.slice(0, 4);
}

// ── Main result rendering ──────────────────────
function renderResults() {
  if (!validateCurrentStep()) return;

  const answers = getFormData();
  const scores = calculateScores(answers);
  const reportScores = getReportScores(scores);
  const warnings = getSafetyWarnings(answers);
  const highRisk = isHighRisk(answers);
  const recommendations = buildRecommendations(scores, highRisk);
  const bmi = calculateBmi(answers.profile);

  const summaryTags = document.querySelector("#summaryTags");
  const bmiCard = document.querySelector("#bmiCard");
  const supplementPush = document.querySelector("#supplementPush");
  const summaryAdvice = document.querySelector("#summaryAdvice");
  const scoreList = document.querySelector("#scoreList");
  const safetyCard = document.querySelector("#safetyCard");
  const analysisCard = document.querySelector("#analysisCard");
  const recommendationGrid = document.querySelector("#recommendationGrid");
  const actionList = document.querySelector("#actionList");
  const supplementInteractionArea = document.querySelector("#supplementInteractionArea");

  // Summary tags
  const tags = recommendations.length
    ? recommendations.slice(0, 5).map((item) => item.title)
    : ["当前整体关注度较低", "保持均衡饮食", "定期复查习惯"];
  summaryTags.innerHTML = tags.map((t) => `<span class="tag">${t}</span>`).join("");

  // BMI with gauge (Feature 6)
  bmiCard.innerHTML = `
    <span>BMI 参考</span>
    ${renderBmiGauge(bmi)}
    <p>${bmi ? `当前处于${getBmiLabel(bmi)}范围，会影响运动恢复、控糖和心血管饮食判断。` : "身高体重信息不足，暂不计算 BMI。"}</p>
  `;

  // Supplement push
  const pushed = buildSupplementPush(recommendations, highRisk);
  supplementPush.innerHTML = `
    <h4>营养品推送建议</h4>
    <p>${highRisk ? "你的情况需要专业判断，以下是安全方向，不代表必须购买或服用。" : "以下是可优先了解的营养方向，不代表必须购买或服用。"}</p>
    <div class="push-list">${pushed.map((item) => `<span>${item}</span>`).join("")}</div>
  `;

  // Supplement interaction (Feature 2)
  supplementInteractionArea.innerHTML = renderSupplementInteraction();

  // Summary advice
  summaryAdvice.innerHTML = `
    <h4>结合你的信息</h4>
    <ul>${buildSummaryAdvice(answers, recommendations, bmi, highRisk).map((item) => `<li>${item}</li>`).join("")}</ul>
  `;

  // Score list
  scoreList.innerHTML = renderScoreList(scores);

  // Safety card
  safetyCard.classList.toggle("high-risk", warnings.length > 0);
  safetyCard.innerHTML = `
    <h3>${warnings.length ? "安全提醒优先看" : "通用安全提醒"}</h3>
    <p>${warnings.length ? warnings.join(" ") : "当前未发现明显补剂安全拦截条件，但补剂仍不能替代均衡饮食、睡眠、运动和正规医疗建议。"}</p>
  `;

  // Analysis card
  const top = recommendations[0];
  analysisCard.innerHTML = `
    <div class="report-score">
      <div>
        <p class="eyebrow">Health Score</p>
        <h3>你的健康测评综合得分：<strong>${reportScores.total}</strong><span>/100</span></h3>
        <p>${top ? `你目前最突出的关注点是「${top.title}」。这通常不是单一营养素能解决的问题，更适合从饮食结构、作息节奏和体检指标三方面一起确认。` : "你的回答没有触发明显高关注维度，建议继续保持稳定作息、均衡饮食和规律运动。"}</p>
        ${highRisk ? '<p class="high-risk-banner">⚠ 你属于高风险用户，以上评分仅供参考，补剂使用必须先咨询医生。</p>' : ""}
      </div>
      ${renderRadar(reportScores)}
    </div>
  `;

  // Recommendation grid with explanations (Feature 4) + meal plans (Feature 7)
  const usedVisualTiles = new Set();
  recommendationGrid.innerHTML = recommendations.length
    ? recommendations.map((item) => {
      const explanation = buildExplanations(item.key, answers);
      const explanationHtml = (explanation.contributors.length > 0 || explanation.profileReasons.length > 0) ? `
        <div class="explanation-box">
          <div class="mini-title">为什么关注这一项</div>
          ${explanation.contributors.map((c) => `<p class="explain-line">因为你回答「${c.text}」为较高频率</p>`).join("")}
          ${explanation.profileReasons.map((r) => `<p class="explain-line">· ${r}</p>`).join("")}
        </div>
      ` : "";

      return `
      <article class="plan-card">
        <div class="plan-visual ${getVisualTile(item.key, usedVisualTiles)}" aria-hidden="true"></div>
        <div class="plan-content">
          <span class="level ${item.level.className}">${item.level.label} · ${item.score} 分</span>
          <h3>${item.title}</h3>
          <p>${item.note}</p>
          <div class="insight-grid">
            <div><strong>为什么关注</strong><p>${item.reason}</p></div>
            <div><strong>执行建议</strong><p>${item.action}</p></div>
          </div>
          ${explanationHtml}
          ${item.highRisk ? "" : `
            <div class="mini-title">可关注营养素</div>
            <div class="nutrients">${item.nutrients.map((n) => `<span class="nutrient">${n}</span>`).join("")}</div>
            <div class="mini-title">优先食物</div>
            <p class="food-line">${item.foods.join("、")}</p>
            ${renderMealPlan(item)}
          `}
        </div>
      </article>`;
    }).join("")
    : `<article class="recommend-card">
        <span class="level">低关注</span><h3>维持当前习惯</h3>
        <p>你的问卷未触发明显营养关注项。建议继续保持均衡饮食、规律作息和适量运动。</p>
        <div class="nutrients"><span class="nutrient">均衡饮食</span><span class="nutrient">规律体检</span></div>
      </article>`;

  // Tiered action plan (Feature 3)
  const tiered = buildTieredActions(answers, recommendations, warnings, highRisk);
  actionList.innerHTML = renderTieredActions(tiered);

  // Switch view
  assessment.hidden = true;
  results.hidden = false;
  summaryPage.hidden = false;
  detailReport.hidden = true;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
  clearFormData();
  // Re-check supplement interactions (in case user re-renders)
  updateSupplementInteractions();
}

// ── Edit / Export / Restart ────────────────────
function editAnswers() {
  results.hidden = true;
  assessment.hidden = false;
  currentStep = 0;
  updateStep();
  assessment.scrollIntoView({ behavior: "smooth", block: "start" });
}

function exportReport() {
  showToast("正在生成打印版报告…");
  setTimeout(() => window.print(), 300);
}

// ── Event listeners ────────────────────────────
document.querySelector("#startBtn").addEventListener("click", () => {
  hero.hidden = true;
  assessment.hidden = false;
  restoreFormData();
  renderLifestyleQuestions();
  checkConditionalFollowUps();
  assessment.scrollIntoView({ behavior: "smooth", block: "start" });
});

prevBtn.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  updateStep();
  scrollToSection(assessment);
});

nextBtn.addEventListener("click", () => {
  if (!validateCurrentStep()) return;
  currentStep = Math.min(steps.length - 1, currentStep + 1);
  if (currentStep === 2) { renderLifestyleQuestions(); checkConditionalFollowUps(); }
  updateStep();
  scrollToSection(assessment);
});

submitBtn.addEventListener("click", renderResults);

detailReportBtn.addEventListener("click", () => {
  summaryPage.hidden = true;
  detailReport.hidden = false;
  scrollToSection(results);
});

document.querySelector("#restartBtn").addEventListener("click", () => {
  currentStep = 0;
  results.hidden = true;
  hero.hidden = false;
  assessment.hidden = true;
  summaryPage.hidden = false;
  detailReport.hidden = true;
  form.reset();
  clearFormData();
  updateStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#editAnswersBtn").addEventListener("click", editAnswers);
document.querySelector("#exportBtn").addEventListener("click", exportReport);

// ── Initial render ─────────────────────────────
renderHealthRiskQuestions();
renderLifestyleQuestions();
updateStep();
