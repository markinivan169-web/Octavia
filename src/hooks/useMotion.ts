import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);

export function useMotion(root: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, anchors: true });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro.from('.hero .word-inner', { yPercent: 110, stagger: 0.08, duration: 1.35 }, 0.12)
          .from('.hero .hero-meta', { opacity: 0, y: 12, duration: 0.9 }, 0.4);
        const heroPhoto = root.current?.querySelector('.hero-photo');
        if (heroPhoto) intro.from(heroPhoto, { opacity: 0, scale: 1.035, duration: 1.8 }, 0.35);
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
          gsap.from(el, { y: 28, opacity: 0, duration: 0.95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        });
        gsap.to('.hero .hero-wordmark', { yPercent: -16, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
        const refresh = () => ScrollTrigger.refresh();
        let disposed = false;
        document.fonts.ready.then(() => { if (!disposed) refresh(); });
        window.addEventListener('load', refresh);
        return () => { disposed = true; window.removeEventListener('load', refresh); gsap.ticker.remove(tick); lenis.destroy(); };
      });
    }, root);
    return () => { media.revert(); ctx.revert(); };
  }, [root]);
}

export function refreshMotion() { ScrollTrigger.refresh(); }
