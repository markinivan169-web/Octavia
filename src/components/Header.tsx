import { useEffect, useState } from 'react';
export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open]);
  return <header className="header">
    <a className="brand" href="#top" aria-label="Octavia — начало">OCTAVIA<span>.</span></a>
    <span className="header-edition">Личная история / 2010</span>
    <button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? 'Закрыть −' : 'Меню +'}</button>
    <nav id="main-nav" aria-label="Основная навигация" className={open ? 'nav is-open' : 'nav'}>
      {[['#story','История'],['#garage','Гараж'],['#specs','Характер'],['#gallery','Галерея']].map(([href,label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
    </nav>
  </header>;
}
