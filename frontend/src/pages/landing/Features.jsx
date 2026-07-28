import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, 
  FileText, 
  Presentation, 
  Search, 
  Eye, 
  MessageSquare,
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ============================================
// REUSABLE COMPONENTS
// ============================================

const AgentIcon = ({ icon: Icon, color, size = "md" }) => {
  const sizeClasses = {
    sm: "h-3 w-3 sm:h-4 sm:w-4",
    md: "h-6 w-6 sm:h-8 sm:w-8",
    lg: "h-10 w-10 sm:h-12 sm:w-12",
    xl: "h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16",
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${color} p-0.5`}>
      <div className="rounded-2xl bg-[#121215] p-2 sm:p-3">
        <Icon className={`${sizeClasses[size]} text-white/90`} strokeWidth={1.5} />
      </div>
    </div>
  );
};

const AgentBadge = ({ label, accentBorder, accentDot }) => (
  <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full border ${accentBorder} bg-white/[0.02] text-[8px] sm:text-[10px] font-medium tracking-wider text-white/40 uppercase`}>
    <span className={`w-1 h-1 rounded-full ${accentDot}`} />
    {label}
  </span>
);

const CapabilityPill = ({ text }) => (
  <span className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] sm:text-xs text-white/50 hover:text-white/70 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 cursor-default">
    {text}
  </span>
);

const AgentPreview = ({ preview }) => (
  <div className="min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] w-full bg-[#17171b] rounded-xl border border-white/5 p-3 sm:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
    {preview}
  </div>
);

const NavigationDots = ({ count, active, onSelect, accentLights }) => (
  <div className="flex gap-1.5 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          i === active 
            ? `w-4 sm:w-6 ${accentLights[i]}` 
            : "w-1.5 bg-white/10 hover:bg-white/20"
        }`}
        aria-label={`Select agent ${i + 1}`}
      />
    ))}
  </div>
);

// ============================================
// AGENT DATA - SINGLE SOURCE OF TRUTH
// ============================================

const features = [
  {
    id: 0,
    icon: Code,
    label: "Coding Agent",
    title: "Write production-ready code with confidence",
    description: "Generate, debug, and refactor code across multiple languages. Your coding agent understands context, follows best practices, and adapts to your codebase's unique patterns.",
    capabilities: [
      "Multi-language code generation",
      "Context-aware debugging & refactoring",
      "Automated test writing & documentation"
    ],
    color: "cyan",
    accentClass: "from-cyan-400 to-cyan-500",
    accentLight: "bg-cyan-400/10",
    accentBorder: "border-cyan-400/20",
    accentText: "text-cyan-400",
    accentDot: "bg-cyan-400",
    glowColor: "rgba(34, 211, 238, 0.15)",
    badge: "Specialized Agent",
    cta: "Try Coding Agent",
    preview: (
      <div className="h-full">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[8px] sm:text-[10px] text-white/20 ml-2">main.py</span>
        </div>
        <div className="font-mono text-[9px] sm:text-[11px] leading-relaxed">
          <span className="text-purple-400">def</span>
          <span className="text-yellow-400"> process_data</span>
          <span className="text-white/60">(data):</span>
          <br />
          <span className="text-white/30 ml-3">"""Process incoming data with AI"""</span>
          <br />
          <span className="text-blue-400 ml-3">result</span>
          <span className="text-white/60"> = </span>
          <span className="text-cyan-400">ai_agent</span>
          <span className="text-white/60">.</span>
          <span className="text-pink-400">analyze</span>
          <span className="text-white/60">(data)</span>
          <br />
          <span className="text-blue-400 ml-3">return</span>
          <span className="text-white/60"> result</span>
        </div>
      </div>
    )
  },
  {
    id: 1,
    icon: FileText,
    label: "PDF Agent",
    title: "Extract insights from any document",
    description: "Analyze, summarize, and generate documents from scratch. Your PDF agent extracts key information, identifies patterns, and transforms unstructured data into actionable insights.",
    capabilities: [
      "Intelligent document summarization",
      "Data extraction & pattern recognition",
      "Cross-document synthesis & analysis"
    ],
    color: "violet",
    accentClass: "from-violet-400 to-violet-500",
    accentLight: "bg-violet-400/10",
    accentBorder: "border-violet-400/20",
    accentText: "text-violet-400",
    accentDot: "bg-violet-400",
    glowColor: "rgba(139, 92, 246, 0.15)",
    badge: "Specialized Agent",
    cta: "Try PDF Agent",
    preview: (
      <div className="h-full">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="w-8 h-10 sm:w-10 sm:h-12 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400/60" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-white/60 font-medium truncate">Annual_Report_2024.pdf</p>
            <div className="mt-1 sm:mt-2 space-y-1 sm:space-y-1.5">
              <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px]">
                <span className="text-white/20">Revenue:</span>
                <span className="text-emerald-400">$12.4M</span>
                <span className="text-white/20">↑ 23%</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px]">
                <span className="text-white/20">Key Insight:</span>
                <span className="text-cyan-400">Market expansion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    icon: Presentation,
    label: "Presentation Agent",
    title: "Create compelling narratives in minutes",
    description: "Design professional presentations with intelligent slide generation, visual recommendations, and narrative flow optimized for your audience and message.",
    capabilities: [
      "Automated slide generation",
      "Smart visual & layout recommendations",
      "Narrative structure optimization"
    ],
    color: "blue",
    accentClass: "from-blue-400 to-blue-500",
    accentLight: "bg-blue-400/10",
    accentBorder: "border-blue-400/20",
    accentText: "text-blue-400",
    accentDot: "bg-blue-400",
    glowColor: "rgba(59, 130, 246, 0.15)",
    badge: "Specialized Agent",
    cta: "Try Presentation Agent",
    preview: (
      <div className="h-full">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400/60" />
          <span className="text-[10px] sm:text-xs text-white/40">Slide 1 of 12</span>
          <div className="flex-1" />
          <span className="text-[8px] sm:text-[10px] text-white/20">Q4 Strategy</span>
        </div>
        <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-lg p-2 sm:p-3 border border-blue-500/10">
          <h4 className="text-xs sm:text-sm text-white/80 font-medium">Market Expansion Strategy</h4>
          <p className="text-[10px] sm:text-[11px] text-white/40 mt-1">• Enter 3 new markets in APAC region</p>
          <p className="text-[10px] sm:text-[11px] text-white/40">• Launch localized product versions</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    icon: Search,
    label: "Search Agent",
    title: "Access real-time intelligence instantly",
    description: "Search the web with context-aware AI that understands your intent, verifies sources, and delivers synthesized insights instead of just links.",
    capabilities: [
      "Real-time web intelligence",
      "Contextual search understanding",
      "Source verification & synthesis"
    ],
    color: "emerald",
    accentClass: "from-emerald-400 to-emerald-500",
    accentLight: "bg-emerald-400/10",
    accentBorder: "border-emerald-400/20",
    accentText: "text-emerald-400",
    accentDot: "bg-emerald-400",
    glowColor: "rgba(52, 211, 153, 0.15)",
    badge: "Specialized Agent",
    cta: "Try Search Agent",
    preview: (
      <div className="h-full">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400/60" />
          <span className="text-[10px] sm:text-xs text-white/40">"AI market trends 2026"</span>
        </div>
        <div className="bg-emerald-500/5 rounded-lg p-2 sm:p-3 border border-emerald-500/10">
          <p className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed">
            <span className="text-emerald-400">Synthesized Insight:</span> The AI market is projected to reach $1.8T by 2026, with enterprise adoption growing at 35% YoY.
          </p>
          <div className="flex items-center gap-2 mt-1 sm:mt-2">
            <span className="text-[7px] sm:text-[9px] text-white/20">Source: Gartner</span>
            <span className="w-px h-2 sm:h-3 bg-white/10" />
            <span className="text-[7px] sm:text-[9px] text-emerald-400/60">Verified</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    icon: Eye,
    label: "Vision Agent",
    title: "Understand visual content with precision",
    description: "Analyze images, diagrams, charts, and handwritten content. Your vision agent extracts data, interprets visual context, and integrates findings with other agents.",
    capabilities: [
      "Advanced image & diagram analysis",
      "Handwritten text recognition (OCR)",
      "Cross-modal visual understanding"
    ],
    color: "purple",
    accentClass: "from-purple-400 to-purple-500",
    accentLight: "bg-purple-400/10",
    accentBorder: "border-purple-400/20",
    accentText: "text-purple-400",
    accentDot: "bg-purple-400",
    glowColor: "rgba(168, 85, 247, 0.15)",
    badge: "Specialized Agent",
    cta: "Try Vision Agent",
    preview: (
      <div className="h-full">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400/60" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-white/60 font-medium">Image Analysis</p>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px]">
                <span className="text-white/20">Objects:</span>
                <span className="text-white/40">3 detected</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px]">
                <span className="text-white/20">Text:</span>
                <span className="text-cyan-400">"Q4 Goals"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    icon: MessageSquare,
    label: "Chat Agent",
    title: "Natural conversations with intelligence",
    description: "Engage in fluid, context-aware conversations. Your chat agent understands nuance, maintains context across sessions, and seamlessly coordinates with other agents.",
    capabilities: [
      "Context-aware conversations",
      "Multi-agent orchestration",
      "Persistent session memory"
    ],
    color: "amber",
    accentClass: "from-amber-400 to-amber-500",
    accentLight: "bg-amber-400/10",
    accentBorder: "border-amber-400/20",
    accentText: "text-amber-400",
    accentDot: "bg-amber-400",
    glowColor: "rgba(251, 191, 36, 0.15)",
    badge: "Specialized Agent",
    cta: "Try Chat Agent",
    preview: (
      <div className="h-full">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-start gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-400/60" />
            </div>
            <div className="bg-amber-400/5 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-amber-400/10 flex-1">
              <p className="text-[10px] sm:text-[11px] text-white/60">Can you help me debug this function?</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5 sm:gap-2 ml-4 sm:ml-6">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white/30" />
            </div>
            <div className="bg-white/5 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-white/5 flex-1">
              <p className="text-[10px] sm:text-[11px] text-white/60">I'll analyze the code and find the issue.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

const Features = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const sectionRef = useRef(null);

  const activeData = features[activeFeature];

  // Autoplay
  useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }, 5000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [isAutoplay]);

  const handleSectionMouseEnter = () => {
    setIsAutoplay(false);
    clearInterval(autoplayRef.current);
  };

  const handleSectionMouseLeave = () => {
    setIsAutoplay(true);
  };

  // Direct mapping from feature data - no lookup map needed
  const accentLights = features.map(f => f.accentLight);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const contentVariants = {
    enter: { opacity: 0, y: 6 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  };

  return (
    <section 
      id="features"
      ref={sectionRef}
      onMouseEnter={handleSectionMouseEnter}
      onMouseLeave={handleSectionMouseLeave}
      className="relative min-h-screen bg-[#0a0a0c] overflow-hidden"
    >
      {/* Ambient glow - follows active agent color */}
      <motion.div
        key={activeFeature}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] rounded-full blur-[80px] sm:blur-[100px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${activeData.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Section color boundary - top fade */}
      <div 
        className="absolute top-0 left-0 right-0 h-[80px] sm:h-[120px] lg:h-[150px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, transparent 0%, rgba(34, 211, 238, 0.03) 100%)",
        }}
      />

      {/* Section color boundary - bottom fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[80px] sm:h-[120px] lg:h-[150px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(139, 92, 246, 0.03) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24 xl:py-32">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-[#0d0d10] px-3 sm:px-3.5 py-1.5 backdrop-blur-sm mb-4 sm:mb-6">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-cyan-400/60" />
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              Meet Your AI Team
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white leading-[1.08]">
            Every task deserves
            <br />
            <span className="font-medium">the right specialist.</span>
          </h2>

          <p className="mt-3 sm:mt-5 md:mt-6 max-w-2xl text-sm sm:text-base text-white/40 leading-relaxed">
            Ciel intelligently routes every request to the AI agent best suited
            for the job—from coding and research to presentations, documents,
            vision, and real-time web search.
          </p>
        </motion.div>

        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-12 lg:mt-16 xl:mt-20 rounded-2xl border border-white/5 bg-[#0d0d10] backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          {/* Desktop Layout - Fixed sidebar alignment */}
          <div className="hidden md:grid md:grid-cols-[280px_lg:340px_1fr] lg:grid-cols-[340px_1fr] md:items-start min-h-[560px] lg:min-h-[640px]">
            {/* Left Navigation - Sidebar with centered content */}
            <div className="border-r border-white/5 bg-[#0d0d10] p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-center">
              <p className="text-[10px] sm:text-xs font-medium tracking-[0.15em] text-white/20 uppercase mb-4 sm:mb-6 px-2">
                Specialists
              </p>

              <div className="space-y-1">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = activeFeature === index;

                  return (
                    <button
                      key={feature.id}
                      onClick={() => setActiveFeature(index)}
                      className={`group relative w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl transition-all duration-200 text-left ${
                        isActive 
                          ? `text-white bg-[#121215]` 
                          : "text-white/40 hover:text-white/70 hover:bg-[#121215]/50"
                      }`}
                      style={{
                        boxShadow: isActive ? `0 0 20px -8px ${feature.glowColor}` : 'none',
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 sm:h-8 rounded-full ${feature.accentLight}`}
                          transition={{ duration: 0.25 }}
                        />
                      )}

                      <div className={`flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                        isActive 
                          ? `${feature.accentLight} ${feature.accentText}` 
                          : "bg-transparent text-white/20 group-hover:text-white/40"
                      }`}>
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
                      </div>

                      <span className={`text-xs sm:text-sm font-medium transition-all duration-200 ${
                        isActive ? "text-white" : ""
                      }`}>
                        {feature.label}
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="active-border"
                          className={`absolute inset-0 rounded-xl border ${feature.accentBorder}`}
                          transition={{ duration: 0.25 }}
                        />
                      )}

                      <ChevronRight className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ml-auto transition-all duration-200 ${
                        isActive 
                          ? "text-white/30 opacity-100" 
                          : "text-white/10 opacity-0 group-hover:opacity-100"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel */}
            <div className="relative bg-[#121215] p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col min-h-[560px] lg:min-h-[640px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 flex flex-col"
                >
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4 sm:mb-6 lg:mb-8">
                    <AgentIcon 
                      icon={activeData.icon} 
                      color={activeData.accentClass} 
                      size="xl" 
                    />
                    <AgentBadge 
                      label={activeData.badge} 
                      accentBorder={activeData.accentBorder}
                      accentDot={activeData.accentDot}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium text-white tracking-tight mb-2 sm:mb-3">
                    {activeData.title}
                  </h3>

                  {/* Description */}
                  <p className="max-w-md text-sm sm:text-base text-white/40 leading-relaxed mb-4 sm:mb-6 lg:mb-8">
                    {activeData.description}
                  </p>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 lg:mb-8">
                    {activeData.capabilities.map((capability, i) => (
                      <CapabilityPill key={i} text={capability} />
                    ))}
                  </div>

                  {/* Preview */}
                  <AgentPreview preview={activeData.preview} />

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/app")}
                    className={`mt-6 sm:mt-8 group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border ${activeData.accentBorder} ${activeData.accentLight} text-sm font-medium ${activeData.accentText} hover:bg-white/[0.04] hover:border-white/20 transition-all duration-200 w-fit`}
                  >
                    <span>{activeData.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </motion.button>

                  {/* Dots */}
                  <NavigationDots 
                    count={features.length} 
                    active={activeFeature} 
                    onSelect={setActiveFeature}
                    accentLights={accentLights}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Tab Strip */}
            <div className="border-b border-white/5 bg-[#0d0d10] p-2 sm:p-3 overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 min-w-max">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = activeFeature === index;

                  return (
                    <button
                      key={feature.id}
                      onClick={() => setActiveFeature(index)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                        isActive 
                          ? `${feature.accentLight} ${feature.accentText} border ${feature.accentBorder}` 
                          : "text-white/40 hover:text-white/70 hover:bg-[#121215]/50"
                      }`}
                    >
                      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.5} />
                      <span className="text-[10px] sm:text-xs font-medium">{feature.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Panel */}
            <div className="bg-[#121215] p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col"
                >
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <AgentIcon 
                      icon={activeData.icon} 
                      color={activeData.accentClass} 
                      size="lg" 
                    />
                    <AgentBadge 
                      label={activeData.badge} 
                      accentBorder={activeData.accentBorder}
                      accentDot={activeData.accentDot}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white tracking-tight mb-2">
                    {activeData.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/40 leading-relaxed mb-4 sm:mb-6">
                    {activeData.description}
                  </p>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {activeData.capabilities.map((capability, i) => (
                      <CapabilityPill key={i} text={capability} />
                    ))}
                  </div>

                  {/* Preview */}
                  <AgentPreview preview={activeData.preview} />

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/app")}
                    className={`mt-4 sm:mt-6 group inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border ${activeData.accentBorder} ${activeData.accentLight} text-sm font-medium ${activeData.accentText} w-fit`}
                  >
                    <span>{activeData.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </motion.button>

                  {/* Dots */}
                  <NavigationDots 
                    count={features.length} 
                    active={activeFeature} 
                    onSelect={setActiveFeature}
                    accentLights={accentLights}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;