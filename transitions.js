// transitions.js — Smooth same-site page navigation
(function () {
    // Random background image
    var bgImages = [
        '/images/artmis/artmis.jpg',
        '/images/artmis/art002e009281~large.jpg',
        '/images/artmis/art002e009289~large.jpg',
        '/images/artmis/art002e009287~large.jpg',
        '/images/artmis/art002e009288orig.jpg',
        '/images/artmis/art002e009562~large.jpg'
    ];
    var chosen = bgImages[Math.floor(Math.random() * bgImages.length)];
    var overlay = 'linear-gradient(to bottom, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.70) 40%, rgba(15,23,42,0.88) 100%)';
    document.body.style.backgroundImage = overlay + ', url("' + chosen + '")';

    var MQ = window.matchMedia('(prefers-reduced-motion: reduce)');

    function isInternalLink(href) {
        if (!href || href.startsWith('#') || href.startsWith('mailto:')) return false;
        try {
            var url = new URL(href, location.href);
            return url.hostname === location.hostname;
        } catch (e) {
            return false;
        }
    }

    document.addEventListener('click', function (e) {
        if (MQ.matches) return;
        var target = e.target.closest('a');
        if (!target) return;

        // Contact cards have their own outbound animation — leave them alone
        if (target.classList.contains('contact-card')) return;

        var href = target.getAttribute('href');
        if (!isInternalLink(href)) return;
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (target.getAttribute('target') === '_blank') return;

        e.preventDefault();
        document.body.classList.add('is-nav-leaving');

        setTimeout(function () {
            window.location.href = new URL(href, location.href).href;
        }, 230);
    });

    // ←
    var _s = [38,38,40,40,37,39,37,39,66,65], _p = 0;
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === _s[_p]) { _p++; if (_p === _s.length) { _p = 0; window.location.href = '/farside.html'; } }
        else { _p = 0; }
    });

    // ── Global Ripple Pool ────────────────────────────
    (function initGlobalRipple() {
        if (MQ.matches) return;

        var canvas = document.createElement('canvas');
        canvas.id = 'global-ripple-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
        document.body.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        var ripples = [];
        var dpr = window.devicePixelRatio || 1;

        function resize() {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        document.addEventListener('click', function (e) {
            var x = e.clientX, y = e.clientY;
            // spawn multiple concentric rings with staggered delay
            for (var k = 0; k < 4; k++) {
                ripples.push({
                    x: x, y: y,
                    r: k * -12,          // negative = not yet visible (delayed start)
                    alpha: 0.45 - k * 0.06,
                    lineW: 3.5 - k * 0.6,
                    speed: 3.8 - k * 0.4,
                    wobble: 0.6 + k * 0.3  // wave distortion amount
                });
            }
        });

        function draw() {
            var w = canvas.width / dpr, h = canvas.height / dpr;
            ctx.clearRect(0, 0, w, h);

            for (var i = ripples.length - 1; i >= 0; i--) {
                var rp = ripples[i];
                rp.r += rp.speed;
                if (rp.r < 0) continue;             // still in delay phase
                rp.alpha -= 0.004;
                rp.lineW *= 0.998;                   // thin out over time
                if (rp.alpha <= 0) { ripples.splice(i, 1); continue; }

                var segments = 90;
                var step = (Math.PI * 2) / segments;

                // main ring — water-cyan tint
                ctx.beginPath();
                for (var s = 0; s <= segments; s++) {
                    var angle = s * step;
                    var wobble = Math.sin(angle * 6 + rp.r * 0.04) * rp.wobble;
                    var rx = rp.x + Math.cos(angle) * (rp.r + wobble);
                    var ry = rp.y + Math.sin(angle) * (rp.r + wobble);
                    if (s === 0) ctx.moveTo(rx, ry);
                    else ctx.lineTo(rx, ry);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(140,210,245,' + rp.alpha.toFixed(3) + ')';
                ctx.lineWidth = Math.max(rp.lineW, 0.3);
                ctx.stroke();

                // subtle inner highlight (bright refraction edge)
                if (rp.alpha > 0.12) {
                    ctx.beginPath();
                    for (var s2 = 0; s2 <= segments; s2++) {
                        var a2 = s2 * step;
                        var w2 = Math.sin(a2 * 6 + rp.r * 0.04) * rp.wobble * 0.5;
                        var rx2 = rp.x + Math.cos(a2) * (rp.r * 0.92 + w2);
                        var ry2 = rp.y + Math.sin(a2) * (rp.r * 0.92 + w2);
                        if (s2 === 0) ctx.moveTo(rx2, ry2);
                        else ctx.lineTo(rx2, ry2);
                    }
                    ctx.closePath();
                    ctx.strokeStyle = 'rgba(200,235,255,' + (rp.alpha * 0.35).toFixed(3) + ')';
                    ctx.lineWidth = Math.max(rp.lineW * 0.4, 0.2);
                    ctx.stroke();
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }());
}());
