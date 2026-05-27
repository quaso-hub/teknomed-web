import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useTheme } from './theme-context'

type Slug =
  | 'mgps'
  | 'mot'
  | 'hvac-cleanroom'
  | 'electrical-mechanical'
  | 'radiology-chiller'
  | 'consumables-spareparts'

type Props = {
  slug: string
  className?: string
}

type Palette = {
  background: THREE.Color
  primary: THREE.Color
  primaryDark: THREE.Color
  accent: THREE.Color
  surface: THREE.Color
  metal: THREE.Color
  glass: THREE.Color
  highlight: THREE.Color
}

function buildPalette(theme: 'light' | 'dark'): Palette {
  if (theme === 'dark') {
    return {
      background: new THREE.Color(0x0a1929),
      primary: new THREE.Color(0x2d7ab8),
      primaryDark: new THREE.Color(0x1a4f7a),
      accent: new THREE.Color(0x5ba3d9),
      surface: new THREE.Color(0xe8eef5),
      metal: new THREE.Color(0x9aa6b2),
      glass: new THREE.Color(0x7fbfea),
      highlight: new THREE.Color(0xffffff),
    }
  }
  return {
    background: new THREE.Color(0xeaf2fa),
    primary: new THREE.Color(0x043962),
    primaryDark: new THREE.Color(0x022440),
    accent: new THREE.Color(0x1d4f7a),
    surface: new THREE.Color(0xffffff),
    metal: new THREE.Color(0xb8c2cf),
    glass: new THREE.Color(0x7aaed6),
    highlight: new THREE.Color(0xffffff),
  }
}

type Builders = Record<Slug, (group: THREE.Group, p: Palette) => void>

// Material helpers
const mat = {
  metal: (color: THREE.Color) =>
    new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.28 }),
  paint: (color: THREE.Color) =>
    new THREE.MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.55 }),
  glass: (color: THREE.Color) =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.4,
      transparent: true,
      opacity: 0.55,
    }),
  matte: (color: THREE.Color) =>
    new THREE.MeshStandardMaterial({ color, metalness: 0.05, roughness: 0.85 }),
}

const builders: Builders = {
  // Medical Gas Pipeline System: parallel pipes with valves and outlets
  mgps: (group, p) => {
    const baseY = -0.5
    // Wall plate
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 2.4, 0.12),
      mat.paint(p.surface),
    )
    plate.position.set(0, baseY + 0.6, -0.6)
    plate.castShadow = true
    plate.receiveShadow = true
    group.add(plate)

    // Pipe colors (medical gas convention proxy)
    const pipeColors = [
      new THREE.Color(0xffffff), // O2 white
      new THREE.Color(0x1f6feb), // air blue
      new THREE.Color(0x444444), // vacuum dark
      new THREE.Color(0xfae04f), // N2O yellow
    ]

    pipeColors.forEach((c, i) => {
      const y = baseY + 1.4 - i * 0.45
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 5.0, 24),
        mat.metal(c),
      )
      pipe.rotation.z = Math.PI / 2
      pipe.position.set(0, y, -0.3)
      pipe.castShadow = true
      group.add(pipe)

      // Valves along the pipe
      for (let v = -1; v <= 1; v++) {
        const valveBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.13, 0.18, 18),
          mat.metal(p.metal),
        )
        valveBody.rotation.z = Math.PI / 2
        valveBody.position.set(v * 1.6, y, -0.3)
        group.add(valveBody)

        const handle = new THREE.Mesh(
          new THREE.TorusGeometry(0.14, 0.022, 8, 24),
          mat.paint(p.primary),
        )
        handle.position.set(v * 1.6, y, -0.1)
        handle.rotation.x = Math.PI / 2
        group.add(handle)

        // Outlet drop
        const drop = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16),
          mat.metal(c),
        )
        drop.position.set(v * 1.6, y - 0.32, -0.3)
        group.add(drop)

        const outlet = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.2, 0.18),
          mat.paint(p.surface),
        )
        outlet.position.set(v * 1.6, y - 0.62, -0.3)
        outlet.castShadow = true
        group.add(outlet)
      }
    })
  },

  // Modular Operating Theatre: room with light and table
  mot: (group, p) => {
    // Floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.1, 4),
      mat.matte(new THREE.Color(0xd4dde6)),
    )
    floor.position.y = -1
    floor.receiveShadow = true
    group.add(floor)

    // Back wall
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(5, 3, 0.1),
      mat.paint(p.surface),
    )
    back.position.set(0, 0.5, -2)
    back.receiveShadow = true
    group.add(back)

    // Side walls
    const side1 = back.clone()
    side1.geometry = new THREE.BoxGeometry(0.1, 3, 4)
    side1.position.set(-2.5, 0.5, 0)
    group.add(side1)
    const side2 = side1.clone()
    side2.position.set(2.5, 0.5, 0)
    group.add(side2)

    // Wall panel seams (lines)
    for (let i = -2; i <= 2; i++) {
      const seam = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 3, 0.06),
        mat.paint(p.metal),
      )
      seam.position.set(i, 0.5, -1.95)
      group.add(seam)
    }

    // Operating table
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.12, 0.7),
      mat.paint(new THREE.Color(0xe8eef5)),
    )
    tableTop.position.set(0, -0.4, 0.3)
    tableTop.castShadow = true
    group.add(tableTop)

    const tableColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.16, 0.5, 16),
      mat.metal(p.metal),
    )
    tableColumn.position.set(0, -0.7, 0.3)
    group.add(tableColumn)

    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.55, 0.08, 24),
      mat.metal(p.metal),
    )
    tableBase.position.set(0, -0.95, 0.3)
    group.add(tableBase)

    // Surgical light dome
    const lightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.4, 12),
      mat.metal(p.metal),
    )
    lightArm.position.set(0, 1.3, 0.3)
    group.add(lightArm)

    const lightPivot = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      mat.metal(p.metal),
    )
    lightPivot.position.set(0, 0.6, 0.3)
    group.add(lightPivot)

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      mat.paint(p.surface),
    )
    dome.position.set(0, 0.55, 0.3)
    dome.rotation.x = Math.PI
    group.add(dome)

    const bulb = new THREE.Mesh(
      new THREE.CircleGeometry(0.4, 32),
      new THREE.MeshStandardMaterial({
        color: 0xfff8d0,
        emissive: 0xfff8d0,
        emissiveIntensity: 1.2,
      }),
    )
    bulb.position.set(0, 0.18, 0.3)
    bulb.rotation.x = -Math.PI / 2
    group.add(bulb)

    // Ceiling vent
    const vent = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.06, 0.9),
      mat.metal(p.metal),
    )
    vent.position.set(0, 1.95, 0.3)
    group.add(vent)
  },

  // HVAC: AHU box with ducts and diffusers
  'hvac-cleanroom': (group, p) => {
    // AHU body
    const ahu = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.4, 1.0),
      mat.paint(p.surface),
    )
    ahu.position.set(-1.3, 0.3, 0)
    ahu.castShadow = true
    group.add(ahu)

    // AHU ribs
    for (let i = 0; i < 4; i++) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 1.42, 1.02),
        mat.paint(p.metal),
      )
      rib.position.set(-2.2 + i * 0.55, 0.3, 0)
      group.add(rib)
    }

    // Fan housing oriented horizontally inside the duct flow
    const fanAxis = new THREE.Group()
    fanAxis.position.set(0.1, 0.3, 0)
    fanAxis.rotation.z = Math.PI / 2
    group.add(fanAxis)

    const fanHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.6, 24),
      mat.metal(p.metal),
    )
    fanAxis.add(fanHousing)

    const blades = new THREE.Group()
    blades.name = 'fanBlades'
    for (let i = 0; i < 6; i++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.45, 0.18),
        mat.metal(p.surface),
      )
      blade.rotation.y = (i / 6) * Math.PI * 2
      blade.translateX(0.22)
      blade.rotation.z = 0.35
      blades.add(blade)
    }
    fanAxis.add(blades)

    const hub = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 12),
      mat.metal(p.primaryDark),
    )
    fanAxis.add(hub)

    // Duct
    const duct = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.5, 0.5),
      mat.metal(p.metal),
    )
    duct.position.set(1.6, 0.3, 0)
    group.add(duct)

    // Duct flanges
    for (let i = 0; i < 4; i++) {
      const flange = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.55, 0.55),
        mat.metal(p.surface),
      )
      flange.position.set(0.7 + i * 0.55, 0.3, 0)
      group.add(flange)
    }

    // Diffuser at end
    const diffuser = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.6),
      mat.paint(p.surface),
    )
    diffuser.position.set(2.95, 0.3, 0)
    group.add(diffuser)

    // Diffuser louvers
    for (let i = -2; i <= 2; i++) {
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.5, 0.5),
        mat.paint(p.metal),
      )
      louver.position.set(3.36, 0.3 + i * 0.08, 0)
      group.add(louver)
    }

    // HEPA filter glow underneath
    const filter = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.05, 0.7),
      new THREE.MeshStandardMaterial({
        color: p.accent,
        emissive: p.accent,
        emissiveIntensity: 0.3,
      }),
    )
    filter.position.set(-1.3, -0.45, 0)
    group.add(filter)
  },

  // Electrical & Mechanical: panel cabinet with breakers + conduit
  'electrical-mechanical': (group, p) => {
    // Cabinet
    const cabinet = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 2.6, 0.7),
      mat.paint(p.primary),
    )
    cabinet.position.set(0, 0.2, 0)
    cabinet.castShadow = true
    group.add(cabinet)

    // Door panel
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 2.2, 0.06),
      mat.paint(p.primaryDark),
    )
    door.position.set(0, 0.2, 0.36)
    group.add(door)

    // Hinges
    for (let i = -1; i <= 1; i += 2) {
      const hinge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.18, 12),
        mat.metal(p.metal),
      )
      hinge.position.set(-1.05, 0.2 + i * 0.85, 0.36)
      group.add(hinge)
    }

    // Window cutout (transparent)
    const window = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.9, 0.04),
      mat.glass(p.glass),
    )
    window.position.set(0, 0.55, 0.4)
    group.add(window)

    // Breakers visible behind glass
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        const breaker = new THREE.Mesh(
          new THREE.BoxGeometry(0.13, 0.22, 0.04),
          mat.paint(col % 2 === 0 ? p.surface : new THREE.Color(0x222222)),
        )
        breaker.position.set(-0.6 + col * 0.16, 0.85 - row * 0.28, 0.39)
        group.add(breaker)

        const switchTab = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 0.07, 0.03),
          mat.paint(new THREE.Color(0xe85c41)),
        )
        switchTab.position.set(-0.6 + col * 0.16, 0.83 - row * 0.28, 0.41)
        group.add(switchTab)
      }
    }

    // Indicator lights
    for (let i = 0; i < 3; i++) {
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshStandardMaterial({
          color: i === 0 ? 0x22dd66 : i === 1 ? 0xfacc15 : 0xff5577,
          emissive: i === 0 ? 0x22dd66 : i === 1 ? 0xfacc15 : 0xff5577,
          emissiveIntensity: 1,
        }),
      )
      led.position.set(-0.4 + i * 0.4, -0.4, 0.4)
      group.add(led)
    }

    // Conduit pipes coming out top
    for (let i = -1; i <= 1; i++) {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16),
        mat.metal(p.metal),
      )
      pipe.position.set(i * 0.5, 1.7, -0.2)
      group.add(pipe)
    }
  },

  // Radiology Chiller: HVAC chiller unit
  'radiology-chiller': (group, p) => {
    // Base chassis
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 1.6, 1.6),
      mat.paint(p.surface),
    )
    chassis.position.set(0, 0.2, 0)
    chassis.castShadow = true
    group.add(chassis)

    // Bottom skirt
    const skirt = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.18, 1.6),
      mat.paint(p.primary),
    )
    skirt.position.set(0, -0.69, 0)
    group.add(skirt)

    // Top louvers
    for (let i = 0; i < 8; i++) {
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.04, 0.18),
        mat.metal(p.metal),
      )
      louver.position.set(0, 1.05, -0.55 + i * 0.16)
      louver.rotation.x = 0.25
      group.add(louver)
    }

    // Front grille
    const grille = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 1.2, 0.04),
      mat.metal(p.metal),
    )
    grille.position.set(0, 0.2, 0.81)
    group.add(grille)

    // Grille slats
    for (let i = -5; i <= 5; i++) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.04, 0.06),
        mat.paint(p.primaryDark),
      )
      slat.position.set(0, 0.2 + i * 0.1, 0.83)
      group.add(slat)
    }

    // Side fan circles (decorative discs)
    for (let i = -1; i <= 1; i += 2) {
      const fanAxis = new THREE.Group()
      fanAxis.position.set(i * 1.55, 0.4, 0)
      fanAxis.rotation.z = Math.PI / 2
      group.add(fanAxis)

      const fanRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.03, 8, 32),
        mat.metal(p.metal),
      )
      fanAxis.add(fanRing)

      const fanBlades = new THREE.Group()
      fanBlades.name = `chillerFan${i}`
      for (let b = 0; b < 4; b++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 0.7, 0.18),
          mat.paint(p.primary),
        )
        blade.rotation.y = (b / 4) * Math.PI * 2
        blade.translateX(0.22)
        blade.rotation.z = 0.25
        fanBlades.add(blade)
      }
      fanAxis.add(fanBlades)

      const hub = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 16, 12),
        mat.metal(p.primaryDark),
      )
      fanAxis.add(hub)
    }

    // Top brand strip
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.18, 0.04),
      mat.paint(p.primary),
    )
    strip.position.set(0, 0.85, 0.83)
    group.add(strip)
  },

  // Consumables: stack of boxes / parts
  'consumables-spareparts': (group, p) => {
    // Pallet
    const pallet = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.12, 2.0),
      mat.matte(new THREE.Color(0x8b6f47)),
    )
    pallet.position.set(0, -0.7, 0)
    pallet.receiveShadow = true
    group.add(pallet)

    // Boxes layout
    const boxColors = [p.primary, p.accent, p.primaryDark, p.primary]
    const positions: Array<[number, number, number, number, number, number]> = [
      // x, y, z, w, h, d
      [-0.9, -0.2, -0.4, 1.0, 0.85, 0.9],
      [0.4, -0.25, -0.3, 1.1, 0.75, 1.0],
      [-0.4, 0.42, -0.2, 1.4, 0.55, 0.9],
      [0.7, 0.45, 0.4, 0.8, 0.6, 0.7],
      [-1.0, 0.65, 0.5, 0.6, 0.45, 0.55],
    ]
    positions.forEach((pos, i) => {
      const [x, y, z, w, h, d] = pos
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        mat.paint(boxColors[i % boxColors.length]),
      )
      box.position.set(x, y, z)
      box.castShadow = true
      box.receiveShadow = true
      group.add(box)

      // Label patch
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.55, h * 0.3),
        mat.paint(p.surface),
      )
      label.position.set(x, y, z + d / 2 + 0.001)
      group.add(label)
    })

    // A cylindrical filter standing up
    const filter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.7, 24),
      mat.paint(p.surface),
    )
    filter.position.set(1.0, -0.29, 0.7)
    group.add(filter)

    const filterCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.27, 0.06, 24),
      mat.metal(p.metal),
    )
    filterCap.position.set(1.0, 0.09, 0.7)
    group.add(filterCap)

    // Ridges on filter
    for (let i = 0; i < 12; i++) {
      const ridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.6, 0.02),
        mat.paint(p.metal),
      )
      const angle = (i / 12) * Math.PI * 2
      ridge.position.set(1.0 + Math.cos(angle) * 0.26, -0.29, 0.7 + Math.sin(angle) * 0.26)
      group.add(ridge)
    }
  },
}

const fallbackBuilder = (group: THREE.Group, p: Palette) => {
  const torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.9, 0.28, 128, 24),
    mat.metal(p.primary),
  )
  torus.castShadow = true
  group.add(torus)
}

function getBuilder(slug: string) {
  return (builders as Record<string, (g: THREE.Group, p: Palette) => void>)[slug] ?? fallbackBuilder
}

export default function Product3DViewer({ slug, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { resolvedTheme } = useTheme()
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const palette = buildPalette(resolvedTheme)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight, false)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    container.appendChild(renderer.domElement)

    // Scene
    const scene = new THREE.Scene()
    scene.background = palette.background
    scene.fog = new THREE.Fog(palette.background, 9, 18)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    camera.position.set(4.2, 2.6, 5.5)

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 0.55)
    scene.add(hemi)

    const key = new THREE.DirectionalLight(0xffffff, 1.4)
    key.position.set(5, 7, 4)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.left = -6
    key.shadow.camera.right = 6
    key.shadow.camera.top = 6
    key.shadow.camera.bottom = -6
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 25
    key.shadow.bias = -0.0005
    scene.add(key)

    const fill = new THREE.DirectionalLight(palette.accent, 0.45)
    fill.position.set(-4, 3, -2)
    scene.add(fill)

    // Ground (subtle shadow catcher)
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(8, 48),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.05
    ground.receiveShadow = true
    scene.add(ground)

    // Subject
    const subject = new THREE.Group()
    subject.name = 'subject'
    getBuilder(slug)(subject, palette)
    subject.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = obj.castShadow || true
        obj.receiveShadow = true
      }
    })
    scene.add(subject)

    // Frame the subject
    const box = new THREE.Box3().setFromObject(subject)
    const center = box.getCenter(new THREE.Vector3())
    subject.position.sub(center)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 3
    controls.maxDistance = 12
    controls.minPolarAngle = Math.PI * 0.1
    controls.maxPolarAngle = Math.PI * 0.55
    controls.target.set(0, 0, 0)
    controls.autoRotate = !reduceMotion
    controls.autoRotateSpeed = 0.6
    controls.enablePan = false

    // Resize handling
    const ro = new ResizeObserver(() => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    ro.observe(container)

    // Find spinning helpers (named groups)
    const fanBlades = subject.getObjectByName('fanBlades') as THREE.Group | undefined
    const chillerFan1 = subject.getObjectByName('chillerFan1') as THREE.Group | undefined
    const chillerFanNeg1 = subject.getObjectByName('chillerFan-1') as THREE.Group | undefined

    let frameId = 0
    let lastT = performance.now()
    const animate = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000)
      lastT = t
      if (!reduceMotion) {
        // Spin around local Y (blade arms emanate along X)
        if (fanBlades) fanBlades.rotation.y += dt * 8
        if (chillerFan1) chillerFan1.rotation.y += dt * 4
        if (chillerFanNeg1) chillerFanNeg1.rotation.y += dt * 4
      }
      controls.update()
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)

    // Pause when not visible
    const io = new IntersectionObserver(([entry]) => {
      if (!entry) return
      if (entry.isIntersecting) {
        if (!frameId) {
          lastT = performance.now()
          frameId = requestAnimationFrame(animate)
        }
      } else if (frameId) {
        cancelAnimationFrame(frameId)
        frameId = 0
      }
    }, { threshold: 0.01 })
    io.observe(container)

    return () => {
      io.disconnect()
      ro.disconnect()
      if (frameId) cancelAnimationFrame(frameId)
      controls.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const m = obj.material
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose())
          else m.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [slug, resolvedTheme, reduceMotion])

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={`Visualisasi 3D produk ${slug}`}
      style={{ touchAction: 'none' }}
    />
  )
}
