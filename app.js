const SESSION_STORAGE_KEY = 'diancan_chat_sessions_v1';
const ACTIVE_SESSION_KEY = 'diancan_current_session_id';
const DEFAULT_WELCOME_MSG = '你好！告诉我你们几个人、预算多少，有没有不吃辣、过敏或忌口？';
const API_BASE = (window.WEBMCP_API_BASE || 'https://laofei.com.cn').replace(/\/$/, '');
const WEBMCP_TOOLS_PATH = '/mcp/v1/tools';
const SHOP_ID = 3;
const state = { session: null, plan: null, draft: null, menu: null, strategy: 'balanced', members: [], tools: [], model: null, partySize: 2, budgetYuan: 0, chatHistory: [{ role: 'assistant', content: '你好！告诉我你们几个人、预算多少，有没有不吃辣、过敏或忌口？' }] };
const MEMBER_ATTRIBUTES = [
  { key: 'no_lamb', label: '不吃羊肉', type: 'restriction', group: '忌口边界' },
  { key: 'non_spicy', label: '不吃辣', type: 'restriction', group: '忌口边界' },
  { key: 'no_fatty_meat', label: '不吃肥肉', type: 'restriction', group: '忌口边界' },
  { key: 'no_beef', label: '不吃牛肉', type: 'restriction', group: '忌口边界' },
  { key: 'no_seafood', label: '不吃海鲜', type: 'restriction', group: '忌口边界' },
  { key: 'low_oil', label: '少油少盐', type: 'preference', group: '口味偏好' },
  { key: 'light_flavor', label: '清淡口味', type: 'preference', group: '口味偏好' },
  { key: 'extra_spicy', label: '偏爱重辣', type: 'preference', group: '口味偏好' },
  { key: 'meat_lover', label: '肉食爱好者', type: 'preference', group: '口味偏好' },
  { key: 'fitness', label: '爱健身', type: 'goal', group: '生活目标' },
  { key: 'weight_control', label: '控制体重', type: 'goal', group: '生活目标' },
  { key: 'high_protein', label: '高蛋白', type: 'goal', group: '生活目标' },
  { key: 'small_appetite', label: '食量较小', type: 'portion', group: '食量偏好' },
  { key: 'big_appetite', label: '食量较大', type: 'portion', group: '食量偏好' }
];
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const rawJson = value => JSON.stringify(value, null, 2);
const money = fen => fen == null || Number.isNaN(Number(fen)) ? '—' : `¥${(Number(fen) / 100).toFixed(2)}`;
function defaultMember(index) { return { member_id: `P${index + 1}`, name: `成员 ${index + 1}`, attributes: index < 2 ? ['non_spicy'] : [], restrictions: index < 2 ? ['不吃辣'] : [], preferences: [], goals: [], portion_target: null }; }
function dataOf(body) { return body?.data ?? body; }
function parseToolText(entries) { if (!Array.isArray(entries)) return null; for (const item of entries) { if (item?.type !== 'text' || typeof item.text !== 'string') continue; try { return JSON.parse(item.text); } catch (_) {} } return null; }
function resultOf(body) { const d = dataOf(body); return d?.result ?? d; }
function toolText(body) { const d = dataOf(body); const direct = parseToolText(d?.content) || parseToolText(body?.content); if (direct) return direct; const nested = d?.result; return parseToolText(nested?.content); }
function businessOf(body) {
  const structured = resultOf(body);
  // 网关同时返回 result/content 和 content[*].text。优先使用结构化业务对象，
  // 但当 result 只有 MCP envelope 时，必须回退解析 text 中的 JSON。
  if (structured && (structured.plan || structured.adjusted_plan || structured.session || structured.snapshot || structured.reply || structured.status === 'SUCCESS' || structured.status === 'FEASIBLE' || structured.status === 'UNFEASIBLE')) return structured;
  return toolText(body) || structured || {};
}
function getOpaqueId(value, key) { const d = businessOf(value); return d?.[key] ?? d?.session?.[key] ?? d?.plan?.[key] ?? d?.draft?.[key] ?? null; }
function setConnection(text, good = false) { if ($('connectionText')) $('connectionText').textContent = text; const dot = document.querySelector('.connection-dot'); if (dot) dot.style.background = good ? '#59e2a0' : '#ffad68'; }
function formatAssistantReply(text) {
  const raw = String(text || '').trim();
  if (!raw) return '';
  const lines = raw.split(/\r?\n/);
  const hasListPattern = lines.some(line => /^\s*(?:(?:\d{1,2}[\.、\)]|\(\d{1,2}\)|\[\d{1,2}\])|[-*•+]|\|)\s+/.test(line));
  if (!hasListPattern) {
    return escapeHtml(raw).replace(/\n/g, '<br>');
  }
  const blocks = [];
  let currentList = null;
  let currentCategory = '';
  function flushList() {
    if (currentList && currentList.items.length) {
      blocks.push(currentList);
      currentList = null;
      currentCategory = '';
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // 支持 Markdown 表格行: | 菜品 | 数量 | 小计 |
    const tableMatch = line.match(/^\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|?\s*$/);
    if (tableMatch) {
      const col1 = tableMatch[1].trim();
      const col2 = tableMatch[2].trim();
      const col3 = tableMatch[3].trim();
      if (/^[-: ]+$/.test(col1)) continue;
      if (/菜品|商品|名称/.test(col1)) {
        flushList();
        currentCategory = '推荐菜品清单';
        continue;
      }
      if (/合计|总计|总价/.test(col1)) {
        flushList();
        blocks.push({ type: 'para', text: `**合计**：${col3 || col2}` });
        continue;
      }
      if (!currentList) currentList = { type: 'list', category: currentCategory || '推荐菜品清单', items: [] };
      let price = col3.replace(/(?:[¥￥]\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:元|块))/g, (_, p1, p2) => '¥' + (p1 || p2));
      if (!price.startsWith('¥') && /\d/.test(price)) price = '¥' + price;
      const spec = col2.replace(/\*\*/g, '');
      const title = col1.replace(/\*\*/g, '');
      currentList.items.push({ num: null, title, spec, tags: [], price, desc: '' });
      continue;
    }
    const catMatch = line.match(/^(?:###|\*\*|【)\s*([^#*【】]+?)\s*(?:###|\*\*|】|:)?$/);
    if (catMatch && i + 1 < lines.length && /^\s*(?:(?:\d{1,2}[\.、\)]|\(\d{1,2}\)|\[\d{1,2}\])|[-*•+]|\|)\s+/.test(lines[i + 1])) {
      flushList();
      currentCategory = catMatch[1].replace(/[:：]$/, '').trim();
      continue;
    }
    const numMatch = line.match(/^(\d{1,2})[\.、\)]\s*(.*)$/) || line.match(/^[\(\[](\d{1,2})[\)\]]\s*(.*)$/);
    const bulletMatch = !numMatch && line.match(/^[-*•+]\s+(.*)$/);
    if (numMatch || bulletMatch) {
      if (!currentList) currentList = { type: 'list', category: currentCategory, items: [] };
      const rawItem = (numMatch ? numMatch[2] : bulletMatch[1]).trim();
      const num = numMatch ? numMatch[1] : null;
      let price = '';
      let cleaned = rawItem.replace(/(?:[¥￥]\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:元|块))/g, (_, p1, p2) => {
        price = '¥' + (p1 || p2);
        return '';
      });
      const tags = [];
      cleaned = cleaned.replace(/\[([^\]]+)\]|【([^】]+)】|\((免辣|微辣|不辣|中辣|特辣|招牌|必点|推荐|新品|热销|限时|特色|高蛋白|解腻|爆款)[^)]*\)/g, (_, t1, t2, t3) => {
        const tag = (t1 || t2 || t3 || '').trim();
        if (tag) tags.push(tag);
        return '';
      });
      let spec = '';
      cleaned = cleaned.replace(/(?:\(|\s|^)(\d+\s*(?:串|份|只|条|扎|瓶|碗|个|把|斤|两|包|听|罐|盒))(?:\)|\s|$)/g, (_, s) => {
        spec = s.trim();
        return ' ';
      });
      let title = '';
      let desc = '';
      const sepMatch = cleaned.match(/^([^：:——\-]+)[：:——\-]\s*(.+)$/);
      if (sepMatch) {
        title = sepMatch[1].trim();
        desc = sepMatch[2].trim();
      } else {
        const commaMatch = cleaned.match(/^([^，,]+)[，,]\s*(.+)$/);
        if (commaMatch && commaMatch[2].length > 6) {
          title = commaMatch[1].trim();
          desc = commaMatch[2].trim();
        } else {
          title = cleaned.trim();
        }
      }
      currentList.items.push({ num, title, spec, tags, price, desc });
    } else {
      flushList();
      blocks.push({ type: 'para', text: line });
    }
  }
  flushList();
  let html = '';
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === 'para') {
      const isOutro = i > 0 && /^(?:建议|提示|注意|温馨提示|总结|💡|说明)/.test(block.text);
      if (isOutro) {
        html += `<div class="ai-msg-outro">${escapeHtml(block.text)}</div>`;
      } else if (i === 0 && blocks.length > 1) {
        html += `<div class="ai-msg-intro">${escapeHtml(block.text)}</div>`;
      } else {
        html += `<div class="ai-msg-para">${escapeHtml(block.text)}</div>`;
      }
    } else if (block.type === 'list') {
      html += `<div class="ai-list-card">`;
      if (block.category) {
        html += `<div class="ai-list-category"><span class="ai-list-category-icon">🔥</span><span>${escapeHtml(block.category)}</span></div>`;
      }
      html += `<div class="ai-list-items">`;
      block.items.forEach(item => {
        const badge = item.num
          ? `<span class="ai-list-num">${escapeHtml(item.num)}</span>`
          : `<span class="ai-list-bullet"></span>`;
        let tagHtml = '';
        if (item.spec) {
          tagHtml += `<span class="ai-tag-pill tag-spec">${escapeHtml(item.spec)}</span>`;
        }
        item.tags.forEach(t => {
          let cls = 'tag-orange';
          if (/免辣|不辣|清淡|微辣/.test(t)) cls = 'tag-mint';
          else if (/推荐|新品|特色/.test(t)) cls = 'tag-gold';
          tagHtml += `<span class="ai-tag-pill ${cls}">${escapeHtml(t)}</span>`;
        });
        const priceHtml = item.price ? `<span class="ai-list-price">${escapeHtml(item.price)}</span>` : '';
        const descHtml = item.desc ? `<div class="ai-list-desc">${escapeHtml(item.desc)}</div>` : '';
        html += `<div class="ai-list-item" data-dish="${escapeHtml(item.title)}">${badge}<div class="ai-list-content"><div class="ai-list-title-row"><span class="ai-list-title">${escapeHtml(item.title)} ${tagHtml}</span>${priceHtml}</div>${descHtml}</div></div>`;
      });
      html += `</div>`;
      html += `<div class="ai-list-action-hint">轻触菜品可快捷引用沟通 · 真实菜品以门店实时菜单为准</div>`;
      html += `</div>`;
    }
  }
  return html;
}
function loadSessions() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.warn('Failed to parse sessions from localStorage:', e);
    return [];
  }
}
function saveSessions(sessions) {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.warn('Failed to save sessions to localStorage:', e);
  }
  updateHistoryBadge(sessions.length);
}
function getActiveSessionId() {
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY) || '';
  } catch (_) {
    return '';
  }
}
function setActiveSessionId(id) {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, id);
  } catch (_) {}
}

function flashSaveIndicator(msg = '对话已自动存盘 · 刷新不丢失') {
  const bar = $('saveIndicator');
  const text = $('saveIndicatorText');
  if (text) text.textContent = msg;
  if (bar) {
    bar.classList.add('saved');
    setTimeout(() => {
      bar.classList.remove('saved');
      if (text) text.textContent = '本地会话已实时同步 · 刷新页面不丢失';
    }, 1800);
  }
}

function updateHistoryBadge(count) {
  const actualCount = count !== undefined ? count : loadSessions().length;
  if ($('historyCountBadge')) $('historyCountBadge').textContent = actualCount;
  if ($('historyDrawerBadge')) $('historyDrawerBadge').textContent = actualCount;
}
function summarizeSessionTitle(chatHistory, plan, partySize, budgetYuan) {
  const firstUserMsg = (chatHistory || []).find(m => m.role === 'user');
  if (firstUserMsg && firstUserMsg.content) {
    const raw = firstUserMsg.content.trim().replace(/\s+/g, ' ');
    return raw.length > 20 ? raw.slice(0, 20) + '…' : raw;
  }
  if (partySize || budgetYuan) {
    return `${partySize || 2}人 ${budgetYuan ? `¥${budgetYuan}` : ''} 点餐推荐`.trim();
  }
  return '新点餐对话';
}
function formatSessionTime(timestamp) {
  if (!timestamp) return '刚刚';
  const now = Date.now();
  const diff = now - timestamp;
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  const d = new Date(timestamp);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  if (diff < 86400000) return `今天 ${hours}:${minutes}`;
  const month = d.getMonth() + 1;
  const date = d.getDate();
  return `${month}月${date}日 ${hours}:${minutes}`;
}
function persistCurrentSession() {
  const sessions = loadSessions();
  let currentId = getActiveSessionId();
  let session = sessions.find(s => s.id === currentId);
  const title = summarizeSessionTitle(state.chatHistory || [], state.plan, state.partySize, state.budgetYuan);
  const now = Date.now();
  if (!session) {
    currentId = 'sess_' + now + '_' + Math.random().toString(36).slice(2, 6);
    setActiveSessionId(currentId);
    session = {
      id: currentId,
      createdAt: now,
      updatedAt: now,
      title,
      partySize: state.partySize || 2,
      budgetYuan: state.budgetYuan || 0,
      strategy: state.strategy || 'balanced',
      chatHistory: state.chatHistory || [],
      plan: state.plan || null,
      session: state.session || null
    };
    sessions.unshift(session);
  } else {
    session.updatedAt = now;
    session.title = title;
    session.partySize = state.partySize || 2;
    session.budgetYuan = state.budgetYuan || 0;
    session.strategy = state.strategy || 'balanced';
    session.chatHistory = state.chatHistory || [];
    session.plan = state.plan || null;
    session.session = state.session || null;
    const idx = sessions.findIndex(s => s.id === currentId);
    if (idx > 0) {
      sessions.splice(idx, 1);
      sessions.unshift(session);
    }
  }
  saveSessions(sessions);
  updateHistoryBadge(sessions.length);
  flashSaveIndicator();
  if ($('historyDrawer')?.classList.contains('is-open')) {
    renderHistoryDrawer();
  }
}
function rebuildChatMessagesFromHistory() {
  const box = $('chatMessages');
  if (!box) return;
  box.innerHTML = '';
  const list = state.chatHistory || [];
  list.forEach(item => {
    const role = item.role || 'assistant';
    const text = item.content || '';
    const meta = item.meta || '';
    const msgEl = document.createElement('div');
    msgEl.className = `chat-message ${role}`;
    const bodyHtml = role === 'assistant' ? formatAssistantReply(text) : escapeHtml(text).replace(/\n/g, '<br>');
    msgEl.innerHTML = `<div class="chat-avatar">${role === 'assistant' ? 'AI' : '我'}</div><div class="chat-bubble">${bodyHtml} ${meta ? `<small class="chat-meta">${escapeHtml(meta)}</small>` : ''}</div>`;
    box.appendChild(msgEl);
    if (role === 'assistant') {
      msgEl.querySelectorAll('.ai-list-item[data-dish]').forEach(dishItem => {
        dishItem.addEventListener('click', () => {
          const dishName = dishItem.dataset.dish;
          if (dishName && $('prompt')) {
            $('prompt').value = `我想了解或加一份【${dishName}】`;
            $('prompt').focus();
          }
        });
      });
    }
  });
  box.scrollTop = box.scrollHeight;
}
function resetResultPanel() {
  if (!$('resultContent')) return;
  $('resultContent').innerHTML = '<strong>方案会显示在这里</strong><p>发送需求后，AI 会从 #3 门店实时菜单中计算方案。</p>';
  $('resultContent').className = 'empty-state';
  if ($('resultStatus')) {
    $('resultStatus').textContent = '等待输入';
    $('resultStatus').className = 'badge muted';
  }
  if ($('draftBtn')) $('draftBtn').disabled = true;
  if ($('submitBtn')) $('submitBtn').disabled = true;
}
function createNewSession() {
  const now = Date.now();
  const newId = 'sess_' + now + '_' + Math.random().toString(36).slice(2, 6);
  setActiveSessionId(newId);
  state.partySize = 2;
  state.budgetYuan = 0;
  state.strategy = 'balanced';
  state.plan = null;
  state.session = null;
  state.draft = null;
  state.chatHistory = [{ role: 'assistant', content: DEFAULT_WELCOME_MSG }];

  const sessions = loadSessions();
  sessions.unshift({
    id: newId,
    createdAt: now,
    updatedAt: now,
    title: '新点餐对话',
    partySize: 2,
    budgetYuan: 0,
    strategy: 'balanced',
    chatHistory: state.chatHistory,
    plan: null,
    session: null
  });
  saveSessions(sessions);

  rebuildChatMessagesFromHistory();
  resetResultPanel();
  closeHistoryDrawer();
}
function switchSession(sessionId) {
  const sessions = loadSessions();
  const target = sessions.find(s => s.id === sessionId);
  if (!target) return;
  setActiveSessionId(sessionId);
  state.partySize = target.partySize || 2;
  state.budgetYuan = target.budgetYuan || 0;
  state.strategy = target.strategy || 'balanced';
  state.chatHistory = Array.isArray(target.chatHistory) && target.chatHistory.length ? target.chatHistory : [{ role: 'assistant', content: DEFAULT_WELCOME_MSG }];
  state.plan = target.plan || null;
  state.session = target.session || null;
  state.draft = null;

  document.querySelectorAll('.strategy').forEach(button => {
    button.classList.toggle('active', button.dataset.value === state.strategy);
  });

  rebuildChatMessagesFromHistory();
  if (state.plan) {
    renderPlan({ plan: state.plan });
  } else {
    resetResultPanel();
  }
  flashSaveIndicator('已恢复会话【' + (target.title || '历史对话') + '】');
  closeHistoryDrawer();
}
function deleteSession(sessionId, event) {
  if (event) event.stopPropagation();
  let sessions = loadSessions();
  sessions = sessions.filter(s => s.id !== sessionId);
  saveSessions(sessions);
  const currentId = getActiveSessionId();
  if (currentId === sessionId) {
    if (sessions.length > 0) {
      switchSession(sessions[0].id);
    } else {
      createNewSession();
    }
  } else {
    renderHistoryDrawer();
  }
}
function openHistoryDrawer() {
  renderHistoryDrawer();
  $('historyDrawer')?.classList.add('is-open');
  $('historyDrawerBackdrop')?.classList.add('is-open');
  $('historyDrawer')?.setAttribute('aria-hidden', 'false');
  $('historyDrawerBackdrop')?.setAttribute('aria-hidden', 'false');
}
function closeHistoryDrawer() {
  $('historyDrawer')?.classList.remove('is-open');
  $('historyDrawerBackdrop')?.classList.remove('is-open');
  $('historyDrawer')?.setAttribute('aria-hidden', 'true');
  $('historyDrawerBackdrop')?.setAttribute('aria-hidden', 'true');
}
function renderHistoryDrawer() {
  const container = $('historyList');
  if (!container) return;
  const sessions = loadSessions();
  const currentId = getActiveSessionId();
  updateHistoryBadge(sessions.length);

  if (!sessions.length) {
    container.innerHTML = '<div class="history-empty">暂无历史对话<br><small>开始聊天后将自动保存</small></div>';
    return;
  }

  container.innerHTML = sessions.map(sess => {
    const isActive = sess.id === currentId;
    const itemsCount = sess.plan?.line_items?.length || sess.plan?.items?.length || 0;
    const msgCount = sess.chatHistory?.length || 0;
    const planTotal = sess.plan?.price_total_fen ?? sess.plan?.total_price_fen ?? sess.plan?.total_fen;
    const costText = planTotal != null ? money(planTotal) : (sess.budgetYuan ? `预算¥${sess.budgetYuan}` : '');

    const lastMsg = (sess.chatHistory || []).slice(-1)[0];
    const lastSnippet = lastMsg ? (lastMsg.role === 'user' ? '我: ' : 'AI: ') + (lastMsg.content || '').replace(/\s+/g, ' ').slice(0, 24) : '等待提问';

    return `
      <div class="history-item-card ${isActive ? 'is-active' : ''}" data-id="${escapeHtml(sess.id)}">
        <div class="history-item-top">
          <div class="history-item-title">${escapeHtml(sess.title || '点餐对话')}</div>
          <button type="button" class="history-item-del" data-del-id="${escapeHtml(sess.id)}" title="删除此记录">删除</button>
        </div>
        <div class="history-item-snippet">${escapeHtml(lastSnippet)}</div>
        <div class="history-item-meta">
          ${isActive ? '<span class="history-active-pill">当前对话</span>' : ''}
          ${sess.partySize ? `<span class="history-meta-pill">${escapeHtml(sess.partySize)}人</span>` : ''}
          ${costText ? `<span class="history-meta-pill">${escapeHtml(costText)}</span>` : ''}
          ${itemsCount ? `<span class="history-meta-pill">${itemsCount}道菜</span>` : ''}
        </div>
        <div class="history-item-time">${formatSessionTime(sess.updatedAt || sess.createdAt)} · ${msgCount}条对话</div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.history-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id) switchSession(id);
    });
  });

  container.querySelectorAll('.history-item-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.delId;
      if (id) deleteSession(id, e);
    });
  });
}
function addChatMessage(role, text, meta = '') {
  const box = $('chatMessages');
  if (box) {
    const item = document.createElement('div');
    item.className = `chat-message ${role}`;
    const bodyHtml = role === 'assistant' ? formatAssistantReply(text) : escapeHtml(text).replace(/\n/g, '<br>');
    item.innerHTML = `<div class="chat-avatar">${role === 'assistant' ? 'AI' : '我'}</div><div class="chat-bubble">${bodyHtml} ${meta ? `<small class="chat-meta">${escapeHtml(meta)}</small>` : ''}</div>`;
    box.appendChild(item);
    box.scrollTop = box.scrollHeight;
    if (role === 'assistant') {
      item.querySelectorAll('.ai-list-item[data-dish]').forEach(dishItem => {
        dishItem.addEventListener('click', () => {
          const dishName = dishItem.dataset.dish;
          if (dishName && $('prompt')) {
            $('prompt').value = `我想了解或加一份【${dishName}】`;
            $('prompt').focus();
          }
        });
      });
    }
  }
  if (text && (role === 'user' || role === 'assistant')) {
    if (!state.chatHistory) state.chatHistory = [];
    state.chatHistory.push({ role, content: text, meta });
    persistCurrentSession();
  }
}

function setChatTyping(show) { const box = $('chatMessages'); if (!box) return; const old = box.querySelector('.chat-typing'); if (old) old.remove(); if (show) { const item = document.createElement('div'); item.className = 'chat-message assistant chat-typing'; item.innerHTML = '<div class="chat-avatar">AI</div><div class="chat-bubble"><i></i><i></i><i></i> 正在读取真实菜单并计算方案…</div>'; box.appendChild(item); box.scrollTop = box.scrollHeight; } }
function api(path, options = {}) { return fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options }).then(async response => { const body = await response.json().catch(() => ({})); if (!response.ok) { const detail = body.msg || body.message || body.error || `HTTP ${response.status}`; const code = body.error_code ? ` [${body.error_code}]` : ''; throw new Error(`${detail}${code}`); } if (body.isError) throw new Error(body.msg || body.message || 'MCP 业务调用失败'); if (body.code !== undefined && body.code !== 0 && body.code !== 200) throw new Error(body.msg || body.message || `业务错误码 [${body.code}]`); return body; }); }
async function webMcp(toolName, args) { if (state.tools.length && !state.tools.some(tool => (tool.name || tool.tool_name || tool.id) === toolName)) throw new Error(`工具未在最新清单中发现：${toolName}`); return api(`${WEBMCP_TOOLS_PATH}/${encodeURIComponent(toolName)}`, { method: 'POST', body: JSON.stringify({ arguments: args }) }); }
function selectedStrategy() { return state.strategy; }
function applyPromptConstraints(text) {
  const value = String(text || '');
  const people = value.match(/(?:我们|共|一共)?\s*(\d{1,2})\s*(?:个人|人|位)/);
  const budget = value.match(/(?:预算|花费|不超过|控制在)\s*[¥￥]?\s*(\d+(?:\.\d+)?)\s*(?:元|块)?/);
  if (people) { if ($('dinerCount')) $('dinerCount').value = Math.max(1, Math.min(20, Number(people[1]))); if ($('memberCards')) renderMembers(); state.partySize = Math.max(1, Math.min(20, Number(people[1]))); }
  if (budget) { if ($('budgetYuan')) $('budgetYuan').value = Math.max(0, Number(budget[1])); state.budgetYuan = Math.max(0, Number(budget[1])); }
  if (/预算优先|省钱|便宜|省着吃/.test(value)) state.strategy = 'budget_first';
  else if (/吃饱|管饱|份量/.test(value)) state.strategy = 'satiety_first';
  else if (/高蛋白|健身/.test(value)) state.strategy = 'high_protein';
  document.querySelectorAll('.strategy').forEach(button => button.classList.toggle('active', button.dataset.value === state.strategy));
  const noSpicy = (value.match(/不吃辣|不能吃辣|免辣/g) || []).length;
  if (noSpicy > 0) { state.members.slice(0, Math.min(noSpicy, state.members.length)).forEach(member => { if (!member.attributes.includes('non_spicy')) member.attributes.push('non_spicy'); member.restrictions = ['不吃辣']; }); renderMembers(); }
}
function memberPayload() { return state.members.map(member => ({ member_id: member.member_id, member_name: member.name, name: member.name, attributes: member.attributes, restrictions: member.restrictions, preferences: member.preferences, goals: member.goals, portion_target: member.portion_target, spicy_level: member.attributes.includes('non_spicy') ? 0 : 2, non_spicy: member.attributes.includes('non_spicy') })); }
function renderMembers() { const count = Math.max(1, Math.min(20, Number($('dinerCount')?.value || state.partySize) || 1)); const old = state.members; state.members = Array.from({ length: count }, (_, index) => old[index] || defaultMember(index)); if ($('memberHint')) $('memberHint').textContent = `${count} 位成员`; if ($('memberCards')) $('memberCards').innerHTML = state.members.map((member, index) => { const selected = new Set(member.attributes); const groups = [...new Set(MEMBER_ATTRIBUTES.map(item => item.group))]; const summary = MEMBER_ATTRIBUTES.filter(item => selected.has(item.key)).map(item => item.label).join(' · ') || '点击标签添加属性'; return `<article class="member-card ${selected.has('non_spicy') ? 'nonspicy' : ''}"><div class="member-card-head"><b>${escapeHtml(member.name)}</b><span>P${index + 1}</span></div>${groups.map(group => `<div class="attribute-group"><span class="attribute-group-label">${group}</span><div class="attribute-list">${MEMBER_ATTRIBUTES.filter(item => item.group === group).map(item => `<button type="button" class="attribute-chip ${selected.has(item.key) ? `selected ${item.type}` : ''}" data-index="${index}" data-key="${item.key}">${item.label}</button>`).join('')}</div></div>`).join('')}<small class="member-summary">${escapeHtml(summary)}</small></article>`; }).join(''); document.querySelectorAll('.attribute-chip').forEach(button => button.addEventListener('click', () => toggleMember(Number(button.dataset.index), button.dataset.key))); }
function toggleMember(index, key) { const member = state.members[index]; const attr = MEMBER_ATTRIBUTES.find(item => item.key === key); if (!member || !attr) return; member.attributes = member.attributes.includes(key) ? member.attributes.filter(item => item !== key) : [...member.attributes, key]; member.restrictions = member.attributes.filter(item => MEMBER_ATTRIBUTES.find(x => x.key === item)?.type === 'restriction').map(item => MEMBER_ATTRIBUTES.find(x => x.key === item).label); member.preferences = member.attributes.filter(item => MEMBER_ATTRIBUTES.find(x => x.key === item)?.type === 'preference'); member.goals = member.attributes.filter(item => MEMBER_ATTRIBUTES.find(x => x.key === item)?.type === 'goal'); member.portion_target = member.attributes.includes('big_appetite') ? 'large' : member.attributes.includes('small_appetite') ? 'small' : null; renderMembers(); }
function renderResult(html, status = '已返回真实数据') { if ($('resultContent')) $('resultContent').innerHTML = `<div class="result-content">${html}</div>`; if ($('resultStatus')) { $('resultStatus').textContent = status; $('resultStatus').className = 'badge ' + (status.includes('失败') || status.includes('需要') ? 'warning' : 'mint'); } }
function renderError(error) { renderResult(`<div class="server-alert"><strong>接口返回：</strong><br>${escapeHtml(error.message || error)}<br><small>页面不会使用本地示例菜单或报价。请检查网关、shop_id=3 和 MCP 服务状态。</small></div>`, '需要处理'); if ($('draftBtn')) $('draftBtn').disabled = true; if ($('submitBtn')) $('submitBtn').disabled = true; setConnection('MCP 调用失败'); }
function normalizeMenu(body) { const d = businessOf(body); return d?.snapshot || d?.menu || d; }
function renderMenu(menu) { const items = Array.isArray(menu) ? menu : menu?.items || []; if (!items.length) return '<div class="server-alert">已连接，但服务端未返回可展示的真实在售菜品。未生成报价。</div>'; return `<div class="plan-summary"><div class="metric"><b>${items.length}</b><span>真实菜品</span></div><div class="metric"><b>${escapeHtml(menu?.menu_version || '—')}</b><span>菜单版本</span></div><div class="metric"><b>已读取</b><span>来源：#3 门店</span></div></div>${items.filter(item => item.active !== false && item.sold_out !== true).slice(0, 8).map(item => `<div class="line-item"><div><b>${escapeHtml(item.name || item.dish_name || '未命名菜品')}</b><small>SKU ${escapeHtml(item.dish_id ?? item.id ?? '—')} · ${escapeHtml(item.spice_options?.join(' / ') || '以接口返回为准')}</small></div><strong>${money(item.price_fen ?? item.price_minor)}</strong></div>`).join('')}`; }
function renderPlan(body) {
  const payload = businessOf(body);
  // 兼容不同网关：result.plan、result.content[*].text、data.result.plan、
  // 以及后端直接返回 plan 的几种结构。
  const p = payload?.plan || payload?.adjusted_plan || payload?.result?.plan || payload?.result?.adjusted_plan || payload;
  state.plan = p;
  const items = p?.line_items || p?.items || [];
  const total = p?.price_total_fen ?? p?.total_price_fen ?? p?.total_fen;
  const budget = Math.round(Number(state.budgetYuan ?? $('budgetYuan')?.value ?? (p?.remaining_budget_fen != null && total != null ? (Number(p.remaining_budget_fen) + Number(total)) / 100 : 0)) * 100);
  const remainingBudget = p?.remaining_budget_fen != null ? money(p.remaining_budget_fen) : (budget > 0 && total != null ? money(budget - Number(total)) : '—');
  const lines = Array.isArray(items) ? items.map(item => `<div class="line-item"><div><b>${escapeHtml(item.name || item.dish_name || `菜品 ${item.dish_id ?? ''}`)}</b><small>数量 ${escapeHtml(item.quantity ?? item.count ?? 1)} · ${escapeHtml(item.spice_level || item.variant_name || '按服务端返回')}</small></div><strong>${money(item.subtotal_fen ?? item.total_price_fen ?? item.price_fen)}</strong></div>`).join('') : '';
  const conflict = p?.feasible === false ? `<div class="server-alert">服务端判定当前约束不可行：${escapeHtml(p.reason || p.message || p.conflict_details?.message || '未返回具体原因')}。请调整非安全性偏好或预算。</div>` : '';
  const noPlan = !p?.plan_id && !p?.id && !Array.isArray(items);
  const hardSafe = p?.allocation_summary?.non_spicy_guaranteed === true;
  const actions = `<div class="plan-actions"><button type="button" class="secondary-action" id="adjustPlanBtn">调整方案</button><button type="button" class="secondary-action" id="validatePlanBtn" disabled>校验订单草稿</button><button type="button" class="primary-action compact" id="confirmPlanBtn" disabled>确认下单</button></div><small class="action-note">预测试环境暂不下单 · 需完成最新草稿校验后才能确认</small>`;
  persistCurrentSession(); renderResult(`<div class="plan-summary"><div class="metric"><b>${money(total)}</b><span>方案总价</span></div><div class="metric"><b>${remainingBudget}</b><span>预算剩余</span></div><div class="metric"><b>${escapeHtml(p?.menu_version || businessOf(state.menu)?.menu_version || '—')}</b><span>菜单版本</span></div></div>${conflict || lines || '<div class="server-alert">服务端已返回方案，但当前响应未包含可展示明细，请查看 MCP 调试面板。</div>'}<div class="constraint-chip ${hardSafe ? 'safe' : ''}">${hardSafe ? '✓ 不吃辣硬约束已满足' : '以服务端返回的硬约束结果为准'}</div><div class="safe-note"><span>✓</span>硬约束由后端求解，营养数据以已核验字段为准</div>${actions}`, p?.feasible === false ? '当前无解' : noPlan ? '方案结构异常' : '方案已返回');
  $('draftBtn').disabled = !(p?.plan_id || p?.id); $('submitBtn').disabled = !(p?.plan_id || p?.id); $('adjustPlanBtn')?.addEventListener('click', () => { $('prompt').focus(); addChatMessage('assistant', '你可以直接告诉我想怎么调整，例如“少20元”“不要牛肉”或“再加两串鸡翅”。'); }); $('validatePlanBtn')?.addEventListener('click', validateDraft); $('confirmPlanBtn')?.addEventListener('click', submitOrder);
}
async function discoverMcpTools() { const start = performance.now(); $('discoverMcpBtn').disabled = true; $('mcpStatus').textContent = '检测中…'; try { const response = await fetch(`${API_BASE}${WEBMCP_TOOLS_PATH}`, { headers: { Accept: 'application/json' } }); const body = await response.json().catch(() => ({})); const d = businessOf(body); const tools = Array.isArray(d) ? d : d?.tools || body?.tools || []; state.tools = tools; $('mcpLatency').textContent = `耗时 ${Math.round(performance.now() - start)} ms`; $('mcpHttpStatus').textContent = `HTTP ${response.status}`; if (!response.ok) throw new Error(body.message || body.msg || `HTTP ${response.status}`); $('mcpToolSelect').innerHTML = '<option value="">请选择工具</option>' + tools.map(tool => `<option value="${escapeHtml(tool.name || tool.tool_name || tool.id)}">${escapeHtml(tool.name || tool.tool_name || tool.id)}</option>`).join(''); $('mcpToolSelect').disabled = !tools.length; $('callMcpBtn').disabled = !tools.length; $('mcpStatus').textContent = tools.length ? `可用 · ${tools.length} 个工具` : '未返回工具'; $('mcpStatus').className = `badge ${tools.length ? 'mint' : 'warning'}`; $('mcpOutput').textContent = rawJson(body); setConnection(tools.length ? 'MCP 已接入' : 'MCP 未返回工具', Boolean(tools.length)); } catch (error) { $('mcpStatus').textContent = '不可用'; $('mcpStatus').className = 'badge warning'; $('mcpOutput').textContent = error.stack || error.message; setConnection('MCP 不可用'); } finally { $('discoverMcpBtn').disabled = false; } }
async function callSelectedTool() { const toolName = $('mcpToolSelect').value; if (!toolName) return; let args; try { args = JSON.parse($('mcpArguments').value || '{}'); } catch (error) { $('mcpOutput').textContent = `JSON 无法解析：${error.message}`; return; } $('callMcpBtn').disabled = true; const start = performance.now(); try { const response = await fetch(`${API_BASE}${WEBMCP_TOOLS_PATH}/${encodeURIComponent(toolName)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ arguments: args }) }); const body = await response.json().catch(() => ({})); $('mcpLatency').textContent = `耗时 ${Math.round(performance.now() - start)} ms`; $('mcpHttpStatus').textContent = `HTTP ${response.status}`; $('mcpOutput').textContent = rawJson(body); $('mcpStatus').textContent = response.ok ? '调用成功' : '调用失败'; $('mcpStatus').className = `badge ${response.ok ? 'mint' : 'warning'}`; } catch (error) { $('mcpOutput').textContent = error.message; $('mcpStatus').textContent = '调用异常'; $('mcpStatus').className = 'badge warning'; } finally { $('callMcpBtn').disabled = false; } }
async function loadMenu() { const body = await webMcp('get_store_menu', { shop_id: SHOP_ID }); state.menu = body; const menu = normalizeMenu(body); if ($('mcpOutput')) $('mcpOutput').textContent = rawJson(body); return menu; }
async function callBackendChat(userPrompt) {
  const prompt = userPrompt || $('prompt')?.value?.trim() || '';
  if (!prompt && !state.chatHistory.length) return null;
  try {
    const historySlice = state.chatHistory.slice(-10).map(item => ({ role: item.role === 'assistant' ? 'assistant' : 'user', content: item.content }));
    const systemPrompt = '你是【串局·深圳烧烤】（试点门店ID: 3）的官方AI智能点餐管家。当前门店真实在售菜品：油边王(15元)、羊肉大串(15元)、东北肉肠(15元)、吊龙牛肉(15元)、销魂鸡爪(15元)、三层五花(15元)、秘制全翅(18元)、澳椒牛肉(20元)、西葫芦瓜(5元)、香辣鸡胗(15元不可免辣)。严禁推荐菜单外菜品，严禁虚构价格；当有顾客不吃辣时必须保证免辣菜品。';
    const messages = [{ role: 'system', content: systemPrompt }, ...historySlice];
    const response = await api('/mcp/v1/chat', { method: 'POST', body: JSON.stringify({ shop_id: SHOP_ID, prompt: prompt || (historySlice[historySlice.length - 1]?.content || ''), messages }) });
    return businessOf(response);
  } catch (error) {
    if (String(error.message || '').includes('LLM_INVOCATION_ERROR')) throw new Error('后端大模型调用失败：请检查服务端 LLM_API_URL 配置，当前接口返回的 URL 含有中文引号或格式不合法。');
    throw error;
  }
}
function declaredToolProperties(toolName) {
  const tool = state.tools.find(item => (item.name || item.tool_name || item.id) === toolName);
  return tool?.inputSchema?.properties || null;
}
function buildSessionArguments() {
  const allArgs = {
    shop_id: SHOP_ID,
    table_number: $('tableNo')?.value || 'A01',
    party_size: Number(state.partySize || $('dinerCount')?.value || 2),
    budget_fen: Math.round(Number(state.budgetYuan ?? $('budgetYuan')?.value ?? 0) * 100),
    strategy: selectedStrategy(),
    members: memberPayload()
  };
  const properties = declaredToolProperties('create_dining_session');
  // 后端当前部署的 Schema 只声明 shop_id/party_size/budget_fen。
  // 未声明字段不得发送，否则旧版服务会直接返回 500。
  if (!properties) return { shop_id: SHOP_ID, party_size: allArgs.party_size, budget_fen: allArgs.budget_fen };
  return Object.fromEntries(Object.entries(allArgs).filter(([key]) => Object.prototype.hasOwnProperty.call(properties, key)));
}
function formatPlanChatMessage(plan) {
  if (!plan || plan.feasible === false) {
    return plan?.reason || '根据当前人数、预算和安全约束，暂时没有可行方案。你可以提高预算或放宽非安全性偏好。';
  }
  const items = Array.isArray(plan.line_items) ? plan.line_items : [];
  const total = money(plan.price_total_fen ?? plan.total_price_fen);
  if (!items.length) {
    return `方案已生成：${total}。`;
  }
  let msg = `方案已生成：总计 **${total}**（共 ${items.length} 类菜品）：\n\n`;
  items.forEach((item, idx) => {
    const name = item.name || item.dish_name || `菜品 ${item.dish_id}`;
    const qty = `${item.quantity ?? item.count ?? 1}${item.unit || '串'}`;
    const spice = item.spice_level ? `(${item.spice_level})` : '';
    const itemTotal = money(item.subtotal_fen ?? item.total_price_fen ?? item.price_fen);
    msg += `${idx + 1}. ${name} × ${qty} ${spice} — ${itemTotal}\n`;
  });
  if (plan.remaining_budget_fen != null) {
    msg += `\n预算结余：${money(plan.remaining_budget_fen)}`;
  }
  if (plan.allocation_summary?.non_spicy_guaranteed) {
    msg += ` · ✓ 已满足不吃辣硬约束`;
  }
  return msg;
}
async function runOrderRequest(userPrompt, fromChat = true) {
  if (/^(?:确认下单|下单|提交订单|买单)$/.test(userPrompt.trim())) {
    if (fromChat) addChatMessage('user', userPrompt);
    addChatMessage('assistant', '当前为预测试模式（安全沙箱），只演示真实菜单读取、配餐与校价流程，默认禁止正式下单。你可以核对上方方案明细，或告诉我如何调整菜品。', '预测试安全模式');
    return;
  }
  const isNewPlanRequest = /(?:重新|新单|清空|重来|换一桌|重新配)/.test(userPrompt);
  if (isNewPlanRequest) {
    state.plan = null;
    state.session = null;
    state.draft = null;
    state.budgetYuan = 0;
    state.partySize = 2;
  }
  applyPromptConstraints(userPrompt);
  if (fromChat) addChatMessage('user', userPrompt);
  setChatTyping(true);
  try {
    if ($('solveBtn')) $('solveBtn').disabled = true;
    if ($('sendBtn')) $('sendBtn').disabled = true;
    setConnection('正在发现 MCP 工具');
    if (!state.tools.length) await discoverMcpTools();
    setConnection('后端 AI 正在解析');
    const chat = await callBackendChat(userPrompt);
    const chatText = chat?.answer || chat?.response || chat?.message || chat?.reply || chat?.content?.[0]?.text || '';
    if (chatText && fromChat) addChatMessage('assistant', chatText, '已结合上下文解析');

    const existingPlanId = state.plan?.plan_id || state.plan?.id;
    let planUpdated = false;

    if (existingPlanId && !isNewPlanRequest) {
      try {
        setConnection('正在增量调整配餐方案');
        const adjustBody = await webMcp('adjust_meal_plan', {
          plan_id: String(existingPlanId),
          patch_text: userPrompt
        });
        const adjustedBusiness = businessOf(adjustBody);
        if (adjustedBusiness?.adjusted_plan || adjustedBusiness?.plan || adjustedBusiness?.status === 'FEASIBLE' || adjustedBusiness?.status === 'INFEASIBLE') {
          renderPlan(adjustBody);
          planUpdated = true;
          const plan = state.plan || {};
          if (fromChat) {
            addChatMessage('assistant', formatPlanChatMessage(plan), '增量调整 · 服务端求解');
          }
        }
      } catch (err) {
        console.warn('adjust_meal_plan 调用未完成，降级重新规划:', err);
      }
    }

    if (!planUpdated) {
      setConnection('正在读取 #3 真实菜单');
      const menu = await loadMenu();
      if ($('menuVersion')) $('menuVersion').textContent = menu?.menu_version || '已读取';
      const sessionBody = await webMcp('create_dining_session', buildSessionArguments());
      state.session = businessOf(sessionBody);
      const sid = getOpaqueId(sessionBody, 'session_id');
      if (!sid) throw new Error('创建会话成功，但未返回 session_id');
      setConnection('正在计算确定性方案');
      const planArgs = { session_id: sid, strategy: selectedStrategy() };
      const solveProps = declaredToolProperties('solve_meal_plan');
      const supportedPlanArgs = solveProps ? Object.fromEntries(Object.entries(planArgs).filter(([key]) => Object.prototype.hasOwnProperty.call(solveProps, key))) : planArgs;
      const planBody = await webMcp('solve_meal_plan', supportedPlanArgs);
      renderPlan(planBody);
      const plan = state.plan || {};
      if (fromChat) addChatMessage('assistant', formatPlanChatMessage(plan), '真实菜单 · 服务端求解');
    }

    setConnection('后端 AI / MCP 已连接', true);
  } catch (error) {
    renderError(error);
    if (fromChat) addChatMessage('assistant', `这次没有完成配餐：${error.message || error}`, '请检查下方错误详情');
  } finally {
    setChatTyping(false);
    if ($('solveBtn')) $('solveBtn').disabled = false;
    if ($('sendBtn')) $('sendBtn').disabled = false;
  }
}
async function solve() { const prompt = $('advancedPrompt')?.value.trim() || $('prompt').value.trim(); if (!prompt) { addChatMessage('assistant', '请先输入人数、预算和口味/忌口需求。'); return; } runOrderRequest(prompt, true); }
function sendChat() { const input = $('prompt')?.value?.trim() || ''; if (!input) { addChatMessage('assistant', '请先输入你的用餐需求，例如：3个人，预算200元，1人不吃辣。'); return; } if ($('sendBtn')) $('sendBtn').disabled = true; if ($('prompt')) $('prompt').value = ''; runOrderRequest(input, true).catch(error => { setChatTyping(false); renderError(error); if ($('sendBtn')) $('sendBtn').disabled = false; }); }
async function validateDraft() { try { const draftId = getOpaqueId(state.draft, 'draft_id'); if (!draftId) throw new Error('当前 MCP 清单未提供可用 draft_id，无法安全进入订单校验。'); const body = await webMcp('validate_order_draft', { draft_id: draftId }); state.draft = businessOf(body); const status = state.draft?.validation_status || state.draft?.status; renderResult(`<div class="server-alert">草稿校验状态：<strong>${escapeHtml(status || '以服务端返回为准')}</strong><br>请核对最新价格、数量、口味和费用。预测试环境默认不提交真实订单。</div>`, '草稿已校验'); $('submitBtn').disabled = true; } catch (error) { renderError(error); } }
async function submitOrder() { renderError(new Error('当前为预测试环境，默认禁止正式下单。')); }
function init() {
  $('historyToggleBtn')?.addEventListener('click', openHistoryDrawer);
  $('historyCloseBtn')?.addEventListener('click', closeHistoryDrawer);
  $('historyDrawerBackdrop')?.addEventListener('click', closeHistoryDrawer);
  $('newChatBtn')?.addEventListener('click', createNewSession);
  $('drawerNewChatBtn')?.addEventListener('click', createNewSession);
  $('clearAllHistoryBtn')?.addEventListener('click', () => {
    if (confirm('确定要清空全部历史对话吗？')) {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      } catch (_) {}
      createNewSession();
    }
  });

  const sessions = loadSessions();
  const currentId = getActiveSessionId();
  if (sessions.length > 0) {
    const active = sessions.find(s => s.id === currentId) || sessions[0];
    switchSession(active.id);
  } else {
    createNewSession();
  }
  updateHistoryBadge();

  if ($('memberCards')) renderMembers();
  if ($('dinerCount')) $('dinerCount').addEventListener('input', renderMembers);
  if ($('solveBtn')) $('solveBtn').addEventListener('click', solve);
  if ($('sendBtn')) $('sendBtn').addEventListener('click', sendChat);
  if ($('prompt')) $('prompt').addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendChat(); } });
  document.querySelectorAll('.chat-quick').forEach(button => button.addEventListener('click', () => { $('prompt').value = button.dataset.prompt || ''; sendChat(); }));
  if ($('advancedToggle') && $('advancedSettings')) $('advancedToggle').addEventListener('click', () => $('advancedSettings').classList.toggle('collapsed'));
  if ($('draftBtn')) $('draftBtn').addEventListener('click', validateDraft);
  if ($('submitBtn')) $('submitBtn').addEventListener('click', submitOrder);
  if ($('discoverMcpBtn')) $('discoverMcpBtn').addEventListener('click', discoverMcpTools);
  if ($('callMcpBtn')) $('callMcpBtn').addEventListener('click', callSelectedTool);
  if ($('debugToggle') && $('mcpDebugPanel')) $('debugToggle').addEventListener('click', () => $('mcpDebugPanel').classList.toggle('collapsed'));
  if ($('mcpToolSelect')) $('mcpToolSelect').addEventListener('change', () => { if ($('mcpToolSelect').value === 'get_store_menu' && $('mcpArguments')) $('mcpArguments').value = rawJson({ shop_id: SHOP_ID }); });
  document.querySelectorAll('.strategy').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.strategy').forEach(item => item.classList.remove('active')); button.classList.add('active'); state.strategy = button.dataset.value; }));
}
init();
