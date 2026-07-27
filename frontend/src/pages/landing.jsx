import { useState, useEffect, useRef, useCallback } from "react";

// ─── Typewriter Hook ─────────────────────────────────────────────────────────

function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout;
    let interval;
    let i = 0;

    timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ─── Landing Page ────────────────────────────────────────────────────────────

export default function Landing() {
  const videoRef = useRef(null);
  const prevXRef = useRef(null);
  const targetTimeRef = useRef(0);
  const seekingRef = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);

  const SENSITIVITY = 0.8;

  const typewriterText =
    "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
  const { displayed, done } = useTypewriter(typewriterText, 38, 600);

  // ── Pills fade-in after 400ms ──
  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // ── Video mouse-scrub ──
  const seekToTarget = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    seekingRef.current = true;
    video.currentTime = targetTimeRef.current;
  }, []);

  const handleSeeked = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    seekingRef.current = false;
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      seekToTarget();
    }
  }, [seekToTarget]);

  useEffect(() => {
    const onMouseMove = (e) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const timeOffset =
        (delta / window.innerWidth) * SENSITIVITY * video.duration;
      let newTarget = targetTimeRef.current + timeOffset;
      newTarget = Math.max(0, Math.min(newTarget, video.duration));
      targetTimeRef.current = newTarget;

      if (!seekingRef.current) {
        seekToTarget();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [seekToTarget]);

  // ── Close mobile menu on md+ resize ──
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Copy email helper ──
  const copyEmail = () => {
    navigator.clipboard.writeText("hello@mainframe.co");
  };

  const navLinks = ["Labs", "Studio", "Openings", "Shop"];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* ── Background Video ── */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        className="fixed inset-0 w-full h-full z-0"
        style={{ objectFit: "cover", objectPosition: "70% center" }}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
          type="video/mp4"
        />
      </video>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Mainframe®
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center text-[23px] text-black">
          {navLinks.map((link, i) => (
            <span key={link}>
              <a
                href="#"
                className="hover:opacity-60 transition-opacity"
              >
                {link}
              </a>
              {i < navLinks.length - 1 && (
                <span className="mx-[0.15em]">,</span>
              )}
            </span>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#"
          className="hidden md:inline-block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-[5px] md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-[2px] bg-black transition-transform duration-300"
            style={{
              transform: menuOpen
                ? "rotate(45deg) translateY(7px)"
                : "none",
            }}
          />
          <span
            className="block w-6 h-[2px] bg-black transition-opacity duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-[2px] bg-black transition-transform duration-300"
            style={{
              transform: menuOpen
                ? "rotate(-45deg) translateY(-7px)"
                : "none",
            }}
          />
        </button>
      </nav>

      {/* ── Mobile Overlay ── */}
      <div
        className="fixed inset-0 z-9 bg-white/95 backdrop-blur-sm flex flex-col justify-center px-8 gap-8 md:hidden transition-opacity duration-300"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
          >
            {link}
          </a>
        ))}
        <a
          href="#"
          className="text-[32px] font-medium text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative z-1 h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="max-w-xl relative z-10">
          {/* Blurred intro label */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: "#000",
              filter: "blur(4px)",
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe&apos;s Adaptive Response Interface Agent
          </div>

          {/* Typewriter text */}
          <p
            className="text-black mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 400,
              minHeight: "54px",
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </p>

          {/* Action pill buttons */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible
                ? "translateY(0)"
                : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {[
              "Pitch us an idea",
              "Come work here",
              "Send a brief hello",
              "See how we operate",
            ].map((label) => (
              <button
                key={label}
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
              >
                {label}
              </button>
            ))}

            {/* Outline email pill */}
            <button
              onClick={copyEmail}
              className="inline-flex items-center justify-center bg-transparent text-white border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200"
            >
              <span>
                Reach us:{" "}
                <span className="underline underline-offset-1">
                  hello@mainframe.co
                </span>
              </span>
              {/* Copy icon – two overlapping rectangles */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
