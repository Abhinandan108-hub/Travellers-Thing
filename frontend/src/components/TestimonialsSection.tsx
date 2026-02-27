import { useState, useEffect, useCallback } from "react";
import { useFadeUp } from "@/hooks/use-fade-up";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Travel Blogger",
    text: "Wanderlust made our honeymoon absolutely magical. Every detail was perfectly planned, from the private villa in Bali to the sunset dinner cruise. Couldn't recommend them enough!",
    initials: "SM",
  },
  {
    name: "David Chen",
    role: "Photographer",
    text: "As a travel photographer, I've worked with many agencies. Wanderlust stands apart with their attention to unique, off-the-beaten-path experiences. Truly exceptional service.",
    initials: "DC",
  },
  {
    name: "Priya Sharma",
    role: "Adventure Enthusiast",
    text: "The Swiss Alps package was beyond our expectations. The guides were knowledgeable, the accommodations were luxurious, and the itinerary was perfectly paced.",
    initials: "PS",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const ref = useFadeUp();

  const next = useCallback(() => setCurrent((c) => (c + 1) % testimonials.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <section className="section-padding" ref={ref}>
      <div className="container-wide max-w-[800px]">
        <div className="text-center mb-14 fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4">
            What Travelers Say
          </h2>
          <p className="text-muted-foreground">
            Real stories from real adventurers who traveled with us.
          </p>
        </div>

        <div className="fade-up relative">
          <div className="bg-background rounded-lg shadow-lg p-8 md:p-12 text-center">
            <Quote className="h-8 w-8 text-primary/30 mx-auto mb-6" />
            <p className="text-foreground italic text-lg leading-relaxed mb-8">
              "{t.text}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {t.initials}
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={prev}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-border"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
