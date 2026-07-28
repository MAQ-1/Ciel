import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const footerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const columnVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.4,
      },
    },
  };

  const linkVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const navGroups = [
    {
      title: "Product",
      items: [
        { label: "Features", href: "#features" },
        { label: "Workflow", href: "#workflow" },
        { label: "Pricing", href: "#pricing" },
        { label: "Ask Ciel", href: "#faq" },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "Documentation", href: "#" },
        { label: "API", href: "#" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Privacy", href: "#" },
      ],
    },
  ];

  const techStack = ["React", "Node.js", "LangGraph", "Redis", "MongoDB"];

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] rounded-sm";

  return (
    <footer className="relative bg-[#0a0a0c] overflow-hidden pt-16 sm:pt-20 lg:pt-24">
      {/* Top gradient boundary */}
      <div
        className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, transparent 0%, rgba(139, 92, 246, 0.04) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Layer 1: Final CTA */}
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-3xl mx-auto pb-12 sm:pb-16 lg:pb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-[#0d0d10] px-4 py-1.5 backdrop-blur-sm mb-6">
            <Sparkles className="h-3 w-3 text-cyan-400/70" aria-hidden="true" />
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
              Ready to Begin
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white leading-[1.08]">
            Start building with
            <br />
            <span className="font-medium">Ciel today.</span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/65 leading-relaxed">
            Join thousands of developers and teams using Ciel to build
            faster, research deeper, and create more.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 30px rgba(34, 211, 238, 0.25)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/app")}
              className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium text-sm transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] ${focusRing}`}
            >
              <span>Launch Ciel</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-white/6" />

        {/* Layer 2: Navigation */}
        <motion.nav
          aria-label="Footer"
          variants={columnVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 py-12 sm:py-16"
        >
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-xs font-medium tracking-[0.15em] text-white/40 uppercase">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <motion.li key={item.label} variants={linkVariants}>
                    <a
                      href={item.href}
                      className={`group text-sm text-white/55 hover:text-white/85 transition-colors duration-200 inline-flex items-center ${focusRing}`}
                    >
                      <span className="relative">
                        {item.label}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400/50 transition-all duration-200 group-hover:w-full" />
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </motion.nav>

        {/* Divider */}
        <div className="w-full h-px bg-white/6" />

        {/* Layer 3: Bottom Signature */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 py-8 sm:py-10 text-center md:text-left"
        >
          {/* Logo & Brand */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="relative" aria-hidden="true">
              <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
              <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-cyan-400 blur-sm opacity-40" />
            </div>
            <span className="text-sm font-medium text-white/70">Ciel</span>
            <span className="hidden sm:inline text-sm text-white/15">•</span>
            <span className="hidden sm:inline text-sm text-white/40 font-light">
              One Workspace. Infinite Intelligence.
            </span>
          </div>

          {/* Copyright */}
          <span className="text-xs text-white/30 order-3 md:order-2">
            © {new Date().getFullYear()} Ciel. All rights reserved.
          </span>

          {/* Tech Stack */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10px] text-white/20 font-mono order-2 md:order-3">
            {techStack.map((tech, i) => (
              <span key={tech} className="flex items-center gap-3">
                {i > 0 && <span className="w-px h-3 bg-white/8" aria-hidden="true" />}
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;