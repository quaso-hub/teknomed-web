import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTheme } from './theme-context'
import vertexShader from '../shaders/meshGradient.vert.glsl'
import fragmentShader from '../shaders/meshGradient.frag.glsl'

type Props = {
  className?: string
}

export default function NoiseMeshGradient({ className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { resolvedTheme } = useTheme()
  const [reduceMotion, setReduceMotion] = useState(false)

  // Detect reduced motion preference
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

    // Set colors based on theme
    const colorA = resolvedTheme === 'dark' ? new THREE.Color(0x0a1929) : new THREE.Color(0x043962)
    const colorB = resolvedTheme === 'dark' ? new THREE.Color(0x1a4f7a) : new THREE.Color(0x1d4f7a)
    const colorC = resolvedTheme === 'dark' ? new THREE.Color(0x5ba3d9) : new THREE.Color(0x5ba3d9)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight, false)
    container.appendChild(renderer.domElement)

    // Scene and Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.z = 2.5 // Closer camera for more immersive mesh

    // Shader Material
    const uniforms = {
      uTime: { value: 0 },
      uAmplitude: { value: reduceMotion ? 0.05 : 0.4 },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
      uColorC: { value: colorC },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      wireframe: false,
      transparent: true,
    })

    // Geometry: high segment count for smooth noise deformation
    const geometry = new THREE.PlaneGeometry(8, 8, 128, 128)
    const mesh = new THREE.Mesh(geometry, material)
    
    // Tilt the mesh slightly to give depth
    mesh.rotation.x = -0.2
    mesh.rotation.z = 0.1
    scene.add(mesh)

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

    let frameId = 0
    let lastT = performance.now()

    // Animation Loop
    const animate = (t: number) => {
      const dt = (t - lastT) / 1000
      lastT = t
      
      if (!reduceMotion) {
        uniforms.uTime.value += dt
      }

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    // Intersection Observer to pause rendering when offscreen
    const io = new IntersectionObserver(
      ([entry]) => {
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
      },
      { threshold: 0.01 }
    )
    io.observe(container)

    return () => {
      io.disconnect()
      ro.disconnect()
      if (frameId) cancelAnimationFrame(frameId)
      
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [resolvedTheme, reduceMotion])

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label="Animated mesh gradient background"
      style={{ touchAction: 'none' }}
    />
  )
}
