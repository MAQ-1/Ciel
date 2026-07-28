import { motion, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Orb from '../../ui/Orb';

const Hero = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const x = (e.clientX - centerX) / (rect.width / 2);
            const y = (e.clientY - centerY) / (rect.height / 2);
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <section
        id="hero"
        ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
            {/* Refined Cinematic Background */}
            
            {/* Soft radial lighting from the orb - cyan tone */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    scale: [0.98, 1.02, 0.98],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    background: "radial-gradient(ellipse 50% 50% at 70% 50%, rgba(0, 220, 220, 0.03) 0%, transparent 60%)",
                }}
            />
            
            {/* Complementary violet radial light */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    scale: [1.02, 0.98, 1.02],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                style={{
                    background: "radial-gradient(ellipse 45% 55% at 65% 45%, rgba(120, 80, 255, 0.015) 0%, transparent 55%)",
                }}
            />

            {/* Gentle left-side illumination to connect both halves */}
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    background: "radial-gradient(ellipse 40% 50% at 30% 50%, rgba(0, 200, 220, 0.01) 0%, transparent 50%)",
                }}
            />

            {/* Extremely subtle procedural noise texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.012]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Tiny static stars */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(7)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${15 + Math.random() * 70}%`,
                            top: `${20 + Math.random() * 60}%`,
                            width: "1px",
                            height: "1px",
                        }}
                        animate={{
                            opacity: [0.08, 0.15, 0.08],
                        }}
                        transition={{
                            duration: 6 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1.5,
                        }}
                    />
                ))}
            </div>

            {/* Subtle vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />

            <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col items-center justify-center px-6 py-24 lg:flex-row lg:gap-16 lg:px-12 xl:gap-24">
                {/* Left Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-xl pt-8 lg:max-w-2xl lg:pt-0"
                >
                    {/* Product Label - Clean, minimal, confident */}
                    <motion.div variants={itemVariants} className="mb-10">
                        <span className="text-xs font-medium tracking-[0.2em] text-white/30 uppercase">
                            Meet Ciel
                        </span>
                    </motion.div>

                    {/* Headline - Strong, product-focused */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.5rem] leading-[1.1]"
                    >
                        <span className="block">One Workspace.</span>
                        <span className="mt-1 block">
                            <span className="text-white">Infinite</span>
                            <span className="text-white/30 font-light"> Intelligence.</span>
                        </span>
                    </motion.h1>

                    {/* Subtitle - Explains what Ciel does */}
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-lg text-base text-white/40 leading-relaxed sm:text-lg"
                    >
                        Ciel intelligently routes every request to the right AI specialist—whether you're coding, researching, analyzing documents, creating presentations, or searching the web.
                    </motion.p>

                    {/* Primary CTA */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-10 flex flex-wrap items-center gap-4"
                    >
                        <motion.button
                            whileHover={{
                                scale: 1.02,
                                y: -1,
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/app")}
                            className="group relative flex items-center gap-2.5 rounded-lg bg-white px-7 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:bg-white/95"
                        >
                            <span>Launch Ciel</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </motion.button>
                    </motion.div>

                    {/* Product Status - Meaningful and specific */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-10 flex items-center gap-3 text-xs text-white/25"
                    >
                        <span>Powered by multiple AI specialists</span>
                        <span className="text-white/10">•</span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50 animate-pulse" />
                            Currently in Beta
                        </span>
                    </motion.div>
                </motion.div>

                {/* Right - Signature Animated Orb */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="relative mt-16 flex h-[380px] w-full items-center justify-center lg:mt-0 lg:h-[520px] lg:w-[520px]"
                >
                    {/* The Living Intelligence Orb */}
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Orb
                            hoverIntensity={2}
                            rotateOnHover
                            hue={0}
                            forceHoverState={false}
                            backgroundColor="#000000"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;