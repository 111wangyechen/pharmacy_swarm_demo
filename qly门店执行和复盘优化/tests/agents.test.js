const assert = require("assert");
const {
  generateStoreExecution,
  generateReviewOptimization
} = require("../src/agents.js");

const storeResult = generateStoreExecution({
  campaignName: "寒潮天气慢病会员健康提醒",
  weatherSignal: "未来72小时降温10℃",
  priorityMembers: 36,
  recommendedCategories: ["慢病续购品类", "保暖护理用品"],
  inventoryStatus: "low"
});

assert.strictEqual(storeResult.managerTasks.length, 3, "应生成 3 条店长任务");
assert.ok(storeResult.stockReminder.includes("补货"), "低库存时应提醒补货");
assert.ok(storeResult.staffScripts[0].includes("健康提醒"), "应生成合规健康提醒话术");
assert.strictEqual(storeResult.exceptionReport.hasStockRisk, true, "低库存应标记风险");

const reviewResult = generateReviewOptimization({
  campaignName: "寒潮天气慢病会员健康提醒",
  reachCount: 1200,
  openRate: 0.22,
  couponRate: 0.12,
  redemptionRate: 0.07,
  salesAmount: 8600,
  repeatPurchaseLift: 0.02,
  managerConfirmed: false,
  staffReachRate: 0.48,
  stockout: true
});

assert.ok(reviewResult.attribution.includes("打开率偏低"), "低打开率应被归因");
assert.ok(reviewResult.attribution.includes("门店执行不足"), "低执行率应被归因");
assert.ok(reviewResult.suggestions.some((item) => item.includes("库存")), "缺货时应给出库存建议");
assert.strictEqual(reviewResult.templateCandidate, false, "效果差时不应沉淀为模板");

console.log("All agent tests passed.");
