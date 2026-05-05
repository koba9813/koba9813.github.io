// playground.js — Scroll-driven dynamic design showcase
(function () {
    'use strict';

    // ── Utilities ──────────────────────────────────────
    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function mapRange(value, inMin, inMax, outMin, outMax) {
        return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
    }

    function getScrollProgress(el) {
        var rect = el.getBoundingClientRect();
        var winH = window.innerHeight;
        // 0 = element just entered bottom, 1 = element just left top
        return clamp(1 - (rect.top / winH), 0, 1);
    }

    // ── 0. Scroll progress indicator ──────────────────
    var scrollIndicator = document.getElementById('pg-scroll-indicator');

    function updateScrollIndicator() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollIndicator) {
            scrollIndicator.style.width = pct + '%';
        }
    }

    // ── 1. Section reveal on scroll ───────────────────
    var revealSections = document.querySelectorAll('[data-pg-reveal]');

    function checkReveals() {
        var winH = window.innerHeight;
        revealSections.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < winH * 0.88) {
                el.classList.add('is-visible');
            }
        });
    }

    // ── 2. Morphing Blob — hue rotation on scroll ─────
    var blobStage = document.getElementById('pg-blob-stage');
    var blob = document.getElementById('pg-blob');
    var blobAlt = document.getElementById('pg-blob-alt');

    function updateBlob() {
        if (!blobStage || !blob) return;
        var p = getScrollProgress(blobStage);
        var hue = Math.round(p * 260);
        blob.style.filter = 'blur(1px) hue-rotate(' + hue + 'deg)';
        if (blobAlt) {
            blobAlt.style.filter = 'blur(28px) hue-rotate(' + (hue + 120) + 'deg)';
        }
    }

    // ── 3. Parallax Cards ─────────────────────────────
    var parallaxCards = document.querySelectorAll('[data-pg-parallax]');

    function updateParallax() {
        parallaxCards.forEach(function (card) {
            var speed = parseFloat(card.dataset.speed) || 0.1;
            var rect = card.getBoundingClientRect();
            var winH = window.innerHeight;
            var center = rect.top + rect.height / 2 - winH / 2;
            var offset = center * speed * -1;
            card.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
        });
    }

    // Tilt on hover (desktop only)
    parallaxCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'perspective(600px) rotateY(' + (x * 12).toFixed(1) + 'deg) rotateX(' + (y * -12).toFixed(1) + 'deg) translateY(-6px) scale(1.015)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

    // ── 4. Wave Text ──────────────────────────────────
    var waveContainer = document.getElementById('pg-wave-text');
    var waveText = 'Hello World from Haya.win';
    var waveChars = [];

    if (waveContainer) {
        waveText.split('').forEach(function (ch, i) {
            var span = document.createElement('span');
            span.className = 'pg-wave-char';
            if (ch === ' ') {
                span.classList.add('is-space');
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = ch;
            }
            span.style.transitionDelay = (i * 0.02) + 's';
            waveContainer.appendChild(span);
            waveChars.push(span);
        });
    }

    function updateWaveText() {
        if (!waveContainer) return;
        var p = getScrollProgress(waveContainer);
        var colors = ['#38bdf8', '#a78bfa', '#f472b6', '#34d399', '#fb923c', '#facc15'];
        waveChars.forEach(function (span, i) {
            var phase = p * Math.PI * 4 + i * 0.35;
            var y = Math.sin(phase) * 14;
            var rotation = Math.sin(phase + 0.5) * 6;
            span.style.transform = 'translateY(' + y.toFixed(1) + 'px) rotate(' + rotation.toFixed(1) + 'deg)';
            var colorIdx = Math.floor((p * 6 + i * 0.2) % colors.length);
            span.style.color = colors[colorIdx];
        });
    }

    // ── 5. Particle Ring (Canvas) ─────────────────────
    var ringCanvas = document.getElementById('pg-ring-canvas');
    var ringCtx = ringCanvas ? ringCanvas.getContext('2d') : null;
    var ringStage = document.getElementById('pg-ring-stage');
    var RING_PARTICLES = 100;
    var ringParticles = [];

    function initRingParticles() {
        for (var i = 0; i < RING_PARTICLES; i++) {
            var angle = (i / RING_PARTICLES) * Math.PI * 2;
            ringParticles.push({
                baseAngle: angle,
                radius: 140 + Math.random() * 30,
                size: 2 + Math.random() * 3,
                speed: 0.3 + Math.random() * 0.5,
                hue: Math.round((i / RING_PARTICLES) * 360)
            });
        }
    }

    function drawRing(scrollAngle, scaleFactor) {
        if (!ringCtx || !ringCanvas) return;
        var w = ringCanvas.width;
        var h = ringCanvas.height;
        var cx = w / 2;
        var cy = h / 2;

        ringCtx.clearRect(0, 0, w, h);

        ringParticles.forEach(function (p) {
            var a = p.baseAngle + scrollAngle * p.speed;
            var r = p.radius * scaleFactor;
            var x = cx + Math.cos(a) * r;
            var y = cy + Math.sin(a) * r;
            var hue = (p.hue + scrollAngle * 40) % 360;

            ringCtx.beginPath();
            ringCtx.arc(x, y, p.size, 0, Math.PI * 2);
            ringCtx.fillStyle = 'hsla(' + hue + ', 80%, 65%, 0.8)';
            ringCtx.fill();

            // glow
            ringCtx.beginPath();
            ringCtx.arc(x, y, p.size * 3, 0, Math.PI * 2);
            ringCtx.fillStyle = 'hsla(' + hue + ', 80%, 65%, 0.12)';
            ringCtx.fill();
        });

        // center glow
        var grd = ringCtx.createRadialGradient(cx, cy, 0, cx, cy, 60 * scaleFactor);
        grd.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
        grd.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ringCtx.fillStyle = grd;
        ringCtx.fillRect(0, 0, w, h);
    }

    function updateRing() {
        if (!ringStage) return;
        var p = getScrollProgress(ringStage);
        var angle = p * Math.PI * 3;
        var scale = 0.6 + p * 0.6;
        drawRing(angle, scale);
    }

    // ── 6. Progress Bars ──────────────────────────────
    var barFills = document.querySelectorAll('[data-pg-bar]');
    var barsTriggered = false;

    function updateBars() {
        if (barsTriggered) return;
        var container = document.querySelector('.pg-bars');
        if (!container) return;
        var rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            barsTriggered = true;
            barFills.forEach(function (bar) {
                var max = bar.dataset.max || 100;
                bar.style.width = max + '%';
            });
        }
    }

    // ── 7. Magnetic Grid ──────────────────────────────
    var magnetGrid = document.getElementById('pg-magnet-grid');
    var magnetTiles = [];

    function initMagnetGrid() {
        if (!magnetGrid) return;
        var cols = window.innerWidth > 500 ? 8 : 5;
        var rows = 5;
        var total = cols * rows;
        for (var i = 0; i < total; i++) {
            var tile = document.createElement('div');
            tile.className = 'pg-magnet-tile';
            magnetGrid.appendChild(tile);
            magnetTiles.push(tile);
        }

        magnetGrid.addEventListener('mousemove', function (e) {
            var rect = magnetGrid.getBoundingClientRect();
            var mx = e.clientX - rect.left;
            var my = e.clientY - rect.top;

            magnetTiles.forEach(function (tile) {
                var tr = tile.getBoundingClientRect();
                var tx = tr.left + tr.width / 2 - rect.left;
                var ty = tr.top + tr.height / 2 - rect.top;
                var dx = mx - tx;
                var dy = my - ty;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var maxDist = 150;
                var strength = clamp(1 - dist / maxDist, 0, 1);
                var moveX = dx * strength * 0.18;
                var moveY = dy * strength * 0.18;
                var scale = 1 + strength * 0.2;
                tile.style.transform = 'translate(' + moveX.toFixed(1) + 'px, ' + moveY.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
                tile.style.background = 'rgba(56, 189, 248, ' + (0.1 + strength * 0.3).toFixed(2) + ')';
                tile.style.boxShadow = strength > 0.1 ? '0 0 ' + (strength * 20).toFixed(0) + 'px rgba(56, 189, 248, ' + (strength * 0.3).toFixed(2) + ')' : 'none';
            });
        });

        magnetGrid.addEventListener('mouseleave', function () {
            magnetTiles.forEach(function (tile) {
                tile.style.transform = '';
                tile.style.background = '';
                tile.style.boxShadow = '';
            });
        });
    }

    // ── 8. Noise Gradient (Canvas) ────────────────────
    var noiseCanvas = document.getElementById('pg-noise-canvas');
    var noiseCtx = noiseCanvas ? noiseCanvas.getContext('2d') : null;

    function drawNoise(hueShift) {
        if (!noiseCtx || !noiseCanvas) return;
        var w = noiseCanvas.width;
        var h = noiseCanvas.height;
        var imgData = noiseCtx.createImageData(w, h);
        var data = imgData.data;

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var idx = (y * w + x) * 4;
                var noise = Math.random();

                // gradient base
                var gx = x / w;
                var gy = y / h;

                var hue = (gx * 200 + hueShift) % 360;
                var sat = 70 + gy * 20;
                var light = 20 + noise * 18 + gy * 12;

                // HSL to RGB (simplified)
                var c = (1 - Math.abs(2 * light / 100 - 1)) * sat / 100;
                var xx = c * (1 - Math.abs((hue / 60) % 2 - 1));
                var m = light / 100 - c / 2;
                var r, g, b;

                if (hue < 60) { r = c; g = xx; b = 0; }
                else if (hue < 120) { r = xx; g = c; b = 0; }
                else if (hue < 180) { r = 0; g = c; b = xx; }
                else if (hue < 240) { r = 0; g = xx; b = c; }
                else if (hue < 300) { r = xx; g = 0; b = c; }
                else { r = c; g = 0; b = xx; }

                data[idx]     = Math.round((r + m) * 255);
                data[idx + 1] = Math.round((g + m) * 255);
                data[idx + 2] = Math.round((b + m) * 255);
                data[idx + 3] = 255;
            }
        }

        noiseCtx.putImageData(imgData, 0, 0);
    }

    var lastNoiseHue = -999;

    function updateNoise() {
        if (!noiseCanvas) return;
        var p = getScrollProgress(noiseCanvas.parentElement);
        var hue = Math.round(p * 300);
        // Only redraw when hue changes significantly (performance)
        if (Math.abs(hue - lastNoiseHue) > 3) {
            lastNoiseHue = hue;
            drawNoise(hue);
        }
    }

    // ── 9. Stagger Reveal ─────────────────────────────
    var staggerItems = document.querySelectorAll('[data-pg-stagger]');

    function updateStagger() {
        var winH = window.innerHeight;
        staggerItems.forEach(function (item, i) {
            var rect = item.getBoundingClientRect();
            if (rect.top < winH * 0.85) {
                setTimeout(function () {
                    item.classList.add('is-visible');
                }, i * 100);
            }
        });
    }

    // ── 10. Orbital Text ──────────────────────────────
    var orbitalRing = document.getElementById('pg-orbital-ring');
    var orbitalStage = document.getElementById('pg-orbital-stage');
    var orbitalText = '● SCROLL ● DRIVEN ● DESIGN ● PLAYGROUND ';

    function initOrbital() {
        if (!orbitalRing) return;
        var chars = orbitalText.split('');
        var step = 360 / chars.length;
        chars.forEach(function (ch, i) {
            var span = document.createElement('span');
            span.className = 'pg-orbital-char';
            span.textContent = ch;
            span.style.transform = 'rotate(' + (i * step) + 'deg)';
            orbitalRing.appendChild(span);
        });
    }

    function updateOrbital() {
        if (!orbitalRing || !orbitalStage) return;
        var p = getScrollProgress(orbitalStage);
        var rotation = p * 720;
        orbitalRing.style.transform = 'rotate(' + rotation.toFixed(1) + 'deg)';
    }

    // ── 11. Liquid Counters ───────────────────────────
    var counterNums = document.querySelectorAll('[data-pg-count]');
    var countersTriggered = false;

    function animateCounter(el, target) {
        var start = 0;
        var duration = 1800;
        var startTime = null;
        var card = el.closest('.pg-counter-card');

        if (card) card.classList.add('is-counting');

        function tick(ts) {
            if (!startTime) startTime = ts;
            var elapsed = ts - startTime;
            var progress = clamp(elapsed / duration, 0, 1);
            // ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target);
            el.textContent = current.toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    function updateCounters() {
        if (countersTriggered) return;
        var container = document.getElementById('pg-counters');
        if (!container) return;
        var rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.78) {
            countersTriggered = true;
            counterNums.forEach(function (el, i) {
                var target = parseInt(el.dataset.target, 10) || 0;
                setTimeout(function () {
                    animateCounter(el, target);
                }, i * 200);
            });
        }
    }

    // ── Main scroll loop ──────────────────────────────
    var ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            updateScrollIndicator();
            checkReveals();
            updateBlob();
            updateParallax();
            updateWaveText();
            updateRing();
            updateBars();
            updateNoise();
            updateStagger();
            updateOrbital();
            updateCounters();
            ticking = false;
        });
    }

    // ── Init ──────────────────────────────────────────
    function init() {
        initRingParticles();
        initMagnetGrid();
        initOrbital();

        // Initial paint
        updateScrollIndicator();
        checkReveals();
        drawRing(0, 0.6);
        drawNoise(0);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
