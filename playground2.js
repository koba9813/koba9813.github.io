// playground2.js — Additional demos (11-20)
(function () {
    'use strict';
    function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }
    function getP(el) {
        if (!el) return 0;
        return clamp(1 - el.getBoundingClientRect().top / window.innerHeight, 0, 1);
    }

    // ── 11. Aurora Borealis ────────────────────────────
    var auroraC = document.getElementById('pg-aurora-canvas');
    var auroraCtx = auroraC ? auroraC.getContext('2d') : null;
    var auroraT = 0;
    function drawAurora() {
        if (!auroraCtx) return;
        var w = auroraC.width, h = auroraC.height;
        auroraCtx.clearRect(0, 0, w, h);
        var p = getP(auroraC.parentElement);
        auroraT += 0.02;
        for (var layer = 0; layer < 5; layer++) {
            auroraCtx.beginPath();
            var hue = (120 + layer * 40 + p * 200) % 360;
            auroraCtx.strokeStyle = 'hsla(' + hue + ',80%,55%,0.25)';
            auroraCtx.lineWidth = 30 + layer * 8;
            auroraCtx.lineCap = 'round';
            var baseY = h * 0.3 + layer * 22;
            auroraCtx.moveTo(0, baseY);
            for (var x = 0; x <= w; x += 8) {
                var y = baseY + Math.sin(x * 0.008 + auroraT + layer * 0.7) * (40 + layer * 12)
                    + Math.sin(x * 0.015 + auroraT * 1.3) * 18;
                auroraCtx.lineTo(x, y);
            }
            auroraCtx.stroke();
        }
    }

    // ── 12. DNA Helix ─────────────────────────────────
    var dnaC = document.getElementById('pg-dna-canvas');
    var dnaCtx = dnaC ? dnaC.getContext('2d') : null;
    function drawDNA() {
        if (!dnaCtx) return;
        var w = dnaC.width, h = dnaC.height;
        dnaCtx.clearRect(0, 0, w, h);
        var p = getP(dnaC.parentElement);
        var phase = p * Math.PI * 6;
        var cy = h / 2;
        var pairs = 40;
        for (var i = 0; i < pairs; i++) {
            var t = i / pairs;
            var x = t * w;
            var angle = t * Math.PI * 4 + phase;
            var amp = 60;
            var y1 = cy + Math.sin(angle) * amp;
            var y2 = cy + Math.sin(angle + Math.PI) * amp;
            var depth = (Math.cos(angle) + 1) / 2;
            // connecting bar
            dnaCtx.beginPath();
            dnaCtx.moveTo(x, y1); dnaCtx.lineTo(x, y2);
            dnaCtx.strokeStyle = 'rgba(148,163,184,' + (0.15 + depth * 0.15) + ')';
            dnaCtx.lineWidth = 2;
            dnaCtx.stroke();
            // strand 1
            var hue1 = (200 + t * 60 + p * 120) % 360;
            dnaCtx.beginPath();
            dnaCtx.arc(x, y1, 4 + depth * 4, 0, Math.PI * 2);
            dnaCtx.fillStyle = 'hsla(' + hue1 + ',75%,60%,' + (0.5 + depth * 0.5) + ')';
            dnaCtx.fill();
            // strand 2
            var hue2 = (320 + t * 60 + p * 120) % 360;
            dnaCtx.beginPath();
            dnaCtx.arc(x, y2, 4 + (1 - depth) * 4, 0, Math.PI * 2);
            dnaCtx.fillStyle = 'hsla(' + hue2 + ',75%,60%,' + (0.5 + (1-depth) * 0.5) + ')';
            dnaCtx.fill();
        }
    }

    // ── 13. Pendulum Wave ─────────────────────────────
    var pendC = document.getElementById('pg-pendulum-canvas');
    var pendCtx = pendC ? pendC.getContext('2d') : null;
    var pendT = 0;
    function drawPendulum() {
        if (!pendCtx) return;
        var w = pendC.width, h = pendC.height;
        pendCtx.clearRect(0, 0, w, h);
        pendT += 0.03;
        var count = 20;
        var spacing = w / (count + 1);
        var pivotY = 20;
        var stringLen = h * 0.7;
        for (var i = 0; i < count; i++) {
            var freq = 0.8 + i * 0.12;
            var angle = Math.sin(pendT * freq) * 0.7;
            var px = spacing * (i + 1);
            var bx = px + Math.sin(angle) * stringLen;
            var by = pivotY + Math.cos(angle) * stringLen;
            // string
            pendCtx.beginPath();
            pendCtx.moveTo(px, pivotY); pendCtx.lineTo(bx, by);
            pendCtx.strokeStyle = 'rgba(148,163,184,0.3)';
            pendCtx.lineWidth = 1.5;
            pendCtx.stroke();
            // ball
            var hue = (i / count * 360 + pendT * 20) % 360;
            pendCtx.beginPath();
            pendCtx.arc(bx, by, 8, 0, Math.PI * 2);
            pendCtx.fillStyle = 'hsla(' + hue + ',75%,60%,0.85)';
            pendCtx.fill();
            // glow
            pendCtx.beginPath();
            pendCtx.arc(bx, by, 16, 0, Math.PI * 2);
            pendCtx.fillStyle = 'hsla(' + hue + ',75%,60%,0.15)';
            pendCtx.fill();
        }
    }

    // ── 14. Breathing Circles ─────────────────────────
    var breathStage = document.getElementById('pg-breathing-stage');
    var breathRings = breathStage ? breathStage.querySelectorAll('.pg-breathing-ring') : [];
    function updateBreathing() {
        if (!breathStage) return;
        var p = getP(breathStage);
        var colors = ['#38bdf8','#a78bfa','#f472b6','#34d399','#fb923c','#facc15','#e879f9'];
        breathRings.forEach(function (ring, i) {
            var phase = p * Math.PI * 3 + i * 0.6;
            var scale = 40 + (1 + Math.sin(phase)) * (20 + i * 22);
            ring.style.width = scale + 'px';
            ring.style.height = scale + 'px';
            ring.style.borderColor = colors[i % colors.length];
            ring.style.opacity = 0.2 + (1 + Math.sin(phase)) * 0.3;
        });
    }

    // ── 15. Ripple Pool ───────────────────────────────
    var ripC = document.getElementById('pg-ripple-canvas');
    var ripCtx = ripC ? ripC.getContext('2d') : null;
    var ripples = [];
    function initRipple() {
        if (!ripC) return;
        var stage = ripC.parentElement;
        stage.addEventListener('click', function (e) {
            var rect = ripC.getBoundingClientRect();
            var sx = ripC.width / rect.width;
            var sy = ripC.height / rect.height;
            ripples.push({
                x: (e.clientX - rect.left) * sx,
                y: (e.clientY - rect.top) * sy,
                r: 0, maxR: 300, alpha: 0.7,
                hue: Math.random() * 360
            });
        });
    }
    function drawRipples() {
        if (!ripCtx) return;
        var w = ripC.width, h = ripC.height;
        ripCtx.clearRect(0, 0, w, h);
        for (var i = ripples.length - 1; i >= 0; i--) {
            var rp = ripples[i];
            rp.r += 3;
            rp.alpha -= 0.008;
            if (rp.alpha <= 0) { ripples.splice(i, 1); continue; }
            ripCtx.beginPath();
            ripCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
            ripCtx.strokeStyle = 'hsla(' + rp.hue + ',70%,60%,' + rp.alpha.toFixed(2) + ')';
            ripCtx.lineWidth = 2;
            ripCtx.stroke();
        }
    }

    // ── 16. Spiral Galaxy ─────────────────────────────
    var galC = document.getElementById('pg-galaxy-canvas');
    var galCtx = galC ? galC.getContext('2d') : null;
    var galStage = document.getElementById('pg-galaxy-stage');
    var stars = [];
    function initGalaxy() {
        for (var i = 0; i < 300; i++) {
            var arm = Math.floor(Math.random() * 3);
            var dist = Math.random();
            stars.push({
                arm: arm, dist: dist,
                offset: (Math.random() - 0.5) * 30,
                size: 0.8 + Math.random() * 2,
                bright: 0.4 + Math.random() * 0.6
            });
        }
    }
    function drawGalaxy() {
        if (!galCtx) return;
        var w = galC.width, h = galC.height, cx = w/2, cy = h/2;
        galCtx.clearRect(0, 0, w, h);
        var p = getP(galStage);
        var spin = p * Math.PI * 4;
        stars.forEach(function (s) {
            var armAngle = (s.arm / 3) * Math.PI * 2;
            var spiral = s.dist * Math.PI * 2.5;
            var angle = armAngle + spiral + spin;
            var r = s.dist * 220 + 20;
            var x = cx + Math.cos(angle) * r + Math.cos(angle + 1.57) * s.offset;
            var y = cy + Math.sin(angle) * r + Math.sin(angle + 1.57) * s.offset;
            var hue = (220 + s.dist * 80 + p * 60) % 360;
            galCtx.beginPath();
            galCtx.arc(x, y, s.size, 0, Math.PI * 2);
            galCtx.fillStyle = 'hsla(' + hue + ',70%,70%,' + s.bright + ')';
            galCtx.fill();
        });
        // core glow
        var g = galCtx.createRadialGradient(cx, cy, 0, cx, cy, 50);
        g.addColorStop(0, 'rgba(248,250,252,0.25)');
        g.addColorStop(1, 'rgba(248,250,252,0)');
        galCtx.fillStyle = g;
        galCtx.fillRect(cx - 50, cy - 50, 100, 100);
    }

    // ── 17. Fluid Fill Text ───────────────────────────
    var fluidStage = document.getElementById('pg-fluid-text-stage');
    var fluidFill = document.getElementById('pg-fluid-fill');
    function updateFluid() {
        if (!fluidStage || !fluidFill) return;
        var p = getP(fluidStage);
        var fillPct = clamp(p * 1.4 - 0.15, 0, 1) * 100;
        fluidFill.style.height = fillPct + '%';
    }

    // ── 18. Pulse Rings ───────────────────────────────
    var pulseC = document.getElementById('pg-pulse-canvas');
    var pulseCtx = pulseC ? pulseC.getContext('2d') : null;
    var pulseT = 0;
    function drawPulse() {
        if (!pulseCtx) return;
        var w = pulseC.width, h = pulseC.height, cx = w/2, cy = h/2;
        pulseCtx.clearRect(0, 0, w, h);
        var p = getP(pulseC.parentElement);
        pulseT += 0.04;
        var ringCount = 8;
        for (var i = 0; i < ringCount; i++) {
            var phase = pulseT + i * (Math.PI * 2 / ringCount);
            var r = ((phase % (Math.PI * 2)) / (Math.PI * 2)) * 260;
            var alpha = 1 - r / 260;
            if (alpha <= 0) continue;
            var hue = (200 + i * 30 + p * 180) % 360;
            pulseCtx.beginPath();
            pulseCtx.arc(cx, cy, r, 0, Math.PI * 2);
            pulseCtx.strokeStyle = 'hsla(' + hue + ',70%,60%,' + (alpha * 0.6).toFixed(2) + ')';
            pulseCtx.lineWidth = 3;
            pulseCtx.stroke();
        }
        // center dot
        pulseCtx.beginPath();
        pulseCtx.arc(cx, cy, 6, 0, Math.PI * 2);
        pulseCtx.fillStyle = '#38bdf8';
        pulseCtx.fill();
    }

    // ── 19. Gravity Rain ──────────────────────────────
    var gravC = document.getElementById('pg-gravity-canvas');
    var gravCtx = gravC ? gravC.getContext('2d') : null;
    var gravStage = document.getElementById('pg-gravity-stage');
    var drops = [];
    function initGravity() {
        for (var i = 0; i < 60; i++) {
            drops.push({
                x: Math.random() * 780,
                y: Math.random() * 360,
                vy: 0,
                size: 2 + Math.random() * 4,
                hue: Math.random() * 360,
                bounce: 0.5 + Math.random() * 0.3
            });
        }
    }
    function drawGravity() {
        if (!gravCtx) return;
        var w = gravC.width, h = gravC.height;
        gravCtx.clearRect(0, 0, w, h);
        var p = getP(gravStage);
        var gravDir = Math.cos(p * Math.PI * 2);
        var grav = gravDir * 0.8;
        drops.forEach(function (d) {
            d.vy += grav;
            d.vy *= 0.99;
            d.y += d.vy;
            if (d.y > h - d.size) { d.y = h - d.size; d.vy *= -d.bounce; }
            if (d.y < d.size) { d.y = d.size; d.vy *= -d.bounce; }
            gravCtx.beginPath();
            gravCtx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            gravCtx.fillStyle = 'hsla(' + d.hue + ',70%,60%,0.8)';
            gravCtx.fill();
            gravCtx.beginPath();
            gravCtx.arc(d.x, d.y, d.size * 2.5, 0, Math.PI * 2);
            gravCtx.fillStyle = 'hsla(' + d.hue + ',70%,60%,0.1)';
            gravCtx.fill();
        });
    }

    // ── 20. Kaleidoscope ──────────────────────────────
    var kalC = document.getElementById('pg-kaleidoscope-canvas');
    var kalCtx = kalC ? kalC.getContext('2d') : null;
    var kalT = 0;
    function drawKaleidoscope() {
        if (!kalCtx) return;
        var w = kalC.width, h = kalC.height, cx = w/2, cy = h/2;
        kalCtx.clearRect(0, 0, w, h);
        var p = getP(kalC.parentElement);
        kalT += 0.015;
        var segments = 12;
        var angleStep = (Math.PI * 2) / segments;
        kalCtx.save();
        kalCtx.translate(cx, cy);
        for (var s = 0; s < segments; s++) {
            kalCtx.save();
            kalCtx.rotate(s * angleStep + kalT);
            // draw shapes in one segment
            for (var j = 0; j < 4; j++) {
                var dist = 50 + j * 45;
                var sz = 10 + Math.sin(kalT * 2 + j) * 6;
                var hue = (j * 70 + s * 20 + p * 300 + kalT * 30) % 360;
                var ox = Math.cos(kalT + j * 0.5) * 15;
                kalCtx.beginPath();
                kalCtx.arc(dist + ox, 0, sz, 0, Math.PI * 2);
                kalCtx.fillStyle = 'hsla(' + hue + ',65%,55%,0.45)';
                kalCtx.fill();
            }
            kalCtx.restore();
        }
        kalCtx.restore();
    }

    // ── Animation Loop ────────────────────────────────
    var running = false;
    function loop() {
        drawAurora();
        drawDNA();
        drawPendulum();
        updateBreathing();
        drawRipples();
        drawGalaxy();
        updateFluid();
        drawPulse();
        drawGravity();
        drawKaleidoscope();
        requestAnimationFrame(loop);
    }

    function init2() {
        initRipple();
        initGalaxy();
        initGravity();
        loop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init2);
    } else {
        init2();
    }
}());
