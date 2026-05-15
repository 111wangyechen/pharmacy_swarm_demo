const titles = {
    home: '工作台首页',
    weather: '气象哨兵',
    chronic: '慢病管家',
    stock: '库存预言家',
    sentiment: '舆情雷达',
    commander: '策略指挥官 · 协商室',
    twin: '数字孪生 · 策略风洞'
  };
  const breads = {
    home: '',
    weather: 'Agent / 气象哨兵',
    chronic: 'Agent / 慢病管家',
    stock: 'Agent / 库存预言家',
    sentiment: 'Agent / 舆情雷达',
    commander: '协同 / 策略指挥官',
    twin: '进化 / 数字孪生'
  };

  function navigate(page, navEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    if (navEl) navEl.classList.add('active');
    document.getElementById('topbarTitle').textContent = titles[page] || '';
    document.getElementById('topbarBread').textContent = breads[page] || '';
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
  }

  // Responsive: show menu button on small screens
  function checkWidth() {
    const btn = document.getElementById('menuBtn');
    if (window.innerWidth <= 1024) btn.style.display = 'block';
    else btn.style.display = 'none';
  }
  window.addEventListener('resize', checkWidth);
  checkWidth();