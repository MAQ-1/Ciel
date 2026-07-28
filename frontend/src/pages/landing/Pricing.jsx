import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    amount: 0.3 
  });

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      tokens: "100 AI Tokens",
      description: "For individuals exploring Ciel",
      highlights: [
        "Basic AI Agents",
        "100 Tokens / month",
        "Community Support",
      ],
      cta: "Launch Ciel",
      recommended: false,
    },
    {
      name: "Starter",
      price: "₹199",
      period: "/month",
      tokens: "200 AI Tokens",
      description: "For professionals and teams",
      highlights: [
        "All Agents Unlimited",
        "Priority Processing",
        "30-day Conversation Memory",
        "Priority Support",
      ],
      cta: "Upgrade to Starter",
      recommended: true,
    },
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      tokens: "500 AI Tokens",
      description: "For growing organizations",
      highlights: [
        "Everything in Starter",
        "90-day Conversation Memory",
        "Custom AI Training",
        "24/7 Dedicated Support",
      ],
      cta: "Go Pro",
      recommended: false,
    },
  ];

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
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3 + (i * 0.12),
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const starterEmphasis = {
    initial: { y: 0, borderColor: "rgba(34, 211, 238, 0.3)" },
    animate: {
      y: -4,
      borderColor: "rgba(34, 211, 238, 0.5)",
      transition: {
        delay: 0.8,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Handle CTA click - all navigate to /app
  const handleCtaClick = () => {
    navigate("/app");
  };

  return (
    <section 
      id="pricing"
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0c] overflow-hidden py-16 sm:py-20 lg:py-24 xl:py-32"
      aria-label="Pricing Plans"
    >
      {/* Section color boundaries */}
      <div 
        className="absolute top-0 left-0 right-0 h-[80px] sm:h-[120px] lg:h-[150px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, transparent 0%, rgba(139, 92, 246, 0.03) 100%)",
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-[80px] sm:h-[120px] lg:h-[150px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(34, 211, 238, 0.03) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 lg:mb-16 xl:mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-[#0d0d10] px-3 sm:px-3.5 py-1.5 backdrop-blur-sm mb-4 sm:mb-6">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-cyan-400/60" />
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              Pricing
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white leading-[1.08]">
            Choose Your
            <br />
            <span className="font-medium">Plan.</span>
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/40 leading-relaxed">
            Start free, scale as you grow. All plans include access to 
            Ciel's multi-agent workspace.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-4xl mx-auto items-stretch"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              custom={index}
              variants={cardVariants}
              className={`relative rounded-xl border p-4 sm:p-5 lg:p-6 transition-all duration-300 flex flex-col ${
                plan.recommended 
                  ? "border-cyan-400/30 bg-[#0d0d10] shadow-[0_4px_24px_rgba(34,211,238,0.06)] sm:mt-[-8px] lg:mt-[-8px] order-first sm:order-none" 
                  : "border-white/5 bg-[#0d0d10]/50"
              } hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1`}
              animate={plan.recommended ? starterEmphasis : {}}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 text-[8px] sm:text-[10px] font-medium text-black whitespace-nowrap">
                  Recommended
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-[10px] sm:text-xs font-medium text-white/40 uppercase tracking-wider">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-2 sm:mt-3 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-white">
                  {plan.price}
                </span>
                <span className="text-xs sm:text-sm text-white/30">
                  {plan.period}
                </span>
              </div>

              {/* Tokens */}
              <p className="mt-1 text-xs sm:text-sm text-white/40">
                {plan.tokens}
              </p>

              {/* Description */}
              <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] text-white/40 leading-relaxed">
                {plan.description}
              </p>

              {/* Highlights - Limited to 3-4 items */}
              <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 flex-1">
                {plan.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-white/40">
                    <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 mt-0.5 text-cyan-400/60 shrink-0" strokeWidth={1.5} />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button - All navigate to /app */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCtaClick}
                className={`mt-4 sm:mt-6 w-full group inline-flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  plan.recommended
                    ? "bg-gradient-to-r from-cyan-400 to-violet-400 text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                    : "border border-white/10 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/[0.04] hover:border-white/20"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Bar - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-14 lg:mt-16 xl:mt-20 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-6 text-[10px] sm:text-xs lg:text-sm text-white/25">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
              No credit card required
            </span>
            <span className="hidden sm:inline w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
              Free forever on Free plan
            </span>
            <span className="hidden sm:inline w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
              Cancel anytime
            </span>
          </div>
        </motion.div>

        {/* Enterprise CTA - Clean */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-8 sm:mt-10 lg:mt-12 xl:mt-14 text-center"
        >
          <p className="text-xs sm:text-sm text-white/20">
            Need more?{" "}
            <a 
              href="#" 
              className="text-white/30 hover:text-white/60 transition-colors duration-200 underline-offset-2 hover:underline"
            >
              Contact our sales team
            </a>
            {" "}for enterprise pricing.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;