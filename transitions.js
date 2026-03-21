// transitions.js — Smooth same-site page navigation
(function () {
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
}());
