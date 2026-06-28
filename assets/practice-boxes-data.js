/* ============================================================================
   Practice-box data — the SINGLE source of truth for the box map.
   Rendered by assets/practice-boxes.js in both the lessons and the reference.

   Two tables:
     PB_BOXES   — machine-level facts (one entry per machine, keyed by slug):
                  name, src, os, diff, and (HTB only) the 0xdf walkthrough url.
     PB_LESSONS — per-lesson teaching context. Each lesson lists ordered items;
                  every item points at a box slug and adds the LESSON's angle
                  on it: a vector tag, Core/Optional, and a one-line "what".

   No machine is listed twice as a fresh target. A box has ONE home lesson
   (a Core/Optional item); where it also teaches a later lesson it appears with
   reuse:{from:N} — a muted "Reused · LNN" card whose text explains the new
   angle. Checkmarks are keyed by slug, so one machine = one checkmark however
   many lessons reference it.

   Sources: HTB = Hack The Box · PG = Proving Grounds Practice ·
   PEN-200 = OffSec Challenge Labs · curated from TJ Null's list + 0xdf.
   0xdf links are for AFTER-the-fact review only. All URLs verified.
   ========================================================================== */

/* eslint-disable */
var PB_BOXES = {
  // ---- HTB (linked to its 0xdf walkthrough) ----
  lame:        { name: "Lame",         src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2020/04/07/htb-lame.html" },
  blue:        { name: "Blue",         src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2021/05/11/htb-blue.html" },
  jerry:       { name: "Jerry",        src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2018/11/17/htb-jerry.html" },
  netmon:      { name: "Netmon",       src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2019/06/29/htb-netmon.html" },
  knife:       { name: "Knife",        src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2021/08/28/htb-knife.html" },
  nibbles:     { name: "Nibbles",      src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2018/06/30/htb-nibbles.html" },
  openadmin:   { name: "OpenAdmin",    src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2020/05/02/htb-openadmin.html" },
  networked:   { name: "Networked",    src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2019/11/16/htb-networked.html" },
  bashed:      { name: "Bashed",       src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2018/04/29/htb-bashed.html" },
  sense:       { name: "Sense",        src: "HTB", os: "BSD",     diff: "Easy", url: "https://0xdf.gitlab.io/2021/03/11/htb-sense.html" },
  cronos:      { name: "Cronos",       src: "HTB", os: "Linux",   diff: "Med",  url: "https://0xdf.gitlab.io/2020/04/14/htb-cronos.html" },
  precious:    { name: "Precious",     src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2023/05/20/htb-precious.html" },
  astronaut:   { name: "Astronaut",    src: "PG",  os: "Linux",   diff: "Easy" },
  sau:         { name: "Sau",          src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2024/01/06/htb-sau.html" },
  photobomb:   { name: "Photobomb",    src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2023/02/11/htb-photobomb.html" },
  shocker:     { name: "Shocker",      src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2021/05/25/htb-shocker.html" },
  beep:        { name: "Beep",         src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2021/02/23/htb-beep.html" },
  traverxec:   { name: "Traverxec",    src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2020/04/11/htb-traverxec.html" },
  optimum:     { name: "Optimum",      src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2021/03/17/htb-optimum.html" },
  devel:       { name: "Devel",        src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2019/03/05/htb-devel.html" },
  jeeves:      { name: "Jeeves",       src: "HTB", os: "Windows", diff: "Med",  url: "https://0xdf.gitlab.io/2022/04/14/htb-jeeves.html" },
  remote:      { name: "Remote",       src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2020/09/05/htb-remote.html" },
  bastard:     { name: "Bastard",      src: "HTB", os: "Windows", diff: "Med",  url: "https://0xdf.gitlab.io/2019/03/12/htb-bastard.html" },
  bastion:     { name: "Bastion",      src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2019/09/07/htb-bastion.html" },
  support:     { name: "Support",      src: "HTB", os: "AD",      diff: "Easy", url: "https://0xdf.gitlab.io/2022/12/17/htb-support.html" },
  sauna:       { name: "Sauna",        src: "HTB", os: "AD",      diff: "Easy", url: "https://0xdf.gitlab.io/2020/07/18/htb-sauna.html" },
  active:      { name: "Active",       src: "HTB", os: "AD",      diff: "Easy", url: "https://0xdf.gitlab.io/2018/12/08/htb-active.html" },
  legacy:      { name: "Legacy",       src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2019/02/21/htb-legacy.html" },
  granny:      { name: "Granny",       src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2019/03/06/htb-granny.html" },
  friendzone:  { name: "FriendZone",   src: "HTB", os: "Linux",   diff: "Easy", url: "https://0xdf.gitlab.io/2019/07/13/htb-friendzone.html" },
  forest:      { name: "Forest",       src: "HTB", os: "AD",      diff: "Easy", url: "https://0xdf.gitlab.io/2020/03/21/htb-forest.html" },
  intelligence:{ name: "Intelligence", src: "HTB", os: "AD",      diff: "Med",  url: "https://0xdf.gitlab.io/2021/11/27/htb-intelligence.html" },
  resolute:    { name: "Resolute",     src: "HTB", os: "AD",      diff: "Med",  url: "https://0xdf.gitlab.io/2020/05/30/htb-resolute.html" },
  scrambled:   { name: "Scrambled",    src: "HTB", os: "AD",      diff: "Med",  url: "https://0xdf.gitlab.io/2022/10/01/htb-scrambled.html" },
  cascade:     { name: "Cascade",      src: "HTB", os: "AD",      diff: "Med",  url: "https://0xdf.gitlab.io/2020/07/25/htb-cascade.html" },
  blackfield:  { name: "Blackfield",   src: "HTB", os: "AD",      diff: "Hard", url: "https://0xdf.gitlab.io/2020/10/03/htb-blackfield.html" },
  monteverde:  { name: "Monteverde",   src: "HTB", os: "AD",      diff: "Med",  url: "https://0xdf.gitlab.io/2020/06/13/htb-monteverde.html" },
  access:      { name: "Access",       src: "HTB", os: "Windows", diff: "Easy", url: "https://0xdf.gitlab.io/2019/03/02/htb-access.html" },
  reddish:     { name: "Reddish",      src: "HTB", os: "Linux",   diff: "Hard", url: "https://0xdf.gitlab.io/2019/01/26/htb-reddish.html" },

  // ---- Proving Grounds (no 0xdf walkthrough) ----
  twiggy:      { name: "Twiggy",       src: "PG",  os: "Linux",   diff: "Easy" },
  hetemit:     { name: "Hetemit",      src: "PG",  os: "Linux",   diff: "Inter" },
  clamav:      { name: "ClamAV",       src: "PG",  os: "Linux",   diff: "Easy" },
  payday:      { name: "PayDay",       src: "PG",  os: "Linux",   diff: "Easy" },
  clue:        { name: "Clue",         src: "PG",  os: "Linux",   diff: "Inter" },
  algernon:    { name: "Algernon",     src: "PG",  os: "Windows", diff: "Easy" },
  heist:       { name: "Heist",        src: "PG",  os: "AD",      diff: "Inter" },
  nickel:      { name: "Nickel",       src: "PG",  os: "Windows", diff: "Inter" },
  vault:       { name: "Vault",        src: "PG",  os: "AD",      diff: "Inter" },
  resourced:   { name: "Resourced",    src: "PG",  os: "AD",      diff: "Inter" },

  // ---- Multi-host sets / labs (no single walkthrough; diff omitted) ----
  oscp_a:      { name: "OSCP A",                 src: "PEN-200", os: "AD set" },
  oscp_bc:     { name: "OSCP B / C",             src: "PEN-200", os: "AD set" },
  relia:       { name: "Relia / Skylark",        src: "PEN-200", os: "Mixed" },
  dante:       { name: "Dante (Pro Lab)",        src: "HTB",     os: "Mixed" },
  pg_exam:     { name: "PG “exam-like” set", src: "PG",  os: "Mixed" },
  htb_oscplike:{ name: "HTB OSCP-like tier",     src: "HTB",     os: "Mixed" }
};

var PB_LESSONS = {
  1: {
    title: "The OSCP Attack Chain",
    blurb: "The goal here isn't a technique — it's to feel the whole chain once. Own one easy box end-to-end.",
    items: [
      { box: "lame",   vector: "Whole chain",  req: "core",     what: "Samba username map script (CVE-2007-2447) drops you straight to root — no privesc phase." },
      { box: "blue",   vector: "Whole chain",  req: "core",     what: "EternalBlue (MS17-010) → SYSTEM; foothold and privesc as a single motion." },
      { box: "jerry",  vector: "Whole chain",  req: "optional", what: "Tomcat manager creds → WAR webshell → SYSTEM; the shortest end-to-end on Windows." },
      { box: "netmon", vector: "Recon → RCE", req: "optional", what: "Readable PRTG config creds → authenticated RCE → SYSTEM; recon-to-root in a straight line." }
    ]
  },
  2: {
    title: "The Deliberate-Practice Loop",
    blurb: "Your first attempt-first box. Forgiving targets, so you practise the loop, not just the box.",
    items: [
      { box: "twiggy", vector: "Version → CVE",  req: "core",     what: "SaltStack CVE-2020-11651 → root; enumeration points straight at the version — a clean attempt-first rep." },
      { box: "knife",  vector: "Single chain",   req: "core",     what: "PHP 8.1 dev backdoor → shell → sudo knife GTFOBin → root; forgiving end-to-end." },
      { box: "blue",   reuse: { from: 1 },        what: "Re-own it attempt-first: a gentle enumerate → exploit → loot run with one clean vector." },
      { box: "lame",   reuse: { from: 1 },        what: "Hard to break, fast to own — a low-stakes loop rep when you want a confidence win." }
    ]
  },
  3: {
    title: "Service Enumeration",
    blurb: "Boxes where the enumeration IS the challenge — the foothold is invisible until you look properly.",
    items: [
      { box: "nibbles",   vector: "Hidden web path",  req: "core",     what: "Foothold hides behind a /nibbleblog/ path only thorough web enum reveals." },
      { box: "openadmin", vector: "Full port + web",  req: "core",     what: "Internal OpenNetAdmin + a tunnelled port — rewards enumerating everything." },
      { box: "networked", vector: "App enumeration",  req: "optional", what: "An upload filter you only spot by reading the app carefully." },
      { box: "hetemit",   vector: "Obscure service",  req: "optional", what: "An obscure service you must enumerate to even find the vulnerable endpoint." },
      { box: "clamav",    vector: "Non-standard ports", req: "optional", what: "Non-standard ports — here the port scan basically is the box." }
    ]
  },
  4: {
    title: "Attacking the Web Service",
    blurb: "Web recon, directory busting, version → CVE, and the classic web vulnerability classes.",
    items: [
      { box: "bashed",   vector: "Dir-bust → shell", req: "core",     what: "gobuster finds a phpbash web shell in /dev/ — the payoff of directory busting." },
      { box: "sense",    vector: "Recon → CVE",      req: "core",     what: "pfSense creds in a hidden .txt, then a version-matched CVE — recon → exploit." },
      { box: "cronos",   vector: "SQLi auth bypass",  req: "optional", what: "vhost/DNS enum (AXFR) → a Laravel login SQLi auth bypass." },
      { box: "precious", vector: "Version → CVE",    req: "optional", what: "Ruby pdfkit version → a known command-injection CVE → shell." },
      { box: "payday",   vector: "CMS admin → RCE",  req: "optional", what: "CS-Cart CMS admin → web RCE; a textbook web foothold." }
    ]
  },
  5: {
    title: "Exploiting the Web Foothold",
    blurb: "Turning a web vuln into a shell: upload bypass, RCE, command injection, SQLi → exec.",
    items: [
      { box: "astronaut", vector: "Template injection", req: "core",     what: "Grav CMS PHP-template injection → RCE → shell." },
      { box: "sau",       vector: "SSRF → RCE",       req: "core",     what: "Request-Baskets SSRF → internal Maltrail → command injection → shell." },
      { box: "photobomb", vector: "Command injection", req: "optional", what: "Authenticated command injection in the download endpoint → reverse shell." },
      { box: "nibbles",   reuse: { from: 3 }, what: "Now weaponise it: Nibbleblog image-upload → RCE → reverse shell." },
      { box: "networked", reuse: { from: 3 }, what: "Double-extension upload bypass → PHP execution." },
      { box: "cronos",    reuse: { from: 4 }, what: "SQLi bypass → command-injection panel → shell." }
    ]
  },
  6: {
    title: "Linux Privilege Escalation",
    blurb: "Low-priv shell → root: sudo, SUID, cron, capabilities, writable files.",
    items: [
      { box: "shocker",   vector: "sudo GTFOBin",   req: "core",     what: "Shellshock CGI foothold → sudo perl GTFOBin → root." },
      { box: "beep",      vector: "Many paths",     req: "core",     what: "A dozen privesc paths in one box — ideal for interleaving vectors." },
      { box: "traverxec", vector: "Cron / SSH key", req: "optional", what: "nostromo RCE → readable backup → journalctl/SSH-key path to root." },
      { box: "clue",      vector: "SUID / cron / caps", req: "optional", what: "SUID / cron / capability chains; a PEAS-driven enumeration rep." },
      { box: "bashed",    reuse: { from: 4 }, what: "The privesc half: sudo -l NOPASSWD → a writable root cron script → root." },
      { box: "lame",      reuse: { from: 1 }, what: "Baseline easy box — a warm-up before the misconfiguration vectors." }
    ]
  },
  7: {
    title: "Windows Privilege Escalation",
    blurb: "Service abuse, token privileges (SeImpersonate), and kernel exploits as a last resort.",
    items: [
      { box: "optimum",  vector: "Kernel exploit",   req: "core",     what: "HFS 2.3 RCE (CVE-2014-6287) → MS16-032 kernel privesc to SYSTEM." },
      { box: "jeeves",   vector: "SeImpersonate",    req: "core",     what: "Jenkins RCE → SeImpersonate token abuse → admin." },
      { box: "devel",    vector: "Kernel exploit",   req: "optional", what: "FTP → webroot .aspx shell → kernel exploit to SYSTEM." },
      { box: "remote",   vector: "Service abuse",    req: "optional", what: "Umbraco RCE → writable UsoSvc service → SYSTEM (TeamViewer-creds path also works)." },
      { box: "bastard",  vector: "Token abuse",      req: "optional", what: "Drupalgeddon → Churrasco / token abuse → SYSTEM." },
      { box: "algernon", vector: "PrintSpoofer",     req: "optional", what: "Service-binary RCE + SeImpersonate (PrintSpoofer) — the modern reflex." }
    ]
  },
  8: {
    title: "Password Attacks & Credential Reuse",
    blurb: "Hash cracking, spraying, and reusing every credential you find everywhere you can.",
    items: [
      { box: "sauna",   vector: "AS-REP → reuse",   req: "core",     what: "AS-REP roast → hashcat → reuse autologon creds from the registry." },
      { box: "active",  vector: "GPP → Kerberoast", req: "core",     what: "GPP cpassword decrypt → Kerberoast → crack the admin SPN." },
      { box: "bastion", vector: "Cred reuse",        req: "optional", what: "Mount a VHD → dump SAM; recover mRemoteNG creds and reuse them." },
      { box: "support", vector: "Info-disclosure",   req: "optional", what: "LDAP description-field creds → reuse to enumerate the DC." },
      { box: "heist",   vector: "Spray + reuse",     req: "optional", what: "Config/description-field creds → spray and reuse across the host." },
      { box: "jeeves",  reuse: { from: 7 }, what: "KeePass .kdbx → keepass2john → crack → reuse the hash via psexec." }
    ]
  },
  9: {
    title: "Footholds Beyond the Web",
    blurb: "SMB, FTP, and other non-HTTP services — version-matched exploits and share abuse.",
    items: [
      { box: "legacy",     vector: "SMB CVE",     req: "core",     what: "MS08-067 / MS17-010 on ancient SMB — the version-match reflex." },
      { box: "granny",     vector: "WebDAV upload", req: "core",   what: "IIS 6.0 WebDAV → upload an .aspx webshell → foothold." },
      { box: "friendzone", vector: "SMB / DNS",   req: "optional", what: "SMB share + DNS zone transfer → LFI → foothold." },
      { box: "nickel",     vector: "Non-HTTP exploit", req: "optional", what: "Non-HTTP service exploitation chained to a foothold." },
      { box: "blue",       reuse: { from: 1 }, what: "MS17-010 EternalBlue over SMB — the classic non-web foothold (foothold + privesc in one shot)." },
      { box: "lame",       reuse: { from: 1 }, what: "vsftpd 2.3.4 backdoor + Samba — a non-web service foothold." }
    ]
  },
  10: {
    title: "Active Directory Enumeration",
    blurb: "ldapsearch, rpcclient, BloodHound — mapping the domain before you touch it.",
    items: [
      { box: "forest",       vector: "LDAP → BloodHound", req: "core",     what: "Anonymous LDAP / rpcclient enum → BloodHound path discovery." },
      { box: "intelligence", vector: "Doc + DNS enum",      req: "core",     what: "Enumerate web docs + DNS for users → spray → a service-account path." },
      { box: "vault",        vector: "LDAP + SMB enum",     req: "optional", what: "LDAP + SMB share enumeration to seed the attack." },
      { box: "oscp_a",       vector: "Exam-scale enum",     req: "optional", what: "Official multi-host AD enumeration at exam scale." },
      { box: "sauna",        reuse: { from: 8 }, what: "Web → user list → GetNPUsers; the ldapsearch + SharpHound flow." }
    ]
  },
  11: {
    title: "AD Authentication Attacks",
    blurb: "AS-REP roasting, Kerberoasting, and password spraying against the domain.",
    items: [
      { box: "resolute",  vector: "Spray from enum",     req: "core",     what: "rpcclient description-field password → spray → foothold." },
      { box: "scrambled", vector: "Kerberoast (no creds)", req: "core",   what: "Kerberoast without credentials (via MSSQL) → crack the SPN." },
      { box: "resourced", vector: "Roast + spray",       req: "optional", what: "Pre-auth roasting + spraying reps." },
      { box: "sauna",     reuse: { from: 8 },  what: "AS-REP roasting end-to-end (GetNPUsers → crack)." },
      { box: "active",    reuse: { from: 8 },  what: "Kerberoasting (GetUserSPNs) + GPP cpassword." },
      { box: "forest",    reuse: { from: 10 }, what: "AS-REP roast a no-preauth account → crack → foothold." }
    ]
  },
  12: {
    title: "AD Lateral Movement → Domain Admin",
    blurb: "Pass-the-hash, ACL abuse, DCSync, and dangerous group memberships.",
    items: [
      { box: "cascade",    vector: "Cred recovery → move", req: "core",     what: "Reversible / AD-recycle-bin credentials → move laterally to admin." },
      { box: "blackfield", vector: "ACL → SeBackup → NTDS", req: "core", what: "ForceChangePassword ACL → SeBackupPrivilege → dump NTDS.dit." },
      { box: "monteverde", vector: "Azure Admins → DA", req: "optional", what: "Azure AD Connect DB leaks the on-prem admin password → DCSync." },
      { box: "forest",     reuse: { from: 10 }, what: "BloodHound WriteDacl → grant DCSync → secretsdump." },
      { box: "resolute",   reuse: { from: 11 }, what: "DnsAdmins DLL load → SYSTEM on the DC." }
    ]
  },
  13: {
    title: "Pivoting & Tunneling",
    blurb: "Multi-host networks: ligolo-ng, chisel, proxychains, and reaching an internal DC.",
    items: [
      { box: "dante",   vector: "Multi-host pivot", req: "core",     what: "A multi-host network — the canonical pivoting playground." },
      { box: "oscp_bc", vector: "Tunnel to DC",     req: "core",     what: "Exam-shaped chains where you must tunnel to reach the internal DC." },
      { box: "relia",   vector: "Double pivot",     req: "optional", what: "Larger scenario labs — deep double-pivot reps." },
      { box: "reddish", vector: "Docker-net pivot", req: "optional", what: "Classic Docker-network pivot (rated Insane — a stretch goal once tunnelling clicks)." }
    ]
  },
  14: {
    title: "Post-Exploitation Looting",
    blurb: "Harvesting creds, hashes, and config secrets to fuel the next hop. Reuse the AD boxes here.",
    items: [
      { box: "access",  vector: "Stored creds", req: "core", what: "A zip of creds + runas /savecred stored credentials — pure looting practice." },
      { box: "sauna",   reuse: { from: 8 },  what: "secretsdump, registry autologon, SAM/NTDS looting." },
      { box: "active",  reuse: { from: 8 },  what: "GPP + Kerberoast loot; clean secretsdump practice." },
      { box: "jeeves",  reuse: { from: 7 },  what: "KeePass database + credential files as loot." },
      { box: "cascade", reuse: { from: 12 }, what: "LDAP / registry / recycle-bin credential harvesting." }
    ]
  },
  17: {
    title: "Mock Exam",
    blurb: "A full, timed, no-walkthrough simulation: roughly three standalone targets plus a small AD set.",
    items: [
      { box: "pg_exam",      vector: "Exam rhythm",      req: "core",     what: "3–4 “exam-like” standalones — build your 24-hour rhythm on OffSec's own grading philosophy." },
      { box: "htb_oscplike", vector: "Timed standalones", req: "optional", what: "TJ Null “OSCP-like” tier under exam rules (one-machine automation only)." },
      { box: "oscp_a",       reuse: { from: 10 }, what: "Under exam conditions now — no walkthrough, on the clock." },
      { box: "oscp_bc",      reuse: { from: 13 }, what: "Chain the standalones + AD set blind, timed end-to-end." }
    ]
  }
};
