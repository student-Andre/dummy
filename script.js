(function () {
  'use strict';

  // ---- Konfigurasi dummy ----
  var WA_NUMBER = '6280000000000'; // ganti dengan nomor asli
  function waLink(topic) {
    var text = 'Halo FurniBLOC, saya ingin bertanya' + (topic ? ' tentang: ' + topic : '') + '.';
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  // ---- Tahun & WhatsApp ----
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('wa-faq').href = waLink('FAQ');
  document.getElementById('wa-footer').href = waLink('');

  // ---- Menu mobile ----
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- Filter kategori (kosong) ----
  var chips = document.querySelectorAll('.chip');
  var msg = document.getElementById('catalog-msg');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
      var cat = chip.dataset.cat;
      msg.textContent = cat === 'all'
        ? 'Belum ada produk untuk ditampilkan.'
        : 'Belum ada produk di kategori ' + cat + '.';
    });
  });

  // ---- Tab Foto / 3D / Video ----
  var tabs = document.querySelectorAll('.tab');
  var panes = document.querySelectorAll('.pane');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      panes.forEach(function (p) {
        p.classList.toggle('is-active', p.dataset.pane === tab.dataset.tab);
      });
    });
  });

  // ---- Kubus 3D: geser untuk memutar + putar otomatis pelan ----
  var scene = document.getElementById('scene');
  var cube = document.getElementById('cube');
  var rx = -20, ry = 30, dragging = false, lastX = 0, lastY = 0, idle = true;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render() { cube.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'; }
  scene.addEventListener('pointerdown', function (e) {
    dragging = true; idle = false; lastX = e.clientX; lastY = e.clientY;
    scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    ry += (e.clientX - lastX) * 0.6;
    rx -= (e.clientY - lastY) * 0.6;
    lastX = e.clientX; lastY = e.clientY;
    render();
  });
  function stop() { dragging = false; setTimeout(function () { idle = true; }, 1500); }
  scene.addEventListener('pointerup', stop);
  scene.addEventListener('pointercancel', stop);
  (function tick() {
    if (idle && !dragging && !reduce) { ry += 0.25; render(); }
    requestAnimationFrame(tick);
  })();

  // ---- Model 3D & AR ----
  // Letakkan semua file .glb di folder "model" di samping index.html.
  // Untuk menambah model: tambahkan satu baris { name, file } di daftar ini.
  // Disarankan nama file tanpa spasi, mis. imperia-double-vanity-60-inch.glb
  var MODELS = [
    { name: 'Imperia Double Vanity – 60 Inch', file: 'model/Imperia Double Vanity – 60 Inch.glb' },
    { name: 'kursi',                     file: 'model/kursii.glb' } // GANTI nama dan file
  ];

  var mv = document.getElementById('mv');
  var arBtn = document.getElementById('ar-btn');
  var arHint = document.getElementById('ar-hint');
  var picker = document.getElementById('model-picker');
  var pickerBtns = [];

  function showHint(text) { arHint.hidden = false; arHint.textContent = text; }

  function loadModel(i) {
    var m = MODELS[i];
    mv.hidden = false;
    scene.hidden = true;
    arBtn.disabled = true;
    arHint.hidden = true;
    mv.setAttribute('alt', 'Model 3D ' + m.name);
    mv.setAttribute('src', encodeURI(m.file));
    pickerBtns.forEach(function (b, idx) {
      b.classList.toggle('is-active', idx === i);
      b.setAttribute('aria-pressed', String(idx === i));
    });
  }

  if (MODELS.length > 1) {
    picker.hidden = false;
    MODELS.forEach(function (m, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = m.name;
      b.addEventListener('click', function () { loadModel(i); });
      picker.appendChild(b);
      pickerBtns.push(b);
    });
  }
  loadModel(0);

  mv.addEventListener('load', function () {
    arBtn.disabled = false;
    arHint.hidden = true;
  });

  mv.addEventListener('error', function () {
    // Model gagal dimuat: tampilkan kubus cadangan, tanpa tombol AR
    mv.hidden = true;
    scene.hidden = false;
    arBtn.disabled = true;
    var local = location.protocol === 'file:';
    showHint(local
      ? 'Model tidak bisa dimuat dari file langsung. Jalankan lewat server lokal (lihat petunjuk) lalu muat ulang.'
      : 'Model tidak ditemukan. Periksa nama file dan folder "model".');
  });

  arBtn.addEventListener('click', function () {
    if (mv.canActivateAR) {
      mv.activateAR();
    } else {
      showHint('AR hanya tersedia di HP/tablet yang mendukung (iPhone Safari, Android Chrome) dan lewat alamat https.');
    }
  });

  // ---- Tombol kembali ke atas ----
  var toTop = document.getElementById('to-top');
  window.addEventListener('scroll', function () {
    toTop.hidden = window.scrollY < window.innerHeight * 2;
  }, { passive: true });
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
