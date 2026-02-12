/* ═══════════════════════════════════════════════════
   AI CHAT ASSISTANT — Dropdown from Topbar Icon
   Pre-loaded mockup conversation + live interaction
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  var mockMessages = [
    {
      type: 'ai',
      text: 'I\'ve analyzed <strong>WBMSCL/NIT-036/2023</strong> \u2014 62 pages, 9 equipment categories. Key alerts:',
      source: null
    },
    {
      type: 'ai',
      text: '<span style="color:var(--rose)">\u25CF</span> Deadline: <strong>21 Feb 2023, 5:00 PM</strong><br>' +
        '<span style="color:var(--orange)">\u25CF</span> 11 of 15 documents still pending<br>' +
        '<span style="color:var(--blue)">\u25CF</span> \u20B92L EMD required online before bid',
      source: 'Section I, Important Dates'
    },
    { type: 'user', text: 'Which items should we focus on?' },
    {
      type: 'ai',
      text: '<strong>Top 3 for Appasamy:</strong><br>' +
        '<span style="color:var(--green)">\u25CF</span> <strong>Slit Lamp</strong> (42 units) \u2014 core OEM strength<br>' +
        '<span style="color:var(--green)">\u25CF</span> <strong>Phaco Machine</strong> (21 units) \u2014 high margin<br>' +
        '<span style="color:var(--green)">\u25CF</span> <strong>Indirect Ophthalmoscope</strong> (10 units) \u2014 niche edge<br><br>' +
        'Skip commodity items. EMD is uniform \u20B92L \u2014 per-item bidding possible.',
      source: 'Section IV, Schedule'
    }
  ];

  function injectChat() {
    var panel = document.createElement('div');
    panel.id = 'chatDropdown';
    panel.className = 'chat-dd';
    panel.innerHTML =
      '<div class="chat-dd-head">' +
        '<div class="chat-dd-head-l">' +
          '<div class="chat-dd-av"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>' +
          '<div class="chat-dd-title">AI Tender Assistant</div>' +
          '<span class="chat-dd-live"><span class="chat-dd-dot"></span>Live</span>' +
        '</div>' +
        '<button class="chat-dd-close" onclick="closeChat()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '</div>' +
      '<div class="chat-dd-body" id="chatMessages"></div>' +
      '<div class="chat-dd-suggestions" id="chatSuggestions">' +
        '<button class="chat-dd-chip" onclick="askSuggestion(this)">Eligibility criteria</button>' +
        '<button class="chat-dd-chip" onclick="askSuggestion(this)">Payment terms</button>' +
        '<button class="chat-dd-chip" onclick="askSuggestion(this)">Penalty clauses</button>' +
        '<button class="chat-dd-chip" onclick="askSuggestion(this)">Missing documents</button>' +
      '</div>' +
      '<div class="chat-dd-input">' +
        '<textarea id="chatInput" class="chat-dd-textarea" placeholder="Ask about the tender\u2026" rows="1" onkeydown="chatKeyDown(event)" oninput="chatAutoGrow(this)"></textarea>' +
        '<button id="chatSend" class="chat-dd-send" onclick="sendChat()" disabled><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
      '</div>';

    var main = document.querySelector('.main');
    if (!main) return;
    main.appendChild(panel);

    var bd = document.createElement('div');
    bd.id = 'chatBackdrop';
    bd.className = 'chat-dd-backdrop';
    bd.onclick = function () { window.closeChat(); };
    main.appendChild(bd);

    document.getElementById('chatInput').addEventListener('input', function () {
      document.getElementById('chatSend').disabled = !this.value.trim();
    });

    mockMessages.forEach(function (m) {
      addMsg(document.getElementById('chatMessages'), m.type, m.text, m.source, false);
    });
  }

  var isOpen = false;
  window.openChat = function () {
    isOpen = true;
    var d = document.getElementById('chatDropdown'), b = document.getElementById('chatBackdrop');
    if (d) d.classList.add('open');
    if (b) b.classList.add('open');
    setTimeout(function () {
      var i = document.getElementById('chatInput'), c = document.getElementById('chatMessages');
      if (i) i.focus();
      if (c) c.scrollTop = c.scrollHeight;
    }, 300);
  };

  window.closeChat = function () {
    isOpen = false;
    var d = document.getElementById('chatDropdown'), b = document.getElementById('chatBackdrop');
    if (d) d.classList.remove('open');
    if (b) b.classList.remove('open');
  };

  window.chatAutoGrow = function (el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  };

  window.chatKeyDown = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.sendChat(); }
  };

  window.askSuggestion = function (btn) {
    document.getElementById('chatInput').value = btn.textContent;
    document.getElementById('chatSend').disabled = false;
    window.sendChat();
  };

  window.sendChat = function () {
    var inp = document.getElementById('chatInput'), text = inp.value.trim();
    if (!text) return;
    var sug = document.getElementById('chatSuggestions');
    if (sug) sug.style.display = 'none';
    var c = document.getElementById('chatMessages');
    addMsg(c, 'user', text, null, true);
    inp.value = ''; inp.style.height = 'auto';
    document.getElementById('chatSend').disabled = true;
    showTyping(c);
    setTimeout(function () {
      hideTyping();
      var r = getResponse(text);
      addMsg(c, 'ai', r.text, r.source, true);
    }, 600 + Math.random() * 900);
  };

  function addMsg(c, type, html, source, anim) {
    var d = document.createElement('div');
    d.className = 'chat-dd-msg ' + type + (anim ? ' anim' : '');
    var src = source ? '<div class="chat-dd-src"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> ' + source + '</div>' : '';
    d.innerHTML = '<div class="chat-dd-msg-av ' + type + '">' + (type === 'ai' ? 'AI' : 'You') + '</div><div class="chat-dd-bubble ' + type + '">' + html + src + '</div>';
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
  }

  function showTyping(c) {
    var d = document.createElement('div');
    d.className = 'chat-dd-msg ai anim'; d.id = 'typingInd';
    d.innerHTML = '<div class="chat-dd-msg-av ai">AI</div><div class="chat-dd-typing"><span></span><span></span><span></span></div>';
    c.appendChild(d); c.scrollTop = c.scrollHeight;
  }

  function hideTyping() { var e = document.getElementById('typingInd'); if (e) e.remove(); }

  function getResponse(q) {
    var l = q.toLowerCase();
    if (l.includes('eligib') || l.includes('who can') || l.includes('qualify') || l.includes('criteria'))
      return { text: '<strong>Eligibility:</strong><br>\u2022 OEM, subsidiaries, or authorized dealers<br>\u2022 Min \u20B93.5 Cr avg turnover (3 FY)<br>\u2022 \u20B92L EMD online<br>\u2022 Not blacklisted in last 5 yrs<br>\u2022 CE (4-digit) / FDA / BIS required', source: 'Section I, Clause 4, 7, 10' };
    if (l.includes('emd') || l.includes('payment') || l.includes('financial') || l.includes('earnest'))
      return { text: '<strong>Payment:</strong><br>\u2022 EMD: \u20B92,00,000 online<br>\u2022 80% after delivery + CRC<br>\u2022 20% after install + SIC<br>\u2022 Perf. Security: 3% of bid value<br>\u2022 Base price is DDP, GST extra', source: 'Section I, Clause 3, 5(b), 6' };
    if (l.includes('risk') || l.includes('concern') || l.includes('challenge'))
      return { text: '<strong style="color:var(--rose)">High:</strong> 50-day delivery, 97% uptime<br><strong style="color:var(--orange)">Medium:</strong> Functional demo, 3 service centers, 10-yr spares<br><strong style="color:var(--green)">Low:</strong> \u20B9500/day penalty, 0.5%/wk LD (5% cap)', source: 'Section I, Clause 5(a), 8, 9' };
    if (l.includes('penalt') || l.includes('blacklist') || l.includes('fine') || l.includes('liquidated'))
      return { text: '<strong>Penalties:</strong><br>\u2022 LD: 0.5%/week, max 5%<br>\u2022 Downtime >72hrs: \u20B9500/day/machine<br>\u2022 Must provide standby after 72hrs<br><br><strong>Blacklisting (5 yrs):</strong><br>\u2022 Misleading info \u2192 EMD forfeiture<br>\u2022 Refurbished goods \u2192 FIR + termination', source: 'Section I, 8, 9; Section II, 14-16' };
    if (l.includes('missing') || l.includes('document') || l.includes('pending') || l.includes('checklist')) {
      var d = document.querySelectorAll('.cx.done').length, t = document.querySelectorAll('.cx').length;
      return { text: '<strong>' + d + '/' + t + ' ready</strong><br><span style="color:var(--rose)">\u25CF Urgent:</span> ITR, Tender Form 1, BOQ<br><span style="color:var(--orange)">\u25CF Action:</span> Mfr Auth, CA Turnover, CE/FDA<br><span style="color:var(--blue)">\u25CF AI auto-gen:</span> Form 1, 4, 6, 7, 10 (~2 min)', source: 'Section V, Form 2' };
    }
    if (l.includes('spec') || l.includes('technical') || l.includes('slit') || l.includes('phaco'))
      return { text: '<strong>Specs:</strong><br>\u2022 <strong>Slit Lamp:</strong> 5-step 6x\u201340x, tonometer 10-80mmHg<br>\u2022 <strong>Phaco:</strong> Peristaltic, 500mmHg, 28KHz+<br>\u2022 <strong>Specular:</strong> 1000\u00D7750\u03BC, CMOS dual<br>\u2022 <strong>Indirect:</strong> Wireless LED, PD 55-75mm<br>All need CE/FDA/BIS.', source: 'Section IV, Technical Specs' };
    if (l.includes('deadline') || l.includes('date') || l.includes('timeline') || l.includes('when'))
      return { text: '<strong>Dates:</strong><br>\u2022 NIT: 01 Feb 2023<br>\u2022 Pre-bid: 08 Feb, 2:30 PM<br>\u2022 Opens: 13 Feb, 12 noon<br>\u2022 <strong style="color:var(--rose)">Deadline: 21 Feb, 5 PM</strong><br>\u2022 Tech opening: 21 Feb, 5:30 PM<br>\u2022 Delivery: 50 days from AOC', source: 'Section I, Dates Table' };
    if (l.includes('warranty') || l.includes('service') || l.includes('cmc') || l.includes('maintenance') || l.includes('uptime'))
      return { text: '<strong>Service:</strong><br>\u2022 Warranty: 2 yrs comprehensive<br>\u2022 Uptime: 97%, response \u22646 hrs<br>\u2022 PMS: 3/year min<br>\u2022 CMC Yr 3-7: 3%\u20134% quarterly<br>\u2022 3 service centers in WB<br>\u2022 10-yr spare availability', source: 'Section I, Clause 8; SCC-3' };
    if (l.includes('which item') || l.includes('bid on') || l.includes('strateg') || l.includes('recommend') || l.includes('appasamy'))
      return { text: '<span style="color:var(--green)">\u25CF Focus:</span> Slit Lamp (42u), Phaco (21u), Indirect Ophthalmoscope (10u)<br><span style="color:var(--orange)">\u25CF Consider:</span> Specular Microscope (4u), Direct Ophthalmoscope (185u)<br><span style="color:var(--text-400)">\u25CF Skip:</span> Trial Box, Torch, Keratoplasty<br><br>EMD uniform \u20B92L \u2014 per-item bidding likely.', source: 'Section IV, Schedule' };
    return { text: 'I can help with: <strong>eligibility</strong>, <strong>payment</strong>, <strong>specs</strong>, <strong>risks</strong>, <strong>deadlines</strong>, <strong>warranty</strong>, <strong>documents</strong>, or <strong>bid strategy</strong>.', source: null };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectChat);
  else injectChat();
})();
