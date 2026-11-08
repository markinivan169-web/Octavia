import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { car } from './config';
import type { CarPhoto } from './config';
import { useMotion } from './hooks/useMotion';
import Header from './components/Header';
import Hero from './components/Hero';
import Story from './components/Story';
import Garage from './components/Garage';
import Specifications from './components/Specifications';
import Gallery from './components/Gallery';

export default function App() {
  const root = useRef<HTMLDivElement>(null), picker = useRef<HTMLInputElement>(null);
  const urls = useRef<string[]>([]);
  const [photos, setPhotos] = useState<CarPhoto[]>(car.photos), [notice, setNotice] = useState('');
  useMotion(root);
  useEffect(() => () => { urls.current.forEach(url => URL.revokeObjectURL(url)); }, []);
  const choose = () => picker.current?.click();
  async function addPhotos(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    const valid = files.filter(f => ['image/jpeg','image/png','image/webp','image/avif'].includes(f.type) && f.size <= 30 * 1024 * 1024);
    const candidates = valid.slice(0, Math.max(0, 20 - photos.length));
    const loaded = await Promise.all(candidates.map(async (file, i) => {
      const url = URL.createObjectURL(file);
      try {
        const image = new Image(); image.src = url; await image.decode();
        urls.current.push(url);
        return { id: `local-${Date.now()}-${i}`, src: url, alt: file.name, title: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '), view: (photos.length === 0 && i === 0 ? 'front' : 'detail') as CarPhoto['view'] };
      } catch { URL.revokeObjectURL(url); return null; }
    }));
    const additions = loaded.filter(p => p !== null);
    setPhotos(p => [...p, ...additions]);
    setNotice(additions.length ? 'Фото открыты только в этом браузере до перезагрузки. Файлы никуда не отправляются.' : 'Выберите JPEG, PNG, WebP или AVIF до 30 МБ. В просмотре может быть до 20 фото.');
  }
  return <div ref={root}>
    <a className="skip-link" href="#story">Перейти к истории</a>
    <Header />
    <main><Hero photo={photos.find(p => p.view === 'front') || photos[0]} /><Story photos={photos} /><Garage photos={photos} onChoose={choose} /><Specifications /><Gallery photos={photos} onChoose={choose} />
      <section className="finale" aria-labelledby="final-title"><p data-reveal>NOT JUST A CAR. YOUR STORY.</p><h2 id="final-title" data-reveal>OCTAVIA<span>.</span></h2><div className="final-plate">{car.plate}<span>{car.region}</span></div><a href="#top" className="back-top">Вернуться к началу ↑</a></section>
    </main>
    <footer><a className="brand" href="#top">OCTAVIA.</a><p>Škoda Octavia A5 Facelift / 2010</p><p>Персональная презентация автомобиля</p></footer>
    <input ref={picker} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={addPhotos} className="sr-only" tabIndex={-1} aria-label="Выбрать фотографии автомобиля" />
    {notice && <aside className="notice" role="status"><p>{notice}</p><button aria-label="Скрыть уведомление" onClick={() => setNotice('')}>×</button></aside>}
  </div>;
}
