/* Stash the few non-sensitive answers that thank-you.html echoes back, so a customer
   whose emailed reply lands in junk still has a record of what they sent — and a
   chance to spot a mistyped date while it is still cheap to fix.

   Why sessionStorage and not the redirect URL: the URL leaks into browser history,
   the referrer sent to any third party, and anything visible on a shared screen.
   thank-you.html clears the key the moment it reads it.

   Why a capture-phase listener on document rather than an edit to inquiry-form.js:
   that module is the shared platform engine used by every tenant. Keeping this
   here means her page gains the feature without the module drifting from canonical
   and owing every other tenant a redeploy.

   Deliberately NOT stashed: name, phone, email, address. This page gets left open. */
(function () {
  'use strict';
  document.addEventListener('submit', function (e) {
    try {
      var f = e.target;
      // Only our inquiry form — identified by the platform honeypot, which no other
      // form on the site has.
      if (!f || !f.querySelector || !f.querySelector('[name="company_url"]')) return;

      var val = function (id) {
        var el = f.querySelector('#f_' + id);
        return el && el.value ? el.value : '';
      };
      var checked = function (name) {
        return Array.prototype.slice
          .call(f.querySelectorAll('input[name="' + name + '"]:checked'))
          .map(function (i) { return i.value; });
      };

      sessionStorage.setItem('ifd_inq', JSON.stringify({
        date: val('date'),
        category: val('category'),
        services: checked('services')
      }));
    } catch (err) {
      /* Private mode throws on sessionStorage. The recap is a nicety; never let it
         interfere with the submit itself. */
    }
  }, true); // capture: fires before the module's own handler, whatever the order
})();
