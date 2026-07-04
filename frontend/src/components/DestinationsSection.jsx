import { useFadeUp } from "@/hooks/use-fade-up";
import destSantorini from "@/assets/dest-santorini.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destSwiss from "@/assets/dest-swiss.jpg";
import destMaldives from "@/assets/dest-maldives.jpg";
const destinations = [
    { name: "Santorini", country: "Greece", image: destSantorini, trips: "120+ Trips" },
    { name: "Bali", country: "Indonesia", image: destBali, trips: "95+ Trips" },
    { name: "Swiss Alps", country: "Switzerland", image: destSwiss, trips: "80+ Trips" },
    { name: "Maldives", country: "Indian Ocean", image: destMaldives, trips: "150+ Trips" },
];
export default function DestinationsSection() {
    const ref = useFadeUp();
    return (<section id="destinations" className="section-padding" ref={ref}>
      <div className="container-wide">
        <div className="text-center mb-14 fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4">
            Popular Destinations
          </h2>
          <p className="text-muted-foreground max-w-[560px] mx-auto">
            Explore our hand-picked destinations loved by travelers worldwide.
            Your next adventure is just a click away.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {destinations.map((dest, i) => (<div key={dest.name} className="fade-up group relative rounded-lg overflow-hidden shadow-md cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="aspect-[3/4] overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent transition-opacity duration-300"/>
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="text-xl font-bold font-heading text-background">
                  {dest.name}
                </h3>
                <p className="text-sm text-background/70">
                  {dest.country} · {dest.trips}
                </p>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
