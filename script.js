/**
 * 数字副店长工作台 Demo — 路由、角色切换、筛选
 * 对齐 docs/PRD-数字副店长工作台-MVP.md §8
 */

const WB_TITLES = {
  workbench: '工作台',
  insights: '会员洞察',
  campaigns: '门店活动',
  stores: '门店执行',
  review: '活动复盘',
  templates: '策略模板'
};

const WB_CRUMBS = {
  workbench: '连锁药房 · 华东试点',
  insights: '会员增长 · 人群与解释',
  campaigns: '门店活动 · 草案与审核',
  stores: '门店履约 · 店长 / 店员',
  review: '数据分析 · 活动复盘',
  templates: '策略资产 · 模板库'
};

/** @type {'hq'|'manager'|'staff'} */
var wbCurrentRole = 'hq';

var WB_ROLES = {
  hq: {
    avatarChar: '总',
    userLine: '张晨 · 运营主管',
    labelLine: '总部运营',
    scopeTag: '总部视图'
  },
  manager: {
    avatarChar: '店',
    userLine: '李芳 · 南京人民路店',
    labelLine: '门店店长',
    scopeTag: '店长视图'
  },
  staff: {
    avatarChar: '员',
    userLine: '王磊 · 一线店员',
    labelLine: '门店店员',
    scopeTag: '店员视图'
  }
};

window.__wbCrumbBase = WB_CRUMBS.workbench;

function applyCrumbWithRole() {
  var r = WB_ROLES[wbCurrentRole];
  var base = window.__wbCrumbBase || '';
  var el = document.getElementById('topbarCrumb');
  if (!el || !r) return;
  el.textContent = base ? base + ' · ' + r.scopeTag : r.scopeTag;
}

function applyRoleUI() {
  var r = WB_ROLES[wbCurrentRole];
  if (!r) return;
  var av = document.getElementById('roleAvatar');
  var u = document.getElementById('roleUserLine');
  var l = document.getElementById('roleLabelLine');
  if (av) av.textContent = r.avatarChar;
  if (u) u.textContent = r.userLine;
  if (l) l.textContent = r.labelLine;

  document.querySelectorAll('.wb-role-option').forEach(function (btn) {
    var key = btn.getAttribute('data-role');
    btn.classList.toggle('active', key === wbCurrentRole);
  });

  applyCrumbWithRole();
}

function closeRoleMenu() {
  var m = document.getElementById('roleMenu');
  var trig = document.getElementById('roleTrigger');
  if (m) {
    m.hidden = true;
    m.setAttribute('aria-hidden', 'true');
  }
  if (trig) trig.setAttribute('aria-expanded', 'false');
}

function toggleRoleMenu(ev) {
  ev.stopPropagation();
  var m = document.getElementById('roleMenu');
  var trig = document.getElementById('roleTrigger');
  if (!m || !trig) return;
  var opening = m.hidden;
  if (opening) {
    m.hidden = false;
    m.setAttribute('aria-hidden', 'false');
    trig.setAttribute('aria-expanded', 'true');
  } else {
    closeRoleMenu();
  }
}

function selectRole(roleKey) {
  if (!WB_ROLES[roleKey]) return;
  wbCurrentRole = roleKey;
  applyRoleUI();
  closeRoleMenu();
}

function navigate(page, railBtn) {
  document.querySelectorAll('.wb-page').forEach(function (p) {
    p.classList.remove('active');
  });
  document.querySelectorAll('.wb-rail-item').forEach(function (b) {
    b.classList.remove('active');
  });

  var pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  if (railBtn) railBtn.classList.add('active');
  else {
    var match = document.querySelector('.wb-rail-item[data-page="' + page + '"]');
    if (match) match.classList.add('active');
  }

  var titleEl = document.getElementById('topbarTitle');
  if (titleEl) titleEl.textContent = WB_TITLES[page] || '';

  window.__wbCrumbBase = WB_CRUMBS[page] || '';
  applyCrumbWithRole();

  var rail = document.getElementById('wbRail');
  if (rail) rail.classList.remove('open');

  if (page === 'stores') {
    var mgr = document.getElementById('store-manager');
    var stf = document.getElementById('store-staff');
    var tabs = document.querySelectorAll('.wb-store-tab');
    if (mgr) mgr.hidden = false;
    if (stf) stf.hidden = true;
    tabs.forEach(function (t, i) {
      t.classList.toggle('active', i === 0);
    });
  }
}

function switchStoreView(btn, view) {
  document.querySelectorAll('.wb-store-tab').forEach(function (t) {
    t.classList.remove('active');
  });
  btn.classList.add('active');
  var mgr = document.getElementById('store-manager');
  var stf = document.getElementById('store-staff');
  if (view === 'manager') {
    if (mgr) mgr.hidden = false;
    if (stf) stf.hidden = true;
  } else {
    if (mgr) mgr.hidden = true;
    if (stf) stf.hidden = false;
  }
}

function filterApps(tabBtn, cat) {
  document.querySelectorAll('.wb-cat-tab').forEach(function (t) {
    t.classList.remove('active');
  });
  tabBtn.classList.add('active');

  var tiles = document.querySelectorAll('#allAppsGrid .wb-app-tile');
  tiles.forEach(function (tile) {
    var cats = (tile.getAttribute('data-cats') || '').split(/\s+/);
    var show = cat === 'recent' || cats.indexOf(cat) !== -1;
    tile.style.display = show ? '' : 'none';
  });
}

function openAddCommonModal() {
  var m = document.getElementById('modalAddCommon');
  if (m) {
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
  }
}

function closeAddCommonModal() {
  var m = document.getElementById('modalAddCommon');
  if (m) {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  }
}

function openTemplateModal() {
  var m = document.getElementById('modalNewTemplate');
  if (m) {
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    var inp = document.getElementById('tplName');
    if (inp) setTimeout(function () { inp.focus(); }, 50);
  }
}

function closeTemplateModal() {
  var m = document.getElementById('modalNewTemplate');
  if (m) {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  }
}

function submitNewTemplate(ev) {
  ev.preventDefault();
  var nameEl = document.getElementById('tplName');
  var triggerEl = document.getElementById('tplTrigger');
  var ruleEl = document.getElementById('tplRule');
  var name = nameEl && nameEl.value ? nameEl.value.trim() : '';
  if (!name) return;
  var trigger = triggerEl && triggerEl.value ? triggerEl.value.trim() : '';
  var rule = ruleEl && ruleEl.value ? ruleEl.value.trim() : '';

  var grid = document.getElementById('templateGrid');
  if (!grid) return;

  var card = document.createElement('div');
  card.className = 'wb-template-card wb-template-card-new';

  var titleRow = document.createElement('div');
  titleRow.className = 'wb-template-name-row';
  var title = document.createElement('div');
  title.className = 'wb-template-name';
  title.textContent = name;
  var tag = document.createElement('span');
  tag.className = 'wb-tag wb-tag-info';
  tag.textContent = '新建';
  titleRow.appendChild(title);
  titleRow.appendChild(tag);

  var meta = document.createElement('div');
  meta.className = 'wb-muted wb-fs-sm';
  var parts = [];
  if (trigger) parts.push('触发：' + trigger);
  if (rule) parts.push(rule);
  meta.textContent = parts.length ? parts.join(' · ') : '（待补充触发与规则）';

  var actions = document.createElement('div');
  actions.className = 'wb-row-actions';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'wb-btn wb-btn-sm wb-btn-primary';
  btn.textContent = '一键生成草案';
  btn.onclick = function () {
    navigate('campaigns', document.querySelector('[data-page=campaigns]'));
  };
  actions.appendChild(btn);

  card.appendChild(titleRow);
  card.appendChild(meta);
  card.appendChild(actions);

  grid.insertBefore(card, grid.firstChild);

  var form = document.getElementById('formNewTemplate');
  if (form) form.reset();
  closeTemplateModal();
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeAddCommonModal();
    closeRoleMenu();
    closeTemplateModal();
  }
});

document.addEventListener('click', function () {
  closeRoleMenu();
});

document.addEventListener('DOMContentLoaded', function () {
  applyRoleUI();
});

window.navigate = navigate;
window.switchStoreView = switchStoreView;
window.filterApps = filterApps;
window.openAddCommonModal = openAddCommonModal;
window.closeAddCommonModal = closeAddCommonModal;
window.openTemplateModal = openTemplateModal;
window.closeTemplateModal = closeTemplateModal;
window.submitNewTemplate = submitNewTemplate;
window.toggleRoleMenu = toggleRoleMenu;
window.selectRole = selectRole;
