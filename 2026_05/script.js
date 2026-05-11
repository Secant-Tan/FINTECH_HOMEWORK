const stepTitles = ["基本信息", "健康状况", "生活习惯", "生成报告"];
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
  energy: "提升精力",
  skin: "皮肤与状态",
  eye: "护眼疲劳",
  fitness: "运动恢复",
  immunity: "免疫支持",
  general: "综合健康"
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

const dimensionMeta = {
  sleep: {
    title: "睡眠与精力",
    nutrients: ["B 族维生素", "镁", "优质蛋白"],
    foods: ["鸡蛋", "瘦肉", "豆类", "全谷物", "深绿叶菜"],
    note: "你的睡眠节律或疲劳信号较明显。先稳定睡眠时间、减少晚间咖啡因和屏幕刺激，再考虑辅助营养。",
    reason: "睡眠不足会影响能量代谢、食欲控制和运动恢复。",
    action: "先连续 7 天固定起床时间，并把咖啡因尽量放在中午前。"
  },
  eye: {
    title: "屏幕用眼",
    nutrients: ["叶黄素", "玉米黄质", "Omega-3", "维生素 A 食物来源"],
    foods: ["菠菜", "羽衣甘蓝", "玉米", "鸡蛋黄", "深海鱼"],
    note: "长时间用眼会增加干涩和疲劳感。营养关注可以辅助，但持续疼痛、视力变化应做眼科检查。",
    reason: "屏幕时长、夜间用眼和优质脂肪不足会共同放大眼疲劳。",
    action: "每 40 分钟离屏 3-5 分钟，并增加深绿叶菜和蛋黄摄入。"
  },
  bone: {
    title: "骨骼与维生素 D",
    nutrients: ["维生素 D", "钙", "镁"],
    foods: ["奶制品", "强化豆奶", "豆腐", "小鱼干", "鸡蛋"],
    note: "少晒太阳或钙来源不足时，可关注维生素 D 与钙摄入。更稳妥的方式是结合体检指标。",
    reason: "维生素 D 与钙摄入会影响骨骼、肌肉状态和免疫支持。",
    action: "优先确认日晒、奶豆制品和维生素 D 检测情况。"
  },
  antioxidant: {
    title: "蔬果与抗氧化",
    nutrients: ["维生素 C", "维生素 E", "多酚", "类胡萝卜素"],
    foods: ["柑橘", "莓果", "彩椒", "坚果", "番茄"],
    note: "蔬果摄入少或烟草暴露较多时，抗氧化饮食更值得优先补齐。",
    reason: "蔬果不足会减少维生素 C、多酚和类胡萝卜素来源。",
    action: "每天先补齐 2 种颜色的蔬果，再考虑额外补充。"
  },
  heart: {
    title: "心血管饮食",
    nutrients: ["Omega-3", "膳食纤维", "钾来源食物"],
    foods: ["深海鱼", "燕麦", "豆类", "香蕉", "绿叶菜"],
    note: "重盐、加工食品、久坐或优质脂肪不足会影响心血管饮食质量。若有相关疾病或用药，请先咨询医生。",
    reason: "油盐糖、久坐和 BMI 偏高会共同影响心血管饮食风险。",
    action: "先把外卖频率、钠摄入和每周运动频率稳定下来。"
  },
  sugar: {
    title: "控糖与稳定能量",
    nutrients: ["膳食纤维", "低 GI 主食", "蛋白质搭配"],
    foods: ["燕麦", "杂豆", "糙米", "希腊酸奶", "坚果"],
    note: "甜食、含糖饮料和三餐不规律会让能量波动更明显。糖尿病用户不应自行用补剂替代治疗。",
    reason: "精制碳水和空腹咖啡会让饥饿感与困倦更明显。",
    action: "每餐用蛋白质、蔬菜和主食搭配，减少单独喝甜饮。"
  },
  fiber: {
    title: "膳食纤维",
    nutrients: ["膳食纤维", "益生元", "发酵食品"],
    foods: ["燕麦", "豆类", "菌菇", "苹果", "酸奶"],
    note: "肠胃不规律时可逐步增加纤维和饮水，不建议突然大量补充纤维粉。",
    reason: "纤维和水分不足会让肠道节律、饱腹感和控糖都变差。",
    action: "从每天多一份豆类或燕麦开始，逐步增加而不是猛加。"
  },
  digestive: {
    title: "肠胃节律",
    nutrients: ["益生元", "膳食纤维", "规律进餐"],
    foods: ["酸奶", "泡菜", "燕麦", "香蕉", "豆类"],
    note: "三餐不规律、喝水少和低纤维饮食会影响肠胃节律，先把饮食节奏稳住。",
    reason: "肠胃节律通常受三餐时间、压力、纤维和益生菌食物共同影响。",
    action: "先固定早餐或午餐时间，并记录一周排便和腹胀情况。"
  },
  stress: {
    title: "压力与恢复",
    nutrients: ["镁", "B 族维生素", "蛋白质"],
    foods: ["坚果", "香蕉", "豆制品", "鸡蛋", "深绿叶菜"],
    note: "压力高时应同时关注睡眠、运动和情绪支持，补剂不能替代专业心理或医疗帮助。",
    reason: "高压力会影响睡眠、食欲、皮肤状态和免疫稳定性。",
    action: "每天安排 10 分钟低强度散步或拉伸，降低恢复负担。"
  },
  liver: {
    title: "饮酒与肝脏负担",
    nutrients: ["均衡蛋白", "B 族维生素", "抗氧化食物"],
    foods: ["豆类", "鸡蛋", "蔬菜", "莓果", "全谷物"],
    note: "经常饮酒时最重要的是减少酒精摄入。有肝病或肝功能异常时不建议自行加用补剂。",
    reason: "酒精会增加肝脏代谢负担，也会影响睡眠质量。",
    action: "先减少频率和单次量，有肝功能异常时优先咨询医生。"
  },
  skin: {
    title: "皮肤与状态感",
    nutrients: ["维生素 C", "锌", "Omega-3", "胶原蛋白相关蛋白质"],
    foods: ["鱼类", "鸡蛋", "柑橘", "坚果", "豆类"],
    note: "皮肤状态通常和睡眠、糖摄入、蛋白质与微量元素有关，先处理作息和饮食结构。",
    reason: "皮肤状态不是单一维生素问题，常和糖摄入、睡眠、蛋白质和脂肪酸有关。",
    action: "先减少高糖饮品，补齐蛋白质和深色蔬果。"
  },
  immune: {
    title: "免疫支持",
    nutrients: ["维生素 C", "维生素 D", "锌", "蛋白质"],
    foods: ["柑橘", "鸡蛋", "鱼类", "瘦肉", "豆制品"],
    note: "换季容易不舒服时，可关注蛋白质、蔬果和维生素 D 状态，但不要追求超高剂量。",
    reason: "免疫支持依赖蛋白质、维生素 D、锌和睡眠共同作用。",
    action: "先稳定睡眠和蛋白质摄入，再考虑检测维生素 D。"
  },
  mineral: {
    title: "矿物质与肌肉状态",
    nutrients: ["镁", "钙", "锌", "铁"],
    foods: ["坚果", "奶制品", "红肉", "贝类", "豆类"],
    note: "抽筋、恢复慢或皮肤头发状态变化可能和矿物质摄入、训练负荷、睡眠有关。铁剂不建议自行长期服用。",
    reason: "镁、钙、锌、铁都可能相关，但是否补铁尤其需要指标支持。",
    action: "有贫血或缺铁担心时，优先看血常规、铁蛋白和 B12。"
  },
  hydration: {
    title: "补水与代谢",
    nutrients: ["水分", "电解质", "蔬果来源钾"],
    foods: ["白水", "低糖电解质饮品", "香蕉", "番茄", "绿叶菜"],
    note: "补水不足会影响精神状态、肠胃节律和皮肤状态。先建立稳定喝水习惯。",
    reason: "水分和电解质不足会影响训练感受、肠胃和皮肤状态。",
    action: "把饮料替换为水或低糖饮品，运动日注意补水。"
  },
  fitness: {
    title: "运动恢复",
    nutrients: ["蛋白质", "肌酸", "镁", "Omega-3"],
    foods: ["鸡蛋", "鱼类", "牛奶", "豆腐", "瘦肉"],
    note: "有训练目标时，蛋白质、总能量、睡眠和训练计划比单一补剂更关键。",
    reason: "训练恢复取决于蛋白质、碳水、睡眠和训练负荷匹配。",
    action: "先估算每餐蛋白质，再根据训练强度调整碳水和补水。"
  }
};

let currentStep = 0;

const hero = document.querySelector("#hero");
const assessment = document.querySelector("#assessment");
const results = document.querySelector("#results");
const form = document.querySelector("#healthForm");
const steps = [...document.querySelectorAll(".form-step")];
const stepTitle = document.querySelector("#stepTitle");
const stepHint = document.querySelector("#stepHint");
const stepCount = document.querySelector("#stepCount");
const progressFill = document.querySelector("#progressFill");
const stageItems = [...document.querySelectorAll("#stageMap span")];
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const submitBtn = document.querySelector("#submitBtn");
const formMessage = document.querySelector("#formMessage");
const summaryPage = document.querySelector("#summaryPage");
const detailReport = document.querySelector("#detailReport");
const detailReportBtn = document.querySelector("#detailReportBtn");

function renderHealthRiskQuestions() {
  const container = document.querySelector("#healthRiskQuestions");
  container.innerHTML = healthRiskQuestions.map((question) => `
    <article class="question-card" data-question="${question.id}">
      <div class="question-title">${question.text}</div>
      <div class="option-row">
        ${riskOptions.map(([value, label]) => `
          <label class="choice">
            <input type="radio" name="${question.id}" value="${value}" required>
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
  const selectedGoals = getSelectedGoals().map((goal) => goalLabels[goal]).join("、");
  container.innerHTML = questions.map((question) => `
    <article class="question-card ${question.sourceGoal ? "targeted-question" : ""}" data-question="${question.id}">
      <div class="question-meta">${question.sourceGoal ? `专项追问 · ${goalLabels[question.sourceGoal]}` : "基础生活习惯"}</div>
      <div class="question-title">${question.text}</div>
      <div class="option-row frequency">
        ${frequencyOptions.map(([value, label]) => `
          <label class="choice">
            <input type="radio" name="${question.id}" value="${value}" required>
            ${label}
          </label>
        `).join("")}
      </div>
    </article>
  `).join("") + `
    <article class="question-card question-summary">
      <div class="question-meta">本页问题结构</div>
      <p>已根据你的目标${selectedGoals ? `「${selectedGoals}」` : ""}追加专项问题。本页共 ${questions.length} 个问题，其中 ${questions.filter((question) => question.sourceGoal).length} 个为目标专项追问。</p>
    </article>
  `;
}

function getSelectedGoals() {
  return [...form.querySelectorAll('input[name="goals"]:checked')].map((item) => item.value);
}

function getActiveLifestyleQuestions() {
  const selectedGoals = getSelectedGoals();
  const goalQuestions = selectedGoals.flatMap((goal) => (goalSpecificQuestions[goal] || []).map((question) => ({ ...question, sourceGoal: goal })));
  const merged = [...lifestyleQuestions, ...goalQuestions];
  return [...new Map(merged.map((question) => [question.id, question])).values()];
}

function updateStep() {
  steps.forEach((step, index) => step.classList.toggle("active", index === currentStep));
  stageItems.forEach((item, index) => {
    item.classList.toggle("is-done", index < currentStep);
    item.classList.toggle("is-current", index === currentStep);
  });
  stepTitle.textContent = stepTitles[currentStep];
  stepHint.textContent = stepHints[currentStep];
  stepCount.textContent = `${Math.round(((currentStep + 1) / steps.length) * 100)}%`;
  progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  prevBtn.hidden = currentStep === 0;
  nextBtn.hidden = currentStep === steps.length - 1;
  formMessage.textContent = "";
}

function scrollToSection(element) {
  const top = element.getBoundingClientRect().top + window.scrollY - 18;
  window.scrollTo({ top, behavior: "smooth" });
}

function validateCurrentStep() {
  const activeStep = steps[currentStep];
  const requiredControls = [...activeStep.querySelectorAll("select[required], input[required]")];
  const names = [...new Set(requiredControls.map((control) => control.name))];
  const missingName = names.find((name) => {
    const controls = requiredControls.filter((control) => control.name === name);
    if (controls[0].type === "radio") {
      return !controls.some((control) => control.checked);
    }
    return !controls[0].value;
  });

  activeStep.querySelectorAll(".field, .question-card").forEach((item) => item.classList.remove("is-missing"));
  const goalControls = [...activeStep.querySelectorAll('input[name="goals"]')];
  const missingGoals = goalControls.length > 0 && !goalControls.some((control) => control.checked);
  if (!missingName && !missingGoals) return true;

  const missing = missingGoals ? goalControls[0] : activeStep.querySelector(`[name="${missingName}"]`);
  const wrapper = missing.closest(".field, .question-card");
  wrapper.classList.add("is-missing");
  wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
  formMessage.textContent = "请先完成当前页问题，再进入下一步。";
  return false;
}

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
  const healthRisks = Object.fromEntries(healthRiskQuestions.map((question) => [question.id, data.get(question.id)]));
  const lifestyle = Object.fromEntries(lifestyleQuestions.map((question) => [question.id, Number(data.get(question.id) || 0)]));
  getActiveLifestyleQuestions().forEach((question) => {
    lifestyle[question.id] = Number(data.get(question.id) || 0);
  });
  return { profile, healthRisks, lifestyle };
}

function calculateBmi(profile) {
  if (!profile.height || !profile.weight) return null;
  const meters = profile.height / 100;
  return Number((profile.weight / (meters * meters)).toFixed(1));
}

function calculateScores(answers) {
  const scores = Object.fromEntries(Object.keys(dimensionMeta).map((key) => [key, 0]));
  const bmi = calculateBmi(answers.profile);

  getActiveLifestyleQuestions().forEach((question) => {
    const value = answers.lifestyle[question.id] || 0;
    question.dimensions.forEach((dimension) => {
      scores[dimension] += value;
    });
  });

  if (answers.profile.sleepHours === "under5") scores.sleep += 4;
  if (answers.profile.sleepHours === "5-6") scores.sleep += 2;
  if (answers.profile.exerciseFreq === "none") {
    scores.heart += 3;
    scores.fitness += 2;
  }
  if (answers.profile.exerciseFreq === "1-2") scores.fitness += 1;
  if (answers.profile.dietType === "vegetarian") {
    scores.mineral += 2;
    scores.heart += 1;
  }
  if (answers.profile.dietType === "vegan") {
    scores.mineral += 3;
    scores.bone += 2;
    scores.heart += 1;
  }
  const goalDimensionMap = { immunity: "immune" };
  answers.profile.goals.forEach((goal) => {
    const goalDimension = goalDimensionMap[goal] || goal;
    if (goalDimension && scores[goalDimension] !== undefined) scores[goalDimension] += 2;
    if (goal === "energy") scores.sleep += 2;
    if (goal === "general") {
      scores.antioxidant += 1;
      scores.fiber += 1;
    }
  });
  if (bmi && bmi >= 24) {
    scores.fitness += 2;
    scores.heart += 2;
    scores.sugar += 1;
  }
  if (bmi && bmi < 18.5) {
    scores.fitness += 2;
    scores.mineral += 1;
  }
  if (answers.profile.checkup === "long" || answers.profile.checkup === "never") {
    scores.bone += 1;
    scores.mineral += 1;
  }

  return scores;
}

function getLevel(score) {
  if (score >= 8) return { label: "高关注", className: "high" };
  if (score >= 4) return { label: "中关注", className: "medium" };
  return { label: "低关注", className: "low" };
}

function getSafetyWarnings(answers) {
  const warnings = [];
  const riskValues = Object.values(answers.healthRisks);

  if (answers.profile.ageGroup === "under18") warnings.push("未成年人使用补剂应由监护人和医生共同确认。");
  if (answers.profile.ageGroup === "60plus") warnings.push("60 岁以上用户更需要关注药物相互作用和基础疾病风险。");
  if (["pregnant", "preparing", "breastfeeding"].includes(answers.profile.specialStatus)) warnings.push("怀孕、备孕或哺乳阶段不建议自行选择高剂量补剂。");
  if (riskValues.includes("yes") || riskValues.includes("unsure")) warnings.push("你的回答中存在疾病、用药、不确定健康状态或过敏风险，建议先咨询医生或注册营养师。");
  if (answers.healthRisks.kidneyDisease === "yes" || answers.healthRisks.kidneyDisease === "unsure") warnings.push("肾病、肾结石或肾功能异常用户不应自行补充高钾、高镁或高蛋白类产品。");
  if (answers.healthRisks.liverDisease === "yes" || answers.healthRisks.liverDisease === "unsure") warnings.push("肝功能异常用户应避免自行叠加草本或高剂量脂溶性维生素。");
  if (answers.healthRisks.allergy === "yes" || answers.healthRisks.allergy === "unsure") warnings.push("存在食物过敏风险时，鱼油、坚果来源、乳制品或大豆来源补剂需谨慎确认成分。");

  return warnings;
}

function buildRecommendations(scores) {
  return Object.entries(scores)
    .map(([key, score]) => ({ key, score, level: getLevel(score), ...dimensionMeta[key] }))
    .filter((item) => item.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
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
  const cx = 125;
  const cy = 118;
  const maxRadius = 86;
  const sides = reportScores.items.length;

  const point = (index, radius) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / sides;
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  };

  const rings = [0.33, 0.66, 1].map((scale) => (
    `<polygon points="${reportScores.items.map((_, index) => point(index, maxRadius * scale)).join(" ")}" />`
  )).join("");

  const area = reportScores.items.map((item, index) => point(index, maxRadius * (item.value / 100))).join(" ");
  const axes = reportScores.items.map((item, index) => `
    <line x1="${cx}" y1="${cy}" x2="${point(index, maxRadius).split(",")[0]}" y2="${point(index, maxRadius).split(",")[1]}" />
    <text x="${point(index, maxRadius + 24).split(",")[0]}" y="${point(index, maxRadius + 24).split(",")[1]}">${item.label} ${item.value}</text>
  `).join("");

  return `
    <svg class="radar-chart" viewBox="0 0 250 245" role="img" aria-label="健康测评雷达图">
      <g class="radar-grid">${rings}${axes}</g>
      <polygon class="radar-area" points="${area}" />
      <text class="radar-total" x="${cx}" y="${cy + 10}">${reportScores.total}</text>
    </svg>
  `;
}

function buildActionList(answers, recommendations, warnings) {
  const actions = [];
  if (warnings.length) actions.push("先把报告中的安全提醒作为第一优先级，有慢性疾病、用药、孕期或过敏风险时，补剂选择需要专业人士确认。");
  if (recommendations.some((item) => item.key === "sleep")) actions.push("连续 7 天固定起床时间，下午后减少咖啡因，睡前 30 分钟减少屏幕刺激。");
  if (recommendations.some((item) => item.key === "eye")) actions.push("每用眼 30-40 分钟休息 3-5 分钟，并增加深绿叶菜、鸡蛋黄或鱼类摄入。");
  if (recommendations.some((item) => item.key === "sugar")) actions.push("把含糖饮料替换为无糖饮品，主食搭配蛋白质和蔬菜，减少能量波动。");
  if (recommendations.some((item) => item.key === "fiber" || item.key === "digestive")) actions.push("每周逐步增加全谷物、豆类和蔬菜，同时提高饮水量。");
  if (answers.profile.checkup === "long" || answers.profile.checkup === "never") actions.push("如果条件允许，可在下次体检关注血糖、血脂、肝肾功能、维生素 D、铁蛋白或 B12。");
  actions.push("不要同时叠加多个高剂量复合补剂，尤其注意维生素 A、D、E、K 的长期超量风险。");
  return actions.slice(0, 6);
}

function renderScoreList(scores) {
  return Object.entries(scores)
    .map(([key, score]) => ({ key, score, title: dimensionMeta[key].title }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => {
      const width = Math.min(100, Math.round((item.score / 12) * 100));
      return `
        <div class="score-row">
          <span>${item.title}</span>
          <strong>${item.score}</strong>
          <div class="score-bar"><i style="width: ${width}%"></i></div>
        </div>
      `;
    }).join("");
}

function getVisualAsset(key) {
  return "assets/wellness-report-panels.png";
}

function getBmiLabel(bmi) {
  if (!bmi) return "未计算";
  if (bmi < 18.5) return "偏低";
  if (bmi < 24) return "正常";
  if (bmi < 28) return "偏高";
  return "较高";
}

function buildSupplementPush(recommendations) {
  const seen = new Set();
  const nutrients = [];
  recommendations.forEach((item) => {
    item.nutrients.forEach((nutrient) => {
      if (!seen.has(nutrient)) {
        seen.add(nutrient);
        nutrients.push(nutrient);
      }
    });
  });
  return nutrients.slice(0, 6);
}

function buildSummaryAdvice(answers, recommendations, bmi) {
  const advice = [];
  const goals = answers.profile.goals;
  if (goals.includes("fitness") || (bmi && bmi >= 24)) {
    advice.push("你的身高体重与运动目标提示：运动恢复、蛋白质摄入和控糖饮食需要一起看，建议先稳定每餐蛋白质来源。");
  }
  if (goals.includes("skin")) {
    advice.push("你选择了皮肤状态目标，报告会重点关注睡眠、糖摄入、蔬果抗氧化和补水情况。");
  }
  if (goals.includes("eye")) {
    advice.push("你选择了护眼目标，报告会额外结合屏幕时长、夜间用眼、优质脂肪和叶黄素来源。");
  }
  if (goals.includes("energy")) {
    advice.push("你选择了精力目标，报告会重点检查早餐、咖啡因、睡眠节律和餐后困倦。");
  }
  if (recommendations[0]) {
    advice.push(`当前最需要优先处理的是「${recommendations[0].title}」，建议先从生活习惯和饮食结构补齐，再考虑补剂。`);
  }
  return advice.slice(0, 4);
}

function renderResults() {
  if (!validateCurrentStep()) return;

  const answers = getFormData();
  const scores = calculateScores(answers);
  const reportScores = getReportScores(scores);
  const warnings = getSafetyWarnings(answers);
  const recommendations = buildRecommendations(scores);
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

  const tags = recommendations.length
    ? recommendations.slice(0, 5).map((item) => item.title)
    : ["当前整体关注度较低", "保持均衡饮食", "定期复查习惯"];

  summaryTags.innerHTML = tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
  bmiCard.innerHTML = `
    <span>BMI 参考</span>
    <strong>${bmi || "--"}</strong>
    <p>${bmi ? `当前处于${getBmiLabel(bmi)}范围，会影响运动恢复、控糖和心血管饮食判断。` : "身高体重信息不足，暂不计算 BMI。"}</p>
  `;
  const pushed = buildSupplementPush(recommendations);
  supplementPush.innerHTML = `
    <h4>营养品推送建议</h4>
    <p>以下是可优先了解的营养方向，不代表必须购买或服用。</p>
    <div class="push-list">
      ${(pushed.length ? pushed : ["均衡饮食", "规律体检", "睡眠管理"]).map((item) => `<span>${item}</span>`).join("")}
    </div>
  `;
  summaryAdvice.innerHTML = `
    <h4>结合你的信息</h4>
    <ul>${buildSummaryAdvice(answers, recommendations, bmi).map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
  scoreList.innerHTML = renderScoreList(scores);

  safetyCard.classList.toggle("high-risk", warnings.length > 0);
  safetyCard.innerHTML = `
    <h3>${warnings.length ? "安全提醒优先看" : "通用安全提醒"}</h3>
    <p>${warnings.length ? warnings.join(" ") : "当前未发现明显补剂安全拦截条件，但补剂仍不能替代均衡饮食、睡眠、运动和正规医疗建议。"}</p>
  `;

  const top = recommendations[0];
  analysisCard.innerHTML = `
    <div class="report-score">
      <div>
        <p class="eyebrow">Health Score</p>
        <h3>你的健康测评综合得分：<strong>${reportScores.total}</strong><span>/100</span></h3>
        <p>${top ? `你目前最突出的关注点是「${top.title}」。这通常不是单一营养素能解决的问题，更适合从饮食结构、作息节奏和体检指标三方面一起确认。` : "你的回答没有触发明显高关注维度，建议继续保持稳定作息、均衡饮食和规律运动。"}</p>
      </div>
      ${renderRadar(reportScores)}
    </div>
  `;

  recommendationGrid.innerHTML = recommendations.length
    ? recommendations.map((item) => `
      <article class="recommend-card plan-card">
        <div class="plan-visual ${item.key}">
          <img src="${getVisualAsset(item.key)}" alt="${item.title}营养方向插画">
        </div>
        <div class="plan-content">
        <span class="level ${item.level.className}">${item.level.label} · ${item.score} 分</span>
        <h3>${item.title}</h3>
        <p>${item.note}</p>
        <div class="insight-grid">
          <div>
            <strong>为什么关注</strong>
            <p>${item.reason}</p>
          </div>
          <div>
            <strong>执行建议</strong>
            <p>${item.action}</p>
          </div>
        </div>
        <div class="mini-title">可关注营养素</div>
        <div class="nutrients">
          ${item.nutrients.map((nutrient) => `<span class="nutrient">${nutrient}</span>`).join("")}
        </div>
        <div class="mini-title">优先食物</div>
        <p class="food-line">${item.foods.join("、")}</p>
        </div>
      </article>
    `).join("")
    : `
      <article class="recommend-card">
        <span class="level">低关注</span>
        <h3>维持当前习惯</h3>
        <p>你的问卷未触发明显营养关注项。建议继续保持均衡饮食、规律作息和适量运动。</p>
        <div class="nutrients">
          <span class="nutrient">均衡饮食</span>
          <span class="nutrient">规律体检</span>
        </div>
      </article>
    `;

  actionList.innerHTML = buildActionList(answers, recommendations, warnings)
    .map((item) => `<li>${item}</li>`)
    .join("");

  assessment.hidden = true;
  results.hidden = false;
  summaryPage.hidden = false;
  detailReport.hidden = true;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelector("#startBtn").addEventListener("click", () => {
  hero.hidden = true;
  assessment.hidden = false;
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
  if (currentStep === 2) renderLifestyleQuestions();
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
  updateStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderHealthRiskQuestions();
renderLifestyleQuestions();
updateStep();
