import { useEffect, useRef, useState } from "react";

const TYPEFORM_URL = "YOUR_TYPEFORM_URL";
const ACCENT = "#FF3B00";
const BG = "#0A0A0A";

// ── Animated counter hook ──────────────────────────────────────────
function useCounter(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

// ── Intersection observer hook ─────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Reveal wrapper ─────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Stat card with animated counter ───────────────────────────────
function StatCard({ value, suffix, label, duration, inView }) {
  const count = useCounter(value, duration, inView);
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-5xl font-extrabold leading-none tracking-tight text-white sm:text-6xl"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {count}{suffix}
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</span>
    </div>
  );
}

// ── Step card ─────────────────────────────────────────────────────
function StepCard({ number, title, body, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
        <div
          className="mb-6 text-[80px] font-extrabold leading-none"
          style={{ fontFamily: "'Syne', sans-serif", color: ACCENT, opacity: 0.15 }}
        >
          {number}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/50">{body}</p>
        <div
          className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
          style={{ backgroundColor: ACCENT }}
        />
      </div>
    </Reveal>
  );
}

// ── Problem card ───────────────────────────────────────────────────
function ProblemCard({ title, body, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
        <div className="mb-4 h-px w-8" style={{ backgroundColor: ACCENT }} />
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/50">{body}</p>
      </div>
    </Reveal>
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function App() {
  const [statsRef, statsInView] = useInView(0.3);

  return (
    <main
      style={{ backgroundColor: BG,fontFamily: "'Space Grotesk', sans-serif" }}
      className="min-h-screen overflow-x-hidden text-white"
    >

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12"
        style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, transparent 100%)" }}
      >
        <div className="flex items-center gap-2">
          <img width={30} src="/src/assets/noBG.png" alt="logo"/>
          <span
            className="text-xl font-extrabold uppercase tracking-wider text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            otlob
          </span>
          <span
              className="text-base font-black text-white/30"
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" ,color: ACCENT}}
            >
              اطلب
            </span>
        </div>
        <a
          href={TYPEFORM_URL}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-80"
          style={{ backgroundColor: ACCENT }}
        >
          Join waitlist
        </a>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col justify-center px-6 pt-24 pb-16 md:px-12">

        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-[20%] left-[30%] h-[600px] w-[600px] rounded-full blur-[140px]"
            style={{ backgroundColor: ACCENT, opacity: 0.06 }}
          />
          <div
            className="absolute bottom-0 right-[-10%] h-[400px] w-[400px] rounded-full blur-[120px]"
            style={{ backgroundColor: ACCENT, opacity: 0.04 }}
          />
        </div>

        {/* Grid texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl">

          {/* Eyebrow */}
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5"
            style={{ backgroundColor: "rgba(255,59,0,0.08)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
            <span className="text-xs font-medium uppercase tracking-widest text-white/60">
              Launching September 2026
            </span>
          </div>

          {/* Headline */}
          <h1
            className="max-w-5xl text-[clamp(48px,9vw,120px)] leading-[0.95] text-white"
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              letterSpacing: "-0.03em",}}
          >
            Order food.
            <br />
            <span style={{ color: ACCENT }}>Skip</span> the queue.
          </h1>

          {/* Subline */}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            otlob lets Egyptian university students order food from campus
            restaurants without standing in line. Order from 
            <span className="max-w-xl font-extrabold leading-[0.9] tracking-tight" style={{ color: ACCENT, fontFamily: "'Syne', sans-serif" }}> Anywhere</span>. 
            Pick up when
            it&apos;s ready.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={TYPEFORM_URL}
              className="group relative overflow-hidden rounded-full px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,59,0,0.4)]"
              style={{ backgroundColor: ACCENT }}
            >
              <span className="relative z-10">Reserve my spot →</span>
              <div
                className="absolute inset-0 translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-0"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              />
            </a>
          </div>

          {/* Stat strip */}
          <div ref={statsRef} className="mt-20 flex flex-wrap gap-12 border-t border-white/[0.07] pt-10">
            <StatCard value={60} suffix="s" label="Restaurant response" duration={1200} inView={statsInView} />
            <div className="w-px bg-white/[0.07]" />
            <StatCard value={0} suffix=" EGP" label="Delivery fees" duration={800} inView={statsInView} />
            <div className="w-px bg-white/[0.07]" />
            <StatCard value={100} suffix="%" label="Queue-free" duration={1600} inView={statsInView} />
          </div>

        </div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 md:py-36">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/30">The problem</p>
            <h2
              className="max-w-3xl text-[clamp(32px,5vw,64px)] font-extrabold leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Your break disappears{" "}
              <span style={{ color: ACCENT }}>before you eat.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            <ProblemCard
              delay={0}
              title="The queue eats your break"
              body="20 to 30 minutes standing in line. By the time you order, your break is already over and class is about to start."
            />
            <ProblemCard
              delay={100}
              title="Zero visibility before you go"
              body="You have no idea what's available, whether it's fresh, or how long the wait is until you're already there."
            />
            <ProblemCard
              delay={200}
              title="No way to order in advance"
              body="If you could order from your seat, your food would be ready when you walked in. Until now, you couldn't."
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 md:py-36"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(255,59,0,0.03) 50%, transparent 100%)" }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/30">How it works</p>
            <h2
              className="max-w-2xl text-[clamp(32px,5vw,64px)] font-extrabold leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Order in under{" "}
              <span style={{ color: ACCENT }}>a minute.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard delay={0}   number="01" title="Open otlob"          body="Pick your campus and browse all restaurants inside it — open ones at the top." />
            <StepCard delay={100} number="02" title="Build your order"    body="Browse the menu, add to cart. The whole flow takes under 60 seconds." />
            <StepCard delay={200} number="03" title="Restaurant confirms" body="Your order hits their dashboard. They accept or reject within 60 seconds — guaranteed." />
            <StepCard delay={300} number="04" title="Pick it up ready"    body="Get notified the moment it's done. Walk over, pay cash, and you're out." />
          </div>
        </div>
      </section>

      {/* ── WHY OTLOB ───────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 md:py-36">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

            <Reveal>
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/30">Why otlob</p>
              <h2
                className="text-[clamp(32px,5vw,64px)] font-extrabold leading-[1.05] tracking-tight text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Built for your{" "}
                <span style={{ color: ACCENT }}>actual break.</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/50">
                By an Egyptian student, for every Egyptian student who&apos;s
                ever watched their entire break disappear in a queue.
              </p>
            </Reveal>

            <div className="flex flex-col gap-4">
              {[
                { title: "No queues, ever",       body: "Order from anywhere on campus. Arrive when it's ready and walk straight out." },
                { title: "Real-time tracking",     body: "Watch your order move through Preparing → Ready in real time." },
                { title: "Multiple campuses",      body: "One app across Egyptian universities. More campuses added every semester." },
                { title: "Zero fees. Cash pickup", body: "No subscriptions, no delivery charges. Pay cash at the counter as always — just without the wait." },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/10">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-white/50">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── LAUNCH BANNER ───────────────────────────────────────── */}
      <section className="px-6 py-12 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div
              className="group relative overflow-hidden rounded-[2.5rem] px-8 py-20 text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:px-16 md:py-32"
              style={{ backgroundColor: ACCENT }}
            >
              {/* --- Background Textures & Depth --- */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Enhanced Grid */}
                <div
                  className="absolute inset-0 opacity-[0.08] mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                    backgroundSize: "48px 48px",
                  }}
                />
                {/* Radial glow for center focus */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
                {/* Subtle bottom shadow to ground the text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* --- Content --- */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                
                {/* Modern Pill Badge */}
                <div className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md">
                  <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-white"></span>
                  Coming Next Semester
                </div>

                {/* Upgraded Heading */}
                <h2
                  className="mb-6 flex flex-col gap-1 text-[clamp(2.5rem,8vw,6rem)] font-extrabold leading-[1.05] tracking-tighter text-white drop-shadow-md"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="text-white/90">Launching</span>
                  <span>September 2026</span>
                </h2>

                {/* Refined Subtitle */}
                <p className="max-w-2xl text-lg font-medium tracking-wide text-white/80 md:text-xl">
                  Want to see your university on the app? Join the waitlist to let us know.
                </p>
                
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center md:px-12 md:py-36">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2
              className="text-[clamp(36px,6vw,80px)] font-extrabold leading-[1] tracking-tight text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Don&apos;t waste
              <br />
              <span style={{ color: ACCENT }}>another break.</span>
            </h2>
            <p className="mt-5 text-lg text-white/50">
              Join the waitlist and be the first to order when otlob launches at
              your campus.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href={TYPEFORM_URL}
                className="group relative overflow-hidden rounded-full px-10 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-[0_0_50px_rgba(255,59,0,0.35)]"
                style={{ backgroundColor: ACCENT }}
              >
                <span className="relative z-10">Reserve my spot →</span>
                <div
                  className="absolute inset-0 translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-extrabold uppercase tracking-wider"
              style={{ fontFamily: "'Syne', sans-serif", color: ACCENT }}
            >
              otlob
            </span>
            <span
              className="text-base font-black text-white/30"
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              اطلب
            </span>
          </div>
          <p className="text-xs text-white/25">
            © 2026 otlob · Made for Egyptian students 🇪🇬
          </p>
        </div>
      </footer>

    </main>
  );
}