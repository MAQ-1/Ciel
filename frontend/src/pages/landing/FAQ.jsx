import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

const FAQ = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef(null);

  const questions = [
    {
      id: "q1",
      short: "What is Ciel?",
      question: "What is Ciel?",
      answer: [
        "Ciel is a multi-agent AI workspace that brings together specialized AI agents for coding, research, document analysis, presentations, vision, and web search—all in one intelligent environment.",
        "Think of it as having a team of AI specialists working together, each handling what they do best, while you maintain complete control over the workflow."
      ],
    },
    {
      id: "q2",
      short: "How does multi-agent work?",
      question: "How does multi-agent work?",
      answer: [
        "Ciel intelligently routes your requests to the most capable agent for the job. Need code? Your Coding Agent steps in. Analyzing a PDF? The PDF Agent takes over. Each request gets the right specialist.",
        "Agents collaborate behind the scenes, sharing context and building on each other's work to deliver comprehensive results—without you ever having to switch tools."
      ],
    },
    {
      id: "q3",
      short: "What can I build with Ciel?",
      question: "What can I build with Ciel?",
      answer: [
        "From complex applications to in-depth research, compelling presentations, and automated workflows—Ciel adapts to your needs. Generate production-ready code, synthesize insights from multiple documents, or create professional presentations in minutes.",
        "The workspace grows with you, handling everything from quick tasks to enterprise-scale projects with the same precision."
      ],
    },
    {
      id: "q4",
      short: "Is my data private?",
      question: "Is my data private?",
      answer: [
        "Privacy is fundamental to Ciel. Your data is encrypted in transit and at rest. We never use your inputs or outputs for training models, and you maintain full ownership of everything you create.",
        "Enterprise-grade security with SOC 2 compliance, single sign-on, and granular access controls ensure your work stays yours."
      ],
    },
    {
      id: "q5",
      short: "How do I get started?",
      question: "How do I get started?",
      answer: [
        "Getting started with Ciel is effortless—simply launch the workspace, choose your agent, and start asking. No credit card required, no setup, no learning curve.",
        "Explore the full power of multi-agent AI immediately, with free access to core capabilities and the ability to scale as your needs grow."
      ],
    },
  ];

  // Check for reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer - once only
  useEffect(() => {
    if (!sectionRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: [0.25] }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Handle question click with debounce
  const handleQuestionClick = useCallback((index) => {
    if (isTransitioning || index === activeIndex) return;
    
    setIsTransitioning(true);
    clearTimeout(timeoutRef.current);
    
    setActiveIndex(index);
    
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 450);
  }, [activeIndex, isTransitioning]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (isMobile) return;
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % questions.length;
      handleQuestionClick(nextIndex);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (activeIndex - 1 + questions.length) % questions.length;
      handleQuestionClick(prevIndex);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  }, [activeIndex, handleQuestionClick, isMobile, questions.length]);

  // Animation variants - refined timing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: reducedMotion ? 0 : -10, y: 0 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.1 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.1 : 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1,
      },
    },
  };

  const answerVariants = {
    enter: {
      opacity: 0,
      y: reducedMotion ? 0 : -6,
      transition: {
        duration: reducedMotion ? 0.05 : 0.15,
        ease: "easeIn",
      },
    },
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.1 : 0.3,
        ease: [0.22, 1, 0.36, 1],
        delay: reducedMotion ? 0 : 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : 6,
      transition: {
        duration: reducedMotion ? 0.05 : 0.15,
        ease: "easeIn",
      },
    },
  };

  const activeQuestion = questions[activeIndex];

  return (
    <section 
      id="faq"
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0c] overflow-hidden py-20 sm:py-24 lg:py-32"
      aria-label="Ask Ciel - Frequently Asked Questions"
      onKeyDown={handleKeyDown}
    >
      {/* Section color boundaries */}
      <div 
        className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, transparent 0%, rgba(34, 211, 238, 0.03) 100%)",
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(139, 92, 246, 0.03) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-[#0d0d10] px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-cyan-400/60" />
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              Ask Ciel
            </span>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white leading-[1.08]">
            Everything you need to
            <br />
            <span className="font-medium">know about Ciel.</span>
          </h2>
        </motion.div>

        {/* Split Layout - Refined proportions */}
        <div className="grid grid-cols-1 lg:grid-cols-[36%_1fr] gap-10 lg:gap-16 xl:gap-20">
          
          {/* Left Panel - Navigation */}
          <motion.div
            variants={containerVariants}
            initial={hasAnimated ? "visible" : "hidden"}
            animate="visible"
            className="lg:sticky lg:top-24 self-start"
          >
            {/* Supporting text */}
            <motion.p variants={itemVariants} className="text-sm text-white/40 leading-relaxed mb-8 hidden sm:block">
              Explore the questions below.
            </motion.p>

            {/* Question List - Desktop */}
            <div className="hidden md:block" role="tablist" aria-label="Questions">
              {questions.map((q, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    key={q.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${q.id}`}
                    id={`tab-${q.id}`}
                    className={`group relative w-full flex items-start gap-4 py-3.5 px-1 rounded-lg transition-all duration-200 text-left ${
                      isActive 
                        ? "text-white" 
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
                    }`}
                    onClick={() => handleQuestionClick(index)}
                    disabled={isTransitioning}
                    style={{
                      cursor: isTransitioning ? 'default' : 'pointer',
                      opacity: isTransitioning && !isActive ? 0.6 : 1,
                    }}
                  >
                    {/* Indicator */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          isActive 
                            ? "bg-cyan-400 scale-110" 
                            : "bg-white/15 group-hover:bg-white/25"
                        }`}
                      />
                    </div>
                    
                    {/* Question text */}
                    <div>
                      <span className={`text-[15px] font-medium transition-colors duration-200 ${
                        isActive ? "text-white" : ""
                      }`}>
                        {q.short}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="active-line"
                          className="h-0.5 w-8 bg-cyan-400 rounded-full mt-1"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Question List - Mobile (Horizontal Scroll) */}
            <div className="md:hidden overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
              <div className="flex gap-2 min-w-max" role="tablist" aria-label="Questions">
                {questions.map((q, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <button
                      key={q.id}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${q.id}`}
                      id={`tab-${q.id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap ${
                        isActive 
                          ? "border-cyan-400/30 bg-cyan-400/10 text-white" 
                          : "border-white/5 bg-white/[0.02] text-white/40"
                      }`}
                      onClick={() => handleQuestionClick(index)}
                      disabled={isTransitioning}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-cyan-400" : "bg-white/20"
                      }`} />
                      <span className="text-sm font-medium">{q.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Answer */}
          <motion.div
            variants={panelVariants}
            initial={hasAnimated ? "visible" : "hidden"}
            animate="visible"
            className="relative bg-[#0d0d10] rounded-2xl p-8 sm:p-10 lg:p-12 xl:p-14 min-h-[420px]"
            role="tabpanel"
            aria-labelledby={`tab-${activeQuestion.id}`}
            id={`panel-${activeQuestion.id}`}
          >
            {/* Accent Bar */}
            <motion.div
              key={`bar-${activeIndex}`}
              className="absolute left-0 top-0 w-1 bg-gradient-to-b from-cyan-400 to-violet-400 rounded-full"
              style={{ transformOrigin: 'top' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            {/* Answer Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={answerVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6 max-w-2xl"
              >
                {/* Question as heading */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-white tracking-tight">
                  {activeQuestion.question}
                </h3>

                {/* Answer body */}
                <div className="space-y-4">
                  {activeQuestion.answer.map((paragraph, idx) => (
                    <p key={idx} className="text-[15px] sm:text-base text-white/60 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* CTA - Integrated naturally */}
                <div className="pt-6 mt-2 border-t border-white/5">
                  <button
                    onClick={() => navigate("/app")}
                    className="group inline-flex items-center gap-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
                  >
                    <span>Launch Ciel</span>
                    <ArrowRight className="h-4 w-4 text-cyan-400/60 group-hover:text-cyan-400 transition-all duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;