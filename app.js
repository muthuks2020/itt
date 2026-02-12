/* ═══════════════════════════════════════════════════
   ITP — Intelligent Tender Process | Appasamy
   Application Logic
   ═══════════════════════════════════════════════════ */

/* ═══════════ AUTHENTICATION ═══════════ */
function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById('em').value;
  const password = document.getElementById('pw').value;

  if (email && password.length >= 4) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('appLayout').classList.add('on');
    return false;
  }

  document.getElementById('loginErr').style.display = 'block';
  return false;
}

function doLogout() {
  document.getElementById('appLayout').classList.remove('on');
  document.getElementById('loginPage').style.display = 'flex';
}


/* ═══════════ NAVIGATION ═══════════ */
function goHome() {
  document.getElementById('dash').style.display = 'block';
  document.getElementById('anlView').classList.remove('on');
  document.getElementById('pgT').textContent = 'Dashboard';
  document.getElementById('pgS').textContent = 'Overview of all tender activities';

  // Update sidebar active state
  const navButtons = document.querySelectorAll('.sb-btn');
  navButtons.forEach(btn => btn.classList.remove('on'));
  navButtons[0].classList.add('on');

  // Close chat panel if open
  if (typeof closeChat === 'function') closeChat();
}

function viewA() {
  document.getElementById('dash').style.display = 'none';
  document.getElementById('anlView').classList.add('on');
  document.getElementById('pgT').textContent = 'Tender Analysis';
  document.getElementById('pgS').textContent = 'AI-powered deep analysis — WBMSCL/NIT-036/2023';
}


/* ═══════════ ANALYSIS TABS ═══════════ */
function stab(id, el) {
  // Deactivate all tabs
  document.querySelectorAll('.tab').forEach(function(t) {
    t.classList.remove('on');
  });

  // Deactivate all panels
  document.querySelectorAll('.pnl').forEach(function(p) {
    p.classList.remove('on');
  });

  // Activate selected tab and panel
  el.classList.add('on');
  document.getElementById('p-' + id).classList.add('on');
}


/* ═══════════ FILTER PILLS ═══════════ */
function initPills() {
  document.querySelectorAll('.pill').forEach(function(p) {
    p.addEventListener('click', function() {
      document.querySelectorAll('.pill').forEach(function(x) {
        x.classList.remove('on');
      });
      this.classList.add('on');
    });
  });
}


/* ═══════════ UPLOAD MODAL ═══════════ */
function openModal() {
  document.getElementById('uModal').classList.add('open');
}

function closeModal() {
  document.getElementById('uModal').classList.remove('open');
}


/* ═══════════ FILE HANDLING ═══════════ */
function onF(e) {
  var file = e.target.files[0];
  if (!file) return;

  // Show file preview
  document.getElementById('fRow').classList.add('show');
  document.getElementById('fNm').textContent = file.name;
  document.getElementById('fSz').textContent = (file.size / 1048576).toFixed(2) + ' MB';

  // Enable analyze button
  document.getElementById('aBtn').disabled = false;

  // Auto-fill tender name if empty
  if (!document.getElementById('tNm').value) {
    var cleanName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]/g, ' ');
    document.getElementById('tNm').value = cleanName;
  }
}

function clrF() {
  document.getElementById('fIn').value = '';
  document.getElementById('fRow').classList.remove('show');
  document.getElementById('aBtn').disabled = true;
}

function initDropZone() {
  var dz = document.getElementById('dz');

  dz.addEventListener('dragover', function(e) {
    e.preventDefault();
    dz.classList.add('ov');
  });

  dz.addEventListener('dragleave', function() {
    dz.classList.remove('ov');
  });

  dz.addEventListener('drop', function(e) {
    e.preventDefault();
    dz.classList.remove('ov');
    if (e.dataTransfer.files[0]) {
      document.getElementById('fIn').files = e.dataTransfer.files;
      onF({ target: { files: e.dataTransfer.files } });
    }
  });
}


/* ═══════════ AI ANALYSIS ANIMATION ═══════════ */
function startAI() {
  closeModal();

  var overlay = document.getElementById('aiO');
  overlay.classList.add('on');

  var steps = ['s1', 's2', 's3', 's4', 's5'];
  var current = 0;

  function nextStep() {
    // Mark previous step as complete
    if (current > 0) {
      var prev = document.getElementById(steps[current - 1]);
      prev.classList.remove('now');
      prev.classList.add('ok');
      prev.querySelector('.sd').textContent = '✓';
    }

    // Advance or finish
    if (current < steps.length) {
      document.getElementById(steps[current]).classList.add('now');
      current++;
      var delay = 1000 + Math.random() * 700;
      setTimeout(nextStep, delay);
    } else {
      // All steps done — finish up
      setTimeout(function() {
        overlay.classList.remove('on');

        // Reset step states for next use
        steps.forEach(function(s) {
          var el = document.getElementById(s);
          el.classList.remove('now', 'ok');
          el.querySelector('.sd').textContent = '';
        });

        // Add new tender row to table
        addRow();

        // Navigate to analysis view
        viewA();
      }, 500);
    }
  }

  setTimeout(nextStep, 300);
}


/* ═══════════ ADD TENDER ROW ═══════════ */
function addRow() {
  var tbody = document.getElementById('tbody');
  var name = document.getElementById('tNm').value || 'New Tender';
  var priority = document.getElementById('tPr').value;

  var priorityMap = { h: 'h', m: 'm', l: 'l' };
  var priorityLabel = { h: 'High', m: 'Medium', l: 'Low' };

  var tr = document.createElement('tr');
  tr.onclick = function() { viewA(); };

  var refId = 'ITP/' + Date.now().toString(36).toUpperCase();

  tr.innerHTML =
    '<td>' +
      '<span class="tn">' + name + '</span>' +
      '<span class="tr">' + refId + '</span>' +
    '</td>' +
    '<td>Uploaded</td>' +
    '<td><span class="bdg b1">Analyzed</span></td>' +
    '<td><div class="pri"><span class="pd ' + priorityMap[priority] + '"></span>' + priorityLabel[priority] + '</div></td>' +
    '<td>—</td>' +
    '<td>15%<div class="prog"><div class="fill" style="width:15%"></div></div></td>' +
    '<td><button class="sb hi" onclick="event.stopPropagation();viewA()">View</button></td>';

  tbody.insertBefore(tr, tbody.firstChild);

  // Update counters
  var totalEl = document.getElementById('sT');
  var badgeEl = document.getElementById('totBg');
  var newTotal = parseInt(totalEl.textContent) + 1;
  totalEl.textContent = newTotal;
  badgeEl.textContent = newTotal;
}


/* ═══════════ CHECKLIST INTERACTION ═══════════ */
function initChecklist() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cx')) {
      var isDone = e.target.classList.toggle('done');
      e.target.textContent = isDone ? '✓' : '';
      updateComplianceScore();
    }
  });
}

function updateComplianceScore() {
  var doneCount = document.querySelectorAll('.cx.done').length;
  var totalCount = document.querySelectorAll('.cx').length;
  var percentage = Math.round((doneCount / totalCount) * 100);

  // Update score display
  var scoreEl = document.getElementById('cScore');
  var barEl = document.getElementById('cBar');
  var pctEl = document.getElementById('cPct');

  if (scoreEl) scoreEl.textContent = doneCount;
  if (barEl) barEl.style.width = percentage + '%';
  if (pctEl) pctEl.textContent = percentage + '% Complete';

  // Update score color based on completion
  if (scoreEl) {
    if (percentage > 60) {
      scoreEl.style.color = 'var(--green)';
    } else if (percentage > 30) {
      scoreEl.style.color = 'var(--orange)';
    } else {
      scoreEl.style.color = 'var(--rose)';
    }
  }
}


/* ═══════════ BID SIMULATOR ═══════════ */
var simData = {
  slit:     { market: 450000, units: 42,  comp: '4–6 bidders' },
  phaco:    { market: 2800000, units: 21, comp: '3–5 bidders' },
  ophth:    { market: 35000, units: 185,  comp: '6–8 bidders' },
  indirect: { market: 180000, units: 10,  comp: '4–6 bidders' },
  specular: { market: 1500000, units: 4,  comp: '2–4 bidders' }
};

function openBidSim() {
  document.getElementById('bidSimModal').classList.add('open');
  updateSimulation();
}

function closeBidSim() {
  document.getElementById('bidSimModal').classList.remove('open');
}

function updateSimulation() {
  var item = document.getElementById('simItem').value;
  var slider = document.getElementById('simPrice').value;
  var d = simData[item];

  // Price: slider 0=60% of market, 100=140% of market
  var priceFactor = 0.6 + (slider / 100) * 0.8;
  var price = Math.round(d.market * priceFactor);

  // Win probability: inverse of price relative to market
  var diff = (d.market - price) / d.market;
  var winPct;
  if (diff > 0.15) winPct = 92;
  else if (diff > 0.10) winPct = 85;
  else if (diff > 0.05) winPct = 72;
  else if (diff > 0) winPct = 58;
  else if (diff > -0.05) winPct = 40;
  else if (diff > -0.10) winPct = 25;
  else if (diff > -0.20) winPct = 12;
  else winPct = 5;

  // Add some noise
  winPct = Math.max(3, Math.min(96, winPct + Math.round((Math.random() - 0.5) * 6)));

  // Margin estimate
  var marginPct = Math.round((price - d.market * 0.7) / price * 100);
  if (marginPct < 0) marginPct = 0;

  // Total value
  var total = price * d.units;

  // Update UI
  document.getElementById('simPriceVal').textContent = '₹' + price.toLocaleString('en-IN');
  document.getElementById('simMarket').textContent = '₹' + d.market.toLocaleString('en-IN');
  document.getElementById('simComp').textContent = d.comp;
  document.getElementById('simTotal').textContent = '₹' + total.toLocaleString('en-IN');
  document.getElementById('simPct').textContent = winPct + '%';
  document.getElementById('simMargin').textContent = '~' + marginPct + '%';

  // Position label
  var posEl = document.getElementById('simPosition');
  var diffPct = Math.abs(Math.round(diff * 100));
  if (diff > 0.02) {
    posEl.textContent = diffPct + '% Below Market';
    posEl.style.color = 'var(--green)';
  } else if (diff < -0.02) {
    posEl.textContent = diffPct + '% Above Market';
    posEl.style.color = 'var(--rose)';
  } else {
    posEl.textContent = 'At Market Rate';
    posEl.style.color = 'var(--blue)';
  }

  // Margin color
  var marginEl = document.getElementById('simMargin');
  if (marginPct < 5) marginEl.style.color = 'var(--rose)';
  else if (marginPct < 15) marginEl.style.color = 'var(--orange)';
  else marginEl.style.color = 'var(--green)';

  // Gauge pct color
  var pctEl = document.getElementById('simPct');
  if (winPct >= 60) pctEl.style.color = 'var(--green)';
  else if (winPct >= 35) pctEl.style.color = 'var(--orange)';
  else pctEl.style.color = 'var(--rose)';

  // Needle rotation: -90 (left/0%) to +90 (right/100%)
  var angle = -90 + (winPct / 100) * 180;
  document.getElementById('simNeedle').setAttribute('transform', 'rotate(' + angle + ', 100, 100)');

  // AI Tip
  var tipEl = document.getElementById('simTip');
  var tipSpan = tipEl.querySelector('span');
  if (winPct >= 75 && marginPct < 8) {
    tipSpan.textContent = 'High win probability but thin margins. Consider whether volume compensates for lower per-unit profit.';
  } else if (winPct >= 60) {
    tipSpan.textContent = 'Sweet spot: pricing 5–10% below market maximizes win probability while maintaining healthy margins.';
  } else if (winPct >= 35) {
    tipSpan.textContent = 'Moderate chances. Consider emphasizing service network and demo capability as differentiators to offset higher pricing.';
  } else {
    tipSpan.textContent = 'Low win probability at this price point. Unless you have strong technical differentiators, consider reducing price closer to market rate.';
  }
}


/* ═══════════ INITIALIZATION ═══════════ */
document.addEventListener('DOMContentLoaded', function() {
  initPills();
  initDropZone();
  initChecklist();
  updateComplianceScore();
});
