import { useEffect, useRef, useState } from 'react';
import type { CarPhoto } from '../config';
import { Arrow, MagneticButton, Photo } from './Primitives';

export default function Gallery({ photos, onChoose }: { photos: CarPhoto[]; onChoose: () => void }) {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = dialog.current!;
    if (active === null) { if (el.open) el.close(); return; }
    if (!el.open) { previousFocus.current = document.activeElement as HTMLElement; el.showModal(); }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [active]);
  const close = () => { setActive(null); previousFocus.current?.focus(); };
  const step = (n: number) => setActive(i => i === null ? null : (i + n + photos.length) % photos.length);
  return <section id="gallery" className="gallery" aria-labelledby="gallery-title">
    <div className="section-heading" data-reveal><div><p className="eyebrow">Вне времени. В кадре.</p><h2 id="gallery-title">STILL ICONIC<span>.</span></h2></div><span className="small-note">{photos.length ? `Личный архив / ${String(photos.length).padStart(2,'0')}` : 'Личный архив'}</span></div>
    {photos.length ? <div className="gallery-grid">{photos.map((p,i) => <button className="gallery-item" onClick={() => setActive(i)} key={p.id} aria-label={`Открыть: ${p.title}`} data-reveal><div className="gallery-image"><Photo photo={p} /><span className="gallery-open" aria-hidden="true">↗</span></div><span className="gallery-caption"><span>{p.title}</span><span>{String(i + 1).padStart(2,'0')}</span></span></button>)}</div> : <div className="gallery-invitation" data-reveal><p>У каждой истории<br />есть свой кадр.</p><MagneticButton className="text-button" onClick={onChoose}>Открыть свои фотографии <Arrow diagonal /></MagneticButton></div>}
    <dialog className="lightbox" ref={dialog} data-lenis-prevent onCancel={e => { e.preventDefault(); close(); }} onClose={() => setActive(null)} aria-labelledby="lightbox-title" onKeyDown={e => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="lightbox-top"><p id="lightbox-title">{active !== null && photos[active]?.title}</p><button onClick={close} autoFocus aria-label="Закрыть фотографию">Закрыть ×</button></div>
      {active !== null && photos[active] && <Photo photo={photos[active]} className="lightbox-photo" eager />}
      <div className="lightbox-controls"><button aria-label="Предыдущая фотография" disabled={photos.length < 2} onClick={() => step(-1)}>←</button><span>{active !== null ? active + 1 : 0} / {photos.length}</span><button aria-label="Следующая фотография" disabled={photos.length < 2} onClick={() => step(1)}>→</button></div>
    </dialog>
  </section>;
}
