import { useState, type FormEvent } from 'react';
import { contactInfo } from '../data/archive';

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const senderEmail = String(form.get('email') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();

    if (!contactInfo.emailAddress) {
      setStatus('공개 이메일 주소가 아직 등록되지 않아 메시지가 전송되지 않았습니다. 연락처 정보가 입력되면 메일 작성으로 연결됩니다.');
      return;
    }

    const subject = encodeURIComponent(`Youngmin Gallery inquiry — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${senderEmail}\n\n${message}`);
    window.location.href = `mailto:${contactInfo.emailAddress}?subject=${subject}&body=${body}`;
    setStatus('기본 메일 앱에서 메시지를 마무리해 주세요.');
  };

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-76px)] max-w-[1280px] flex-col px-5 pb-8 sm:min-h-[calc(100dvh-88px)] sm:px-9 lg:px-14">
      <section className="mx-auto w-full max-w-[760px] flex-1 py-16 sm:py-24 lg:py-28">
        <p className="mb-3 text-center text-[9px] uppercase tracking-[0.24em] text-espresso/50">Youngmin · Photographer &amp; Filmmaker</p>
        <h1 className="text-center font-serif text-5xl font-light tracking-[-0.035em] sm:text-6xl lg:text-7xl">CONTACT</h1>
        <p className="mx-auto mt-5 max-w-md text-center font-serif text-sm italic leading-relaxed text-espresso/65 sm:text-base">
          Feel free to reach out anytime.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-7 sm:mt-16 sm:space-y-9">
          <div>
            <label htmlFor="contact-name" className="mb-2 block text-[10px] uppercase tracking-[0.16em]">Name <span aria-hidden="true">*</span></label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Your name"
              className="min-h-12 w-full border border-espresso/20 bg-[#F8F7F3] px-4 py-3 text-sm text-espresso outline-none placeholder:text-espresso/35 focus:border-terracotta focus:ring-1 focus:ring-terracotta/35 sm:min-h-14"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-2 block text-[10px] uppercase tracking-[0.16em]">Email Address <span aria-hidden="true">*</span></label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="min-h-12 w-full border border-espresso/20 bg-[#F8F7F3] px-4 py-3 text-sm text-espresso outline-none placeholder:text-espresso/35 focus:border-terracotta focus:ring-1 focus:ring-terracotta/35 sm:min-h-14"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-2 block text-[10px] uppercase tracking-[0.16em]">Message <span aria-hidden="true">*</span></label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              placeholder="Your message"
              className="w-full resize-y border border-espresso/20 bg-[#F8F7F3] px-4 py-3 text-sm leading-relaxed text-espresso outline-none placeholder:text-espresso/35 focus:border-terracotta focus:ring-1 focus:ring-terracotta/35"
            />
          </div>
          <div className="pt-1 text-center sm:pt-3">
            <button type="submit" className="min-h-12 min-w-36 border border-espresso px-8 text-[10px] uppercase tracking-[0.18em] text-espresso transition-colors hover:bg-espresso hover:text-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-terracotta">
              Submit
            </button>
            <p aria-live="polite" className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-espresso/65">{status}</p>
          </div>
        </form>

        <div className="mt-14 border-t border-espresso/20 pt-6 text-center sm:mt-16">
          <p className="mb-2 text-[9px] uppercase tracking-[0.18em] text-espresso/45">Email</p>
          <a href={`mailto:${contactInfo.emailAddress}`} className="break-all font-serif text-lg underline decoration-espresso/25 underline-offset-4 hover:text-terracotta">{contactInfo.emailAddress}</a>
        </div>
      </section>

      <footer className="flex items-center justify-between gap-4 border-t border-espresso/20 pt-4 text-[9px] uppercase tracking-[0.15em] text-espresso/50">
        <span>Youngmin · Archive</span>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-espresso transition-colors hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta">
          ↑ Back to Top
        </button>
      </footer>
    </main>
  );
}
