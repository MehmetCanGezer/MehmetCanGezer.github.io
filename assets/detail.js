// Detay sayfası: canlı kilit ekranı saati, önizleme modu, renk kopyalama, paylaşma, klavye ile gezinme
(function () {
  const $ = (id) => document.getElementById(id);
  const toast = (msg) => {
    const t = $("toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 1600);
  };

  // kilit ekranı / menü çubuğu saati (Türkçe tarih)
  const tick = () => {
    const now = new Date();
    const time = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    if ($("ltime")) $("ltime").textContent = time;
    if ($("mclock")) $("mclock").textContent = time;
    if ($("ldate")) $("ldate").textContent = now.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
  };
  tick(); setInterval(tick, 15000);

  // "Kilit ekranı / Tam görsel"
  const stage = document.querySelector(".stage");
  document.querySelectorAll(".toggle button").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".toggle button").forEach((x) => x.setAttribute("aria-selected", x === b));
      stage.classList.toggle("plain", b.dataset.mode === "plain");
    });
  });

  // renk kodunu kopyala
  document.querySelectorAll(".sw").forEach((s) => {
    s.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(s.dataset.hex); toast(s.dataset.hex + " kopyalandı"); }
      catch (e) { toast(s.dataset.hex); }
    });
  });

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
