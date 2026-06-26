/* ============================================================================
   OSCP Learning — shared site navigation
   Single source of truth for the sticky table-of-contents shown on every
   multi-file page (contents, lessons, references). Injected client-side so the
   30-link nav lives in ONE place instead of being copied into every page; the
   breadcrumb on each page is the no-JS / print fallback.

   The single-file build (build-artifact.py → oscp-course.html) does NOT use
   this — it strips the <script> tag and renders its own equivalent nav from
   the matching PAGES list in Python.
   ========================================================================== */
(function () {
  // Path back to the site root, derived from this script's own src
  // ("assets/site-nav.js" at root → ""; "../assets/site-nav.js" → "../").
  var self = document.currentScript;
  var root = self ? self.getAttribute("src").replace(/assets\/site-nav\.js.*$/, "") : "";

  // Order + labels mirror PAGES in build-artifact.py. The two lists target
  // different links (separate files here, in-page anchors there), so they're
  // kept in sync by hand rather than shared.
  var PAGES = [
    ["index.html", "Contents", true],
    ["lessons/0001-the-oscp-attack-chain.html", "01 · Attack Chain"],
    ["lessons/0002-the-deliberate-practice-loop.html", "02 · Practice Loop"],
    ["lessons/0003-service-enumeration.html", "03 · Enumeration"],
    ["lessons/0004-attacking-the-web-service.html", "04 · Web Service"],
    ["lessons/0005-exploiting-the-web-foothold.html", "05 · Web Exploitation"],
    ["lessons/0006-linux-privilege-escalation.html", "06 · Linux Privesc"],
    ["lessons/0007-windows-privilege-escalation.html", "07 · Windows Privesc"],
    ["lessons/0008-password-attacks-and-credential-reuse.html", "08 · Password Attacks"],
    ["lessons/0009-footholds-beyond-the-web.html", "09 · Footholds"],
    ["lessons/0010-active-directory-enumeration.html", "10 · AD Enumeration"],
    ["lessons/0011-active-directory-authentication-attacks.html", "11 · AD Auth Attacks"],
    ["lessons/0012-active-directory-lateral-movement.html", "12 · AD → Domain Admin"],
    ["lessons/0013-pivoting-and-tunneling.html", "13 · Pivoting"],
    ["lessons/0014-post-exploitation-looting.html", "14 · Looting"],
    ["lessons/0015-writing-the-report.html", "15 · The Report"],
    ["lessons/0016-exam-strategy.html", "16 · Exam Strategy"],
    ["lessons/0017-mock-exam.html", "17 · Mock Exam"],
    ["reference/glossary.html", "Glossary"],
    ["reference/exam-format.html", "Exam Format"],
    ["reference/practice-boxes.html", "Practice Boxes"],
    ["reference/enumeration-cheatsheet.html", "Enum Cheatsheet"],
    ["reference/web-exploitation.html", "Web Exploitation"],
    ["reference/linux-privesc.html", "Linux Privesc"],
    ["reference/windows-privesc.html", "Windows Privesc"],
    ["reference/password-attacks.html", "Password Attacks"],
    ["reference/active-directory.html", "Active Directory"],
    ["reference/pivoting.html", "Pivoting"],
    ["reference/report-writing.html", "Report Writing"],
    ["reference/links.html", "Useful Links"]
  ];

  function build() {
    var here = location.pathname.split("/").pop() || "index.html";
    var nav = document.createElement("nav");
    nav.className = "toc";
    nav.setAttribute("aria-label", "Course sections");
    PAGES.forEach(function (page) {
      var href = page[0], label = page[1], home = page[2];
      var a = document.createElement("a");
      a.href = root + href;
      a.textContent = label;
      if (home) a.className = "home";
      if (href.split("/").pop() === here) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);
})();
