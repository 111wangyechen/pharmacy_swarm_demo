const titles = {
    controller: '主控 Agent',
    signal: '信号感知 Agent',
    insight: '会员洞察 Agent',
    drug: '药品匹配 Agent',
    strategy: '活动策略 Agent',
    exec: '门店执行 Agent',
    'review-agent': '复盘优化 Agent',
    inventory: '库存履约 Agent',
    topology: '协作拓扑',
    logs: '运行日志'
  };
  const breads = {
    controller: '核心调度',
    signal: '功能 Agent / 信号感知',
    insight: '功能 Agent / 会员洞察',
    drug: '功能 Agent / 药品匹配',
    strategy: '功能 Agent / 活动策略',
    exec: '功能 Agent / 门店执行',
    'review-agent': '功能 Agent / 复盘优化',
    inventory: '功能 Agent / 库存履约',
    topology: '系统监控 / 协作拓扑',
    logs: '系统监控 / 运行日志'
  };

  function navigate(page, navEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');
    if (navEl) navEl.classList.add('active');
    document.getElementById('topbarTitle').textContent = titles[page] || '';
    document.getElementById('topbarBread').textContent = breads[page] || '';
    document.getElementById('sidebar').classList.remove('open');
  }

  function checkWidth() {
    const btn = document.getElementById('menuBtn');
    if (btn) {
      if (window.innerWidth <= 1024) btn.style.display = 'block';
      else btn.style.display = 'none';
    }
  }
  window.addEventListener('resize', checkWidth);
  checkWidth();
