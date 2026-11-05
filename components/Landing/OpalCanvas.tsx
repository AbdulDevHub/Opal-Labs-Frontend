import { useEffect, useRef, useState } from 'react'

/**
 * A living opal: a WebGL fragment shader that paints an iridescent, slowly breathing gem.
 * The play of colour follows the pointer. No libraries; falls back to a CSS gradient
 * without WebGL, draws a single frame for reduced motion and pauses when off screen.
 */

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
// Pearly body colour and saturated "fire" flashes (an opal's play of colour)
vec3 pearl(float t) {
  return vec3(0.8, 0.81, 0.86) + vec3(0.2, 0.19, 0.16) * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}
vec3 fire(float t) {
  return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 m = uMouse - 0.5;
  float t = uTime * 0.11;

  // Breathing outline with a gentle wobble, like a polished cabochon
  float r = length(uv);
  float ang = atan(uv.y, uv.x);
  float pulse = 0.014 * sin(uTime * 1.6) + 0.006 * sin(uTime * 2.9);
  float wobble = 0.012 * sin(ang * 3.0 + uTime * 0.7) + 0.008 * sin(ang * 5.0 - uTime * 1.1)
               + 0.012 * (fbm(vec2(ang * 1.5, t * 6.0)) - 0.5);
  float radius = 0.4 + pulse + wobble;
  float inside = smoothstep(radius, radius - 0.004, r);

  // Domain-warped noise for the milky body
  vec2 p = uv * 1.9 + m * 0.6;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 w = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 3.4 * w);

  vec3 col = pearl(f * 1.2 + length(w) * 0.8 + t * 0.5 + dot(uv, m) * 1.2);
  col *= 0.86 + 0.24 * f;

  // Sharp flashes of colour that drift and follow the pointer
  float fleck = smoothstep(0.6, 0.88, fbm(p * 3.0 + w * 4.0 + uTime * 0.05));
  col = mix(col, fire(f * 2.6 + uTime * 0.06 + dot(uv, m) * 2.0) * 1.05, fleck * 0.85);

  // Iridescent rim and a soft highlight that leans towards the pointer
  float rim = smoothstep(radius * 0.6, radius, r);
  col = mix(col, fire(ang / 6.28318 + t * 2.0 + 0.3), rim * 0.32);
  vec2 hl = uv - vec2(-0.12, 0.15) - m * 0.08;
  col += exp(-dot(hl, hl) * 50.0) * 0.45;

  // Soft coloured halo that fades out well before the canvas edge
  float halo = exp(-max(0.0, r - radius) * 18.0) * (1.0 - inside) * smoothstep(0.5, 0.43, r);
  vec3 haloCol = fire(ang / 6.28318 + t * 2.0);

  float alpha = inside + halo * 0.45;
  gl_FragColor = vec4(col * inside + haloCol * halo * 0.45, alpha);
}
`

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

const OpalCanvas = ({
  className,
  label = 'An animated, iridescent opal',
}: {
  className?: string
  label?: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: true })
    if (!gl) {
      setFallback(true)
      return
    }

    const program = gl.createProgram()
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    if (!program || !vs || !fs) {
      setFallback(true)
      return
    }
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'uRes')
    const uTime = gl.getUniformLocation(program, 'uTime')
    const uMouse = gl.getUniformLocation(program, 'uMouse')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = { x: 0.5, y: 0.5 }
    const mouse = { x: 0.5, y: 0.5 }
    let visible = true
    let frame = 0
    const start = performance.now() - Math.random() * 20000

    const resize = () => {
      // The gem is soft, so it renders below screen resolution (capped at ~1 megapixel) to stay light
      const { width, height } = canvas.getBoundingClientRect()
      let scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.8
      scale = Math.min(scale, Math.sqrt(1000000 / Math.max(1, width * height)))
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const draw = () => {
      mouse.x += (target.x - mouse.x) * 0.05
      mouse.y += (target.y - mouse.y) * 0.05
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const loop = () => {
      draw()
      if (visible && !document.hidden) frame = requestAnimationFrame(loop)
      else frame = 0
    }

    const wake = () => {
      if (!frame && visible && !document.hidden && !reduceMotion)
        frame = requestAnimationFrame(loop)
    }

    const onPointer = (event: PointerEvent) => {
      target.x = event.clientX / window.innerWidth
      target.y = 1 - event.clientY / window.innerHeight
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      wake()
    })
    observer.observe(canvas)
    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw()
    })
    resizeObserver.observe(canvas)

    resize()
    draw()
    wake()
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', wake)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', wake)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  if (fallback)
    return <div className={`${className ?? ''} opal-fallback`} role="img" aria-label={label} />
  return <canvas ref={canvasRef} className={className} role="img" aria-label={label} />
}

export default OpalCanvas
