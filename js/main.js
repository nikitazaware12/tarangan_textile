/* ====== CONFIG — इथे आपला WhatsApp नंबर टाका (country code सह, + आणि space शिवाय) ====== */
const WA_NUMBER = "919999999999";   // उदा. 919876543210
const BRAND = "Tarangan Textiles";
/* ====================================================================================== */

const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const openWA = (text) => window.open(waLink(text), "_blank", "noopener");
const toast = (m) => { const t = document.querySelector(".toast"); if(!t) return; t.textContent = m; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"), 2600); };

/* sticky header shadow + mobile nav */
const hdr = document.querySelector(".hdr");
addEventListener("scroll", () => hdr.classList.toggle("scrolled", scrollY > 20), {passive:true});
const burger = document.querySelector(".burger"), nav = document.querySelector(".nav");
burger.addEventListener("click", () => { burger.classList.toggle("open"); nav.classList.toggle("open"); });
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { burger.classList.remove("open"); nav.classList.remove("open"); }));

/* scroll reveal */
const io = new IntersectionObserver((es) => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.12});
document.querySelectorAll(".rv").forEach((el, i) => { el.style.setProperty("--d", (i % 4) * .08 + "s"); io.observe(el); });

/* counters */
const cio = new IntersectionObserver((es) => es.forEach(e => {
  if(!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, suf = el.dataset.suf || ""; let n = 0;
  const step = () => { n += Math.max(1, end / 40); if(n >= end){ el.textContent = end + suf; } else { el.textContent = Math.floor(n) + suf; requestAnimationFrame(step); } };
  step();
}), {threshold:.5});
document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));

/* product enquiry buttons */
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-enq]"); if(!b) return; e.preventDefault();
  openWA(`Hello ${BRAND}! 👋\nI'm interested in: *${b.dataset.enq}*\nPlease share price, minimum order & availability.`);
});

/* generic WhatsApp CTA */
document.querySelectorAll("[data-wa]").forEach(a => a.addEventListener("click", (e) => {
  e.preventDefault(); openWA(a.dataset.wa || `Hello ${BRAND}! I'd like to know more about your collections.`);
}));
document.querySelectorAll(".fab").forEach(a => a.href = waLink(`Hello ${BRAND}! I'd like to know more about your collections.`));

/* collection filter */
const fbar = document.querySelector(".filters");
if(fbar){
  fbar.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if(!b) return;
    fbar.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    document.querySelectorAll(".pc[data-cat]").forEach(c => {
      const show = b.dataset.f === "all" || c.dataset.cat === b.dataset.f;
      c.classList.toggle("hide", !show);
      if(show){ c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop"); c.classList.add("in"); }
    });
  });
}

/* 3D tilt on cards (pointer devices only) */
if(matchMedia("(hover:hover)").matches){
  document.querySelectorAll(".pc").forEach(c => {
    c.addEventListener("mousemove", (e) => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `translateY(-10px) perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });
    c.addEventListener("mouseleave", () => c.style.transform = "");
  });
}

/* date picker: no past dates + readable date in the message */
const fmtDate = (v) => v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(v + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";
document.querySelectorAll("input[data-min-today]").forEach(i => { const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); i.min = t.toISOString().slice(0, 10); });

/* enquiry form -> WhatsApp */
document.querySelectorAll("form.enq").forEach(f => f.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(f).entries());
  let ok = true;
  f.querySelectorAll("[required]").forEach(i => { const bad = !i.value.trim(); i.classList.toggle("err", bad); if(bad) ok = false; });
  if(d.phone && !/^[0-9+\-\s]{8,15}$/.test(d.phone.trim())){ f.phone.classList.add("err"); ok = false; }
  if(!ok){ toast("कृपया आवश्यक माहिती भरा / Please fill required fields"); return; }
  const msg = `Hello ${BRAND}! 👋\n*New Enquiry*\n\n*Name:* ${d.name}\n*Phone:* ${d.phone}\n*City:* ${d.city || "-"}\n*Interested in:* ${d.product || "-"}\n*Quantity:* ${d.qty || "-"}\n*Preferred date:* ${fmtDate(d.date)}\n*Message:* ${d.msg || "-"}`;
  openWA(msg); toast("Opening WhatsApp… ✅"); f.reset();
}));
document.querySelectorAll(".enq input,.enq select,.enq textarea").forEach(i => i.addEventListener("input", () => i.classList.remove("err")));
