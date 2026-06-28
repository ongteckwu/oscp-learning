/* ============================================================================
   Shared "Practice Boxes" component for OSCP lessons + the reference map.
   ONE renderer, used in two places:

     - inside a lesson  →  <div data-practice-boxes data-lesson="6"></div>
                           (expanded by default)
     - the reference    →  <div data-practice-boxes data-lesson="6"
                                 data-anchor="pb-06" data-open="false"></div>
                           (collapsed; deep-linkable via #pb-06)

   Pair with practice-boxes-data.js (defines PB_BOXES + PB_LESSONS), then:
     <script src="../assets/practice-boxes-data.js"></script>
     <script src="../assets/practice-boxes.js"></script>

   Each box renders as a checkbox card with coloured difficulty / OS / vector
   badges and a Core / Optional / Reused tag. Checkmarks persist in
   localStorage (THIS browser only), keyed by box slug, and stay in sync across
   every instance on the page — so a machine that appears as "Reused" in a later
   lesson reflects the same checkmark as its home lesson.

   Design notes:
   - No duplicate machines: each box has ONE home lesson (a Core/Optional card);
     where it teaches a later lesson it appears as a muted "Reused" card whose
     text explains the different angle, not as a fresh target.
   - Difficulty colours: Easy=green, Inter/Med=amber, Hard=red, sets/labs=slate.
   - Print opens every dropdown so nothing is lost on paper.
   ========================================================================== */
(function () {
  'use strict';

  var STORE_KEY = 'oscp:pb-done';
  var inputs = [];   // {slug, el}  — every checkbox, for cross-instance sync
  var meters = [];   // {el, coreSlugs, total} — every summary counter
  var uid = 0;       // unique checkbox ids (a slug can render many times)

  // ---- localStorage (degrades silently in private mode / on quota) --------
  function load() {
    try {
      var m = JSON.parse(localStorage.getItem(STORE_KEY));
      return (m && typeof m === 'object') ? m : {};
    } catch (e) { return {}; }
  }
  function save(map) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(map)); }
    catch (e) { /* checkmarks just won't persist this session */ }
  }

  // ---- classification (drives the badge colours) --------------------------
  function diffClass(diff) {
    var d = String(diff || '').toLowerCase();
    if (d === 'easy') return 'easy';
    if (d === 'hard') return 'hard';
    if (d === 'inter' || d === 'med' || d === 'medium') return 'med';
    return 'set';   // "—" : exam sets, pro labs, challenge labs
  }
  function osClass(os) {
    var o = String(os || '').toLowerCase();
    if (o.indexOf('linux') > -1) return 'linux';
    if (o.indexOf('bsd') > -1) return 'bsd';
    if (o.indexOf('ad') > -1) return 'ad';        // "AD", "AD set"
    if (o.indexOf('mixed') > -1) return 'mixed';
    if (o.indexOf('windows') > -1) return 'win';
    return 'set';
  }
  function pad2(n) { return String(n).length < 2 ? '0' + n : String(n); }

  // ---- tiny DOM helpers ---------------------------------------------------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function badge(cls, text) { return el('span', 'pbx-badge ' + cls, text); }

  // ---- live sync: re-read storage, update every checkbox + every counter --
  function refresh() {
    var map = load();
    inputs.forEach(function (it) { it.el.checked = !!map[it.slug]; });
    meters.forEach(function (m) {
      var done = 0;
      m.coreSlugs.forEach(function (s) { if (map[s]) done++; });
      var core = m.coreSlugs.length;
      m.el.textContent =
        m.total + (m.total === 1 ? ' box' : ' boxes') +
        (core ? ' · core ' + done + '/' + core + (done === core ? ' ✓' : '') : '');
    });
  }

  function setDone(slug, on) {
    var map = load();
    if (on) map[slug] = 1; else delete map[slug];
    save(map);
    refresh();   // reflect across all instances of this slug + their counters
  }

  // ---- one box card -------------------------------------------------------
  function renderCard(item, mode) {
    var box = PB_BOXES[item.box];
    if (!box) return null;   // unknown slug: skip, never crash the page
    var reuse = item.reuse;

    var li = el('li', 'pbx-card');
    li.setAttribute('data-req', reuse ? 'reuse' : (item.req === 'core' ? 'core' : 'opt'));

    var row = el('div', 'pbx-row');

    var label = el('label', 'pbx-check');
    var cb = el('input');
    cb.type = 'checkbox';
    cb.id = 'pbx-cb-' + (++uid);
    cb.setAttribute('data-box', item.box);
    cb.addEventListener('change', function () { setDone(item.box, cb.checked); });
    inputs.push({ slug: item.box, el: cb });
    label.appendChild(cb);
    label.appendChild(el('span', 'pbx-name', box.name));
    row.appendChild(label);

    var tags = el('span', 'pbx-tags');
    tags.appendChild(badge('src', box.src));
    tags.appendChild(badge('os os-' + osClass(box.os), box.os));
    if (box.diff) tags.appendChild(badge('diff diff-' + diffClass(box.diff), box.diff));
    if (item.vector) tags.appendChild(badge('vec', item.vector));

    if (reuse) {
      var label2 = '↻ Reused · L' + pad2(reuse.from);
      if (mode === 'ref') {
        var ra = el('a', 'pbx-badge reuse', label2);   // jump to its home lesson
        ra.href = '#pb-' + pad2(reuse.from);
        tags.appendChild(ra);
      } else {
        tags.appendChild(badge('reuse', label2));
      }
    } else {
      tags.appendChild(item.req === 'core'
        ? badge('req core', 'Core')
        : badge('req opt', 'Optional'));
    }

    if (box.url) {
      var a = el('a', 'pbx-badge link', '0xdf ↗');
      a.href = box.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = '0xdf walkthrough — review only, after you finish or exhaust the box';
      tags.appendChild(a);
    }
    row.appendChild(tags);
    li.appendChild(row);

    if (item.what) li.appendChild(el('p', 'pbx-what', item.what));
    return li;
  }

  // ---- one lesson dropdown ------------------------------------------------
  function renderHost(host) {
    var n = parseInt(host.getAttribute('data-lesson'), 10);
    var data = (typeof PB_LESSONS !== 'undefined') && PB_LESSONS[n];
    if (!data) return;

    var anchor = host.getAttribute('data-anchor');
    var mode = anchor ? 'ref' : 'lesson';
    var openAttr = host.getAttribute('data-open');
    var open = openAttr ? (openAttr !== 'false') : (mode === 'lesson');

    var details = el('details', 'pbx');
    if (anchor) details.id = anchor;            // deep-link target on the ref page
    if (open) details.setAttribute('open', '');

    var sum = el('summary', 'pbx-sum');
    var title = el('span', 'pbx-title');
    title.appendChild(el('b', null, pad2(n) + ' · '));
    title.appendChild(document.createTextNode(data.title));
    sum.appendChild(title);
    var meter = el('span', 'pbx-meter');
    sum.appendChild(meter);
    details.appendChild(sum);

    var body = el('div', 'pbx-body');
    if (data.blurb) body.appendChild(el('p', 'pbx-blurb', data.blurb));

    var ul = el('ul', 'pbx-list');
    var coreSlugs = [];
    data.items.forEach(function (item) {
      var card = renderCard(item, mode);
      if (card) ul.appendChild(card);
      if (!item.reuse && item.req === 'core' && coreSlugs.indexOf(item.box) < 0) {
        coreSlugs.push(item.box);
      }
    });
    body.appendChild(ul);

    var note = el('p', 'pbx-note');
    note.appendChild(document.createTextNode(
      'Checkmarks are saved only in this browser (localStorage) — they won’t ' +
      'follow you to another device or browser. '));
    var reset = el('button', 'pbx-reset');
    reset.type = 'button';
    reset.textContent = 'Reset this lesson';
    reset.addEventListener('click', function () {
      // Only clear boxes this lesson OWNS — a reused box's state belongs to its
      // home lesson, so resetting here must not untick it elsewhere.
      var map = load();
      data.items.forEach(function (it) { if (!it.reuse) delete map[it.box]; });
      save(map);
      refresh();
    });
    note.appendChild(reset);
    body.appendChild(note);

    details.appendChild(body);
    host.parentNode.replaceChild(details, host);
    meters.push({ el: meter, coreSlugs: coreSlugs, total: data.items.length });
  }

  // ---- init ---------------------------------------------------------------
  function init() {
    var hosts = document.querySelectorAll('[data-practice-boxes]');
    Array.prototype.forEach.call(hosts, renderHost);
    refresh();

    // On print, open every dropdown so the full map lands on paper; restore after.
    window.addEventListener('beforeprint', function () {
      Array.prototype.forEach.call(document.querySelectorAll('details.pbx'), function (d) {
        d.dataset.printPrev = d.open ? '1' : '0';
        d.open = true;
      });
    });
    window.addEventListener('afterprint', function () {
      Array.prototype.forEach.call(document.querySelectorAll('details.pbx'), function (d) {
        if (d.dataset.printPrev === '0') d.open = false;
        delete d.dataset.printPrev;
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
