const assert = require("assert");
const {
  generateDrugMatch,
  generateCampaignDraft,
  generateStockWarning,
  runFullStrategy
} = require("../src/agents.js");

const input = {
  scenario: "寒潮降温",
  signalText: "未来72小时降温10℃，慢病会员复购窗口临近",
  memberCount: 1280,
  memberTags: "慢病复购窗口,近90天购买过降压药,高价值会员",
  businessGoal: "提升复购",
  inventoryStatus: "low",
  storeCount: 18,
  budgetLevel: "medium"
};

const drugMatch = generateDrugMatch(input);
assert.ok(drugMatch.recommendedCategories.length >= 3, "应生成至少 3 个推荐品类");
assert.ok(drugMatch.complianceWarnings.some((item) => item.includes("诊断")), "应包含合规诊断提醒");
assert.strictEqual(drugMatch.riskLevel, "中", "低库存时药品匹配风险应升高");

const campaignDraft = generateCampaignDraft(input, drugMatch);
assert.ok(campaignDraft.campaignName.includes("寒潮降温"), "活动名称应包含场景");
assert.ok(campaignDraft.storeActions.length >= 3, "应生成门店动作");
assert.ok(campaignDraft.auditChecklist.length >= 4, "应生成审核清单");
assert.ok(campaignDraft.handoffToStock.expectedDemand > 0, "应向库存预警传递预计需求");

const stockWarning = generateStockWarning(input, campaignDraft, drugMatch);
assert.strictEqual(stockWarning.riskLevel, "高", "低库存时应标记高风险");
assert.ok(stockWarning.releaseDecision.includes("不建议全量直接发布"), "低库存时不应建议全量发布");
assert.ok(stockWarning.replenishmentSuggestions.some((item) => item.includes("补货")), "应生成补货建议");

const healthyResult = runFullStrategy({
  ...input,
  inventoryStatus: "normal",
  budgetLevel: "low"
});
assert.ok(healthyResult.stockWarning.releaseDecision.includes("可进入运营审核"), "库存正常时应允许进入审核发布");
assert.strictEqual(healthyResult.stockWarning.riskLevel, "低", "库存正常时风险应较低");

console.log("All strategy agent tests passed.");
