import { useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import gsap from 'gsap';
import type { CarPhoto } from '../config';
import { refreshMotion } from '../hooks/useMotion';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

export function MagneticButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const media = gsap.matchMedia();
    media.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const x = gsap.quickTo(el, 'x', { duration: 0.4 }), y = gsap.quickTo(el, 'y', { duration: 0.4 });
      const move = (e: PointerEvent) => { const b = el.getBoundingClientRect(); x((e.clientX - b.left - b.width / 2) * 0.12); y((e.clientY - b.top - b.height / 2) * 0.12); };
      const leave = () => { x(0); y(0); };
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
    });
    return () => media.revert();
  }, []);
  return <button ref={ref} className={className} {...props}>{children}</button>;
}

export function SplitText({ text, className = '' }: { text: string; className?: string }) {
  return <span className={`split ${className}`} aria-label={text}>{text.split(' ').map((word, i) => <span className="word-mask" aria-hidden="true" key={i}><span className="word-inner">{word}</span></span>)}</span>;
}

export function Photo({ photo, className = '', eager = false, lights = false }: { photo: CarPhoto; className?: string; eager?: boolean; lights?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = lights && photo.headlightsSrc ? photo.headlightsSrc : photo.src;
  useEffect(() => setFailed(false), [src]);
  if (failed) return <div className={`photo-error ${className}`} role="status">Снимок недоступен</div>;
  return <img className={className} src={src} alt={photo.alt} style={{ objectPosition: photo.objectPosition || 'center' }} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" onLoad={refreshMotion} onError={() => setFailed(true)} />;
}
