// Detay sayfası: canlı saat/tarih, cihaz modu (macOS / Windows / kilit / ana ekran), renk kopyalama, paylaşma, klavye
(function () {
  const $ = (id) => document.getElementById(id);
  const all = (sel) => document.querySelectorAll(sel);
  const toast = (msg) => {
    const t = $("toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 1600);
  };
  const set = (sel, text) => all(sel).forEach((el) => { el.textContent = text; });

  const tick = () => {
    const now = new Date();
    const time = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    set("#ltime, .mtime, .wtime, .htime", time);
    set("#ldate", now.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }));
    set(".mdate", now.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" }));
    set(".wdate", now.toLocaleDateString("tr-TR"));
    set(".cal-day", now.toLocaleDateString("tr-TR", { weekday: "short" }).toLocaleUpperCase("tr-TR").slice(0, 3));
    set(".cal-num", String(now.getDate()));
  };
  tick(); setInterval(tick, 15000);

  // cihaz modu; masaüstünde seçilen sistem (macOS/Windows) hatırlanır
  const stage = document.querySelector(".stage");
  const buttons = all(".toggle button");
  const setMode = (mode) => {
    stage.className = stage.className.replace(/\bmode-\S+/, "mode-" + mode);
    buttons.forEach((b) => b.setAttribute("aria-selected", b.dataset.mode === mode));
  };
  if (stage && stage.dataset.kind === "desktop") {
    try {
      const os = localStorage.getItem("os");
      if (os === "win" || os === "mac") setMode(os);
      else if (/Windows/.test(navigator.userAgent)) setMode("win");
    } catch (e) {}
  }
  buttons.forEach((b) => b.addEventListener("click", () => {
    setMode(b.dataset.mode);
    if (b.dataset.mode === "mac" || b.dataset.mode === "win") {
      try { localStorage.setItem("os", b.dataset.mode); } catch (e) {}
    }
  }));

  // renk kodunu kopyala
  all(".sw").forEach((s) => s.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(s.dataset.hex); toast(s.dataset.hex + " kopyalandı"); }
    catch (e) { toast(s.dataset.hex); }
  }));

  // paylaş (telefonda sistem paylaşımı, masaüstünde bağlantıyı kopyala)
  const share = $("share");
  if (share) share.addEventListener("click", async () => {
    const data = { title: document.querySelector("h1").textContent, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(location.href); toast("Bağlantı kopyalandı"); }
    catch (e) { toast(location.href); }
  });

  // ← → ile kategoride gezin
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowLeft" && $("prev")) location.href = $("prev").href;
    if (e.key === "ArrowRight" && $("next")) location.href = $("next").href;
  });
})();
