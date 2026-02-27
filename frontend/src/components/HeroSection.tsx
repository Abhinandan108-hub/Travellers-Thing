import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src={heroBg}
        alt="Beautiful tropical paradise"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[hsl(var(--hero-overlay)/0.4)]" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container-wide">
          <div className="max-w-[600px] text-left ml-0 lg:ml-[40px]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-[1.1] text-background mb-6">
              Explore The World With Wanderlust
            </h1>
            <p className="text-base sm:text-lg text-background/80 mb-8 max-w-[480px] leading-relaxed">
              Discover breathtaking destinations, curated travel packages, and
              unforgettable experiences that await you around the globe.
            </p>
            <a
              href="#destinations"
              className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-semibold text-sm rounded-pill hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Discover More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
