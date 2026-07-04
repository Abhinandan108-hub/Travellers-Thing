import { useFadeUp } from "@/hooks/use-fade-up";
import { Check } from "lucide-react";
import packageImg from "@/assets/package-adventure.jpg";
const features = [
    "Handcrafted itineraries by travel experts",
    "Luxury accommodations & local experiences",
    "24/7 on-trip support & concierge service",
    "Flexible booking & free cancellation",
    "Small group sizes for intimate journeys",
];
export default function PackagesSection() {
    const ref = useFadeUp();
    return (<section id="packages" className="section-padding" ref={ref}>
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left image */}
          <div className="fade-up rounded-lg overflow-hidden shadow-lg">
            <img src={packageImg} alt="Adventure travel package" className="w-full h-[400px] lg:h-[520px] object-cover" loading="lazy"/>
          </div>

          {/* Right content */}
          <div className="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-5">
              Curated Travel Packages
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              From adrenaline-pumping adventures to serene cultural retreats, our
              packages are thoughtfully designed to give you the trip of a
              lifetime. Every detail is taken care of so you can focus on making
              memories.
            </p>

            <ul className="space-y-4 mb-10">
              {features.map((f) => (<li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary"/>
                  </span>
                  <span className="text-foreground text-sm">{f}</span>
                </li>))}
            </ul>

            <a href="#" className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-semibold text-sm rounded-pill hover:-translate-y-[2px] transition-all duration-300 shadow-md hover:shadow-lg">
              View All Packages
            </a>
          </div>
        </div>
      </div>
    </section>);
}
