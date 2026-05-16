function generateStoreExecution(input) {
  const lowInventory = input.inventoryStatus === "low";

  return {
    campaignName: input.campaignName,
    summary: `基于“${input.weatherSignal}”，今日需优先服务 ${input.priorityMembers} 位重点会员。`,
    managerTasks: [
      "确认今日活动承接安排",
      `检查${input.recommendedCategories.join("、")}库存`,
      "安排店员优先服务重点会员"
    ],
    staffScripts: [
      "健康提醒：最近天气变化明显，请注意保暖并关注身体情况。",
      "如您近期有复购需求，我可以协助查看本店相关商品和活动信息。",
      "如有不适，建议及时咨询医生或药师。"
    ],
    stockReminder: lowInventory
      ? "重点品类库存偏低，建议立即补货，并优先确认活动承接能力。"
      : "重点品类库存充足，可正常承接活动。",
    exceptionReport: {
      hasStockRisk: lowInventory,
      needsEscalation: lowInventory,
      note: lowInventory ? "重点品类存在缺货风险" : "暂无异常"
    }
  };
}

function generateReviewOptimization(input) {
  const attribution = [];
  const suggestions = [];

  if (input.openRate < 0.3) {
    attribution.push("打开率偏低");
    suggestions.push("将触达时间调整到会员更活跃的晚间，并优化标题表达。");
  }
  if (input.couponRate < 0.18) {
    attribution.push("领券率偏低");
    suggestions.push("检查优惠力度与推荐品类是否足够匹配会员需求。");
  }
  if (input.redemptionRate < 0.1) {
    attribution.push("核销率偏低");
    suggestions.push("延长券有效期，并强化门店承接提醒。");
  }
  if (!input.managerConfirmed || input.staffReachRate < 0.7) {
    attribution.push("门店执行不足");
    suggestions.push("对未确认任务或执行率偏低门店增加督办提醒。");
  }
  if (input.stockout) {
    attribution.push("库存支持不足");
    suggestions.push("活动前增加库存预检，并优先补足重点品类库存。");
  }

  const score = Math.round(
    input.openRate * 20 +
      input.couponRate * 20 +
      input.redemptionRate * 25 +
      Math.min(input.repeatPurchaseLift * 100, 10) +
      (input.managerConfirmed ? 10 : 0) +
      input.staffReachRate * 15
  );

  return {
    campaignName: input.campaignName,
    score,
    effectSummary:
      score >= 60
        ? "本次活动整体有效，可继续优化放大。"
        : "本次活动效果一般，主要问题集中在触达、执行或库存承接。",
    attribution,
    suggestions,
    templateCandidate:
      score >= 60 &&
      input.redemptionRate >= 0.12 &&
      input.repeatPurchaseLift >= 0.04 &&
      !input.stockout
  };
}

if (typeof module !== "undefined") {
  module.exports = {
    generateStoreExecution,
    generateReviewOptimization
  };
}

if (typeof window !== "undefined") {
  window.AgentEngine = {
    generateStoreExecution,
    generateReviewOptimization
  };
}
