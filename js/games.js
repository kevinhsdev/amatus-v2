'use strict';
/* Amatus Games: jogos que rodam no próprio site (sem servidor). Progresso salvo no aparelho. */
(() => {
const A = window.AMATUS, { $, $$, esc, icon, D } = A;
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} }
};
const when = iso => iso ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso)) + ' · Brasília' : 'Conclusão anterior · horário não registrado';
const shuffle = n => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const r = new Uint32Array(1); crypto.getRandomValues(r); const j = r[0] % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } if (a.every((v, i) => v === i)) [a[0], a[1]] = [a[1], a[0]]; return a; };

/* ---------- catálogo ---------- */
const GAMES = [
  { id: 'drybones', title: 'Dry Bones', desc: 'Quebra-cabeça de 30 peças. Monte no seu tempo.', cover: 'assets/games/desafio-dry-bones.png', tag: '30 peças', run: () => puzzle({ key: 'amatus-dry-bones-20261018-v1', title: 'Dry Bones', img: 'assets/games/desafio-dry-bones.png', cols: 6, rows: 5, ratio: '4/3' }) },
  { id: 'guerras', title: 'Em Guerras', desc: 'O quebra-cabeça de 64 peças do Avivamatus. Desafio encerrado.', cover: 'assets/games/em-guerras-image-v1.webp', tag: '64 peças', run: () => puzzle({ key: 'amatus-em-guerras-livre-v1', title: 'Em Guerras', img: 'assets/games/em-guerras-image-v1.webp', cols: 8, rows: 8, ratio: '1201/1309' }) },
  { id: 'cruzadas', title: 'Palavras cruzadas', desc: 'Quanto você lembra dos nossos encontros do Avivamatus?', cover: null, coverText: 'SOMOS AMATUS', tag: '11 palavras', run: () => crossword() },
  { id: 'oito', title: 'Jogo dos 8 erros', desc: 'Olhe com atenção e encontre as diferenças.', cover: 'assets/games/eight-original.png', tag: '8 diferenças', run: () => eight() },
  { id: 'quiz', title: 'Quiz AMATUS', desc: `Todas as perguntas dos quizzes encerrados, uma após a outra. 30 segundos cada.`, cover: null, coverText: 'QUIZ', tag: `${D.quizLibrary.length} perguntas`, run: () => quiz('Quiz AMATUS', D.quizLibrary, 'quiz') },
  { id: 'quizafo', title: 'Quiz da AFO', desc: 'Jonas, Daniel e conhecimentos gerais. A rodada de 23/10.', cover: null, coverText: 'AFO', tag: `${D.quizAfo.length} perguntas`, run: () => quiz('Quiz da AFO', D.quizAfo, 'quizafo') }
];
const SERVER = [
  { title: 'Missão AMATUS · Jardim do Éden', desc: 'A corrida do tempo: corra com Brasinha e alcance o portal.', cover: 'assets/games/eden-cover.png', path: '/missao-amatus' },
  { title: 'Onde está o mascote?', desc: 'Encontre os 15 mascotes. Jogo livre e resultado final.', path: '/onde-esta-o-mascote' },
  { title: 'Ponto de Impacto', desc: 'Duelos AMATUS de reflexo e precisão. Convide um amigo.', path: '/ponto-de-impacto' },
  { title: 'Conexão', desc: 'Encontre sua conexão. Forme sua equipe.', cover: 'assets/brasinha/conexao.webp', path: '/conexao' }
];
const doneOf = id => ({ drybones: store.get('amatus-dry-bones-20261018-v1')?.certificateName, guerras: store.get('amatus-em-guerras-livre-v1')?.certificateName, cruzadas: store.get('amatus-crossword-avivamatus-20261019-v1')?.name, oito: store.get('amatus-eight-livre-v1')?.done, quiz: store.get('amatus-quiz-best-quiz'), quizafo: store.get('amatus-quiz-best-quizafo') })[id];

function page() {
  return `<header class="pagehead games-head"><h1>Amatus Games</h1><p>Desafios valendo pontos e jogos livres para jogar com a turma.</p>
    <label class="search">${icon('search', 18)}<span class="sr">Encontre um jogo</span><input id="gameSearch" type="search" placeholder="Encontre um jogo" autocomplete="off"></label></header>
  <section class="wrap">
    <div class="flash">
      <div><h2>Aguarde mais provas!</h2><p>Novos desafios podem surgir a qualquer momento, valendo <b>10, 20, 50 ou até 100 pontos</b>. Fique de olho no grupo e ative as notificações.</p></div>
      <span class="flash-bolt" aria-hidden="true">${icon('spark', 40)}</span>
    </div>
  </section>
  <section class="wrap">
    <div class="section-head"><h2>Jogue agora</h2><span class="muted">Jogo livre · sem novos pontos</span></div>
    <div class="game-grid" id="gameGrid">${GAMES.map(g => {
      const done = doneOf(g.id);
      return `<article class="game-card" data-game-name="${esc(g.title.toLowerCase())}">
        <button class="game-cover" data-play="${g.id}" aria-label="Jogar ${esc(g.title)}">${g.cover ? `<img src="${g.cover}" alt="" loading="lazy">` : `<span class="cover-type">${g.coverText}</span>`}</button>
        <div class="game-body"><div class="game-tags"><span class="tag">${g.tag}</span>${done ? `<span class="tag ok">${icon('check', 14)} Concluído</span>` : ''}</div>
        <h3>${g.title}</h3><p>${g.desc}</p><button class="btn primary sm" data-play="${g.id}">${done ? 'Jogar de novo' : 'Jogar agora'}</button></div></article>`;
    }).join('')}</div>
    <p class="muted small" id="gameSearchStatus" role="status"></p>
  </section>
  <section class="wrap">
    <div class="section-head"><h2>Jogos anteriores com servidor</h2><span class="muted">Abrem na versão atual do site</span></div>
    <div class="server-list">${SERVER.map(s => `<a class="server-game" data-game-name="${esc(s.title.toLowerCase())}" href="${A.LINKS.legacy}${s.path}" target="_blank" rel="noopener noreferrer">
      ${s.cover ? `<img src="${s.cover}" alt="" loading="lazy">` : `<span class="server-icon">${icon('mascot', 28)}</span>`}
      <span><strong>${s.title}</strong><small>${s.desc}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div>
  </section>`;
}
function mount() {
  $('#gameSearch').oninput = e => {
    const q = e.target.value.trim().toLowerCase(); let n = 0;
    $$('[data-game-name]').forEach(el => { const hit = !q || el.dataset.gameName.includes(q); el.hidden = !hit; n += hit; });
    $('#gameSearchStatus').textContent = q && !n ? 'Nenhum jogo com esse nome. Tente outro nome.' : '';
  };
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-play]'); if (!b) return;
  GAMES.find(g => g.id === b.dataset.play)?.run();
});
const open = (title, html) => A.showDialog(title, `<div class="game-stage">${html}</div>`, 'game');
const refreshGrid = () => { if (location.hash === '#games') { $('#main').innerHTML = page(); mount(); } };
document.getElementById('dialog').addEventListener('close', e => { if (e.target.classList.contains('game')) refreshGrid(); });

/* ---------- comprovante ---------- */
function certificate({ game, name, detail, img, onAgain }) {
  return `<section class="cert" aria-label="Comprovante de participação">
    <div class="cert-top"><img src="assets/logo-mark.png" alt="" width="40" height="39"><span>Amatus Games · ${esc(game)}</span></div>
    <h2>Comprovante de participação</h2>
    <p class="cert-name">${esc(name)}</p>
    <p class="cert-detail">${detail}</p>
    ${img ? `<img class="cert-img" src="${img}" alt="Imagem completa de ${esc(game)}">` : ''}
    <p class="muted small">Jogo livre · sem novos pontos.</p>
  </section><div class="btn-row center"><button class="btn ghost" id="again">Jogar novamente</button></div>`;
}
function nameForm(id, onName, title = 'Concluído!') {
  const u = A.session.get();
  return `<form class="form center" id="${id}"><h2 class="h2">${title}</h2><label class="field"><span>Seu nome no comprovante</span>
    <input name="n" required minlength="2" maxlength="45" placeholder="Digite seu nome" autocomplete="name" value="${u && !u.leader ? esc(u.name) : ''}"></label>
    <button class="btn primary block">Gerar comprovante</button></form>`;
}
function bindName(id, cb) {
  $('#' + id).onsubmit = e => { e.preventDefault(); const n = new FormData(e.target).get('n').trim().replace(/\s+/g, ' '); if (n.length >= 2) cb(n); };
}

/* ---------- quebra-cabeça ---------- */
function puzzle(cfg) {
  const N = cfg.cols * cfg.rows;
  let s = store.get(cfg.key);
  if (!s || !Array.isArray(s.tiles) || s.tiles.length !== N) s = { tiles: shuffle(N), moves: 0 };
  let sel = null;
  const solved = () => s.tiles.every((v, i) => v === i);
  const save = () => store.set(cfg.key, s);
  const draw = () => {
    if (solved() && !s.certificateName) {
      open(cfg.title, nameForm('pzName') + `<p class="muted small center">${s.moves} trocas · ${N} peças</p>`);
      return bindName('pzName', n => { s.certificateName = n; save(); draw(); });
    }
    if (solved()) {
      open(cfg.title, certificate({ game: cfg.title, name: s.certificateName, detail: `${when(s.completedAt)}<br>${N} peças · ${s.moves} trocas`, img: cfg.img }));
      return $('#again').onclick = () => { store.del(cfg.key); puzzle(cfg); };
    }
    const placed = s.tiles.filter((v, i) => v === i).length;
    open(cfg.title, `<div class="game-meta"><span>Toque em duas peças para trocar</span><span><b>${placed}</b>/${N} no lugar · ${s.moves} trocas</span></div>
      <div class="puzzle" style="--cols:${cfg.cols};aspect-ratio:${cfg.ratio}" role="group" aria-label="Quebra-cabeça de ${N} peças">${s.tiles.map((v, i) => `<button class="tile ${sel === i ? 'sel' : ''} ${v === i ? 'ok' : ''}" data-i="${i}" aria-label="Peça ${i + 1}" aria-pressed="${sel === i}" style="background-image:url(${cfg.img});background-size:${cfg.cols * 100}% ${cfg.rows * 100}%;background-position:${(v % cfg.cols) / (cfg.cols - 1) * 100}% ${Math.floor(v / cfg.cols) / (cfg.rows - 1) * 100}%"></button>`).join('')}</div>
      <div class="btn-row"><button class="btn ghost sm" id="peek">Ver imagem</button><button class="btn ghost sm" id="restart">Recomeçar</button></div>`);
    $$('.tile').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (sel === null || sel === i) { sel = sel === i ? null : i; return draw(); }
      [s.tiles[sel], s.tiles[i]] = [s.tiles[i], s.tiles[sel]]; s.moves++; sel = null;
      if (solved()) s.completedAt = new Date().toISOString();
      save(); draw();
      $(`.tile[data-i="${i}"]`)?.focus({ preventScroll: true });
    });
    $('#peek').onclick = () => { const p = $('.puzzle'); p.classList.toggle('peek'); p.style.backgroundImage = `url(${cfg.img})`; };
    $('#restart').onclick = () => { if (confirmInline('#restart')) { store.del(cfg.key); puzzle(cfg); } };
  };
  draw();
}
/* confirmação em dois toques, sem diálogo extra */
function confirmInline(sel) {
  const b = $(sel);
  if (b.dataset.armed) return true;
  b.dataset.armed = '1'; const old = b.textContent; b.textContent = 'Tocar de novo para confirmar'; b.classList.add('warn');
  setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.textContent = old; b.classList.remove('warn'); } }, 3000);
  return false;
}

/* ---------- palavras cruzadas (SOMOS AMATUS) ---------- */
function crossword() {
  const KEY = 'amatus-crossword-avivamatus-20261019-v1', Q = D.crossword;
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  let s = store.get(KEY);
  if (!s || !Array.isArray(s.answers) || !Q.every(([w], i) => s.answers[i]?.length === w.length)) s = { answers: Q.map(([w]) => Array(w.length).fill('')), completedAt: null, name: '' };
  const ok = i => s.answers[i].join('') === Q[i][0];
  const all = () => Q.every((_, i) => ok(i));
  const maxIdx = Math.max(...Q.map(q => q[1]));
  const draw = () => {
    if (all() && s.completedAt && !s.name) { open('Palavras cruzadas', `<p class="cw-win">SOMOS AMATUS</p>` + nameForm('cwName', null, '11 de 11 respostas corretas')); return bindName('cwName', n => { s.name = n; store.set(KEY, s); draw(); }); }
    if (all() && s.name) { open('Palavras cruzadas', certificate({ game: 'Avivamatus', name: s.name, detail: `Palavras cruzadas · 11 de 11 respostas corretas<br>${when(s.completedAt)}` })); return $('#again').onclick = () => { store.del(KEY); crossword(); }; }
    open('Palavras cruzadas', `<p class="muted">Cada resposta acende uma letra da coluna laranja. Complete tudo para revelar a frase.</p>
      <div class="cw" style="--key:${maxIdx}">${Q.map(([w, k], r) => `<div class="cw-row ${ok(r) ? 'ok' : ''}" style="--off:${maxIdx - k}"><span class="cw-n">${r + 1}</span>${[...w].map((_, c) => `<input class="cw-cell ${c === k ? 'key' : ''}" data-r="${r}" data-c="${c}" maxlength="1" value="${esc(s.answers[r][c])}" aria-label="Palavra ${r + 1}, letra ${c + 1}" autocomplete="off" autocapitalize="characters" inputmode="text">`).join('')}</div>`).join('')}</div>
      <ol class="cw-clues">${Q.map(([, , clue], i) => `<li class="${ok(i) ? 'ok' : ''}">${esc(clue)}</li>`).join('')}</ol>`);
    $$('.cw-cell').forEach(inp => {
      inp.oninput = () => {
        const r = +inp.dataset.r, c = +inp.dataset.c, v = norm(inp.value).slice(-1);
        inp.value = v; s.answers[r][c] = v;
        if (all() && !s.completedAt) s.completedAt = new Date().toISOString();
        store.set(KEY, s);
        $$('.cw-row')[r].classList.toggle('ok', ok(r)); $$('.cw-clues li')[r].classList.toggle('ok', ok(r));
        if (v) (inp.nextElementSibling || $(`.cw-cell[data-r="${r + 1}"]`))?.focus();
        if (all()) setTimeout(draw, 500);
      };
      inp.onkeydown = e => { if (e.key === 'Backspace' && !inp.value) inp.previousElementSibling?.matches('input') && inp.previousElementSibling.focus(); };
      inp.onfocus = () => inp.select();
    });
  };
  draw();
}

/* ---------- 8 erros (portado do site atual) ---------- */
function eight() {
  const W = 1536, H = 1154, KEY = 'amatus-eight-livre-v1';
  const edits = [{ x: 275, y: 332, rx: 23, ry: 13, tiles: [21] }, { x: 213, y: 968, rx: 39, ry: 22, tiles: [61] }, { x: 581, y: 524, rx: 34, ry: 19, tiles: [33] }, { x: 648, y: 688, rx: 17, ry: 18, tiles: [44] },
    { x: 1080, y: 347, rx: 64, ry: 40, tiles: [26, 27] }, { x: 994, y: 670, rx: 24, ry: 34, asset: 'v5', tiles: [46] }, { x: 1105, y: 844, rx: 24, ry: 19, tiles: [57] }, { x: 1285, y: 967, rx: 26, ry: 24, asset: 'v5', tiles: [68] }];
  let s = store.get(KEY) || { selected: [], done: false }, checked = null;
  const svg = alt => `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${alt ? 'Imagem com oito diferenças' : 'Imagem original'}"><image href="assets/games/eight-original.png" width="${W}" height="${H}"/>${alt ? edits.map((e, i) => `<defs><radialGradient id="f${i}"><stop offset="0" stop-color="#fff"/><stop offset=".72" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="m${i}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}"/><ellipse cx="${e.x}" cy="${e.y}" rx="${e.rx}" ry="${e.ry}" fill="url(#f${i})"/></mask></defs><image href="assets/games/eight-details-${e.asset || 'v4'}.webp" width="${W}" height="${H}" mask="url(#m${i})"/>`).join('') : ''}</svg>`;
  const found = () => new Set(s.selected.map(n => edits.findIndex(e => e.tiles.includes(n))).filter(i => i >= 0));
  const draw = () => {
    if (s.done) { open('Jogo dos 8 erros', `<div class="eight-done"><h2 class="h2">Você achou as 8 diferenças!</h2>${svg(true)}<button class="btn ghost" id="again">Jogar novamente</button></div>`); return $('#again').onclick = () => { store.del(KEY); eight(); }; }
    open('Jogo dos 8 erros', `<div class="game-meta"><span>Marque na segunda imagem os 8 quadros onde há diferenças</span><span><b>${s.selected.length}</b>/8 marcados</span></div>
      <div class="eight"><figure><figcaption>Original</figcaption>${svg(false)}</figure>
      <figure><figcaption>Encontre as diferenças</figcaption><div class="eight-play">${svg(true)}<div class="eight-cells">${Array.from({ length: 80 }, (_, i) => `<button data-cell="${i}" class="${s.selected.includes(i) ? 'on' : ''}" aria-pressed="${s.selected.includes(i)}" aria-label="Quadro ${i + 1}"></button>`).join('')}</div></div></figure></div>
      <div class="btn-row"><button class="btn primary" id="check" ${s.selected.length === 8 ? '' : 'disabled'}>Conferir</button><span class="muted" role="status">${checked === null ? '' : `${checked} de 8 corretas. ${checked < 8 ? 'Troque os quadros e confira de novo.' : ''}`}</span></div>`);
    $$('[data-cell]').forEach(b => b.onclick = () => {
      const i = +b.dataset.cell, k = s.selected.indexOf(i);
      if (k >= 0) s.selected.splice(k, 1); else if (s.selected.length < 8) s.selected.push(i); else return A.toast('Você já marcou 8. Desmarque um quadro para trocar.');
      checked = null; store.set(KEY, s); draw();
    });
    $('#check').onclick = () => { checked = found().size; if (checked === 8) s.done = true; store.set(KEY, s); draw(); };
  };
  draw();
}

/* ---------- quiz (30 s por pergunta) ---------- */
let qTimer;
function quiz(title, questions, id) {
  let i = 0, hits = 0;
  clearInterval(qTimer);
  const intro = () => {
    const best = store.get('amatus-quiz-best-' + id);
    open(title, `<div class="quiz-intro"><h2 class="h2">Conhece mesmo a nossa turma?</h2><p>${questions.length} perguntas, 30 segundos cada. Errou? Continue jogando. Só diversão: nenhum ponto vai para o ranking.</p>${best ? `<p class="tag ok">Seu recorde: ${best}/${questions.length}</p>` : ''}<button class="btn primary lg" id="qStart">Começar</button></div>`);
    $('#qStart').onclick = ask;
  };
  const ask = () => {
    if (i >= questions.length) return result();
    const q = questions[i], end = Date.now() + 30000; let answered = false;
    open(title, `<div class="quiz-top"><strong>Pergunta ${i + 1} de ${questions.length}</strong><span class="quiz-clock" id="qClock" role="timer">30s</span></div>
      <div class="quiz-track"><span id="qBar"></span></div>
      <h2 class="quiz-q">${esc(q.title)}</h2>
      <div class="quiz-opts">${q.options.map((o, k) => `<button class="quiz-opt" data-k="${k}"><span class="letter">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>
      <p class="quiz-fb" id="qFb" role="status"></p><button class="btn primary block" id="qNext" hidden>${i === questions.length - 1 ? 'Ver resultado' : 'Próxima pergunta'}</button>`);
    const bar = $('#qBar');
    bar.style.transitionDuration = '30s'; requestAnimationFrame(() => requestAnimationFrame(() => bar.style.transform = 'scaleX(0)'));
    const finish = k => {
      if (answered) return; answered = true; clearInterval(qTimer);
      const right = k === q.correct; if (right) hits++;
      $$('.quiz-opt').forEach(b => { b.disabled = true; const n = +b.dataset.k; b.classList.toggle('right', n === q.correct); b.classList.toggle('wrong', n === k && !right); });
      bar.style.transitionDuration = '0s'; bar.style.transform = getComputedStyle(bar).transform;
      $('#qFb').textContent = k === null ? `Tempo esgotado! Resposta: ${q.options[q.correct]}.` : right ? 'Acertou!' : `Quase! Resposta: ${q.options[q.correct]}.`;
      $('#qNext').hidden = false; $('#qNext').focus();
    };
    $$('.quiz-opt').forEach(b => b.onclick = () => finish(+b.dataset.k));
    $('#qNext').onclick = () => { i++; ask(); };
    qTimer = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      const c = $('#qClock'); if (!c) return clearInterval(qTimer);
      c.textContent = left + 's'; c.classList.toggle('hot', left <= 5);
      if (!left) finish(null);
    }, 250);
  };
  const result = () => {
    const best = Math.max(hits, store.get('amatus-quiz-best-' + id) || 0); store.set('amatus-quiz-best-' + id, best);
    open(title, `<div class="quiz-intro"><h2 class="h2">Mandou bem em chegar até aqui!</h2><p class="quiz-score"><b>${hits}</b>/${questions.length}</p><p>acertos nesta partida · recorde ${best}</p><p class="muted small">Só diversão: nenhum ponto foi somado ao ranking.</p><button class="btn primary" id="qAgain">Jogar novamente</button></div>`);
    $('#qAgain').onclick = () => quiz(title, questions, id);
  };
  intro();
}
document.getElementById('dialog').addEventListener('close', () => clearInterval(qTimer));

window.AMATUS_GAMES = { page, mount };
})();
