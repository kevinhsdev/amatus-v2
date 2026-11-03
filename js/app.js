'use strict';
/* AMATUS · app shell, rotas e páginas. Sem build: abra index.html por um servidor local. */
(() => {
const D = window.AMATUS_DATA;
const TZ = 'America/Sao_Paulo';
const LINKS = {
  whatsapp: 'https://wa.me/5511979563411',
  instagram: 'https://www.instagram.com/somosamatus',
  churchInstagram: 'https://www.instagram.com/3ieq.ferraz/',
  churchYoutube: 'https://www.youtube.com/@3ieq.Ferraz',
  maps: 'https://www.google.com/maps/place/3%C2%AA+Igreja+Evangelho+Quadrangular/@-23.5442097,-46.3591352,17z/data=!4m6!3m5!1s0x94ce7ac973800a59:0x176db23a57a56419!8m2!3d-23.5442097!4d-46.3565602!16s%2Fg%2F1ts3mbgx',
  prayer: 'https://docs.google.com/forms/d/e/1FAIpQLSex9L3Ec2EoYISKCit5tHV1f_1vJxQfxu64ZFIGB8Px23G4QQ/viewform',
  legacy: 'https://amatus-geracao-forte.deniscardozojr.chatgpt.site'
};

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ICONS = {
  pray: '<path d="M9 19 5 15l4-4V4a2 2 0 0 1 3 0v8l-3 7Zm6 0 4-4-4-4V4a2 2 0 0 0-3 0v8l3 7ZM5 15l-2 3 4 4 2-3m10-4 2 3-4 4-2-3"/>',
  music: '<path d="M9 18V5l12-3v13M9 8l12-3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="15" r="3"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v2a3 3 0 0 0 3 3m8-5h3v2a3 3 0 0 1-3 3m-4 2v5m-4 3h8"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/>',
  bag: '<path d="M5 8h14l1.5 12h-17zM9 8V6a3 3 0 0 1 6 0v2"/>',
  book: '<path d="M12 6c-3-2.5-7-2-9-.5V20c2.5-1.5 6.5-1.5 9 .5 2.5-2 6.5-2 9-.5V5.5c-2-1.5-6-2-9 .5Zm0 0v14.5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  play: '<rect x="2.5" y="4.5" width="19" height="15" rx="4"/><path d="m10 9 5 3-5 3z"/>',
  tent: '<path d="m3 20 9-15 9 15zm6 0 3-6 3 6"/>',
  flame: '<path d="M12 21c4 0 7-2.7 7-6.6 0-3.6-2.4-5.7-4-8.4-.5 2-1.5 3-2.8 3.6C12.6 6.8 11.3 4.4 9 3c.3 3-1.6 5-3 6.8C4.9 11.2 5 12.6 5 14.4 5 18.3 8 21 12 21Z"/>',
  church: '<path d="M12 2v4m-2-2h4M7 21V11l5-4 5 4v10M3 21v-5l4-3m14 8v-5l-4-3M10 21v-4a2 2 0 0 1 4 0v4"/>',
  mascot: '<path d="M12 21a6 6 0 0 0 6-6c0-3-2-4.5-3-7-1 1.5-2 2-2.6 2.3C12 7.5 11 5 9 3.5c.2 2.8-1.2 4.4-2.4 6A7.7 7.7 0 0 0 6 15a6 6 0 0 0 6 6Z"/><path d="M10 14h.01M14 14h.01M10.5 17c1 .7 2 .7 3 0"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
  share: '<path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
  arrow: '<path d="M7 17 17 7M9 7h8v8"/>',
  right: '<path d="M5 12h14m-5-6 6 6-6 6"/>',
  left: '<path d="M19 12H5m5-6-6 6 6 6"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.2 2 .8c-.2 1.3-1.2 2-2.4 1.9-3.3-.3-6-3-6.3-6.3-.1-1.2.6-2.2 1.9-2.4l.8 2z"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  spark: '<path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6"/>',
  compare: '<path d="M8 4v16m8-16v16M4 8h4m8 8h4M4 16h4m8-8h4"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>'
};
const icon = (n, s = 22) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ICONS.book}</svg>`;
const ext = (href, label, cls = 'btn ghost') => `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`;

function partsSP(date = new Date()) {
  const o = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date).map(p => [p.type, p.value]));
  return { date: `${o.year}-${o.month}-${o.day}`, hour: +o.hour, minute: +o.minute };
}
const todaySP = () => partsSP().date;
const serialDate = s => new Date(Date.UTC(1899, 11, 30) + Number(s) * 864e5).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
const fmtDay = (iso, opts) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', ...opts }).format(new Date(iso + 'T12:00:00Z'));
const pad = n => String(n).padStart(2, '0');

/* ---------- agenda (portada do site atual) ---------- */
const AGENDA = (() => {
  const historical = [
    { date: '2026-11-01', time: '08:00', title: 'Culto de domingo cancelado', category: 'church', kind: 'cancelled', info: 'Não haverá culto neste domingo.' },
    { date: '2026-11-01', time: '10:30', title: 'Reunião de jovens cancelada', kind: 'cancelled', info: 'Não haverá reunião de jovens hoje.' },
    { date: '2026-10-18', time: '10:30', title: 'Reunião de jovens', kind: 'meeting', info: 'Após o culto · por volta de 10h30.' },
    { date: '2026-10-23', time: '22:00', title: 'AFO', kind: 'meeting', info: '22h às 00h · 3ª IEQ de Ferraz de Vasconcelos' },
    { date: '2026-10-25', title: 'Aniversário de Denis Cardozo', kind: 'birthday', info: 'Líder da AMATUS' },
    { date: '2026-10-28', title: 'Aniversário de Rafaela Cabral', kind: 'birthday', info: '' },
    { date: '2026-10-28', title: 'Aniversário de Samuel Aquino', kind: 'birthday', info: '' },
    { date: '2026-10-30', time: '22:00', title: 'AFO', kind: 'meeting', info: '22h às 00h · 3ª IEQ de Ferraz de Vasconcelos' }
  ];
  const recurring = [
    { id: 'coral', day: 2, time: '19:30', endTime: '21:00', title: 'Coral', category: 'church' },
    { id: 'prayer', day: 3, time: '20:00', endTime: '21:00', title: 'Culto de oração', category: 'church' },
    { id: 'friday', day: 5, time: '22:00', endTime: '00:00', title: 'AFO ou BRASA', category: 'amatus', info: 'Consulte o grupo para saber qual projeto será nesta sexta.' },
    { id: 'saturday', day: 6, time: '19:00', endTime: '21:00', title: 'Culto de sábado', category: 'church' },
    { id: 'sunday', day: 0, time: '08:00', endTime: '10:00', title: 'Culto de domingo', category: 'church' },
    { id: 'youth', day: 0, time: '10:00', endTime: '12:00', title: 'Encontro dos jovens', category: 'amatus' }
  ];
  const cache = new Map();
  function all(year = +todaySP().slice(0, 4)) {
    if (cache.has(year)) return cache.get(year);
    const out = historical.map(e => ({ category: 'amatus', ...e }));
    for (let y = year - 1; y <= year + 1; y++) {
      for (let d = new Date(Date.UTC(y, 0, 1, 12)); d.getUTCFullYear() === y; d.setUTCDate(d.getUTCDate() + 1)) {
        const date = d.toISOString().slice(0, 10);
        if (date < '2026-11-01') continue;
        for (const r of recurring) {
          if (r.day !== d.getUTCDay()) continue;
          if (out.some(e => e.date === date && (e.title === r.title || e.time === r.time || (r.id === 'youth' && /jovens/.test(e.title))))) continue;
          out.push({ ...r, date, kind: 'meeting', recurring: true, info: r.info || 'Horário de Brasília · confira os avisos do grupo.' });
        }
      }
    }
    out.sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
    cache.set(year, out);
    return out;
  }
  const events = year => all(year).filter(e => e.category === 'amatus');
  function active(date = new Date()) {
    const now = +date, p = partsSP(date);
    return all(+p.date.slice(0, 4)).filter(e => e.kind !== 'birthday').map(e => {
      const start = Date.parse(`${e.date}T${e.time || '00:00'}:00-03:00`);
      let end = e.endTime ? Date.parse(`${e.date}T${e.endTime}:00-03:00`) : start + 36e5;
      if (end <= start) end += 864e5;
      return { ...e, start, end };
    }).filter(e => e.kind === 'cancelled' ? e.date === p.date : e.start - 36e5 <= now && now < e.end)
      .sort((a, b) => (b.kind === 'cancelled') - (a.kind === 'cancelled') || a.start - b.start)[0] || null;
  }
  function next(now = Date.now()) {
    return events().filter(e => e.kind === 'meeting' && e.time)
      .map(e => ({ ...e, start: Date.parse(`${e.date}T${e.time}:00-03:00`) }))
      .filter(e => e.start > now).sort((a, b) => a.start - b.start)[0] || null;
  }
  return { all, events, active, next, partsSP };
})();

/* ---------- ranking ---------- */
const rank = D.rank.slice().sort((a, b) => a.position - b.position || a.name.localeCompare(b.name, 'pt-BR'));
const person = id => rank.find(p => p.id === id);
const first = n => n.split(' ')[0];
const initials = n => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
const normalize = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const canonical = s => normalize(s).replace(/ll/g, 'l').replace(/y/g, 'i').replace(/kelv[ei]n/g, 'kelven').replace(/marian[aei]/g, 'mariana');
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function searchMatches(name, q) {
  const a = canonical(name), b = canonical(q), raw = normalize(q);
  return !b || a.includes(b) || (raw.length >= 4 && [normalize(name), a].some(v => v.split(' ').some(p => distance(p, raw) <= Math.max(1, Math.floor(raw.length / 5)) || distance(p, b) <= Math.max(1, Math.floor(b.length / 5)))));
}
const pts = n => D.scoresHidden ? '**' : n;
function conquestTime(h) { return h.updatedAt ? Date.parse(h.updatedAt) : (h.date - 25569) * 864e5; }
function latestConquests(n = 4) {
  const seen = new Set();
  return D.histories.map((h, i) => ({ ...h, order: i })).filter(h => {
    const k = JSON.stringify([h.id, h.label, h.date, h.points, h.updatedAt]);
    if (seen.has(k)) return false; seen.add(k); return h.points !== 0 && person(h.id);
  }).sort((a, b) => conquestTime(b) - conquestTime(a) || b.order - a.order).slice(0, n);
}
function nextPosition(p) {
  if (D.scoresHidden) return 'Pontuação temporariamente oculta. Continue participando dos desafios!';
  const above = rank.filter(v => v.position < p.position).sort((a, b) => b.position - a.position)[0];
  if (!above) return 'Você está na liderança! Continue participando para manter sua posição.';
  const gap = Math.max(0, above.total - p.total);
  return gap ? `Faltam <b>${gap} pontos</b> para alcançar ${esc(above.name)} e ${gap + 1} para passar à frente. O desempate considera reuniões e AFOs.`
    : `Você já tem os mesmos pontos de ${esc(above.name)}. Mais 1 ponto coloca você à frente; o desempate atual considera reuniões e AFOs.`;
}
const CATS = [['Reuniões', p => p.meetings * 10, /reunião/i], ['AFOs', p => p.afos * 8, /afo/i], ['Mensalidades', p => p.monthly, /mensalidade/i], ['Visitantes', p => p.visitors, /visitante|convite/i], ['Gincanas e outras atividades', p => p.other, null]];
function catRows(id, label) {
  const re = CATS.find(c => c[0] === label)[2];
  return D.histories.filter(h => h.id === id && (re ? re.test(h.label) : !/reunião|afo|mensalidade|visitante|convite/i.test(h.label))).sort((a, b) => b.date - a.date);
}

/* Reações do Brasinha no perfil (texto original). */
const REACTIONS = [["OLHA QUEM TÁ SE ACHANDO! E COM MOTIVO!", "Tá confortável aí em cima? Porque tem gente chegando...", "Primeiro lugar é bom, né? Difícil é continuar!", "O trono é seu. O sossego, nem tanto.", "Eu vi esse primeiro lugar. Pode fazer pose!", "Hoje você olha o ranking de cima. Não acostuma demais!", "Tem uma fila querendo essa sua cadeira, hein!", "Tá liderando e ainda veio conferir? Eu também conferia.", "A placa da vaga combinou com você. Mas a disputa continua!", "Pode comemorar! Só não deixa a comemoração virar férias.", "Seu nome no topo. Coincidência? Acho que não.", "Se o ranking fosse foto, você tava na capa."], ["Tá sentindo o cheirinho da liderança?", "Mais um esforço e alguém perde o trono!", "O primeiro colocado que abra o olho!", "Você tá perto o bastante pra incomodar. Gostei!", "O topo já tá no seu campo de visão, hein!", "Essa medalha é bonita. Mas eu sei qual você tá olhando...", "Tá esperando convite pra atacar a liderança?", "Você abriu o ranking ou veio medir a distância do trono?", "Tem alguém lá em cima fingindo que não tá preocupado.", "O pódio já conhece seu nome. Agora falta trocar de degrau!", "Se chegar mais perto, vai ter que pedir licença!", "Tá no pódio e com cara de quem quer mais. Acertei?"], ["O TOP 3 NÃO TÁ TÃO LONGE ASSIM!", "Eu não queria falar nada... mas dá pra subir, hein!", "Tá chegando quietinho... tô de olho!", "Quem tá no pódio já viu seu nome chegando?", "Você tem cara de quem ainda vai bagunçar essa tabela.", "Esse lugar tá pequeno pra sua próxima conquista.", "Abriu pra conferir ou pra escolher quem vai ultrapassar?", "Eu olhei os pontos. Você ainda tem jogo!", "Vai chegando na sua. Depois deixa o ranking fazer o barulho.", "Se a ideia era passar despercebido, não deu. Eu vi você!", "Tá esquentando a disputa. E olha que de calor eu entendo.", "Essa posição é endereço provisório, né?"], ["E AÍ, VAI REAGIR QUANDO?", "O ranking não vai subir sozinho, né?", "Ainda dá tempo de virar esse jogo!", "Eu sei que você consegue mais que isso!", "Você veio olhar. Agora falta dar trabalho pra tabela!", "Bora aparecer nos encontros e surpreender esse ranking?", "A disputa tá rolando. Vai ficar só na arquibancada?", "Tô desconfiando que você tá guardando a reação pro final.", "Essa posição não tem contrato de permanência, viu?", "Quero ver seu nome dando susto em quem tá lá em cima!", "Já conferiu os pontos. Agora confere as próximas oportunidades!", "Se você resolver reagir, me avisa. Quero assistir de perto!"]];
const bags = new Map();
function reaction(p) {
  const tier = p.position === 1 ? 0 : p.position <= 3 ? 1 : p.position <= 10 ? 2 : 3;
  let bag = bags.get(p.id + tier);
  if (!bag?.length) { bag = REACTIONS[tier].map((_, i) => i).sort(() => Math.random() - .5); bags.set(p.id + tier, bag); }
  return { tier, line: REACTIONS[tier][bag.pop()] };
}

/* ---------- sessão (demonstração) ---------- */
const LEADER = { id: 'LIDER', name: 'Denis Cardozo', leader: true };
const session = {
  get() { try { const s = JSON.parse(localStorage.getItem('amatus-sessao') || sessionStorage.getItem('amatus-sessao')); return s?.leader ? LEADER : person(s?.id) ? { ...person(s.id) } : null; } catch { return null; } },
  set(id, keep = true) { this.clear(); (keep ? localStorage : sessionStorage).setItem('amatus-sessao', JSON.stringify(id === 'LIDER' ? { leader: true } : { id })); paintAccount(); },
  clear() { localStorage.removeItem('amatus-sessao'); sessionStorage.removeItem('amatus-sessao'); paintAccount(); }
};
function paintAccount() {
  const u = session.get(), b = $('#accountBtn');
  b.innerHTML = u ? `<span class="avatar sm">${initials(u.name)}</span><span class="account-name">${esc(first(u.name))}</span>` : `${icon('user', 18)}<span>Entrar</span>`;
  b.setAttribute('aria-label', u ? `Sua conta: ${u.name}` : 'Entrar com seu PIN');
  if (['meu-historico', 'paginas-ocultas'].includes(route())) render();
}
function loginDialog() {
  if (route() !== 'entrar') sessionStorage.setItem('amatus-volta', route());
  location.hash = 'entrar';
}
const GOOGLE_G = '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
const EYE = ['<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>', '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.7 5.1A9.9 9.9 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.2 3.2M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>'];
function entrar() {
  const wa = t => `${LINKS.whatsapp}?text=${encodeURIComponent(t)}`;
  const quote = (img, name, handle, text, n) => `<figure class="sip-quote" style="--q:${n}"><img src="${img}" alt="" width="40" height="40"><figcaption><strong>${name}</strong><span>${handle}</span></figcaption><blockquote>${text}</blockquote></figure>`;
  let d = 0; const a = (c = '') => `class="sip-in ${c}" style="--d:${d++}"`;
  return `<div class="sip">
  <section class="sip-form-col">
    <div class="sip-form">
      <a ${a('sip-back')} href="#inicio">${icon('left', 18)}<img src="assets/logo-mark.png" alt="" width="28" height="28"><span>Voltar ao site</span></a>
      <h1 ${a('sip-title')}>Boas-vindas</h1>
      <p ${a('sip-desc')}>Entre com seu PIN para ver seus pontos, de onde cada um veio e quanto falta para subir no ranking.</p>
      <form id="sipForm" class="sip-fields" novalidate>
        <div ${a()}><label class="sip-label" for="sipWho">Quem é você?</label>
          <div class="sip-glass"><select id="sipWho" name="username" autocomplete="username" required><option value="">Escolha seu nome</option>${rank.slice().sort((x, y) => x.name.localeCompare(y.name, 'pt-BR')).map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}<option value="LIDER">Denis Cardozo (líder)</option></select></div></div>
        <div ${a()}><label class="sip-label" for="sipPin">PIN</label>
          <div class="sip-glass has-btn"><input id="sipPin" name="password" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="current-password" placeholder="Seus 4 números" required>
          <button type="button" class="sip-eye" id="sipEye" aria-label="Mostrar a senha" aria-pressed="false">${EYE[0]}</button></div></div>
        <p class="sip-error" id="sipError" role="alert"></p>
        <div ${a('sip-row')}>
          <label class="sip-check"><input type="checkbox" name="keep" checked><span>Manter conectado</span></label>
          <a class="sip-link" href="${wa('Oi, Denis! Esqueci meu PIN do site da AMATUS.')}" target="_blank" rel="noopener">Esqueci a senha</a>
        </div>
        <button ${a('sip-submit')} type="submit">Entrar</button>
      </form>
      <div ${a('sip-divider')}><span>Ou continue com</span></div>
      <button ${a('sip-google')} type="button" id="sipGoogle">${GOOGLE_G}<span>Continuar com Google</span></button>
      <p ${a('sip-new')}>Novo por aqui? <a class="sip-link" href="${wa('Oi, Denis! Quero meu PIN para o site da AMATUS.')}" target="_blank" rel="noopener">Criar conta</a></p>
      <p ${a('sip-demo')}>${icon('lock', 14)} Demonstração: qualquer PIN de 4 dígitos entra. A validação real chega com o servidor.</p>
    </div>
  </section>
  <section class="sip-hero-col" aria-hidden="true">
    <div class="sip-hero">
      <img class="sip-art" src="fotos/login.jpg" alt="" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/2fq40D4enkI/maxresdefault.jpg';this.classList.add('poster')">
      <div class="sip-quotes">
        ${quote('assets/brasinha/capa.jpg', 'Brasinha', '@mascote', 'Entrou? Então confere o ranking. Tem gente chegando perto de você!', 0)}
        ${quote('assets/logo-mark.png', 'BRASA', '2 Samuel 22:13', 'Pelo resplendor da sua presença, brasas de fogo se acenderam.', 1)}
        ${quote('assets/icons/amatus-icon-192-v2.png', 'AMATUS', '@somosamatus', 'AMATUS significa “amado”. É no amor de Deus que tudo começa.', 2)}
      </div>
    </div>
  </section>
</div>`;
}
function bindEntrar() {
  const pin = $('#sipPin'), eye = $('#sipEye'), err = $('#sipError');
  eye.onclick = () => {
    const show = pin.type === 'password';
    pin.type = show ? 'text' : 'password';
    eye.setAttribute('aria-pressed', show);
    eye.setAttribute('aria-label', show ? 'Esconder a senha' : 'Mostrar a senha');
    eye.innerHTML = EYE[+show];
  };
  pin.oninput = () => { pin.value = pin.value.replace(/\D/g, ''); err.textContent = ''; };
  $('#sipWho').onchange = () => { err.textContent = ''; };
  $('#sipGoogle').onclick = () => toast('Entrar com Google chega junto com o servidor (fase 2).');
  $('#sipForm').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (!f.get('username')) { err.textContent = 'Escolha seu nome na lista.'; return $('#sipWho').focus(); }
    if (!/^\d{4}$/.test(f.get('password'))) { err.textContent = 'O PIN tem 4 números.'; return pin.focus(); }
    session.set(f.get('username'), !!f.get('keep'));
    toast(`Bem-vindo, ${first(session.get().name)}!`);
    const back = sessionStorage.getItem('amatus-volta');
    sessionStorage.removeItem('amatus-volta');
    location.hash = back && back !== 'entrar' && back !== 'inicio' ? back : (session.get().leader ? 'paginas-ocultas' : 'meu-historico');
  };
}
function accountDialog() {
  const u = session.get();
  if (!u) return loginDialog();
  showDialog('Sua conta', `<div class="account-card"><span class="avatar lg">${initials(u.name)}</span><div><strong>${esc(u.name)}</strong><span class="muted">${u.leader ? 'Líder da AMATUS' : `${u.position}º no ranking`}</span></div></div>
    <div class="stack">${u.leader ? `<a class="row-link" href="#paginas-ocultas" data-close>${icon('lock')}<span>Páginas ocultas</span>${icon('right', 18)}</a>` : `<a class="row-link" href="#meu-historico" data-close>${icon('list')}<span>Meu histórico</span>${icon('right', 18)}</a>`}
    <button class="row-link" id="swapAcc">${icon('user')}<span>Trocar de conta</span>${icon('right', 18)}</button>
    <button class="row-link danger" id="logout">${icon('left')}<span>Sair da conta</span></button></div>`);
  $('#swapAcc').onclick = () => { closeDialog(); session.clear(); loginDialog(); };
  $('#logout').onclick = () => { session.clear(); closeDialog(); toast('Você saiu da conta.'); };
}

/* ---------- dialog / sheet / toast ---------- */
const dialog = $('#dialog');
function showDialog(title, body, cls = '') {
  $('#dialogTitle').textContent = title;
  $('#dialogBody').innerHTML = body;
  dialog.className = 'modal ' + cls;
  if (!dialog.open) dialog.showModal();
}
function closeDialog() { dialog.open && dialog.close(); }
document.addEventListener('click', e => {
  const c = e.target.closest('[data-close]');
  if (c) c.closest('dialog')?.close();
});
$$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}



/* ---------- menu "Mais" ---------- */
const MORE = [
  ['avivamatus', 'Avivamatus', 'Cultos e playlists', 'play'],
  ['mascote', 'Nosso mascote', 'Conheça o Brasinha', 'mascot'],
  ['igreja', 'Nossa igreja', '3ª IEQ · Ferraz', 'church'],
  ['oracao', 'Pedidos de oração', 'Conte com a gente', 'pray'],
  ['reflexoes', 'Reflexões', 'Ler e compartilhar', 'book'],
  ['loja', 'Loja AMATUS', 'Camisetas e itens', 'bag'],
  ['acampamento', 'Acampamento 2027', 'A vaga do ranking', 'tent'],
  ['projetos', 'Projetos', 'AFO e BRASA', 'flame']
];
function paintMore() {
  $('#moreGrid').innerHTML = MORE.map(([r, t, d, i]) => `<a class="more-item" href="#${r}" data-close>${icon(i, 24)}<span><strong>${t}</strong><small>${d}</small></span></a>`).join('') +
    `<a class="more-item accent" href="${LINKS.whatsapp}" target="_blank" rel="noopener noreferrer">${icon('whatsapp', 24)}<span><strong>Fale com o líder</strong><small>WhatsApp do Denis ↗</small></span></a>
     <a class="more-item" href="${LINKS.instagram}" target="_blank" rel="noopener noreferrer">${icon('instagram', 24)}<span><strong>Instagram</strong><small>@somosamatus ↗</small></span></a>
     <button class="more-item" id="pushBtn">${icon('bell', 24)}<span><strong>Notificações</strong><small id="pushState">${pushLabel()}</small></span></button>`;
  $('#pushBtn').onclick = enablePush;
}
const sheet = $('#moreSheet');
['#moreBtn', '#menuBtn', '#tabMore'].forEach(s => $(s).addEventListener('click', () => { paintMore(); sheet.showModal(); }));
$('#accountBtn').onclick = accountDialog;

function pushLabel() {
  if (!('Notification' in window)) return 'No iPhone: Compartilhar → Adicionar à Tela de Início';
  return Notification.permission === 'granted' ? 'Ativadas' : Notification.permission === 'denied' ? 'Bloqueadas no navegador' : 'Receba os avisos do líder';
}
async function enablePush() {
  if (!('Notification' in window)) return toast('No iPhone: abra no Safari, toque em Compartilhar → Adicionar à Tela de Início.');
  const r = await Notification.requestPermission();
  $('#pushState').textContent = pushLabel();
  toast(r === 'granted' ? 'Pronto! Os avisos do líder chegam aqui quando o servidor estiver ligado.' : 'Você pode ativar quando quiser.');
}

/* ---------- componentes de página ---------- */
const pagehead = (title, desc = '', extra = '') => `<header class="pagehead"><h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}${extra}</header>`;
const back = (href, label) => `<a class="back" href="${href}">${icon('left', 18)} ${label}</a>`;

function countdownParts(target) {
  const s = Math.max(0, Math.ceil((target - Date.now()) / 1000));
  return [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
}
function countdownHTML(target, id) {
  const [d, h, m, s] = countdownParts(target);
  return `<div class="countdown" data-countdown="${target}" ${id ? `id="${id}"` : ''} role="timer">
    ${[[d, 'dias'], [h, 'horas'], [m, 'min'], [s, 'seg']].map(([v, l]) => `<span><b>${pad(v)}</b><small>${l}</small></span>`).join('')}</div>`;
}
function tickCountdowns() {
  $$('[data-countdown]').forEach(el => {
    const v = countdownParts(+el.dataset.countdown);
    $$('b', el).forEach((b, i) => { const t = pad(v[i]); if (b.textContent !== t) b.textContent = t; });
  });
  const n = AGENDA.next(), pill = $('#nextPill');
  if (!pill) return;
  pill.hidden = !n;
  if (n) {
    const [d, h, m] = countdownParts(n.start);
    $('#nextPillText').textContent = `${n.title} em ${d ? d + 'd ' : ''}${pad(h)}h${pad(m)}`;
  }
}
setInterval(tickCountdowns, 1000);

function weekAgenda() {
  const today = todaySP(), anchor = new Date(today + 'T12:00:00Z');
  anchor.setUTCDate(anchor.getUTCDate() - (anchor.getUTCDay() + 6) % 7);
  const start = anchor.toISOString().slice(0, 10); anchor.setUTCDate(anchor.getUTCDate() + 7);
  const end = anchor.toISOString().slice(0, 10);
  const items = AGENDA.events().filter(e => e.date >= start && e.date >= today && e.date < end);
  return items.length ? `<ol class="agenda">${items.map(agendaRow).join('')}</ol>` : '<p class="muted">Nenhum evento cadastrado para esta semana.</p>';
}
function agendaRow(e) {
  const today = e.date === todaySP();
  const kind = e.kind === 'cancelled' ? 'Cancelado' : e.kind === 'birthday' ? 'Aniversário' : 'Encontro';
  return `<li class="agenda-row ${e.kind} ${today ? 'is-today' : ''}"><time datetime="${e.date}"><b>${+e.date.slice(8)}</b><small>${fmtDay(e.date, { weekday: 'short' }).replace('.', '')}</small></time>
    <div><span class="tag ${e.kind}">${today ? 'Hoje · ' : ''}${kind}</span><h3>${esc(e.title)}</h3><p>${e.time ? esc(e.time) + (e.endTime ? '–' + esc(e.endTime) : '') + ' · ' : ''}${esc(e.info || '')}</p></div></li>`;
}

function podium() {
  const metal = { 1: 'ouro', 2: 'prata', 3: 'bronze' };
  return `<div class="podium">${[2, 1, 3].map(n => {
    const ps = rank.filter(p => p.position === n);
    return `<div class="podium-col p${n}"><div class="podium-flame" aria-hidden="true"><span class="sprite-mini"></span></div>
      <div class="podium-step"><span class="podium-pos">${n}º <small>${metal[n]}</small></span>
      ${ps.map(p => `<button class="podium-name" data-profile="${p.id}">${esc(p.name)}</button><span class="podium-pts">${pts(p.total)} pts</span>`).join('') || '<span class="muted">Posição compartilhada</span>'}
      ${n === 1 ? '<span class="plaque">Vaga do acampamento</span>' : ''}</div></div>`;
  }).join('')}</div>`;
}
function conquestList(n = 4) {
  return `<ul class="conquests">${latestConquests(n).map(h => `<li><button data-profile="${h.id}"><span class="avatar sm">${initials(person(h.id).name)}</span><span><strong>${esc(person(h.id).name)}</strong><small>${esc(h.label)} · ${serialDate(h.date)}</small></span><b>${h.points > 0 ? '+' : ''}${pts(h.points)}</b></button></li>`).join('') || '<li class="muted">As próximas conquistas aparecem aqui.</li>'}</ul>`;
}

/* Fotos do grupo: carrega o que existir em /fotos (01.jpg … 12.jpg) e some se não houver nada. */
function gallery() {
  return `<section class="band gallery-band" id="gallery" hidden><div class="wrap"><div class="section-head"><h2>Nossa turma</h2><a class="link" href="${LINKS.instagram}" target="_blank" rel="noopener noreferrer">Mais no Instagram ↗</a></div><div class="gallery" id="galleryTrack"></div></div></section>`;
}
function loadGallery() {
  const track = $('#galleryTrack'); if (!track) return;
  for (let i = 1; i <= 12; i++) {
    const img = new Image(); img.alt = 'Foto da AMATUS'; img.decoding = 'async';
    img.onload = () => { const f = document.createElement('figure'); f.className = 'shot'; f.style.order = i; f.append(img); track.append(f); $('#gallery').hidden = false; };
    img.src = `fotos/${pad(i)}.jpg`;
  }
}

/* ---------- páginas ---------- */
function home() {
  const n = AGENDA.next(), u = session.get();
  const farewell = Date.now() < Date.parse('2026-11-02T19:00:00-03:00');
  const secret = Date.parse('2026-11-08T10:00:00-03:00');
  return `
  <section class="sh-hero" id="glHero">
    <div class="sh-stage">
      <canvas class="sh-canvas" aria-hidden="true"></canvas>
      <div class="sh-content">
        <h1 class="sh-title">Geração Forte.</h1>
        <p class="sh-lede">Conhecer Jesus. Construir amizades. Viver a fé juntos, de verdade.</p>
        <div class="hero-actions sh-actions">
${u ? `<a class="btn primary lg" href="#meu-historico">Ver meus pontos ${icon('right', 18)}</a>` : `<a class="btn primary lg" href="#projetos">Vem conhecer a AMATUS ${icon('right', 18)}</a>`}
          ${ext(LINKS.whatsapp, 'Fale com o líder', 'btn ghost lg')}
        </div>
      </div>
      <p class="sh-place">Jovens da 3ª IEQ · Ferraz de Vasconcelos</p>
    </div>
  </section>

  <section class="wrap strip-sec">
    <div class="fire-strip">
      ${n ? `<a class="fs-cell fs-next" href="#cronograma"><span class="fs-label"><span class="live-dot"></span>Próximo encontro</span><strong>${esc(n.title)}</strong><span class="fs-meta">${fmtDay(n.date, { weekday: 'long', day: 'numeric', month: 'short' })} · ${n.time}</span>${countdownHTML(n.start)}</a>`
        : `<a class="fs-cell" href="#cronograma"><span class="fs-label">Agenda</span><strong>Nenhum encontro marcado</strong><span class="fs-meta">Fique de olho no grupo</span></a>`}
      <a class="fs-cell" href="#ranking"><span class="fs-label">${icon('trophy', 16)} Corrida do acampamento</span><strong>1º ${esc(rank[0].name)}</strong><span class="fs-meta">${D.scoresHidden ? 'Placar oculto até a revelação' : `${rank[0].total} pontos · ${rank.length} jovens na disputa`}</span><span class="fs-go">Ver ranking ${icon('right', 16)}</span></a>
      <a class="fs-cell" href="#igreja"><span class="fs-label">${icon('pin', 16)} Onde estamos</span><strong>3ª IEQ Ferraz</strong><span class="fs-meta">Rua Osvaldo Marcondes do Amaral, 15 · Jd. Juliana</span><span class="fs-go">Como chegar ${icon('right', 16)}</span></a>
    </div>
  </section>

  <section class="wrap manifesto">
    <div class="manifesto-main">
      <p class="manifesto-big">AMATUS significa <em>amado</em>.<br>É no amor de Deus que tudo começa.</p>
      <div class="manifesto-side"><p>Somos o grupo de jovens da 3ª Igreja do Evangelho Quadrangular de Ferraz de Vasconcelos. Tem gente chegando agora, gente que cresceu na igreja e gente recomeçando. Caminhamos juntos.</p><a class="link" href="#projetos">Quem somos ${icon('right', 16)}</a></div>
    </div>
    <div class="brasinha-stage" id="brasinhaStage">
      <div class="brasinha-art" id="brasinhaArt" role="img" aria-label="Brasinha, o mascote da AMATUS"><canvas width="200" height="260"></canvas></div>
      <div class="bubble" role="status"><span class="bubble-head"><strong>Brasinha</strong><span id="brasinhaStamp"></span></span><p id="brasinhaLine">Só um segundo…</p></div>
    </div>
  </section>

  ${farewell ? `<section class="wrap"><article class="farewell"><h2>Vinícius e Milena</h2><p>Agora começa uma fase nova pra vocês, e eu não podia deixar passar sem agradecer por tudo que viveram com a gente na AMATUS.</p><p>Vocês fazem parte da nossa história! Vou guardar com carinho as conversas, as risadas e os momentos que compartilhamos. Que Jesus esteja no centro do lar de vocês, dando sabedoria, amor e parceria pra cada dia.</p><p>A rotina muda, mas o carinho continua. Contem comigo e com a gente. Sejam muito felizes nessa caminhada!</p><span class="sign">Com carinho, Denis e AMATUS</span></article></section>` : ''}

  <section class="wrap home-sec">
    <div class="section-head"><h2>Corrida do acampamento</h2><a class="link" href="#ranking">Ranking completo ${icon('right', 16)}</a></div>
    <div class="race">
      <div class="panel race-podium">${podium()}</div>
      <div class="panel race-log"><h3 class="sub">Últimas conquistas</h3>${conquestList(4)}</div>
    </div>
  </section>

  <section class="wrap home-sec">
    <div class="section-head"><h2>Esta semana</h2><a class="link" href="#cronograma">Agenda completa ${icon('right', 16)}</a></div>
    <div class="panel home-week">${weekAgenda()}</div>
  </section>

  <section class="wrap feature-row">
    <a class="feature conexao" href="${LINKS.legacy}/conexao" target="_blank" rel="noopener noreferrer">
      <img src="assets/brasinha/conexao.webp" alt="" loading="lazy">
      <div><h2>Conexão</h2><p>Encontre sua conexão. Forme sua equipe. 3 equipes, 5 jovens em cada.</p><span class="link">Abrir dinâmica ↗</span></div>
    </a>
    ${Date.now() < secret ? `<button class="feature secret" data-secret>
      <img src="assets/games/arquivos-secretos-teaser-v4.png" alt="Equipe AMATUS em um cenário de investigação, com os rostos borrados" loading="lazy">
      <div><h2>Tem novidade chegando</h2><p>É bom vocês conhecerem bem a AMATUS, a nossa igreja e cada um do grupo.</p>${countdownHTML(secret)}</div>
    </button>` : ''}
  </section>

  <section class="band projects-band">
    <div class="wrap">
      <div class="section-head"><h2>Dois encontros, um mesmo desejo</h2><a class="link" href="#projetos">Conheça os projetos ${icon('right', 16)}</a></div>
      <div class="project-pair">
        <a class="project afo" href="#projetos"><span class="project-name">AFO</span><span class="project-desc">Amatus Friday Oration · oração individual e em grupo</span><span class="project-when">Sextas alternadas · 22h às 00h</span></a>
        <a class="project brasa" href="#projetos"><span class="project-name">BRASA</span><span class="project-desc">Louvores e reflexões bíblicas · 2 Samuel 22:13</span><span class="project-when">Sextas alternadas</span></a>
      </div>
    </div>
  </section>
  ${gallery()}`;
}

function projetos() {
  return pagehead('Nossos projetos', 'Dois encontros, com propostas diferentes e o mesmo desejo de conhecer mais a Deus.') + `
  <section class="wrap prose-block about">
    <h2>Quem somos</h2>
    <div class="prose"><p>Somos o grupo de jovens da 3ª Igreja do Evangelho Quadrangular de Ferraz de Vasconcelos. <strong>AMATUS significa “amado”</strong>, e esse nome nos lembra de onde tudo começa: no amor de Deus por nós.</p>
    <p>Queremos conhecer mais a Jesus e aprender a viver a nossa fé nas escolhas de todos os dias. Nossos encontros têm oração, louvor, conversa, aprendizado e espaço para criar amizades e cuidar uns dos outros.</p>
    <p>Tem gente chegando agora, gente que cresceu na igreja e gente recomeçando sua caminhada com Deus. Cada um tem sua história, e queremos caminhar juntos, com sinceridade e disposição para crescer.</p></div>
  </section>
  <section class="wrap project-detail afo">
    <div class="project-mark">AFO</div>
    <div class="prose"><h2>Amatus Friday Oration</h2>
      <p>A AFO significa “Oração de Sexta-feira da Amatus”. É um encontro voltado principalmente à <strong>oração individual e em grupo</strong>.</p>
      <p>Separamos um tempo para conversar com Deus, agradecer, apresentar nossas necessidades e orar uns pelos outros. O propósito é incentivar uma vida de oração mais constante, que continue durante a semana.</p>
      <div class="meta"><span>${icon('calendar', 16)} Sextas-feiras alternadas</span><span>${icon('clock', 16)} 22h às 00h</span></div>
      <div class="btn-row">${ext(D.afoPlaylist, `${icon('music', 18)} Spotify`)}${ext(D.afoYoutubeMusic, `${icon('music', 18)} YouTube Music`)}</div>
    </div>
  </section>
  <section class="wrap project-detail brasa">
    <div class="project-mark">BRASA</div>
    <div class="prose"><h2>Louvores e reflexões bíblicas</h2>
      <p>O BRASA é um encontro voltado principalmente aos <strong>louvores e às reflexões bíblicas</strong>. Cantamos para exaltar a Deus e refletimos juntos sobre o que a Bíblia ensina e como isso se aplica à nossa vida.</p>
      <p>O nome vem de <strong>2 Samuel 22:13</strong>, uma passagem que fala de brasas acesas pelo resplendor da presença de Deus. Ela faz parte de um cântico em que Davi agradece a Deus pelos livramentos que recebeu.</p>
      <div class="meta"><span>${icon('calendar', 16)} Sextas-feiras alternadas</span></div>
    </div>
  </section>
  <section class="wrap callout">
    <div><h2>Quando e onde</h2><p>AFO e BRASA acontecem às sextas-feiras, de forma alternada, na 3ª IEQ de Ferraz de Vasconcelos. Para menores de 18 anos, o transporte de ida e volta é de responsabilidade dos pais ou responsáveis.</p></div>
    <a class="btn primary" href="#cronograma">Consultar cronograma ${icon('right', 18)}</a>
  </section>`;
}

function rankingTabs(active) {
  return `<div class="segmented" role="tablist">${[['ranking', 'Classificação'], ['comparar', 'Comparar jovens'], ['regras', 'Como pontuar']].map(([r, l]) => `<a role="tab" aria-selected="${r === active}" href="#${r}">${l}</a>`).join('')}</div>`;
}
function ranking() {
  const w = D.weekly;
  return pagehead('Ranking do acampamento', 'Quem soma mais pontos até uma semana antes do acampamento garante a vaga gratuita.', rankingTabs('ranking')) + `
  <section class="wrap">${podium()}</section>
  <section class="wrap rank-layout">
    <div class="panel">
      <div class="rank-toolbar">
        <label class="search">${icon('search', 18)}<span class="sr">Buscar jovem</span><input id="search" type="search" placeholder="Buscar jovem" autocomplete="off"></label>
        <button class="btn ghost sm" id="shareRanking" aria-label="Compartilhar resumo">${icon("share", 18)}<span class="label">Compartilhar</span></button>
      </div>
      <ol class="rank-list" id="rankRows"></ol>
      <p class="muted small" id="searchNote">Toque no nome para ver os pontos e o histórico. Desempate: reuniões, depois AFOs.</p>
    </div>
    <aside class="rank-side">
      <div class="panel">
        <h2 class="h3">Quem mais subiu</h2>
        ${w?.leaders?.length ? w.leaders.map(p => `<button class="riser" data-profile="${p.id}"><span class="avatar">${initials(p.name)}</span><span><strong>${esc(p.name)}</strong><small>Do ${p.from}º para o ${p.to}º lugar</small></span><b>↑ ${p.rise}</b></button>`).join('') : '<p class="muted">Ainda não houve subida de posições nesta semana.</p>'}
        ${w?.since ? `<p class="muted small">Comparação desde ${new Date(w.since).toLocaleDateString('pt-BR', { timeZone: TZ })}, de segunda a domingo.</p>` : ''}
      </div>
      <div class="panel"><h2 class="h3">Últimas conquistas</h2>${conquestList(4)}</div>
      <p class="muted small">Pontuação provisória · Início em 18/09/2026 · Data de encerramento a definir.</p>
    </aside>
  </section>`;
}
function renderRank(q = '') {
  const list = rank.filter(p => searchMatches(p.name, q));
  const max = rank[0]?.total || 1;
  $('#rankRows').innerHTML = list.length ? list.map(p => `<li class="rank-row ${p.position <= 3 ? 'top' : ''}"><button data-profile="${p.id}" aria-label="Ver pontos e histórico de ${esc(p.name)}">
    <span class="pos">${p.position}º</span><span class="avatar">${initials(p.name)}</span>
    <span class="who"><strong>${esc(p.name)}</strong><small>${p.meetings} reuniões · ${p.afos} AFOs</small><span class="bar" style="--w:${D.scoresHidden ? 0 : Math.round(p.total / max * 100)}%"></span></span>
    <span class="score">${pts(p.total)}<small>pts</small></span></button></li>`).join('') : '<li class="empty-row">Nenhum jovem encontrado. Tente outro nome.</li>';
  $('#searchNote').textContent = q ? `${list.length} resultado(s), incluindo nomes parecidos.` : 'Toque no nome para ver os pontos e o histórico. Desempate: reuniões, depois AFOs.';
}

function profileBody(p, inline = false) {
  const r = reaction(p);
  const h = D.histories.filter(x => x.id === p.id).sort((a, b) => b.date - a.date);
  return `<section class="rank-talk tier-${r.tier}"><canvas class="talk-sprite" width="384" height="416" data-tier="${r.tier}" role="img" aria-label="Brasinha reagindo à classificação"></canvas>
    <div class="talk-bubble"><small>Oh, ${esc(first(p.name))}…</small><strong>${esc(r.line)}</strong></div></section>
    <div class="stats4">${[[pts(p.total), 'pontos'], [p.position + 'º', 'posição'], [p.meetings, 'reuniões'], [p.afos, 'AFOs']].map(([v, l]) => `<div><b>${v}</b><small>${l}</small></div>`).join('')}</div>
    <p class="next-step">${nextPosition(p)}</p>
    ${D.scoresHidden ? '' : `<h3 class="sub">De onde vieram os pontos</h3>
    <div class="cats">${CATS.map(([l, f]) => `<button class="cat" data-cat="${l}" data-person="${p.id}" aria-expanded="false"><span>${l}</span><b>${f(p)}</b></button>`).join('')}</div>
    <div id="catDetail" aria-live="polite"></div>
    <h3 class="sub">Histórico por data</h3>
    <ul class="history">${h.map(x => `<li><span>${esc(x.label)}<small>${/Mensalidade/.test(x.label) ? 'Referência: outubro/2026' : serialDate(x.date)}</small></span><b>+${x.points}</b></li>`).join('')}</ul>`}
    <p class="muted small">Pontuação provisória. Os registros mostram a origem de cada ponto.</p>
    ${inline ? '' : `<a class="btn ghost block" href="#comparar" data-close>${icon('compare', 18)} Comparar com alguém</a>`}`;
}
function openProfile(id) {
  const p = person(id); if (!p) return;
  showDialog(p.name, profileBody(p), 'profile');
  window.AMATUS_BRASINHA?.talk($('.talk-sprite'));
}

function comparar() {
  return pagehead('Compare as participações', 'Escolha dois jovens para ver os pontos por categoria.', rankingTabs('comparar')) + `
  <section class="wrap compare">
    <div class="compare-pick"><label class="field"><span>Primeiro jovem</span><select id="personA">${rank.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label>
    <span class="vs" aria-hidden="true">×</span>
    <label class="field"><span>Segundo jovem</span><select id="personB">${rank.map((p, i) => `<option value="${p.id}" ${i === 1 ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select></label></div>
    <div id="comparison"></div>
  </section>`;
}
function compareCats(p) {
  const g = D.histories.filter(h => h.id === p.id && (h.label === 'Gincana' || h.label === 'Quebra-cabeça Dry Bones')).reduce((s, h) => s + h.points, 0);
  return [p.meetings * 10, p.afos * 8, g, p.monthly + p.other - g, p.visitors];
}
function renderCompare() {
  const out = $('#comparison');
  if (D.scoresHidden) { out.innerHTML = '<p class="muted">Pontuações e diferenças estão temporariamente ocultas: <strong>**</strong>.</p>'; return; }
  const a = person($('#personA').value), b = person($('#personB').value);
  if (a.id === b.id) { out.innerHTML = '<p class="muted">Escolha dois jovens diferentes para comparar as participações.</p>'; return; }
  const aa = compareCats(a), bb = compareCats(b), max = Math.max(1, ...aa, ...bb);
  const labels = ['Reuniões', 'AFOs', 'Gincanas', 'Contribuições', 'Visitantes'];
  out.innerHTML = `<div class="duel"><div class="duel-head"><strong>${esc(a.name)}</strong><span>${a.total} pts</span></div><div class="duel-head right"><strong>${esc(b.name)}</strong><span>${b.total} pts</span></div></div>
  <ul class="duel-rows">${labels.map((l, i) => `<li><span class="dv ${aa[i] > bb[i] ? 'win' : ''}">${aa[i]}</span><span class="dbar l"><i style="--w:${aa[i] / max * 100}%"></i></span><span class="dl">${l}</span><span class="dbar r"><i style="--w:${bb[i] / max * 100}%"></i></span><span class="dv ${bb[i] > aa[i] ? 'win' : ''}">${bb[i]}</span></li>`).join('')}</ul>
  <p class="muted small">Contribuições reúne mensalidades, alimentos e limpeza.</p>`;
}

function regras() {
  const rules = [['Reunião de jovens', '10', 'Presença do início ao fim. Tolerância de 15 minutos, salvo aviso prévio ao líder.'], ['AFO', '8', 'Atraso por trabalho, faculdade ou saúde pontua normalmente. Para sair antes, permanecer até as 23h.'], ['Evento do grupo', '8', 'Participação em eventos do grupo.'], ['Leitura bíblica pública', '5', 'No mínimo 30 minutos de participação.'], ['Limpeza e organização', '5', 'Pontuação por dia.'], ['Alimentos', '8', 'Pontuação por dia.'], ['Visitante no culto', '8 + 2', '8 por visitante, mais 2 se participar da reunião. Apenas não crentes e afastados da igreja pontuam.'], ['Visitante na AFO', '8', 'Apenas não crentes e afastados da igreja pontuam.'], ['Visitante em eventos', '5', 'Apenas não crentes e afastados da igreja pontuam.'], ['Mensalidade', '10 + extras', 'R$ 20 completos: 10 pontos. Cada R$ 5 completos a mais: +1. Válida a partir de outubro/2026.'], ['Provas e gincanas', 'Variável', 'Cada prova pode ter um peso diferente, definido pelo líder.']];
  return pagehead('Como pontuar', 'Critérios da competição para a vaga gratuita no Acampamento 2027.', rankingTabs('regras')) + `
  <section class="wrap"><ul class="rules">${rules.map(([n, p, d]) => `<li><b class="rule-pts">${p}<small>pts</small></b><div><h3>${n}</h3><p>${d}</p></div></li>`).join('')}</ul></section>
  <section class="wrap prose-block"><div class="prose">
    <h2>Visitantes</h2><p><strong>Visitantes que já são crentes não pontuam. Não crentes e afastados da igreja pontuam.</strong></p>
    <p>As duas primeiras participações do visitante pontuam, somando culto, AFO e evento. A partir da terceira, não há pontos. Quando mais de um jovem convida, a pontuação é dividida entre eles.</p>
    <h2>Desempate e período</h2><p>Maior quantidade de participações em reuniões de jovens e, em seguida, em AFOs. Se o empate continuar, a classificação permanece compartilhada até a definição do próximo critério.</p>
    <p>A contagem começou em 18/09/2026 e termina uma semana antes do acampamento. A data final ainda será informada.</p>
    <p>Mensalidades atrasadas compensadas geram pontos para o mês de referência. Pagamentos parciais e compensações após o encerramento ainda dependem de definição.</p>
  </div></section>`;
}

let calY, calM, calSel = '';
function cronograma() {
  const t = todaySP(); calY = +t.slice(0, 4); calM = +t.slice(5, 7) - 1; calSel = '';
  return pagehead('Cronograma', 'Nossos encontros e aniversários, em um só lugar.') + `
  <section class="wrap cal-layout">
    <div class="panel calendar">
      <div class="cal-head"><button class="icon-btn" id="prevMonth" aria-label="Mês anterior">${icon('left', 18)}</button><h2 id="monthTitle" aria-live="polite"></h2><button class="icon-btn" id="nextMonth" aria-label="Próximo mês">${icon('right', 18)}</button></div>
      <div class="cal-week" aria-hidden="true">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => `<span>${d}</span>`).join('')}</div>
      <div class="cal-days" id="days"></div>
      <div class="cal-foot"><span><i class="dot meeting"></i>Encontro</span><span><i class="dot birthday"></i>Aniversário</span><span><i class="dot cancelled"></i>Cancelado</span>
      <span class="spacer"></span><button class="btn ghost sm" id="calToday">Hoje</button><button class="btn ghost sm" id="calAll">Mês inteiro</button></div>
    </div>
    <div><h2 class="h3" id="agendaTitle"></h2><ol class="agenda" id="agendaItems"></ol></div>
  </section>`;
}
function calendarRender() {
  const evs = AGENDA.events(calY), start = new Date(Date.UTC(calY, calM, 1)).getUTCDay(), count = new Date(Date.UTC(calY, calM + 1, 0)).getUTCDate();
  const prefix = `${calY}-${pad(calM + 1)}-`, today = todaySP();
  $('#monthTitle').textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(calY, calM, 1)));
  let cells = '<span></span>'.repeat(start);
  for (let d = 1; d <= count; d++) {
    const k = prefix + pad(d), es = evs.filter(e => e.date === k);
    cells += `<button class="day ${k === today ? 'today' : ''} ${k === calSel ? 'sel' : ''} ${es.length ? 'has' : ''}" data-day="${k}" ${k === today ? 'aria-current="date"' : ''} aria-label="${d}/${calM + 1}${es.map(e => ', ' + esc(e.title)).join('')}"><span>${d}</span><span class="dots">${es.map(e => `<i class="dot ${e.kind}"></i>`).join('')}</span></button>`;
  }
  $('#days').innerHTML = cells;
  const items = evs.filter(e => calSel ? e.date === calSel : e.date.startsWith(prefix));
  $('#agendaTitle').textContent = calSel ? fmtDay(calSel, { weekday: 'long', day: 'numeric', month: 'long' }) : 'Neste mês';
  $('#agendaItems').innerHTML = items.length ? items.map(agendaRow).join('') : '<li class="muted">Nenhuma atividade cadastrada para este período.</li>';
}

function avivamatus() {
  return pagehead('Avivamatus', 'Reveja os cultos e ouça as playlists dos nossos encontros.', `<div class="segmented" role="tablist"><button role="tab" aria-selected="true" data-vtab="cultos">Cultos no YouTube</button><button role="tab" aria-selected="false" data-vtab="playlists">Playlists</button></div>`) +
    `<section class="wrap" id="videoPanel">${videoContent('cultos')}</section>
    <section class="wrap callout"><div><h2>Playlist da AFO</h2><p>As músicas dos nossos encontros de oração.</p></div><div class="btn-row">${ext(D.afoPlaylist, 'Spotify', 'btn primary')}${ext(D.afoYoutubeMusic, 'YouTube Music')}</div></section>`;
}
function videoContent(tab) {
  const m = D.media.slice().reverse();
  return tab === 'cultos'
    ? `<div class="media-grid">${m.map((v, i) => `<article class="media ${i === 0 ? 'lead' : ''}"><a class="thumb" href="${esc(v.youtube)}" target="_blank" rel="noopener noreferrer" aria-label="Assistir ${esc(v.title)} no YouTube"><img src="https://i.ytimg.com/vi/${esc(v.video_id)}/${i === 0 ? 'maxresdefault' : 'hqdefault'}.jpg" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='https://i.ytimg.com/vi/${esc(v.video_id)}/hqdefault.jpg'"><span class="play">${icon('play', 28)}</span></a>
      <div class="media-meta"><h2>${esc(v.title)}</h2><div class="chips">${ext(v.playlist, 'Spotify', 'chip')}${ext(v.youtubeMusic, 'YT Music', 'chip')}</div></div></article>`).join('')}</div>`
    : `<ul class="playlists">${m.map(v => `<li><span class="pl-ed">${v.edition}</span><div><h3>${esc(v.title)}</h3><p class="muted">Escolha onde ouvir</p></div><div class="btn-row">${ext(v.playlist, 'Spotify', 'chip')}${ext(v.youtubeMusic, 'YouTube Music', 'chip')}</div></li>`).join('')}</ul>`;
}

const MASCOT = { finalists: [['CHAMEX', 8], ['Brasinha', 6], ['COMPETITUS', 6], ['Afonsinho', 5], ['Amatus Batista', 5], ['Tyrone', 5]], stats: [[20, 'nomes sugeridos'], [20, 'indicações'], [13, 'votantes no site'], [65, 'votos no site']] };
function mascote() {
  return `<section class="mascot-hero"><div class="wrap mascot-grid">
    <div><h1 class="display">Nosso mascote tem nome.</h1><p class="lede">Escolhido pela nossa turma, o <strong>Brasinha</strong> está pronto para viver as próximas histórias da AMATUS, no site, nos games e nos desafios.</p>
    <p class="muted">Um minuto para conhecer essa história. Dê o play e comemore com a gente!</p></div>
    <div class="film"><video controls preload="none" playsinline poster="assets/brasinha/capa.jpg" aria-label="A identidade do Brasinha, filme animado de um minuto"><source src="assets/brasinha/identidade.mp4" type="video/mp4">Seu navegador não reproduz este vídeo.</video></div>
  </div></section>
  <section class="wrap stats-strip">${MASCOT.stats.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</section>
  <section class="wrap mascot-story">
    <div class="prose"><h2>Como escolhemos esse nome</h2>
    <p><strong>20 ideias, seis finalistas e uma escolha da turma.</strong> As sugestões chegaram em 21/10. Em 22/10, a votação no site definiu os seis finalistas; depois, o grupo escolheu Brasinha em voto único no WhatsApp.</p>
    <p>O nome lembra o <strong>BRASA</strong>, nosso encontro de louvor e oração. O Chamex chegou pertinho de ser escolhido!</p>
    <p>Nome sugerido por <strong>Samuel Aquino</strong>.</p></div>
    <div class="panel"><h3 class="h3">Finalistas · votos no site</h3><ol class="finalists">${MASCOT.finalists.map(([n, v]) => `<li class="${n === 'Brasinha' ? 'winner' : ''}"><span>${n}${n === 'Brasinha' ? ' <em>escolhido</em>' : ''}</span><span class="fbar"><i style="--w:${v / 8 * 100}%"></i></span><b>${v}</b></li>`).join('')}</ol></div>
  </section>
  <section class="wrap wardrobe"><h2>O dia do Brasinha</h2><p class="muted">Ele muda de roupa e de assunto conforme a hora e a agenda da AMATUS.</p>
    <div class="wardrobe-row">${[['sleep', 'Madrugada'], ['coffee', 'Manhã'], ['work', 'Trabalho'], ['study', 'Estudos'], ['church', 'Encontros'], ['rest', 'Descanso']].map(([a, l]) => `<figure><span class="frame" style="background-image:url(assets/brasinha/${a}.webp)"></span><figcaption>${l}</figcaption></figure>`).join('')}</div></section>`;
}

function igreja() {
  return pagehead('Nossa igreja', 'Conheça a 3ª Igreja do Evangelho Quadrangular de Ferraz de Vasconcelos.') + `
  <section class="wrap church">
    <div class="prose"><h2>Um convite para nos conhecer.</h2><p>A AMATUS é o grupo de jovens da 3ª IEQ de Ferraz de Vasconcelos. Nossos projetos fazem parte da vida da igreja, onde nos reunimos para orar, louvar e aprender sobre a Bíblia.</p><p>Você pode conhecer a igreja pelas redes sociais, acompanhar os cultos no YouTube ou consultar a localização para nos visitar.</p>
      <h3>Cultos da semana</h3>
      <ul class="schedule"><li><b>Domingo</b><span>Culto 8h · Encontro dos jovens 10h</span></li><li><b>Terça</b><span>Coral 19h30</span></li><li><b>Quarta</b><span>Culto de oração 20h</span></li><li><b>Sexta</b><span>AFO ou BRASA 22h</span></li><li><b>Sábado</b><span>Culto 19h</span></li></ul>
    </div>
    <aside class="visit"><span class="visit-icon">${icon('pin', 30)}</span><h2>Venha nos visitar</h2><p>3ª Igreja do Evangelho Quadrangular<br>Rua Osvaldo Marcondes do Amaral, 15<br>Jardim Juliana · Ferraz de Vasconcelos · SP</p>${ext(LINKS.maps, 'Ver no Google Maps', 'btn primary block')}</aside>
  </section>
  <section class="wrap links-2">
    <a class="link-card" href="${LINKS.churchInstagram}" target="_blank" rel="noopener noreferrer">${icon('instagram', 28)}<span><strong>Instagram da igreja</strong><small>@3ieq.ferraz · publicações e avisos</small></span><span aria-hidden="true">↗</span></a>
    <a class="link-card" href="${LINKS.churchYoutube}" target="_blank" rel="noopener noreferrer">${icon('play', 28)}<span><strong>YouTube da igreja</strong><small>@3ieq.Ferraz · cultos e vídeos</small></span><span aria-hidden="true">↗</span></a>
  </section>`;
}

function oracao() {
  return `<section class="prayer"><div class="wrap prayer-inner">
    <span class="prayer-icon">${icon('pray', 40)}</span>
    <h1 class="display">Pedidos de oração</h1>
    <p class="lede">Conte pelo que você gostaria que orássemos. A gente leva junto com você.</p>
    ${ext(LINKS.prayer, 'Enviar meu pedido de oração', 'btn primary lg')}
    <p class="muted small">Você será direcionado ao formulário do Google, que abre em uma nova aba. Confira as informações de privacidade no formulário antes de enviar. Se precisar saber quem terá acesso ao pedido, fale com o líder.</p>
  </div></section>`;
}

function reflexoes() {
  return pagehead('Reflexões', 'Um espaço para ler, estudar e compartilhar o que temos aprendido.', `<div class="segmented" role="tablist"><button role="tab" aria-selected="true" data-rtab="lider">Reflexão do líder</button><button role="tab" aria-selected="false" data-rtab="galera">Reflexões da galera</button></div>`) +
    `<section class="wrap"><div class="empty" id="reflectionPanel">${reflectionEmpty('lider')}</div></section>`;
}
const reflectionEmpty = t => `${icon('book', 40)}<h2>${t === 'lider' ? 'Novas reflexões em breve.' : 'O que você tem aprendido?'}</h2><p>${t === 'lider' ? 'As reflexões do líder serão publicadas aqui, para você ler no seu tempo.' : 'Os textos enviados pelos jovens e revisados pelo líder aparecerão aqui, com o nome de quem escreveu.'}</p>`;

function loja() {
  const shirt = c => `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M72 32 41 44 16 81l29 18 12-17v86h86V82l12 17 29-18-25-37-31-12c-3 12-14 17-28 17S75 44 72 32Z" fill="${c}"/><path d="M72 32c6 23 50 23 56 0" fill="none" stroke="#0002" stroke-width="2"/><image href="assets/logo-mark.png" x="84" y="88" width="32" height="31"/></svg>`;
  const mug = `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M136 65h20c34 0 34 58 0 58h-20" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="13"/><path d="M42 51h99v88q0 23-50 23t-49-23Z" fill="#f4f1ee"/><image href="assets/logo-mark.png" x="74" y="84" width="34" height="33"/></svg>`;
  const cup = `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="m48 35 13 125q39 19 78 0l13-125Z" fill="#e9e4de"/><image href="assets/logo-mark.png" x="83" y="80" width="34" height="33"/></svg>`;
  const items = [['Camiseta preta', shirt('#1c1a1b')], ['Camiseta off-white', shirt('#efebe0')], ['Camiseta vermelha', shirt('#b83d3d')], ['Caneca', mug], ['Copo', cup]];
  return pagehead('Loja AMATUS', 'Conheça os itens do grupo.') + `<section class="wrap"><p class="notice">${icon('bag', 18)} <span><strong>Em breve, reposição!</strong> Todos os itens estão indisponíveis no momento.</span></p>
  <div class="shop">${items.map(([n, s]) => `<article class="product"><div class="product-art">${s}</div><h3>${n}</h3><span class="tag cancelled">Indisponível</span><small class="muted">Imagem ilustrativa · foto oficial em breve</small></article>`).join('')}</div></section>`;
}

function acampamento() {
  const leader = rank[0];
  return `<section class="camp"><div class="wrap camp-inner"><h1 class="display">Acampamento 2027</h1><p class="lede">Informações em breve. Enquanto isso, a disputa pela vaga gratuita continua no ranking.</p>
  ${leader ? `<p class="camp-leader">${icon('trophy', 20)}<span>Hoje, <strong>${esc(leader.name)}</strong> está com a placa da vaga.</span></p>` : ''}
  <a class="btn primary" href="#ranking">Ver ranking ${icon('right', 18)}</a></div></section>`;
}

function meuHistorico() {
  const u = session.get();
  if (!u) return `<section class="wrap gate">${icon('lock', 40)}<h1 class="h2">Meu histórico</h1><p class="muted">Entre com seu PIN para ver seus pontos, a origem de cada um e quanto falta para subir no ranking.</p><button class="btn primary" data-login>Entrar com meu PIN</button></section>`;
  if (u.leader) return `<section class="wrap gate">${icon('lock', 40)}<h1 class="h2">Você entrou como líder</h1><p class="muted">Líderes não pontuam. Veja as páginas reservadas.</p><a class="btn primary" href="#paginas-ocultas">Páginas ocultas</a></section>`;
  return pagehead(`Oi, ${esc(first(u.name))}`, 'Seus pontos e de onde cada um veio.') + `<section class="wrap narrow">${profileBody(u, true)}</section>`;
}

function paginasOcultas() {
  const u = session.get();
  return pagehead('Páginas ocultas', 'Páginas fora do menu por enquanto.') + `<section class="wrap">${u?.leader
    ? `<div class="links-2">${[['acampamento', 'Acampamento 2027'], ['loja', 'Loja'], ['reflexoes', 'Reflexões']].map(([r, l]) => `<a class="link-card" href="#${r}">${icon('lock', 24)}<span><strong>${l}</strong><small>Visualizar</small></span>${icon('right', 18)}</a>`).join('')}</div>`
    : `<div class="empty">${icon('lock', 40)}<h2>Área exclusiva do Denis.</h2><p>Entre com o PIN de líder para visualizar.</p><button class="btn primary" data-login>Entrar</button></div>`}</section>`;
}

/* ---------- roteador ---------- */
const PAGES = {
  inicio: ['Início', home], projetos: ['Projetos', projetos], ranking: ['Ranking', ranking], comparar: ['Comparar jovens', comparar], regras: ['Como pontuar', regras],
  games: ['Amatus Games', () => window.AMATUS_GAMES.page()], cronograma: ['Cronograma', cronograma], avivamatus: ['Avivamatus', avivamatus], mascote: ['Nosso mascote', mascote],
  igreja: ['Nossa igreja', igreja], oracao: ['Pedidos de oração', oracao], reflexoes: ['Reflexões', reflexoes], loja: ['Loja', loja], acampamento: ['Acampamento 2027', acampamento],
  'meu-historico': ['Meu histórico', meuHistorico], 'paginas-ocultas': ['Páginas ocultas', paginasOcultas], entrar: ['Entrar', entrar]
};
const NAV_OF = { comparar: 'ranking', regras: 'ranking', 'meu-historico': '', 'paginas-ocultas': '', entrar: '' };
const route = () => { const r = location.hash.slice(1).split('?')[0]; return PAGES[r] ? r : 'inicio'; };
function render() {
  const r = route(), main = $('#main');
  const [title, fn] = PAGES[r];
  const swap = () => {
    main.innerHTML = fn();
    main.dataset.route = r;
    document.documentElement.dataset.page = r;
    document.title = `${title} · AMATUS`;
    const nav = NAV_OF[r] ?? r;
    $$('[data-route]').forEach(a => a.dataset.route === nav ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    after(r);
    tickCountdowns();
  };
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches && main.dataset.route) document.startViewTransition(swap);
  else swap();
  window.AMATUS_SCROLL ? window.AMATUS_SCROLL.top() : window.scrollTo({ top: 0, behavior: 'instant' });
}
function after(r) {
  if (r !== 'inicio') window.AMATUS_HERO?.destroy();
  if (r === 'inicio') { window.AMATUS_BRASINHA?.mount($('#brasinhaArt')); loadGallery(); window.AMATUS_HERO?.mount($('#glHero')); }
  if (r === 'ranking') { renderRank(); $('#search').oninput = e => renderRank(e.target.value); $('#shareRanking').onclick = shareRanking; }
  if (r === 'comparar') { renderCompare(); $('#personA').onchange = $('#personB').onchange = renderCompare; }
  if (r === 'cronograma') {
    calendarRender();
    $('#prevMonth').onclick = () => moveMonth(-1); $('#nextMonth').onclick = () => moveMonth(1);
    $('#calToday').onclick = () => { const t = todaySP(); calY = +t.slice(0, 4); calM = +t.slice(5, 7) - 1; calSel = t; calendarRender(); };
    $('#calAll').onclick = () => { calSel = ''; calendarRender(); };
  }
  if (r === 'meu-historico') window.AMATUS_BRASINHA?.talk($('.talk-sprite'));
  if (r === 'games') window.AMATUS_GAMES.mount();
  if (r === 'entrar') bindEntrar();
  $$('.sprite-mini').forEach(el => window.AMATUS_BRASINHA?.mini(el));
  /* abas roláveis: a aba ativa aparece inteira mesmo no celular */
  $$('.segmented').forEach(g => { const on = g.querySelector('[aria-selected="true"]'); if (on) g.scrollLeft += on.getBoundingClientRect().left - g.getBoundingClientRect().left - 4; });
}
/* revelação ao rolar: cada bloco abaixo do primeiro sobe do desfoque ao entrar na tela */
const io = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px 10% 0px' });
function reveal() {
  if (!io) return;
  document.documentElement.classList.add('reveal');
  $$('#main > :not(:first-child)').forEach(el => { el.classList.add('rv'); io.observe(el); });
}
function moveMonth(d) { calM += d; if (calM < 0) { calY--; calM = 11; } if (calM > 11) { calY++; calM = 0; } calSel = ''; calendarRender(); }
async function shareRanking() {
  const msg = 'AMATUS • Ranking Acampamento 2027\n\n' + rank.slice(0, 5).map(p => `${p.position}º ${p.name}${D.scoresHidden ? '' : ` — ${p.total} pontos`}`).join('\n') + `\n\nClassificação provisória · ${todaySP().split('-').reverse().join('/')}\nAcompanhe: ${location.origin}${location.pathname}#ranking`;
  if (navigator.share) { try { await navigator.share({ text: msg }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  showDialog('Compartilhar classificação', `<p class="muted">Revise o resumo antes de compartilhar.</p><textarea class="share-text" id="shareText" rows="10">${esc(msg)}</textarea><button class="btn primary block" id="copySummary">Copiar resumo</button>`);
  $('#copySummary').onclick = async () => { try { await navigator.clipboard.writeText($('#shareText').value); toast('Resumo copiado. Agora é só colar no WhatsApp.'); } catch { $('#shareText').select(); toast('Selecione e copie o texto acima.'); } };
}

document.addEventListener('click', e => {
  const t = e.target;
  const prof = t.closest('[data-profile]'); if (prof) return openProfile(prof.dataset.profile);
  const cat = t.closest('[data-cat]');
  if (cat) {
    const open = cat.getAttribute('aria-expanded') === 'true';
    $$('[data-cat]').forEach(c => c.setAttribute('aria-expanded', 'false'));
    if (open) { $('#catDetail').innerHTML = ''; return; }
    cat.setAttribute('aria-expanded', 'true');
    const rows = catRows(cat.dataset.person, cat.dataset.cat);
    $('#catDetail').innerHTML = `<ul class="history inset">${rows.map(h => `<li><span>${esc(h.label)}<small>${serialDate(h.date)}</small></span><b>+${h.points}</b></li>`).join('') || '<li class="muted">Nenhum registro nesta categoria por enquanto.</li>'}</ul>`;
    return;
  }
  const day = t.closest('[data-day]'); if (day) { calSel = day.dataset.day; calendarRender(); return; }
  const vt = t.closest('[data-vtab]'); if (vt) { $$('[data-vtab]').forEach(b => b.setAttribute('aria-selected', b === vt)); $('#videoPanel').innerHTML = videoContent(vt.dataset.vtab); return; }
  const rt = t.closest('[data-rtab]'); if (rt) { $$('[data-rtab]').forEach(b => b.setAttribute('aria-selected', b === rt)); $('#reflectionPanel').innerHTML = reflectionEmpty(rt.dataset.rtab); return; }
  if (t.closest('[data-login]')) return loginDialog();
  if (t.closest('[data-secret]')) showDialog('Tem novidade chegando', `<img class="secret-img" src="assets/games/arquivos-secretos-teaser-v4.png" alt="Pôster AMATUS: Arquivos Secretos, Caso 001"><p>É bom vocês conhecerem bem a AMATUS, a nossa igreja e cada um dos membros do grupo. Vem novidade por aí!</p>${countdownHTML(Date.parse('2026-11-08T10:00:00-03:00'))}`);
});

/* topbar ganha material ao rolar */
const topbar = $('#topbar');
addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 8), { passive: true });
addEventListener('hashchange', render);

/* abertura: uma vez por sessão */
const intro = $('#intro');
if (sessionStorage.getItem('amatus-intro') || matchMedia('(prefers-reduced-motion: reduce)').matches) intro.remove();
else { sessionStorage.setItem('amatus-intro', '1'); intro.addEventListener('animationend', () => intro.remove(), { once: true }); intro.onclick = () => intro.remove(); }

window.AMATUS = { $, $$, esc, icon, ext, D, AGENDA, rank, person, session, showDialog, closeDialog, toast, loginDialog, first, initials, pad, partsSP, todaySP, LINKS, countdownHTML };

document.addEventListener('DOMContentLoaded', () => { paintAccount(); render(); });
})();
