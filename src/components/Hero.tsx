import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { CarPhoto } from '../config';
import { Photo, SplitText } from './Primitives';
export default function Hero({ photo }: { photo?: CarPhoto }) {
  const root = useRef<HTMLElement>(null), layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const el = root.current!, x = gsap.quickTo(layer.current, 'x', { duration: 1 }), y = gsap.quickTo(layer.current, 'y', { duration: 1 });
      const move = (e: PointerEvent) => { x((e.clientX / window.innerWidth - 0.5) * 16); y((e.clientY / window.innerHeight - 0.5) * 10); };
      const reset = () => { x(0); y(0); };
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', reset); window.addEventListener('blur', reset);
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset); window.removeEventListener('blur', reset); };
    });
    return () => media.revert();
  }, []);
  return <section id="top" className={`hero ${photo ? 'has-photo' : ''}`} ref={root} aria-labelledby="hero-title">
    <div className="studio-light" aria-hidden="true" />
    <div className="hero-meta hero-topline"><span>NOT JUST A CAR.</span><span>ŠKODA / A5 FACELIFT</span></div>
    <div className="hero-title-group"><h1 id="hero-title" className="hero-wordmark"><SplitText text="OCTAVIA" /><span className="hero-a5">A5</span></h1><p className="hero-meta hero-subtitle">2010 <span>/</span> BLACK EDITION</p></div>
    <div className="hero-visual" ref={layer}>{photo && <Photo photo={photo} className="hero-photo" eager />}</div>
    <div className="hero-baseline hero-meta"><a href="#story" className="scroll-cue"><span className="scroll-line" aria-hidden="true" />SCROLL TO EXPLORE</a><span className="hero-note">Характер, который не требует<br />представления.</span><span className="hero-index">Р770УВ <small>64 RUS</small></span></div>
    <div className="hero-floor" aria-hidden="true" />
  </section>;
}
