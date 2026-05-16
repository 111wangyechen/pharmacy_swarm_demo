const titles = {
    dashboard: '工作台',
    member: '会员运营',
    campaign: '活动管理',
    store: '门店执行',
    review: '复盘分析',
    'scenario-chronic': '慢病管理',
    'scenario-weather': '降温健康',
    'scenario-flu': '舆情流感',
    'scenario-recall': '会员召回',
    'scenario-stock': '库存补货'
  };
  const breads = {
    dashboard: '',
    member: '业务场景 / 会员运营',
    campaign: '业务场景 / 活动管理',
    store: '业务场景 / 门店执行',
    review: '业务场景 / 复盘分析',
    'scenario-chronic': '快捷入口 / 慢病管理',
    'scenario-weather': '快捷入口 / 降温健康',
    'scenario-flu': '快捷入口 / 舆情流感',
    'scenario-recall': '快捷入口 / 会员召回',
    'scenario-stock': '快捷入口 / 库存补货'
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

  function switchCampaignTab(tab, btn) {
    document.querySelectorAll('.campaign-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-bar .tab-btn').forEach(b => b.classList.remove('active'));
    const tabEl = document.getElementById('campaign-' + tab);
    if (tabEl) tabEl.classList.add('active');
    if (btn) btn.classList.add('active');
  }

  function switchStoreView(view, btn) {
    document.querySelectorAll('.store-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.store-view-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    const viewEl = document.getElementById('store-' + view);
    if (viewEl) viewEl.classList.add('active');
    if (btn) btn.classList.add('active');
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
