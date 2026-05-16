function splitList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split(/[,，、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberOr(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function scenarioProfile(scenario) {
  if (scenario.includes("流感")) {
    return {
      baseCategories: ["感冒发热品类", "止咳化痰品类", "口罩与消毒用品"],
      touchTime: "舆情升温后 24 小时内，优先企微提醒，短信补充",
      channel: ["企微一对一", "短信补充", "小程序首页弹窗"],
      keyReason: "区域流感关注度升高，会员健康提醒需求增强"
    };
  }
  if (scenario.includes("慢病")) {
    return {
      baseCategories: ["慢病续购品类", "基础健康监测用品", "用药依从性关怀服务"],
      touchTime: "会员复购窗口前 3 天触达，晚上 19:00 后补充提醒",
      channel: ["企微一对一", "会员电话回访", "小程序待办提醒"],
      keyReason: "会员临近复购窗口，适合做健康关怀和续购提醒"
    };
  }
  if (scenario.includes("沉睡")) {
    return {
      baseCategories: ["高频家庭常备药", "健康检测服务", "门店到店礼权益"],
      touchTime: "周五晚间和周末上午触达，降低打扰感",
      channel: ["短信召回", "小程序券包", "企微补充触达"],
      keyReason: "沉睡会员需要先用低门槛权益恢复互动"
    };
  }
  return {
    baseCategories: ["慢病续购品类", "保暖护理用品", "基础健康监测用品"],
    touchTime: "降温前 1—2 天触达，晚间 19:00 后打开率更高",
    channel: ["企微一对一", "短信补充", "门店到店提醒"],
    keyReason: "天气明显变化，慢病和保暖护理相关需求上升"
  };
}

function generateDrugMatch(input) {
  const scenario = input.scenario || "寒潮降温";
  const profile = scenarioProfile(scenario);
  const memberTags = splitList(input.memberTags);
  const memberCount = numberOr(input.memberCount, 0);
  const inventoryStatus = input.inventoryStatus || "normal";
  const stockPressure = inventoryStatus === "low" || inventoryStatus === "uneven";

  const recommendedCategories = profile.baseCategories.map((name, index) => ({
    name,
    priority: index === 0 ? "高" : index === 1 ? "中高" : "中",
    reason:
      index === 0
        ? `${profile.keyReason}，且目标会员数量为 ${memberCount} 人。`
        : `与场景“${scenario}”存在关联，可作为组合推荐或到店承接补充。`,
    complianceNote: name.includes("慢病") || name.includes("感冒")
      ? "仅作为健康提醒和合规购药服务提示，不能替代医生诊断。"
      : "可作为非诊疗型服务提醒，避免夸大功效。"
  }));

  const alternativeCategories = stockPressure
    ? ["同功效替代品类", "可预约到店商品", "非药健康服务包"]
    : ["关联护理用品", "健康检测服务"];

  return {
    agentName: "药品匹配 Agent",
    scenario,
    targetMembers: memberCount,
    memberTags,
    recommendedCategories,
    alternativeCategories,
    decisionBasis: [
      `机会信号：${input.signalText || "未填写"}`,
      `会员标签：${memberTags.join("、") || "未填写"}`,
      `经营目标：${input.businessGoal || "未填写"}`,
      `库存状态：${inventoryStatus}`
    ],
    complianceWarnings: [
      "不得承诺疗效，不替代医生或药师诊断。",
      "处方药相关内容应进入药师审核或复购提醒流程。",
      "会员标签和购药记录仅在授权范围内最小可见。"
    ],
    riskLevel: stockPressure ? "中" : "低"
  };
}

function generateCampaignDraft(input, drugMatch) {
  const scenario = input.scenario || drugMatch.scenario || "寒潮降温";
  const profile = scenarioProfile(scenario);
  const memberCount = numberOr(input.memberCount, drugMatch.targetMembers || 0);
  const budgetLevel = input.budgetLevel || "medium";

  const couponMap = {
    low: "轻量权益：满减券 + 到店健康检测提醒",
    medium: "中等权益：重点品类券 + 组合购券 + 到店服务提醒",
    high: "强权益：分层券包 + 高价值会员专属券 + 门店承接任务"
  };

  const mainCategory = drugMatch.recommendedCategories[0]?.name || "重点推荐品类";
  const campaignName = `${scenario}·${input.businessGoal || "会员经营"}活动草案`;
  const estimatedReach = Math.round(memberCount * 0.92);

  return {
    agentName: "活动草案 Agent",
    campaignName,
    status: "待运营审核",
    targetAudience: `目标会员 ${memberCount} 人，预计有效触达 ${estimatedReach} 人`,
    coreMessage: `围绕“${mainCategory}”生成健康提醒、券包和门店承接动作。`,
    channels: profile.channel,
    touchPlan: profile.touchTime,
    couponStrategy: couponMap[budgetLevel] || couponMap.medium,
    storeActions: [
      "活动发布前确认重点品类库存与替代品",
      "店长确认活动承接人员和话术",
      "店员优先服务高意向会员并记录反馈",
      "异常缺货或无法承接时回传库存预警 Agent"
    ],
    auditChecklist: [
      "活动文案是否符合药品广告与合规边界",
      "券包力度是否符合预算与毛利要求",
      "目标人群是否在授权触达范围内",
      "库存预警是否允许该活动直接发布"
    ],
    handoffToStock: {
      expectedDemand: Math.max(1, Math.round(estimatedReach * 0.18)),
      keyCategories: drugMatch.recommendedCategories.map((item) => item.name),
      storeCount: numberOr(input.storeCount, 1)
    }
  };
}

function generateStockWarning(input, campaignDraft, drugMatch) {
  const inventoryStatus = input.inventoryStatus || "normal";
  const storeCount = numberOr(input.storeCount, 1);
  const expectedDemand = campaignDraft.handoffToStock.expectedDemand;
  const statusLabelMap = {
    low: "库存偏低",
    normal: "库存正常",
    high: "库存充足",
    uneven: "门店不均衡"
  };

  const isRisky = inventoryStatus === "low" || inventoryStatus === "uneven";
  const readinessScore = inventoryStatus === "high" ? 92 : inventoryStatus === "normal" ? 82 : inventoryStatus === "uneven" ? 64 : 52;

  const risks = [];
  if (inventoryStatus === "low") {
    risks.push("重点品类库存低于活动安全线，存在触达后无法承接风险。");
  }
  if (inventoryStatus === "uneven") {
    risks.push("不同门店库存分布不均，建议按门店库存能力分批发布。 ");
  }
  if (!risks.length) {
    risks.push("当前库存可支撑活动首轮发布，建议继续监控核销高峰。 ");
  }

  const replenishmentSuggestions = isRisky
    ? [
        `按预计需求 ${expectedDemand} 单进行活动前补货测算`,
        `覆盖 ${storeCount} 家门店，优先补足重点门店和高意向会员附近门店`,
        "为库存不足门店配置替代品类或预约到店方案"
      ]
    : [
        "维持当前库存策略，活动期间按日监控核销和动销",
        "若核销速度超过预期，自动触发二次补货提醒"
      ];

  const releaseDecision = isRisky
    ? "建议先补货或按门店分批发布，不建议全量直接发布。"
    : "可进入运营审核并发布，活动期间保留库存监控。";

  return {
    agentName: "库存预警 Agent",
    statusLabel: statusLabelMap[inventoryStatus] || "库存正常",
    readinessScore,
    expectedDemand,
    riskLevel: readinessScore >= 80 ? "低" : readinessScore >= 60 ? "中" : "高",
    risks,
    replenishmentSuggestions,
    alternatives: drugMatch.alternativeCategories,
    releaseDecision,
    nextStep: isRisky
      ? "生成补货/替代品确认单，待运营或店长确认后再发布。"
      : "提交运营审核，通过后同步门店执行 Agent。"
  };
}

function runFullStrategy(input) {
  const drugMatch = generateDrugMatch(input);
  const campaignDraft = generateCampaignDraft(input, drugMatch);
  const stockWarning = generateStockWarning(input, campaignDraft, drugMatch);
  return { drugMatch, campaignDraft, stockWarning };
}

if (typeof module !== "undefined") {
  module.exports = {
    splitList,
    generateDrugMatch,
    generateCampaignDraft,
    generateStockWarning,
    runFullStrategy
  };
}

if (typeof window !== "undefined") {
  window.AgentEngine = {
    generateDrugMatch,
    generateCampaignDraft,
    generateStockWarning,
    runFullStrategy
  };
}
