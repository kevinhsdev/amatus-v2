'use strict';
/* Brasinha: companheiro da home (cena muda com a hora e a agenda) e reações no ranking. */
(() => {
const A = window.AMATUS, L = A.D.brasinhaLines;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCENES = {
  sleep: { step: 850, hold: 3800 }, coffee: { step: 480, hold: 2600 }, work: { step: 230, hold: 1200 }, study: { step: 550, hold: 2000 },
  church: { step: 650, hold: 3500 }, 'wedding-prep': { step: 370, hold: 2100 }, 'wedding-walk': { step: 160, hold: 0 }, rest: { step: 340, hold: 3200 }
};
const ASSET = { sono: 'sleep', cafe: 'coffee', trabalho: 'work', estudo: 'study', almoco: 'rest', descanso: 'rest', livre: 'rest', feriado: 'rest', fe: 'church', fePreparacao: 'church' };
const STAMP = { sono: 'madrugada', cafe: 'manhã', trabalho: 'no trampo', estudo: 'estudando', almoco: 'almoço', descanso: 'fim do dia', livre: 'de boa', feriado: 'feriado', fe: 'agora', fePreparacao: 'daqui a pouco' };

function context(date = new Date()) {
  const p = A.partsSP(date), day = new Date(p.date + 'T12:00:00Z').getUTCDay();
  const ev = A.AGENDA.active(date);
  if (ev && ev.kind !== 'cancelled') return { scene: date < ev.start ? 'fePreparacao' : 'fe', event: ev };
  const holiday = p.date.slice(5) === '11-02';
  const h = p.hour;
  const scene = h < 5 ? 'sono' : h < 8 ? 'cafe' : h >= 22 ? 'descanso' : holiday ? 'feriado' : h >= 12 && h < 14 ? 'almoco'
    : day >= 1 && day <= 5 && h >= 8 && h < 18 ? 'trabalho' : day >= 1 && day <= 5 && h >= 19 ? 'estudo' : 'livre';
  return { scene, event: null };
}
function pick(key, n) {
  let s = {}; try { s = JSON.parse(localStorage.getItem('brasinha-v5')) || {}; } catch {}
  let rest = s.key === key && Array.isArray(s.rest) ? s.rest.filter(i => i < n) : [];
  if (!rest.length) { rest = [...Array(n).keys()].sort(() => Math.random() - .5); if (rest[0] === s.last) rest.push(rest.shift()); }
  const i = rest.shift();
  try { localStorage.setItem('brasinha-v5', JSON.stringify({ key, rest, last: i })); } catch {}
  return i;
}

let raf = 0;
function mount(art) {
  if (!art) return;
  cancelAnimationFrame(raf);
  const c = context(), lines = L[c.scene] || L.livre, i = pick(c.scene, lines.length);
  let line = lines[i];
  if (c.event) {
    const t = c.event.title.replace(/^(Culto|Coral|Encontro)/, w => w.toLocaleLowerCase('pt-BR'));
    line = (c.scene === 'fePreparacao' ? `Daqui a pouco tem ${t}. ` : `Agora tem ${t}. `) + line;
  }
  const asset = ASSET[c.scene] || 'rest';
  document.getElementById('brasinhaLine').textContent = line;
  document.getElementById('brasinhaStamp').textContent = STAMP[c.scene] || '';
  const canvas = art.querySelector('canvas'), ctx = canvas.getContext('2d'), img = new Image(), spec = SCENES[asset];
  art.dataset.scene = asset;
  img.onload = () => {
    const t0 = performance.now(); let last = -1;
    const draw = now => {
      if (!canvas.isConnected) return;
      const phase = (now - t0) % (spec.step * 6 + spec.hold), f = reduced() ? 0 : Math.min(5, Math.floor(phase / spec.step));
      if (f !== last) { ctx.clearRect(0, 0, 200, 260); ctx.drawImage(img, f * 200, 0, 200, 260, 0, 0, 200, 260); last = f; }
      if (!reduced()) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
  };
  img.src = `assets/brasinha/${asset}.webp`;
}

/* Reação no perfil do ranking: sprite 192×208 por quadro, poses por faixa de posição (do site atual). */
const sprite = new Image(); sprite.src = 'assets/brasinha/sprite.png';
function talk(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d'), tier = +canvas.dataset.tier;
  const poses = [{ row: 4, frames: [0, 1, 2, 3, 4, 3, 2, 1] }, { row: 7, frames: [0, 1, 2, 3, 4, 5] }, { row: 3, frames: [0, 1, 2, 3, 2, 1] }, { row: 8, frames: [0, 1, 2, 3, 4, 5] }][tier];
  let t0;
  const draw = now => {
    if (!canvas.isConnected) return;
    t0 ??= now; const t = now - t0;
    let row = 0, col = 0;
    if (!reduced()) {
      if (t < 280) { row = 0; col = 0; }
      else if (t < 650) { row = 9; col = Math.min(4, Math.floor((t - 280) / 90)); }
      else if (t < 2400) { row = poses.row; col = poses.frames[Math.floor((t - 650) / 170) % poses.frames.length]; }
      else { const ph = (t - 2400) % 5200; col = ph > 4200 && ph < 4520 ? Math.min(5, Math.floor((ph - 4200) / 64)) : 0; }
    }
    ctx.clearRect(0, 0, 384, 416);
    ctx.drawImage(sprite, col * 192, row * 208, 192, 208, 0, 0, 384, 416);
    if (!reduced()) requestAnimationFrame(draw);
  };
  const go = () => requestAnimationFrame(draw);
  sprite.complete && sprite.naturalWidth ? go() : sprite.addEventListener('load', go, { once: true });
}

window.AMATUS_BRASINHA = { mount, talk, mini() {} };
})();
