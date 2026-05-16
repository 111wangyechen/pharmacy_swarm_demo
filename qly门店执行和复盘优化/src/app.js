function byId(id) {
  return document.getElementById(id);
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function runExecution() {
  const result = window.AgentEngine.generateStoreExecution({
    campaignName: byId("campaignName").value,
    weatherSignal: byId("weatherSignal").value,
    priorityMembers: Number(byId("priorityMembers").value),
    recommendedCategories: byId("categories").value.split(",").map((item) => item.trim()),
    inventoryStatus: byId("inventoryStatus").value
  });

  byId("executionOutput").classList.remove("empty");
  byId("executionOutput").innerHTML = `
    <span class="agent-badge">执行完成</span>
    <h3>${result.campaignName}</h3>
    <p>${result.summary}</p>
    <h4>店长任务</h4>
    ${renderList(result.managerTasks)}
    <h4>店员话术</h4>
    ${renderList(result.staffScripts)}
    <h4>库存提醒</h4>
    <p>${result.stockReminder}</p>
    <h4>异常上报</h4>
    <p>${result.exceptionReport.note}</p>
  `;
}

function runReview() {
  const result = window.AgentEngine.generateReviewOptimization({
    campaignName: byId("campaignName").value,
    reachCount: Number(byId("reachCount").value),
    openRate: Number(byId("openRate").value),
    couponRate: Number(byId("couponRate").value),
    redemptionRate: Number(byId("redemptionRate").value),
    salesAmount: Number(byId("salesAmount").value),
    repeatPurchaseLift: Number(byId("repeatPurchaseLift").value),
    managerConfirmed: byId("managerConfirmed").value === "true",
    staffReachRate: Number(byId("staffReachRate").value),
    stockout: byId("stockout").value === "true"
  });

  byId("reviewOutput").classList.remove("empty");
  byId("reviewOutput").innerHTML = `
    <span class="agent-badge review">复盘完成</span>
    <h3>${result.campaignName}</h3>
    <p><strong>策略评分：</strong>${result.score}</p>
    <p>${result.effectSummary}</p>
    <h4>问题归因</h4>
    ${renderList(result.attribution.length ? result.attribution : ["本次未发现明显短板"])}
    <h4>优化建议</h4>
    ${renderList(result.suggestions.length ? result.suggestions : ["维持当前策略，并继续观察下一轮效果"])}
    <h4>模板沉淀</h4>
    <p>${result.templateCandidate ? "建议沉淀为可复用模板" : "暂不建议沉淀为模板"}</p>
  `;
}

byId("runExecution").addEventListener("click", runExecution);
byId("runReview").addEventListener("click", runReview);
