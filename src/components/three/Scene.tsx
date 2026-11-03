import { useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

export type StageRef = MutableRefObject<{ value: number }>
const N = 5, R = 1.55, TUBE = 0.3, GAP = 0.1
const ARC = (Math.PI * 2) / N - GAP

function LoopObject({ stage, offsetX }: { stage: StageRef; offsetX: number }) {
  const group = useRef<THREE.Group>(null)
  const segs = useRef<(THREE.Group | null)[]>([])
  const seams = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  const cur = useRef(0)
  useFrame((s, dt) => {
    const g = group.current; if (!g) return
    const target = stage.current.value
    cur.current += (target - cur.current) * Math.min(1, dt * 2.2)
    const t = s.clock.elapsedTime
    const px = s.pointer.x, py = s.pointer.y
    g.position.x += (offsetX - g.position.x) * 0.05
    g.rotation.y += ((px * 0.35 + Math.sin(t * 0.2) * 0.08) - g.rotation.y) * 0.05
    g.rotation.x += ((0.55 - py * 0.25 + cur.current * 0.12) - g.rotation.x) * 0.05
    g.rotation.z = t * 0.06 - cur.current * ((Math.PI * 2) / N) * 0.0 + cur.current * 0.35
    segs.current.forEach((sg, i) => {
      if (!sg) return
      const d = Math.abs(cur.current - i)
      const lift = Math.max(0, 1 - d) // active segment slides outward
      sg.scale.setScalar(1 + lift * 0.06)
      sg.position.z = lift * 0.35
    })
    seams.current.forEach((m, i) => {
      if (!m) return
      const d = Math.min(Math.abs(cur.current - i), Math.abs(cur.current - (i + 1)))
      m.emissiveIntensity = 0.7 + Math.max(0, 1 - d) * 3.2 + Math.sin(t * 1.2 + i) * 0.1
    })
  })
  const body = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0b0c0f', metalness: 0.92, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.18, anisotropy: 0.8, envMapIntensity: 1.3 }), [])
  const trim = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#1a1d22', metalness: 1, roughness: 0.18, envMapIntensity: 1.6 }), [])
  return (
    <group ref={group} position={[offsetX, 0, 0]}>
      {Array.from({ length: N }, (_, i) => (
        <group key={i} rotation={[0, 0, i * (Math.PI * 2) / N + GAP / 2]}>
          <group ref={(el) => { segs.current[i] = el }}>
            <mesh material={body} castShadow><torusGeometry args={[R, TUBE, 28, 96, ARC]} /></mesh>
            <mesh material={trim} position={[0, 0, TUBE * 0.82]}><torusGeometry args={[R, 0.045, 12, 96, ARC * 0.94]} /></mesh>
            <mesh material={trim} position={[0, 0, -TUBE * 0.82]}><torusGeometry args={[R, 0.045, 12, 96, ARC * 0.94]} /></mesh>
          </group>
          {/* crimson light only from the seam between segments */}
          <group rotation={[0, 0, ARC + GAP * 0.1]}>
            <mesh position={[R, 0, 0]}>
              <boxGeometry args={[TUBE * 1.5, 0.014, TUBE * 1.2]} />
              <meshStandardMaterial ref={(m) => { seams.current[i] = m }} color="#220305" emissive="#C1121F" emissiveIntensity={1} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}
      <mesh rotation={[0, 0, 0]}><torusGeometry args={[R - TUBE - 0.18, 0.012, 8, 128]} /><meshStandardMaterial color="#111" emissive="#C1121F" emissiveIntensity={0.6} toneMapped={false} /></mesh>
    </group>
  )
}

function Dust() {
  const ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => { const a = new Float32Array(700 * 3); for (let i = 0; i < a.length; i++) a[i] = (Math.random() - 0.5) * (i % 3 === 2 ? 6 : 12); return a }, [])
  useFrame((_, dt) => { if (ref.current) { ref.current.rotation.y += dt * 0.012; ref.current.position.y = Math.sin(performance.now() / 9000) * 0.1 } })
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry><pointsMaterial size={0.012} color="#ECE9E2" transparent opacity={0.35} depthWrite={false} sizeAttenuation /></points>
}

export default function Scene({ stage, active, offsetX = 1.1 }: { stage: StageRef; active: boolean; offsetX?: number }) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 1.75]} shadows camera={{ position: [0, 0, 6.2], fov: 38 }}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
      <color attach="background" args={['#07080A']} />
      <fog attach="fog" args={['#07080A', 7, 14]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[4, 5, 5]} angle={0.4} penumbra={1} intensity={60} castShadow color="#ECE9E2" />
      {/* Procedural studio environment: no network HDRI dependency */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#050506']} />
        <Lightformer form="rect" intensity={4} position={[0, 5, -3]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.5} position={[-5, 1, 2]} scale={[1.5, 8, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.6} position={[5, 0, 3]} scale={[1, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={1.2} color="#C1121F" position={[0, -3, -4]} scale={4} />
      </Environment>
      <LoopObject stage={stage} offsetX={offsetX} />
      <Dust />
      <ContactShadows position={[offsetX, -2.4, 0]} opacity={0.55} scale={9} blur={3} far={4} />
    </Canvas>
  )
}
