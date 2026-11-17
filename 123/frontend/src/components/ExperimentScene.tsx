import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useAppearance } from '../hooks/useAppearance'

export type ExperimentSceneProps = {
  experimentId: string
  view?: 'space' | 'top'
  showGrid?: boolean
  resetKey?: number
}

/** Dữ liệu 3D minh họa được sinh cố định từ ID, chưa phải embedding thật. */
export default function ExperimentScene({
  experimentId,
  view = 'space',
  showGrid = true,
  resetKey = 0,
}: ExperimentSceneProps) {
  const { appearance } = useAppearance()
  const hostRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const fallback = fallbackRef.current
    if (!host || !fallback) return
    fallback.hidden = true

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      fallback.hidden = false
      return
    }

    const css = getComputedStyle(document.documentElement)
    const color = (name: string, fallback: string) =>
      new THREE.Color(css.getPropertyValue(name).trim() || fallback)
    const sceneBackground = color('--scene-bg', '#ffffff')
    const gridColor = color('--scene-grid', '#d0d0d0')
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(sceneBackground, 16, 32)
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80)
    camera.position.set(
      ...((view === 'top' ? [0.01, 17, 0] : [10, 7.5, 12]) as [number, number, number]),
    )
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(sceneBackground, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const canvas = renderer.domElement
    canvas.style.cssText =
      'display:block;width:100%;height:100%;touch-action:none;outline-offset:-3px'
    canvas.tabIndex = 0
    canvas.setAttribute('role', 'img')
    canvas.setAttribute(
      'aria-label',
      'Không gian 3D minh họa. Kéo để xoay, cuộn để thu phóng; phím mũi tên để di chuyển.',
    )
    host.appendChild(canvas)

    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 2.1, 0)
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.minDistance = 7
    controls.maxDistance = 28
    controls.maxPolarAngle = Math.PI / 2.02
    controls.listenToKeyEvents(canvas)
    controls.update()

    scene.add(new THREE.AmbientLight(0xffffff, 2.1))
    const light = new THREE.DirectionalLight(0xffffff, 3)
    light.position.set(5, 12, 8)
    scene.add(light)
    const grid = new THREE.GridHelper(22, 22, gridColor, gridColor)
    grid.visible = showGrid
    scene.add(grid)

    let seed = [...experimentId].reduce(
      (value, char) => (value * 31 + char.charCodeAt(0)) >>> 0,
      17,
    )
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 4294967296
    }
    const sphere = new THREE.SphereGeometry(1, 12, 10)
    const colors = [
      color('--scene-node-dark', '#292929'),
      color('--scene-node-mid', '#898989'),
      color('--scene-node-light', '#bcbcbc'),
    ]
    const centers = [
      new THREE.Vector3(-3.5, 2.5, 0),
      new THREE.Vector3(0, 3, -1),
      new THREE.Vector3(3.5, 2, 0.7),
    ]
    const connections: number[] = []
    const clusters: THREE.Vector3[][] = []

    centers.forEach((center, clusterIndex) => {
      const material = new THREE.MeshStandardMaterial({
        color: colors[clusterIndex],
        roughness: 0.6,
        metalness: 0.1,
      })
      const points: THREE.Vector3[] = []
      for (let index = 0; index < 42; index += 1) {
        const azimuth = random() * Math.PI * 2
        const elevation = Math.acos(2 * random() - 1)
        const radius = 0.35 + Math.cbrt(random()) * 1.65
        const point = center
          .clone()
          .add(
            new THREE.Vector3(
              Math.sin(elevation) * Math.cos(azimuth) * radius,
              Math.cos(elevation) * radius * 0.8,
              Math.sin(elevation) * Math.sin(azimuth) * radius,
            ),
          )
        points.push(point)
        const node = new THREE.Mesh(sphere, material)
        node.position.copy(point)
        node.scale.setScalar(index % 9 === 0 ? 0.14 : 0.065 + random() * 0.035)
        scene.add(node)
      }
      for (let first = 0; first < points.length; first += 1) {
        for (let second = first + 1; second < points.length; second += 1) {
          if (points[first].distanceTo(points[second]) < 1.1) {
            connections.push(...points[first].toArray(), ...points[second].toArray())
          }
        }
      }
      clusters.push(points)
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.45, 1.465, 64),
        new THREE.MeshBasicMaterial({
          color: gridColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        }),
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.set(center.x, 0.01, center.z)
      scene.add(ring)
    })

    for (let cluster = 0; cluster < 2; cluster += 1) {
      for (let index = 0; index < 5; index += 1) {
        connections.push(
          ...clusters[cluster][index * 6].toArray(),
          ...clusters[cluster + 1][index * 5].toArray(),
        )
      }
    }
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3))
    scene.add(
      new THREE.LineSegments(
        lineGeometry,
        new THREE.LineBasicMaterial({ color: colors[1], transparent: true, opacity: 0.18 }),
      ),
    )

    const resize = () => {
      const width = Math.max(host.clientWidth, 1)
      const height = Math.max(host.clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()
    let frame = 0
    let disposed = false
    const draw = () => {
      if (disposed) return
      controls.update()
      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(draw)
    }
    const onContextLost = (event: Event) => {
      event.preventDefault()
      window.cancelAnimationFrame(frame)
      fallback.hidden = false
    }
    canvas.addEventListener('webglcontextlost', onContextLost)
    draw()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      canvas.removeEventListener('webglcontextlost', onContextLost)
      const geometries = new Set<THREE.BufferGeometry>()
      const materials = new Set<THREE.Material>()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          geometries.add(object.geometry)
          const items = Array.isArray(object.material) ? object.material : [object.material]
          items.forEach((item) => materials.add(item))
        }
      })
      geometries.forEach((item) => item.dispose())
      materials.forEach((item) => item.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    }
  }, [experimentId, view, showGrid, resetKey, appearance])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 320 }}>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />
      <div
        ref={fallbackRef}
        hidden
        role="status"
        style={{ position: 'absolute', inset: 0, background: 'var(--scene-bg)' }}
      >
        <div
          style={{
            display: 'grid',
            placeContent: 'center',
            height: '100%',
            padding: 28,
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <strong style={{ color: 'var(--text-primary)', marginBottom: 10 }}>
            Không thể hiển thị không gian 3D
          </strong>
          <span>Hãy bật tăng tốc đồ họa hoặc dùng trình duyệt hỗ trợ WebGL.</span>
          <span style={{ marginTop: 8 }}>
            Bạn vẫn có thể xem danh sách và thông số thực nghiệm.
          </span>
        </div>
      </div>
    </div>
  )
}
