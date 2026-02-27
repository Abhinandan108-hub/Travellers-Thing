import { useFadeUp } from "@/hooks/use-fade-up";
import { ArrowRight } from "lucide-react";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const posts = [
  {
    image: blog1,
    date: "January 15, 2026",
    title: "10 Ancient Temples You Must Visit Before You Die",
    excerpt: "Discover the world's most awe-inspiring ancient temples, from hidden jungle ruins to cliff-top sanctuaries.",
  },
  {
    image: blog2,
    date: "February 3, 2026",
    title: "A Foodie's Guide to Southeast Asian Street Markets",
    excerpt: "Navigate the vibrant street food scene like a local with our insider tips and must-try dishes.",
  },
  {
    image: blog3,
    date: "February 10, 2026",
    title: "Solo Female Travel: Top Destinations for 2026",
    excerpt: "Empowering and safe destinations that every solo female traveler should add to their bucket list.",
  },
];

export default function BlogSection() {
  const ref = useFadeUp();

  return (
    <section id="blog" className="section-padding bg-stats-bg" ref={ref}>
      <div className="container-wide">
        <div className="text-center mb-14 fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4">
            Travel Stories & Tips
          </h2>
          <p className="text-muted-foreground">
            Inspiration and guides from our team of passionate explorers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {posts.map((post, i) => (
            <article
              key={post.title}
              className="fade-up bg-background rounded-lg overflow-hidden shadow-md group cursor-pointer"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="overflow-hidden aspect-[16/10]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  {post.date}
                </p>
                <h3 className="text-lg font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
