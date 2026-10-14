import { Menu } from 'lucide-react';
import { logoSrc } from '../data/archive';

type SiteHeaderProps = {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onHome: () => void;
};

export default function SiteHeader({ menuOpen, onMenuToggle, onHome }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-sand/90 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1680px] items-center justify-between px-5 sm:h-[88px] sm:px-9 lg:px-14">
        <a
          href="/"
          onClick={(event) => { event.preventDefault(); onHome(); }}
          aria-label="Youngmin Gallery 홈"
          className="inline-flex items-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
        >
          <img
            src={logoSrc}
            alt="Youngmin 로고"
            className="h-[48px] w-[68px] object-contain sm:h-[60px] sm:w-[82px]"
          />
        </a>
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={menuOpen ? '메뉴 닫기' : '목차 열기'}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          className="grid h-12 w-12 place-items-center text-espresso transition-opacity hover:opacity-55 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <Menu size={24} strokeWidth={1.25} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
