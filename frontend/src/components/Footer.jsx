import { Mail } from "lucide-react";
const quickLinks = ["About Us", "Destinations", "Packages", "Blog", "Contact"];
const contactInfo = [
    "123 Travel Street, Suite 400",
    "New York, NY 10001",
    "info@wanderlust.com",
    "+1 (555) 234-5678",
];
export default function Footer() {
    return (<footer id="contact" className="bg-footer-bg pt-20 pb-8">
      <div className="container-wide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold font-heading text-footer-heading mb-4">
              Wanderlust
            </h3>
            <p className="text-sm text-footer-foreground leading-relaxed">
              We craft extraordinary travel experiences that transform the way
              you see the world. Adventure awaits — let us guide you there.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-footer-heading mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (<li key={link}>
                  <a href="#" className="text-sm text-footer-foreground hover:text-footer-heading transition-colors duration-200">
                    {link}
                  </a>
                </li>))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-footer-heading mb-4">
              Contact Us
            </h4>
            <ul className="space-y-2.5">
              {contactInfo.map((line) => (<li key={line} className="text-sm text-footer-foreground">
                  {line}
                </li>))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-footer-heading mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-footer-foreground mb-4">
              Subscribe for exclusive deals and travel inspiration.
            </p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2.5 bg-footer-foreground/10 text-sm text-footer-heading placeholder:text-footer-foreground/50 rounded-l-md outline-none border border-footer-foreground/20 focus:border-primary transition-colors"/>
              <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-r-md hover:opacity-90 transition-opacity">
                <Mail className="h-4 w-4"/>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-footer-foreground/20 pt-6">
          <p className="text-center text-xs text-footer-foreground">
            © {new Date().getFullYear()} Wanderlust. All rights reserved.
          </p>
        </div>
      </div>
    </footer>);
}
