import * as THREE from 'three'

// Night stadium behind the page. The camera moves between keyframes tied to page sections.
const KEYFRAMES = [
  { id: 'hero', pos: [0, 4.2, 68], look: [0, 1.5, 20] },
  { id: 'summary', pos: [-58, 20, 26], look: [0, 0, 4] },
  { id: 'squad', pos: [0, 92, 20], look: [0, 0, 0] },
  { id: 'highlights', pos: [52, 16, -30], look: [0, 0, -8] },
  { id: 'contact', pos: [0, 8, -70], look: [0, 2, -10] },
]

const PITCH_FRAG = /* glsl */ `
  varying vec3 vW; uniform vec3 uFog;
  float band(float d, float w){ float aa = fwidth(d) * 1.2; return 1. - smoothstep(w - aa, w + aa, abs(d)); }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main(){
    vec2 p = vW.xz, a = abs(p);
    float W = 34., L = 52.5, lw = .07;
    float ln = 0.;
    ln = max(ln, band(a.x - W, lw) * step(a.y, L + lw));
    ln = max(ln, band(a.y - L, lw) * step(a.x, W + lw));
    ln = max(ln, band(p.y, lw) * step(a.x, W));
    ln = max(ln, band(length(p) - 9.15, lw));
    ln = max(ln, 1. - smoothstep(.22, .3, length(p)));
    float pb = L - 16.5, sb = L - 5.5;
    ln = max(ln, band(a.y - pb, lw) * step(a.x, 20.16));
    ln = max(ln, band(a.x - 20.16, lw) * step(pb, a.y) * step(a.y, L));
    ln = max(ln, band(a.y - sb, lw) * step(a.x, 9.16));
    ln = max(ln, band(a.x - 9.16, lw) * step(sb, a.y) * step(a.y, L));
    vec2 ps = vec2(p.x, a.y - (L - 11.));
    ln = max(ln, 1. - smoothstep(.2, .27, length(ps)));
    ln = max(ln, band(length(ps) - 9.15, lw) * step(a.y, pb) * step(0., -ps.y));
    float stripe = step(.5, fract(p.y / (2. * L / 14.)));
    vec3 col = mix(vec3(.030, .095, .045), vec3(.042, .125, .060), stripe);
    float n = hash(floor(p * 6.)) * .6 + hash(floor(p * 23.)) * .4;
    col *= .86 + .22 * n;
    float inside = step(a.x, W + 4.) * step(a.y, L + 4.);
    col = mix(vec3(.012, .028, .02), col, inside);
    float light = .45;
    for (int i = 0; i < 4; i++) {
      vec2 c = vec2((i < 2 ? -1. : 1.) * 30., (mod(float(i), 2.) < 1. ? -1. : 1.) * 40.);
      light += .55 * exp(-dot(p - c, p - c) / 1400.);
    }
    light += .35 * exp(-dot(p, p) / 900.);
    col *= light;
    col = mix(col, vec3(.86, .92, .88) * min(light, 1.15), ln * .9);
    float d = length(cameraPosition - vW);
    col = mix(col, uFog, 1. - exp(-d * .011));
    gl_FragColor = vec4(col, 1.);
  }`

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const x = c.getContext('2d')
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, 'rgba(255,255,255,1)')
  gr.addColorStop(0.15, 'rgba(255,248,230,.85)')
  gr.addColorStop(0.4, 'rgba(255,236,200,.18)')
  gr.addColorStop(1, 'rgba(255,236,200,0)')
  x.fillStyle = gr
  x.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function addGoals(scene) {
  const postMat = new THREE.MeshBasicMaterial({ color: 0xdfe6e1 })
  const netMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
  const postGeo = new THREE.CylinderGeometry(0.07, 0.07, 2.44, 8)
  const barGeo = new THREE.CylinderGeometry(0.07, 0.07, 7.32, 8)
  for (const side of [-1, 1]) {
    const g = new THREE.Group()
    const p1 = new THREE.Mesh(postGeo, postMat)
    p1.position.set(-3.66, 1.22, 0)
    const p2 = p1.clone()
    p2.position.x = 3.66
    const bar = new THREE.Mesh(barGeo, postMat)
    bar.rotation.z = Math.PI / 2
    bar.position.y = 2.44
    const net = []
    for (let x = -3.66; x <= 3.67; x += 0.61) net.push(x, 2.44, 0, x, 0, 2)
    for (let y = 0; y <= 2.45; y += 0.61) net.push(-3.66, y, y >= 2.4 ? 0 : 2, 3.66, y, y >= 2.4 ? 0 : 2)
    const ng = new THREE.BufferGeometry()
    ng.setAttribute('position', new THREE.Float32BufferAttribute(net, 3))
    g.add(p1, p2, bar, new THREE.LineSegments(ng, netMat))
    g.position.z = side * 52.5
    g.rotation.y = side > 0 ? 0 : Math.PI
    scene.add(g)
  }
}

function addFloodlights(scene, tex) {
  const beamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uH: { value: 1 } },
    vertexShader: `varying float h; varying vec3 vN; varying vec3 vV; uniform float uH;
      void main(){ h = position.y / uH + .5; vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float h; varying vec3 vN; varying vec3 vV;
      void main(){ float edge = pow(abs(dot(vN, vV)), 1.6); gl_FragColor = vec4(vec3(1., .96, .86), (.012 + .05 * pow(h, 2.)) * edge); }`,
  })
  const up = new THREE.Vector3(0, 1, 0)
  const poleMat = new THREE.MeshBasicMaterial({ color: 0x0b0f0d })
  for (const [x, z] of [[-46, -64], [46, -64], [-46, 64], [46, 64]]) {
    const top = new THREE.Vector3(x, 38, z)
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.6, 38, 0.6), poleMat)
    pole.position.set(x, 19, z)
    scene.add(pole)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xfff1d6, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.9 }))
    halo.scale.setScalar(26)
    halo.position.copy(top)
    scene.add(halo)
    for (let i = -2; i <= 2; i++) for (let j = 0; j < 2; j++) {
      const bulb = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false }))
      bulb.scale.setScalar(2.2)
      bulb.position.set(x + i * 1.3 * Math.sign(z), 38 + j * 1.2, z)
      scene.add(bulb)
    }
    const target = new THREE.Vector3(x * 0.35, 0, z * 0.35)
    const dir = top.clone().sub(target)
    const len = dir.length()
    const cone = new THREE.Mesh(new THREE.ConeGeometry(16, len, 40, 1, true), beamMat)
    beamMat.uniforms.uH.value = len
    cone.position.copy(target).add(top).multiplyScalar(0.5)
    cone.quaternion.setFromUnitVectors(up, dir.normalize())
    scene.add(cone)
  }
}

export function createPitchScene(canvas) {
  const small = window.matchMedia('(max-width: 700px)').matches
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75))
  renderer.setClearColor(0x05080a)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 400)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 300),
    new THREE.ShaderMaterial({
      uniforms: { uFog: { value: new THREE.Color(0x05080a) } },
      vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: PITCH_FRAG,
    }),
  )
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  const tex = glowTexture()
  addGoals(scene)
  addFloodlights(scene, tex)

  const DUST = small ? 260 : 600
  const dpos = new Float32Array(DUST * 3)
  const dvel = new Float32Array(DUST)
  for (let i = 0; i < DUST; i++) {
    dpos.set([(Math.random() - 0.5) * 90, Math.random() * 26 + 1, (Math.random() - 0.5) * 130], i * 3)
    dvel[i] = 0.2 + Math.random() * 0.6
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3))
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
    map: tex, color: 0xffe9bf, size: 0.5, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending,
  })))

  // Camera rig
  const keys = KEYFRAMES.map(k => ({ ...k, pos: new THREE.Vector3(...k.pos), look: new THREE.Vector3(...k.look) }))
  let tops = keys.map(() => 0)
  const measure = () => {
    tops = keys.map(k => {
      const el = document.getElementById(k.id)
      return el ? el.getBoundingClientRect().top + window.scrollY : 0
    })
  }
  const ease = t => t * t * (3 - 2 * t)
  const target = { pos: new THREE.Vector3(), look: new THREE.Vector3() }
  const rigAt = y => {
    const yy = y + window.innerHeight * 0.3
    let i = 0
    while (i < keys.length - 1 && yy > tops[i + 1]) i++
    if (i === keys.length - 1) {
      target.pos.copy(keys[i].pos)
      target.look.copy(keys[i].look)
    } else {
      const t = ease(THREE.MathUtils.clamp((yy - tops[i]) / (tops[i + 1] - tops[i] || 1), 0, 1))
      target.pos.lerpVectors(keys[i].pos, keys[i + 1].pos, t)
      target.look.lerpVectors(keys[i].look, keys[i + 1].look, t)
    }
    return target
  }

  const pointer = { x: 0, y: 0 }
  const onPointer = e => {
    pointer.x = e.clientX / window.innerWidth - 0.5
    pointer.y = e.clientY / window.innerHeight - 0.5
  }
  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w < h ? 55 : 40
    camera.updateProjectionMatrix()
    measure()
  }
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('resize', resize)
  const bodyObserver = new ResizeObserver(measure)
  bodyObserver.observe(document.body)
  resize()

  rigAt(window.scrollY)
  camera.position.copy(target.pos)
  const look = target.look.clone()
  const clock = new THREE.Clock()
  let px = 0
  let py = 0
  let raf = 0

  const frame = () => {
    const t = clock.getElapsedTime()
    const tgt = rigAt(window.scrollY)
    px += (pointer.x - px) * 0.04
    py += (pointer.y - py) * 0.04
    if (!still) {
      tgt.pos.x += Math.sin(t * 0.12) * 2.5 + px * 6
      tgt.pos.y += Math.sin(t * 0.2) * 0.4 - py * 2
      for (let i = 0; i < DUST; i++) {
        const k = i * 3 + 1
        dpos[k] += dvel[i] * 0.016
        dpos[i * 3] += Math.sin(t * 0.3 + i) * 0.006
        if (dpos[k] > 28) dpos[k] = 1
      }
      dustGeo.attributes.position.needsUpdate = true
    }
    camera.position.lerp(tgt.pos, 0.06)
    look.lerp(tgt.look, 0.06)
    camera.lookAt(look)
    renderer.render(scene, camera)
    raf = requestAnimationFrame(frame)
  }
  frame()

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('resize', resize)
    bodyObserver.disconnect()
    scene.traverse(o => {
      o.geometry?.dispose()
      if (o.material) [].concat(o.material).forEach(m => { m.map?.dispose(); m.dispose() })
    })
    tex.dispose()
    renderer.dispose()
  }
}
