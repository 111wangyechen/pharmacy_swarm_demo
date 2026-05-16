function byId(id) {
  return document.getElementById(id);
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
}

function renderBadges(items, variant) {
  return `<div class="badge-row">${items
    .map((item) => `<span class="pill ${variant || ""}">${escapeHTML(item)}</span>`)
    .join("")}</div>`;
}

function collectInput() {
  return {
    scenario: byId("scenario").value,
    signalText: byId("signalText").value,
    memberCount: Number(byId("memberCount").value),
    memberTags: byId("memberTags").value,
    businessGoal: byId("businessGoal").value,
    inventoryStatus: byId("inventoryStatus").value,
    storeCount: Number(byId("storeCount").value),
    budgetLevel: byId("budgetLevel").value
  };
}

function updateSignalStrip(input) {
  const inventoryMap = {
    low: "库存偏低",
    normal: "库存正常",
    high: "库存充足",
    uneven: "门店不均衡"
  };
  byId("stripScenario").textContent = input.scenario;
  byId("stripMembers").textContent = `${input.memberCount} 人`;
  byId("stripInventory").textContent = inventoryMap[input.inventoryStatus] || "库存正常";
}

function renderDrugMatch(result) {
  const categoryList = result.recommendedCategories.map(
    (item) => `${item.name}｜优先级：${item.priority}｜${item.reason}`
  );
  byId("drugOutput").classList.remove("empty");
  byId("drugOutput").innerHTML = `
    <span class="agent-badge">匹配完成</span>
    <h3>${escapeHTML(result.scenario)}推荐结果</h3>
    <div class="metric-grid">
      <div class="metric"><span>目标会员</span><strong>${result.targetMembers}</strong></div>
      <div class="metric"><span>推荐品类</span><strong>${result.recommendedCategories.length}</strong></div>
      <div class="metric"><span>风险等级</span><strong>${escapeHTML(result.riskLevel)}</strong></div>
    </div>
    <h4>推荐品类</h4>
    ${renderList(categoryList)}
    <h4>会员标签</h4>
    ${renderBadges(result.memberTags)}
    <h4>合规提醒</h4>
    ${renderList(result.complianceWarnings)}
  `;
}

function renderCampaignDraft(result) {
  byId("campaignOutput").classList.remove("empty");
  byId("campaignOutput").innerHTML = `
    <span class="agent-badge campaign">草案生成</span>
    <h3>${escapeHTML(result.campaignName)}</h3>
    <p><strong>状态：</strong>${escapeHTML(result.status)}</p>
    <p>${escapeHTML(result.targetAudience)}</p>
    <p>${escapeHTML(result.coreMessage)}</p>
    <h4>触达渠道</h4>
    ${renderBadges(result.channels)}
    <h4>券包策略</h4>
    <p>${escapeHTML(result.couponStrategy)}</p>
    <h4>门店动作</h4>
    ${renderList(result.storeActions)}
    <h4>审核清单</h4>
    ${renderList(result.auditChecklist)}
  `;
}

function renderStockWarning(result) {
  const badgeClass = result.riskLevel === "高" ? "danger" : result.riskLevel === "中" ? "warning" : "";
  byId("stockOutput").classList.remove("empty");
  byId("stockOutput").innerHTML = `
    <span class="agent-badge stock">库存校验</span>
    <h3>${escapeHTML(result.statusLabel)}</h3>
    <div class="metric-grid">
      <div class="metric"><span>承接评分</span><strong>${result.readinessScore}</strong></div>
      <div class="metric"><span>预计需求</span><strong>${result.expectedDemand}</strong></div>
      <div class="metric"><span>风险等级</span><strong>${escapeHTML(result.riskLevel)}</strong></div>
    </div>
    <h4>风险判断</h4>
    ${renderList(result.risks)}
    <h4>补货建议</h4>
    ${renderList(result.replenishmentSuggestions)}
    <h4>替代方案</h4>
    ${renderBadges(result.alternatives, badgeClass)}
    <h4>发布决策</h4>
    <p><strong>${escapeHTML(result.releaseDecision)}</strong></p>
    <p>${escapeHTML(result.nextStep)}</p>
  `;
}

function runStrategy() {
  const input = collectInput();
  updateSignalStrip(input);
  const result = window.AgentEngine.runFullStrategy(input);
  renderDrugMatch(result.drugMatch);
  renderCampaignDraft(result.campaignDraft);
  renderStockWarning(result.stockWarning);
}

byId("runStrategy").addEventListener("click", runStrategy);
