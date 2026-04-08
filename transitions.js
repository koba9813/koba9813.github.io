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
}());
