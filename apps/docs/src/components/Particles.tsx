import _Particles from "react-particles"
import { loadFull } from "tsparticles"
import { useCallback } from "react"
import { Container, Engine } from "tsparticles-engine"
import { particlesOptions, getParticlesOptions } from "../utils/particles"

type ParticlesProps = {
  id: string
  opacity?: number
}

export function Particles({ id, opacity }: ParticlesProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(async (container: Container | undefined) => {}, [])

  const options = !opacity ? particlesOptions : getParticlesOptions({ opacity })

  return (
    <_Particles
      id={id}
      width="100vw"
      height="100vh"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
    />
  )
}
