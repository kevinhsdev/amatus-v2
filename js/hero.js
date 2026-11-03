/* Hero da home: fluxo de brasa granulado em WebGL puro (domain warping + pontilhado estocástico),
   na linha do hero do ProfitizeBuild, com as cores da AMATUS. O cursor puxa o fluxo de leve.
   Também liga a rolagem suave (Lenis) no site todo. */
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.mjs';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.1, prevent: n => !!n.closest?.('dialog') });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
window.AMATUS_SCROLL = { top: () => (lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0)) };

const FRAG = `
precision highp float;
uniform vec2 uRes, uMouse;
uniform float uTime, uIn;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; } return v; }
vec3 ramp(float t) {                         /* brasa funda -> laranja AMATUS -> creme */
  vec3 c = mix(vec3(0.30, 0.06, 0.03), vec3(0.78, 0.18, 0.05), smoothstep(0.0, 0.35, t));
  c = mix(c, vec3(1.0, 0.42, 0.10), smoothstep(0.3, 0.62, t));
  c = mix(c, vec3(1.0, 0.70, 0.40), smoothstep(0.6, 0.85, t));
  return mix(c, vec3(1.0, 0.89, 0.78), smoothstep(0.85, 1.0, t));
}
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  p -= (p - m) * 0.18 * exp(-dot(p - m, p - m) * 6.0);          /* o cursor puxa o fluxo */
  float t = uTime * 0.035;
  vec2 s = p * 1.1;
  vec2 q = vec2(fbm(s + vec2(0.0, t)), fbm(s + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(s + 3.6 * q + vec2(1.7, 9.2) + t * 1.4), fbm(s + 3.6 * q + vec2(8.3, 2.8) - t * 1.1));
  float v = fbm(s + 3.2 * r);
  v = smoothstep(0.26, 0.82, v + length(q - 0.5) * 0.25);
  v *= mix(0.62, 1.0, smoothstep(0.05, 0.75, length(p * vec2(0.62, 1.15))));   /* centro mais escuro para o texto */
  v *= uIn;
  /* pontilhado: cada pixel acende com probabilidade igual à intensidade, como grão de filme */
  float g = hash(gl_FragCoord.xy + fract(uTime * 3.7) * vec2(91.7, 37.3));
  float lit = step(g, pow(v, 1.0));
  vec3 col = mix(vec3(0.078, 0.031, 0.027), ramp(v), lit * 0.88 + v * v * 0.35);
  gl_FragColor = vec4(col, 1.0);
}`;

let teardown = null, current = null;

function mount(sec) {
  const canvas = sec?.querySelector('.sh-canvas');
  if (canvas && canvas === current) return;   /* já rodando neste canvas */
  destroy();
  const gl = canvas?.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return;   /* sem WebGL fica o degradê do CSS */

  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }'));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
  } catch (e) { console.warn('Hero em shader indisponível.', e); return; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   /* um triângulo cobre a tela */
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uMouse = U('uMouse'), uTime = U('uTime'), uIn = U('uIn');

  const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const onMove = e => { const r = canvas.getBoundingClientRect(); ptr.tx = (e.clientX - r.left) / r.width; ptr.ty = 1 - (e.clientY - r.top) / r.height; };
  const draw = (time, fade) => {
    ptr.x += (ptr.tx - ptr.x) * 0.05; ptr.y += (ptr.ty - ptr.y) * 0.05;
    gl.uniform2f(uMouse, ptr.x, ptr.y); gl.uniform1f(uTime, time); gl.uniform1f(uIn, fade);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  /* grão em pixel de tela: dpr limitado a 1.25 deixa o pontilhado visível e o custo baixo */
  const size = () => {
    const k = Math.min(devicePixelRatio || 1, 1.25), w = Math.round(canvas.clientWidth * k), h = Math.round(canvas.clientHeight * k);
    if (!w || !h) return;
    canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(uRes, w, h);
    if (reduce) draw(18, 1);
  };

  const ro = new ResizeObserver(size); ro.observe(canvas); size();
  let raf = 0, vis = true;
  const t0 = performance.now();
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(canvas);
  const loop = now => {
    raf = requestAnimationFrame(loop);
    if (!vis || document.hidden) return;
    const t = (now - t0) / 1000, k = Math.min(1, t / 1.6);
    draw(t + 18, 1 - Math.pow(1 - k, 3));
  };
  if (!reduce) { sec.addEventListener('pointermove', onMove); raf = requestAnimationFrame(loop); }

  current = canvas;
  teardown = () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); sec.removeEventListener('pointermove', onMove); };
}
function destroy() { teardown?.(); teardown = null; current = null; }

window.AMATUS_HERO = { mount, destroy };
const pending = document.getElementById('glHero');
if (pending) mount(pending);
