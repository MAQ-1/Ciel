import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare,
  GitBranch,
  Database,
  Wrench,
  Cpu,
  FileOutput,
  CheckCircle2,
  RotateCcw,
  Zap,
  Sparkles
} from "lucide-react";

// ============================================
// WORKFLOW NODES DATA
// ============================================

const workflowNodes = [
  {
    id: "prompt",
    title: "User Prompt",
    description: "Natural language request enters Ciel",
    icon: MessageSquare,
    color: "cyan",
    accentClass: "from-cyan-400 to-cyan-500",
    accentLight: "bg-cyan-400/10",
    accentBorder: "border-cyan-400/20",
    accentText: "text-cyan-400",
    glowColor: "rgba(34, 211, 238, 0.15)",
    isLLMNode: false,
  },
  {
    id: "router",
    title: "Intent Router",
    description: "Classifies request and routes to appropriate agent",
    icon: GitBranch,
    color: "violet",
    accentClass: "from-violet-400 to-violet-500",
    accentLight: "bg-violet-400/10",
    accentBorder: "border-violet-400/20",
    accentText: "text-violet-400",
    glowColor: "rgba(139, 92, 246, 0.15)",
    isLLMNode: false,
  },
  {
    id: "memory",
    title: "Conversation Memory",
    description: "Redis-stored context & session history",
    icon: Database,
    color: "blue",
    accentClass: "from-blue-400 to-blue-500",
    accentLight: "bg-blue-400/10",
    accentBorder: "border-blue-400/20",
    accentText: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.15)",
    isLLMNode: false,
  },
  {
    id: "tools",
    title: "Tool Execution",
    description: "Specialized tools execute the request",
    icon: Wrench,
    color: "emerald",
    accentClass: "from-emerald-400 to-emerald-500",
    accentLight: "bg-emerald-400/10",
    accentBorder: "border-emerald-400/20",
    accentText: "text-emerald-400",
    glowColor: "rgba(52, 211, 153, 0.15)",
    isLLMNode: false,
  },
  {
    id: "llm",
    title: "LLM Processing",
    description: "Intelligent synthesis across agents",
    icon: Cpu,
    color: "purple",
    accentClass: "from-purple-400 to-purple-500",
    accentLight: "bg-purple-400/10",
    accentBorder: "border-purple-400/20",
    accentText: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.15)",
    isLLMNode: true,
  },
  {
    id: "artifact",
    title: "Artifact Generation",
    description: "Final output is assembled",
    icon: FileOutput,
    color: "amber",
    accentClass: "from-amber-400 to-amber-500",
    accentLight: "bg-amber-400/10",
    accentBorder: "border-amber-400/20",
    accentText: "text-amber-400",
    glowColor: "rgba(251, 191, 36, 0.15)",
    isLLMNode: false,
  },
  {
    id: "response",
    title: "Final Response",
    description: "Delivered to user",
    icon: CheckCircle2,
    color: "rose",
    accentClass: "from-rose-400 to-rose-500",
    accentLight: "bg-rose-400/10",
    accentBorder: "border-rose-400/20",
    accentText: "text-rose-400",
    glowColor: "rgba(244, 63, 94, 0.15)",
    isLLMNode: false,
  },
];

// ============================================
// SUB-COMPONENTS
// ============================================

const WorkflowNode = ({ 
  node, 
  isActive, 
  isCompleted, 
  index, 
  totalNodes,
  onNodeHover 
}) => {
  const Icon = node.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex flex-col items-center w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px] flex-shrink-0 transition-all duration-300"
      onMouseEnter={() => {
        setIsHovered(true);
        onNodeHover?.(node.id);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onNodeHover?.(null);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Node card */}
      <motion.div
        className={`relative rounded-xl border p-3 sm:p-4 transition-all duration-500 w-full ${
          node.isLLMNode ? "border-t-2" : ""
        } ${
          isCompleted || isActive
            ? `${node.accentBorder} ${node.accentLight}`
            : "border-white/5 bg-white/[0.02]"
        }`}
        animate={{
          scale: isActive ? 1.05 : isCompleted ? 1.02 : 1,
          borderColor: isActive || isCompleted ? node.accentBorder : "rgba(255,255,255,0.05)",
        }}
        transition={{
          duration: isActive ? 0.3 : 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          boxShadow: isActive ? `0 0 30px -8px ${node.glowColor}` : "none",
        }}
      >
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          <div className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
            isActive || isCompleted ? node.accentLight : "bg-white/5"
          }`}>
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${
              isActive || isCompleted ? node.accentText : "text-white/20"
            }`} strokeWidth={1.5} />
          </div>
          <p className={`text-[9px] sm:text-[10px] font-medium text-center transition-all duration-300 ${
            isActive || isCompleted ? "text-white" : "text-white/30"
          }`}>
            {node.title}
          </p>
          <p className={`text-[8px] sm:text-[10px] text-center leading-snug transition-all duration-500 hidden sm:block ${
            isActive || isCompleted ? "text-white/70" : "text-white/25"
          }`}>
            {node.description}
          </p>
        </div>

        {/* Completion checkmark */}
        {isCompleted && !isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
          >
            <CheckCircle2 className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-emerald-400" />
          </motion.div>
        )}
      </motion.div>

      {/* Node label - index */}
      <span className={`text-[7px] sm:text-[9px] mt-1.5 sm:mt-2 transition-all duration-300 ${
        isActive || isCompleted ? "text-white/40" : "text-white/15"
      }`}>
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.div>
  );
};

// ============================================
// CONNECTING LINES
// ============================================

const ConnectingLine = ({ 
  fromIndex, 
  toIndex, 
  totalNodes, 
  activeNodeIndex,
  isMobile 
}) => {
  const isCompleted = activeNodeIndex > fromIndex;
  const isActive = activeNodeIndex === fromIndex && activeNodeIndex < totalNodes - 1;

  // Calculate positions based on orientation
  const getLineProps = () => {
    if (isMobile) {
      return {
        x1: "50%",
        y1: "100%",
        x2: "50%",
        y2: "0%",
      };
    }
    return {
      x1: "100%",
      y1: "50%",
      x2: "0%",
      y2: "50%",
    };
  };

  const lineProps = getLineProps();

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <line
          x1={lineProps.x1}
          y1={lineProps.y1}
          x2={lineProps.x2}
          y2={lineProps.y2}
          stroke={
            isCompleted ? "rgba(34, 211, 238, 0.5)" : 
            isActive ? "rgba(34, 211, 238, 0.7)" : 
            "rgba(255,255,255,0.05)"
          }
          strokeWidth={isMobile ? "2.5" : "1.5"}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        
        {/* Animated segment when active */}
        {isActive && (
          <motion.line
            initial={{ strokeDashoffset: 1 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            x1={lineProps.x1}
            y1={lineProps.y1}
            x2={lineProps.x2}
            y2={lineProps.y2}
            stroke={isMobile ? "rgba(34, 211, 238, 0.6)" : "rgba(34, 211, 238, 0.5)"}
            strokeWidth={isMobile ? "2.5" : "1.5"}
            strokeLinecap="round"
            strokeDasharray="1"
          />
        )}
      </svg>
    </div>
  );
};

// ============================================
// REQUEST ORB
// ============================================

const RequestOrb = ({ 
  nodePositions, 
  activeNodeIndex, 
  totalNodes,
  isMobile 
}) => {
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (activeNodeIndex < totalNodes && nodePositions[activeNodeIndex]) {
      const pos = nodePositions[activeNodeIndex];
      setCurrentPos(pos);
    }
  }, [activeNodeIndex, nodePositions, totalNodes]);

  if (activeNodeIndex >= totalNodes || !nodePositions[activeNodeIndex]) {
    return null;
  }

  const pos = nodePositions[activeNodeIndex];

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        x: pos.x - 14,
        y: pos.y - 14 - (isMobile ? 0 : 16),
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 0.5,
      }}
      style={{
        width: 28,
        height: 28,
      }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_24px_rgba(34,211,238,0.3)] flex items-center justify-center">
        <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white/80" strokeWidth={1.5} />
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Workflow = () => {
  const sectionRef = useRef(null);
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [nodePositions, setNodePositions] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  const totalNodes = workflowNodes.length;

  // Check for reduced motion preference
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

  // Complete animation
  const completeAnimation = useCallback(() => {
    setActiveNodeIndex(totalNodes);
    setIsAnimating(false);
    setHasCompleted(true);
    setIsPaused(false);
    clearTimeout(timeoutRef.current);
  }, [totalNodes]);

  // Advance to next node
  const advanceNode = useCallback(() => {
    setActiveNodeIndex(prev => {
      const next = prev + 1;
      if (next >= totalNodes) {
        completeAnimation();
        return prev;
      }
      return next;
    });
  }, [totalNodes, completeAnimation]);

  // Continue animation after pause
  const continueAnimation = useCallback(() => {
    if (activeNodeIndex >= totalNodes - 1) {
      completeAnimation();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (!isPaused && isInView) {
        advanceNode();
      }
    }, 400);
  }, [activeNodeIndex, isPaused, isInView, advanceNode, completeAnimation, totalNodes]);

  // Start the full animation
  const startAnimation = useCallback(() => {
    if (reducedMotion) {
      setActiveNodeIndex(totalNodes);
      setHasCompleted(true);
      return;
    }

    setIsAnimating(true);
    setHasCompleted(false);
    setActiveNodeIndex(0);
    setIsPaused(false);

    const scheduleNextNode = (index) => {
      if (index >= totalNodes) {
        completeAnimation();
        return;
      }

      timeoutRef.current = setTimeout(() => {
        if (!isPaused && isInView) {
          const next = index + 1;
          setActiveNodeIndex(next);
          if (next < totalNodes) {
            scheduleNextNode(next);
          } else {
            completeAnimation();
          }
        } else if (isPaused) {
          timeoutRef.current = setTimeout(() => {
            if (!isPaused && isInView) {
              setActiveNodeIndex(index + 1);
              scheduleNextNode(index + 1);
            }
          }, 200);
        }
      }, index === 0 ? 300 : 600);
    };

    scheduleNextNode(0);
  }, [reducedMotion, totalNodes, isPaused, isInView, completeAnimation]);

  // Intersection Observer
  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting;
        const ratio = entry.intersectionRatio;

        setIsInView(isVisible);

        if (isVisible && ratio >= 0.5 && !hasCompleted && !isAnimating && activeNodeIndex === -1) {
          startAnimation();
        }
        
        if (!isVisible && isAnimating) {
          setIsPaused(true);
          clearTimeout(timeoutRef.current);
        }
        
        if (isVisible && isPaused && isAnimating) {
          setIsPaused(false);
          continueAnimation();
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reducedMotion, isAnimating, hasCompleted, activeNodeIndex, startAnimation, continueAnimation, isPaused]);

  // Reset and replay
  const handleReplay = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setActiveNodeIndex(-1);
    setIsAnimating(false);
    setHasCompleted(false);
    setIsPaused(false);
    
    setTimeout(() => {
      startAnimation();
    }, 300);
  }, [startAnimation]);

  // Calculate node positions for the orb
  const updateNodePositions = useCallback(() => {
    const positions = {};
    const nodes = sectionRef.current?.querySelectorAll('[data-node-id]');
    if (nodes) {
      nodes.forEach((node) => {
        const id = node.getAttribute('data-node-id');
        const rect = node.getBoundingClientRect();
        const sectionRect = sectionRef.current?.getBoundingClientRect();
        if (sectionRect) {
          positions[id] = {
            x: rect.left - sectionRect.left + rect.width / 2,
            y: rect.top - sectionRect.top + rect.height / 2,
          };
        }
      });
    }
    setNodePositions(positions);
  }, []);

  // Update positions on resize
  useEffect(() => {
    updateNodePositions();
    window.addEventListener('resize', updateNodePositions);
    return () => window.removeEventListener('resize', updateNodePositions);
  }, [updateNodePositions]);

  // If reduced motion, show all nodes completed
  useEffect(() => {
    if (reducedMotion) {
      setActiveNodeIndex(totalNodes);
      setHasCompleted(true);
    }
  }, [reducedMotion, totalNodes]);

  // Announce changes for screen readers
  const getActiveNodeName = () => {
    if (activeNodeIndex >= 0 && activeNodeIndex < totalNodes) {
      return workflowNodes[activeNodeIndex].title;
    }
    if (activeNodeIndex >= totalNodes) {
      return "Complete";
    }
    return "Waiting to start";
  };

  return (
    <section 
      id="workflow"
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0c] overflow-hidden py-16 sm:py-20 lg:py-24"
      aria-label="How Ciel Thinks - Workflow pipeline"
    >
      {/* Section color boundary - top fade */}
      <div 
        className="absolute top-0 left-0 right-0 h-[80px] sm:h-[120px] lg:h-[150px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, transparent 0%, rgba(139, 92, 246, 0.03) 100%)",
        }}
      />

      {/* Section color boundary - bottom fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[80px] sm:h-[120px] lg:h-[150px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(34, 211, 238, 0.03) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-[#0d0d10] px-3 sm:px-3.5 py-1.5 backdrop-blur-sm mb-4 sm:mb-6">
            <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-violet-400/60" />
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              How Ciel Thinks
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white leading-[1.08]">
            From prompt to
            <br />
            <span className="font-medium">intelligent response.</span>
          </h2>

          <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/40 leading-relaxed">
            Watch how your request flows through Ciel's multi-agent pipeline,
            with each specialized component working in harmony.
          </p>

          {/* Subtle visual bridge */}
          <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-px bg-white/5" />
        </div>

        {/* Workflow Pipeline */}
        <div className="relative">
          {/* Status indicator for screen readers */}
          <div className="sr-only" aria-live="polite">
            {isAnimating ? `Processing: ${getActiveNodeName()}` : 
             hasCompleted ? "Workflow complete" : 
             activeNodeIndex === -1 ? "Ready to start" : "Workflow idle"}
          </div>

          {/* Desktop Layout - Horizontal */}
          <div className="hidden md:block">
            <div className="relative flex items-center justify-center gap-4 lg:gap-6 py-8 lg:py-12">
              {workflowNodes.map((node, index) => (
                <div key={node.id} className="flex items-center gap-4 lg:gap-6">
                  <div data-node-id={node.id}>
                    <WorkflowNode
                      node={node}
                      index={index}
                      totalNodes={totalNodes}
                      isActive={activeNodeIndex === index}
                      isCompleted={activeNodeIndex > index}
                    />
                  </div>
                  
                  {/* Connector line */}
                  {index < totalNodes - 1 && (
                    <div className="w-8 sm:w-10 lg:w-12 h-px relative flex-shrink-0">
                      <ConnectingLine
                        fromIndex={index}
                        toIndex={index + 1}
                        totalNodes={totalNodes}
                        activeNodeIndex={activeNodeIndex}
                        isMobile={false}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout - Vertical */}
          <div className="md:hidden">
            <div className="relative flex flex-col items-center gap-0 py-6 sm:py-8">
              {workflowNodes.map((node, index) => (
                <div key={node.id} className="w-full flex flex-col items-center">
                  <div data-node-id={node.id} className="w-full max-w-[160px] sm:max-w-[200px]">
                    <WorkflowNode
                      node={node}
                      index={index}
                      totalNodes={totalNodes}
                      isActive={activeNodeIndex === index}
                      isCompleted={activeNodeIndex > index}
                    />
                  </div>
                  
                  {/* Connector line */}
                  {index < totalNodes - 1 && (
                    <div className="h-8 sm:h-10 w-px relative flex-shrink-0">
                      <ConnectingLine
                        fromIndex={index}
                        toIndex={index + 1}
                        totalNodes={totalNodes}
                        activeNodeIndex={activeNodeIndex}
                        isMobile={true}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Request Orb */}
          {!reducedMotion && isAnimating && activeNodeIndex >= 0 && activeNodeIndex < totalNodes && (
            <RequestOrb
              nodePositions={nodePositions}
              activeNodeIndex={activeNodeIndex}
              totalNodes={totalNodes}
              isMobile={isMobile}
            />
          )}

          {/* Replay Button */}
          {(hasCompleted || activeNodeIndex >= 0) && (
            <div className="flex justify-center mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReplay}
                className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-xs sm:text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
              >
                <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:rotate-[-180deg]" />
                <span>{hasCompleted ? "Replay Workflow" : "Reset"}</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Workflow;