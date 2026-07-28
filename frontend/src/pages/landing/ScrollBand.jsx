import ScrollVelocity from "../../ui/ScrollVelocity";

const ScrollBand = () => {
  return (
    <section className="relative py-8 md:py-12 overflow-hidden bg-[#0a0a0c] border-y border-white/5 group">
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-[#0a0a0c] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-[#0a0a0c] to-transparent pointer-events-none z-10" />

      <div className="space-y-3 md:space-y-4 [&_*]:transition-[animation-play-state] group-hover:[&_*]:![animation-play-state:paused]">
        {/* Row 1 - scrolls left, violet/cyan gradient */}
        <ScrollVelocity
          texts={[
            "ONE WORKSPACE · INFINITE INTELLIGENCE · CHAT · ROUTER · CODE · SEARCH · PDF · PPT · VISION · MULTI-AGENT AI · SMART AUTOMATION"
          ]}
          velocity={20}
          className="bg-gradient-to-r from-white/30 via-violet-200/40 to-cyan-200/30 bg-clip-text text-transparent font-light text-sm md:text-base tracking-[0.4em] uppercase whitespace-nowrap"
          numCopies={8}
          damping={50}
          stiffness={250}
        />

        {/* Row 2 - scrolls right (opposite), amber/rose gradient, slightly dimmer */}
        <ScrollVelocity
          texts={[
            "ONE WORKSPACE · INFINITE INTELLIGENCE · CHAT · ROUTER · CODE · SEARCH · PDF · PPT · VISION · MULTI-AGENT AI · SMART AUTOMATION"
          ]}
          velocity={-16}
          className="bg-gradient-to-r from-amber-200/20 via-rose-200/25 to-white/20 bg-clip-text text-transparent font-light text-xs md:text-sm tracking-[0.35em] uppercase whitespace-nowrap"
          numCopies={8}
          damping={50}
          stiffness={250}
        />
      </div>
    </section>
  );
};

export default ScrollBand;