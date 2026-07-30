import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useId, useCallback } from "react";
import { Menu, X, Sparkles } from "lucide-react";

// Fixed nav items - do not rename or reorder
const navItems = [
  { name: "Features", href: "#features", agent: "#22d3ee" }, // cyan
  { name: "Workflow", href: "#workflow", agent: "#a78bfa" }, // violet
  { name: "Pricing", href: "#pricing", agent: "#fbbf24" }, // amber
  { name: "FAQ", href: "#faq", agent: "#34d399" }, // emerald
];

// Smooth scroll helper with offset for fixed navbar
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

// Focus ring utility - visible on :focus-visible only
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] rounded-lg";

// Logo Mark: Orbiting Agents
const AgentMark = ({ reduced }) => {
  const nodes = [
    { color: "#22d3ee", radius: 9, duration: 5, reverse: false }, // cyan
    { color: "#a78bfa", radius: 12, duration: 7.5, reverse: true }, // violet - opposite direction
    { color: "#fbbf24", radius: 15, duration: 10, reverse: false }, // amber
  ];

  return (
    <span className="relative flex h-8 w-8 items-center justify-center">
      {/* Core orchestrator */}
      <span 
        aria-hidden="true"
        className="relative z-10 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]" 
      />
      
      {/* Orbiting nodes */}
      {!reduced &&
        nodes.map((n, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute inset-0"
            animate={{ rotate: n.reverse ? -360 : 360 }}
            transition={{ 
              duration: n.duration, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <span
              className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: n.color,
                boxShadow: `0 0 8px ${n.color}`,
                transform: `translate(-50%, -50%) translateX(${n.radius}px)`,
              }}
            />
          </motion.span>
        ))}
      
      {/* Static nodes when reduced motion is enabled */}
      {reduced &&
        nodes.map((n, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: n.color,
              boxShadow: `0 0 8px ${n.color}`,
              transform: `translate(-50%, -50%) translate(${n.radius * Math.cos(i * 2.094)}px, ${n.radius * Math.sin(i * 2.094)}px)`,
            }}
          />
        ))}
    </span>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const { scrollY, scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const mobileMenuId = useId();
  const menuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Scroll progress bar - transforms 0% → 100%
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Handle scroll state for navbar background
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

  // Handle nav link clicks with smooth scroll
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
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Scroll Progress Bar - "Workflow Line" */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 h-[2px] w-full origin-left"
        style={{
          scaleX: progressScaleX,
          background: "linear-gradient(90deg, #22d3ee, #a78bfa, #fbbf24, #34d399)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Navbar container - height animates 64px → 56px on scroll */}
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-14" : "h-16"
          }`}
        >
          {/* Logo - clickable to scroll to top */}
          <button
            onClick={handleLogoClick}
            aria-label="Scroll to top"
            className={`flex items-center gap-2 group ${focusRing}`}
          >
            <AgentMark reduced={prefersReducedMotion} />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Ciel
            </span>
          </button>

          {/* Desktop Navigation - centered */}
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
                  {/* Active pill - morphs and slides between sections */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-lg border"
                      style={{
                        background: `${item.agent}14`,
                        borderColor: `${item.agent}40`,
                        boxShadow: `0 0 20px ${item.agent}25`,
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 380, 
                        damping: 30 
                      }}
                    />
                  )}
                  
                  <span className="relative inline-flex items-center gap-1.5">
                    {/* Agent color dot */}
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full transition-opacity duration-200"
                      style={{
                        backgroundColor: item.agent,
                        opacity: isActive ? 1 : 0.35,
                        boxShadow: isActive ? `0 0 8px ${item.agent}` : "none",
                      }}
                    />
                    {item.name}
                  </span>
                  
                  {/* Handoff trail dot - slides with active pill */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-trail"
                      aria-hidden="true"
                      className="absolute -bottom-[5px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                      style={{ 
                        backgroundColor: item.agent, 
                        boxShadow: `0 0 8px ${item.agent}` 
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 380, 
                        damping: 30 
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Side - Status + CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Status chip - live agents indicator (hidden below lg) */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Agents online
            </div>

            {/* Primary CTA - hidden below sm breakpoint */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/app")}
              className={`hidden sm:flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-shadow duration-150 hover:shadow-[0_0_30px_rgba(167,139,250,0.4)] ${focusRing}`}
              style={{ background: "linear-gradient(90deg, #22d3ee, #a78bfa)" }}
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

      {/* Mobile Menu - Pipeline layout with agent nodes */}
      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <motion.div
            id={mobileMenuId}
            ref={menuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: prefersReducedMotion ? 0 : 0.25, 
              ease: "easeInOut" 
            }}
            className="md:hidden overflow-hidden border-b border-white/10 bg-[#0a0a0c]/95 backdrop-blur-2xl"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
              <nav aria-label="Mobile navigation" className="relative flex flex-col pl-5">
                {/* Pipeline spine - connecting line */}
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] top-3 bottom-3 w-px bg-white/10"
                />
                
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? "location" : undefined}
                      onClick={(e) => handleNavClick(e, item.href)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: prefersReducedMotion ? 0 : i * 0.05,
                        duration: 0.2,
                        ease: "easeOut"
                      }}
                      className={`relative flex items-center gap-3 py-3 px-3 -ml-3 text-sm rounded-lg transition-colors duration-200 ${focusRing} ${
                        isActive 
                          ? "text-white bg-white/[0.06]" 
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {/* Agent node on pipeline */}
                      <span
                        aria-hidden="true"
                        className="relative z-10 h-2 w-2 shrink-0 rounded-full transition-all duration-200"
                        style={{
                          backgroundColor: item.agent,
                          boxShadow: isActive ? `0 0 12px ${item.agent}` : "none",
                          opacity: isActive ? 1 : 0.5,
                        }}
                      />
                      {item.name}
                    </motion.a>
                  );
                })}
              </nav>
              
              {/* Mobile CTA - full width */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/app");
                }}
                className={`w-full mt-3 flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-black ${focusRing}`}
                style={{ background: "linear-gradient(90deg, #22d3ee, #a78bfa)" }}
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