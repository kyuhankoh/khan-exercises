requirejs.config({
    paths: {
        "jquery": "/ODSAkhan-exercises/local-only/jquery",
    }
});

requirejs([
    "jquery",
    "/ODSAkhan-exercises/local-only/katex/katex.js",
    "/ODSAkhan-exercises/local-only/underscore.js",
    "/ODSAkhan-exercises/local-only/jed.js",
    "/ODSAkhan-exercises/local-only/localeplanet/icu." + getLang() + ".js",
    "/ODSAkhan-exercises/local-only/moment.js"
], function($, katex) {
    // Only 'jquery' and 'katex' have amd wrappers (and jQuery sets the global
    // regardless); the other files export globally directly and we don't use
    // their return values
    window.katex = katex;

    // These scripts depend on jQuery or underscore, so we wait to load them
    requirejs([
        "/ODSAkhan-exercises/exercises-stub.js",
        "/ODSAkhan-exercises/local-only/jquery-migrate-1.1.1.js",
        "/ODSAkhan-exercises/local-only/jquery-ui.js",
        "/ODSAkhan-exercises/local-only/jquery.qtip.js",
        "/ODSAkhan-exercises/local-only/kas.js",
        "/ODSAkhan-exercises/local-only/i18n.js"
    ], function() {
        requirejs([
            "/ODSAkhan-exercises/history.js",
            "/ODSAkhan-exercises/interface.js",
        ], function() {
            requirejs(["/ODSAkhan-exercises/khan-exercise.js"], function() {
                Khan.loadLocalModeSiteWhenReady();
            });
        });
    });
});

function getLang() {
    var match = /[?&]lang=([^&]+)/.exec(window.location.search);
    return match ? match[1] : "en-US";
}
