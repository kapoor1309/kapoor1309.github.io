(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   *  Command palette  (⌘K / Ctrl+K)  — works on every page
   * ------------------------------------------------------------------ */
  var items = [
    { icon: "▸", label: "About",       sub: "index.html",     href: "index.html" },
    { icon: "▸", label: "Projects",    sub: "projects.html",  href: "projects.html" },
    { icon: "▸", label: "Research",    sub: "research.html",  href: "research.html" },
    { icon: "▸", label: "News",        sub: "news.html",      href: "news.html" },
    { icon: "⇩", label: "Resume / CV", sub: "pdf",            href: "resume.pdf", blank: true },
    { icon: "◆", label: "Warden",      sub: "github",         href: "https://github.com/kapoor1309/warden", blank: true },
    { icon: "◆", label: "RecallMind",  sub: "github",         href: "https://github.com/kapoor1309/recallmind", blank: true },
    { icon: "◆", label: "FocusBoard",  sub: "github",         href: "https://github.com/kapoor1309/focusboard", blank: true },
    { icon: "◆", label: "DLSG-CoT",    sub: "github",         href: "https://github.com/kapoor1309/DLSG-CoT", blank: true },
    { icon: "○", label: "GitHub",      sub: "profile",        href: "https://github.com/kapoor1309", blank: true },
    { icon: "in",label: "LinkedIn",    sub: "",               href: "https://www.linkedin.com/in/parshiv-kapoor-439564280/", blank: true },
    { icon: "@", label: "Email",       sub: "mailto",         href: "mailto:parshiv_k@bt.iitr.ac.in" }
  ];

  var overlay = document.createElement("div");
  overlay.className = "cmdk-overlay";
  overlay.innerHTML =
    '<div class="cmdk" role="dialog" aria-label="Command palette">' +
      '<input class="cmdk-input" placeholder="Type a command or search…" aria-label="Search">' +
      '<div class="cmdk-list"></div>' +
    "</div>";
  document.body.appendChild(overlay);

  var pInput = overlay.querySelector(".cmdk-input");
  var pList = overlay.querySelector(".cmdk-list");
  var filtered = items.slice();
  var active = 0;

  function renderList() {
    pList.innerHTML = "";
    if (!filtered.length) {
      pList.innerHTML = '<div class="cmdk-empty">No results</div>';
      return;
    }
    filtered.forEach(function (it, i) {
      var el = document.createElement("div");
      el.className = "cmdk-item" + (i === active ? " active" : "");
      el.innerHTML =
        '<span class="ci-ico">' + it.icon + "</span>" +
        "<span>" + it.label + "</span>" +
        '<span class="ci-sub">' + it.sub + "</span>";
      el.addEventListener("click", function () { go(it); });
      el.addEventListener("mousemove", function () { active = i; highlight(); });
      pList.appendChild(el);
    });
  }
  function highlight() {
    var kids = pList.children;
    for (var i = 0; i < kids.length; i++) kids[i].classList.toggle("active", i === active);
    if (kids[active] && kids[active].scrollIntoView) kids[active].scrollIntoView({ block: "nearest" });
  }
  function openPalette() {
    overlay.classList.add("open");
    pInput.value = ""; filtered = items.slice(); active = 0; renderList();
    setTimeout(function () { pInput.focus(); }, 20);
  }
  function closePalette() { overlay.classList.remove("open"); }
  function go(it) {
    closePalette();
    if (it.blank) window.open(it.href, "_blank");
    else window.location.href = it.href;
  }

  pInput.addEventListener("input", function () {
    var q = pInput.value.toLowerCase().trim();
    filtered = items.filter(function (it) {
      return (it.label + " " + it.sub).toLowerCase().indexOf(q) !== -1;
    });
    active = 0; renderList();
  });
  pInput.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); highlight(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); highlight(); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[active]) go(filtered[active]); }
    else if (e.key === "Escape") { closePalette(); }
  });
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closePalette(); });
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay.classList.contains("open") ? closePalette() : openPalette();
    }
  });

  var pill = document.createElement("button");
  pill.className = "cmdk-pill";
  pill.setAttribute("aria-label", "Open command menu");
  pill.innerHTML = "<kbd>⌘</kbd><kbd>K</kbd>&nbsp;menu";
  pill.addEventListener("click", openPalette);
  document.body.appendChild(pill);

  /* ------------------------------------------------------------------ *
   *  Interactive terminal  — only on the page that has #term-out
   * ------------------------------------------------------------------ */
  var out = document.getElementById("term-out");
  var form = document.getElementById("term-form");
  var tin = document.getElementById("term-input");

  if (out && form && tin) {
    var body = out.parentElement;

    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function scroll() { out.scrollTop = out.scrollHeight; }
    function echo(cmd) {
      var p = document.createElement("p");
      p.className = "t-cmd";
      p.innerHTML = '<span class="prompt">visitor@parshiv:~$</span> ' + esc(cmd);
      out.appendChild(p);
    }
    function print(html, cls) {
      var p = document.createElement("p");
      p.className = "t-res" + (cls ? " " + cls : "");
      p.innerHTML = html;
      out.appendChild(p);
    }

    var cmds = {
      help: function () {
        print(
          "available commands:<br>&nbsp; <span class='t-key'>about</span> &nbsp; <span class='t-key'>projects</span> &nbsp; <span class='t-key'>research</span> &nbsp; <span class='t-key'>skills</span> &nbsp; <span class='t-key'>socials</span> &nbsp; <span class='t-key'>resume</span><br>" +
          "&nbsp; <span class='t-key'>contact</span> &nbsp; <span class='t-key'>whoami</span> &nbsp; <span class='t-key'>ls</span> &nbsp; <span class='t-key'>open &lt;page&gt;</span> &nbsp; <span class='t-key'>date</span> &nbsp; <span class='t-key'>clear</span> &nbsp; <span class='t-key'>sudo</span> &nbsp; <span class='t-key'>coffee</span><br>" +
          "&nbsp; <span class='t-key'>contact</span> lets you send me a message right from here ✉️"
        );
      },
      about: function () { print("I build robust, interpretable AI systems across vision-language models, AI agents, and medical imaging. I like taking an idea from a paper all the way to a working pipeline."); },
      whoami: function () { print("Parshiv Kapoor · pre-final year B.Tech @ IIT Roorkee"); },
      projects: function () {
        print(
          "→ <a href='https://github.com/kapoor1309/warden' target='_blank'>warden</a> &nbsp;&nbsp; agent-security crew<br>" +
          "→ <a href='https://github.com/kapoor1309/recallmind' target='_blank'>recallmind</a> &nbsp;&nbsp; llm memory layer<br>" +
          "→ <a href='https://github.com/kapoor1309/focusboard' target='_blank'>focusboard</a> &nbsp;&nbsp; claude-code companion<br>" +
          "run <span class='t-key'>open projects</span> for the full page"
        );
      },
      research: function () { print("2× AAAI 2026 (Student Abstract) · ICVGIP 2025 — see <a href='research.html'>research</a>"); },
      skills: function () { print("python · c++ · pytorch · tensorflow · huggingface · langgraph · crewai · faiss · qdrant"); },
      socials: function () { print("<a href='https://github.com/kapoor1309' target='_blank'>github</a> &nbsp;·&nbsp; <a href='https://www.linkedin.com/in/parshiv-kapoor-439564280/' target='_blank'>linkedin</a> &nbsp;·&nbsp; <a href='mailto:parshiv_k@bt.iitr.ac.in'>email</a>"); },
      contact: function () { startContact(); },
      resume: function () { print("opening resume.pdf …"); window.open("resume.pdf", "_blank"); },
      cv: function () { cmds.resume(); },
      ls: function () { print("about&nbsp;&nbsp;projects&nbsp;&nbsp;research&nbsp;&nbsp;news&nbsp;&nbsp;resume"); },
      date: function () { print(new Date().toString()); },
      sudo: function () { print("nice try 😏 — no root here. just <a href='mailto:parshiv_k@bt.iitr.ac.in'>email me</a> instead.", "warn"); },
      coffee: function () { print("&nbsp;&nbsp;( (<br>&nbsp;&nbsp;&nbsp;) )<br>&nbsp;&nbsp;........<br>&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;|]<br>&nbsp;&nbsp;\\&nbsp;&nbsp;&nbsp;/<br>&nbsp;&nbsp;&nbsp;`--'&nbsp;&nbsp; brewing great AI ☕"); },
      matrix: function () { print("entering the matrix… (click or press Esc to exit)"); matrixRain(); },
      clear: function () { out.innerHTML = ""; }
    };

    var pages = { about: "index.html", home: "index.html", projects: "projects.html", research: "research.html", news: "news.html", resume: "resume.pdf" };

    function run(raw) {
      var line = raw.trim();
      if (!line) return;
      echo(line);
      var parts = line.split(/\s+/);
      var cmd = parts[0].toLowerCase();

      if (cmd === "open" || cmd === "cd") {
        var t = (parts[1] || "").toLowerCase();
        if (pages[t]) {
          print("navigating to " + t + " …");
          setTimeout(function () { window.location.href = pages[t]; }, 250);
        } else {
          print("no such page: " + esc(parts[1] || ""), "err");
        }
      } else if (cmd === "echo") {
        print(esc(parts.slice(1).join(" ")) || "&nbsp;");
      } else if (cmds[cmd]) {
        cmds[cmd]();
      } else {
        print("command not found: " + esc(cmd) + " — type <span class='t-key'>help</span>", "err");
      }
      scroll();
    }

    /* ----- contact wizard: send a message straight from the terminal ----- */
    var promptEl = form.querySelector(".prompt2");
    var DEFAULT_PROMPT = "visitor@parshiv:~$";
    var contact = null; // { step, data } when active
    var steps = [
      { key: "name",  q: "your name »" },
      { key: "email", q: "your email »" },
      { key: "msg",   q: "your message »" }
    ];
    function setPrompt(t) { if (promptEl) promptEl.textContent = t; }

    function startContact() {
      contact = { step: 0, data: {} };
      print("let's talk. answer 3 quick prompts (type <span class='t-key'>cancel</span> to abort):");
      setPrompt(steps[0].q);
      scroll();
    }
    function handleContact(v) {
      var val = v.trim();
      if (val.toLowerCase() === "cancel") { contact = null; setPrompt(DEFAULT_PROMPT); print("contact cancelled.", "warn"); return; }
      var cur = steps[contact.step];
      if (!val) { print("(required) " + cur.q.replace(" »", ""), "warn"); return; }
      if (cur.key === "email" && val.indexOf("@") === -1) { print("hmm, that doesn't look like an email — try again", "warn"); return; }

      // show the answered prompt in history
      var p = document.createElement("p");
      p.className = "t-cmd";
      p.innerHTML = "<span class='prompt'>" + cur.q + "</span> " + esc(val);
      out.appendChild(p);

      contact.data[cur.key] = val;
      contact.step++;

      if (contact.step < steps.length) {
        setPrompt(steps[contact.step].q);
      } else {
        var d = contact.data;
        contact = null;
        setPrompt(DEFAULT_PROMPT);
        var subject = encodeURIComponent("Portfolio message from " + (d.name || "someone"));
        var lines = (d.msg || "") + "\n\n— " + (d.name || "") + (d.email ? " (" + d.email + ")" : "");
        var mailto = "mailto:parshiv_k@bt.iitr.ac.in?subject=" + subject + "&body=" + encodeURIComponent(lines);
        print("thanks, " + esc(d.name) + "! opening your mail app to send this to Parshiv ✉️");
        print("(no mail client? just email <a href='mailto:parshiv_k@bt.iitr.ac.in'>parshiv_k@bt.iitr.ac.in</a>)");
        window.open(mailto, "_blank");
      }
      scroll();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = tin.value; tin.value = "";
      if (contact) handleContact(v);
      else run(v);
      scroll();
    });
    body.addEventListener("click", function (e) { if (!e.target.closest("a")) tin.focus(); });
  }

  /* ------------------------------------------------------------------ *
   *  Matrix rain easter egg
   * ------------------------------------------------------------------ */
  function matrixRain() {
    var c = document.createElement("canvas");
    c.style.cssText = "position:fixed;inset:0;z-index:90;background:#000;cursor:pointer";
    document.body.appendChild(c);
    var ctx = c.getContext("2d");
    function size() { c.width = window.innerWidth; c.height = window.innerHeight; }
    size();
    var step = 15;
    var cols = Math.floor(c.width / step);
    var y = new Array(cols).fill(1);
    var chars = "01<>[]{}$#*/\\ｱｲｳｴｵｶｷ";
    var raf;
    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#8B7BFF";
      ctx.font = step + "px monospace";
      for (var i = 0; i < cols; i++) {
        var ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * step, y[i] * step);
        if (y[i] * step > c.height && Math.random() > 0.975) y[i] = 0;
        y[i]++;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    function stop() {
      cancelAnimationFrame(raf);
      c.remove();
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", size);
    }
    function onKey(e) { if (e.key === "Escape") stop(); }
    c.addEventListener("click", stop);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", size);
    setTimeout(stop, 12000);
  }
})();
