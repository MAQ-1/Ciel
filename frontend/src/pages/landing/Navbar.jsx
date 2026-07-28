import { motion, useScroll, useMotionValueEvent, useReducedMotion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useId, useCallback } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const navItems = [
  { name: "Features", href: "#features" },
  { name: "Workflow", href: "#workflow" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

// Smooth scroll helper
const scrollToSection = (elementId, offset = 80) => {
  const element = document.querySelector(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] rounded-lg";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const mobileMenuId = useId();
  const menuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Handle scroll state
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  // Active section detection using Intersection Observer
  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Handle smooth scroll navigation
  const handleNavClick = useCallback(
    (e, href) => {
      e.preventDefault();
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      scrollToSection(href);
    },
    [isMobileMenuOpen]
  );

  // Logo click - scroll to hero
  const handleLogoClick = useCallback(() => {
    scrollToSection("#hero");
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape and outside click
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(e.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    // Full-bleed, in-flow header — no margin/gap around it, so nothing
    // behind it can ever peek through at section boundaries.
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        isScrolled
          ? "bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            aria-label="Scroll to top"
            className={`flex items-center gap-2.5 group ${focusRing}`}
          >
            <span className="relative flex h-3 w-3">
              <span className="h-3 w-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              <span className="absolute inset-0 rounded-full ring-1 ring-cyan-300/40 scale-150" />
            </span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Ciel
            </span>
          </button>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${focusRing} ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-lg bg-white/8 border border-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/app")}
              className={`hidden sm:flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] ${focusRing}`}
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Launch Ciel
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              ref={toggleButtonRef}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
              className={`md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 ${focusRing}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <motion.div
            id={mobileMenuId}
            ref={menuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-b border-white/10 bg-[#0a0a0c]/95 backdrop-blur-2xl"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={activeSection === item.href ? "location" : undefined}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`block py-3 px-4 text-sm rounded-lg transition-colors duration-200 ${focusRing} ${
                      activeSection === item.href
                        ? "text-white bg-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/app");
                }}
                className={`w-full mt-3 flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black ${focusRing}`}
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Launch Ciel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;