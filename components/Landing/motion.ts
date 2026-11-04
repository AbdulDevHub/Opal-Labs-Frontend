import { PointerEvent as ReactPointerEvent, RefObject, useEffect, useRef, useState } from 'react'

/** Adds `data-in="true"` to every `[data-reveal]` element once it scrolls into view */
export const useReveal = (root: RefObject<HTMLElement>) => {
  useEffect(() => {
    const elements = root.current?.querySelectorAll<HTMLElement>('[data-reveal]') ?? []
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in', 'true')
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [root])
}

/** Counts from 0 to `to` the first time the element is visible */
export const useCountUp = (to: number, duration = 1400) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration)
        setValue(Math.round(to * (1 - Math.pow(1 - progress, 4))))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to, duration])

  return { ref, value }
}

/** Scroll progress (0 when the element's top enters the viewport, 1 when it reaches the middle) */
export const useScrollProgress = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const vh = window.innerHeight
      setProgress(Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.6))))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return { ref, progress }
}

/** Pointer handlers that pull an element a little towards the cursor */
export const magnetic = {
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    target.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`
  },
  onPointerLeave: (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.transform = ''
  },
}
