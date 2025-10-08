import React from "react";
import { Facebook, Linkedin, Twitter, Instagram, ChevronUp, Mail, Phone, MapPin, Globe } from "lucide-react";

const FooterSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Services", href: "#" },
    { name: "Projects", href: "#" },
    { name: "Contact", href: "#" }
  ];

  const services = [
    "Building Construction",
    "Renovation & Remodeling",
    "Project Management",
    "Consulting Services"
  ];

  return (
    <footer className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <h3 className="text-2xl font-bold">P Btech</h3>
            </div>
            <p className="text-blue-200 leading-relaxed text-sm mb-6">
              Excellence in construction services with experienced professionals committed to quality and innovation.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Instagram, href: "#", label: "Instagram" }
              ].map(({ Icon, href, label }) => (
                <a 
                  key={label}
                  href={href} 
                  className="group relative bg-white/10 backdrop-blur-sm p-2.5 rounded-lg hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  aria-label={label}
                >
                  <Icon size={18} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service} className="text-blue-200 text-sm flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
              Get In Touch
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <MapPin size={16} className="text-orange-500" />
                </div>
                <span className="text-blue-200 text-sm leading-relaxed">Kumasi, Ashanti Region, Ghana</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <Phone size={16} className="text-orange-500" />
                </div>
                <a href="tel:+233244245257" className="text-blue-200 hover:text-white text-sm transition-colors">
                  +233 244 245 257
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <Mail size={16} className="text-orange-500" />
                </div>
                <a href="mailto:info@pbtech.com" className="text-blue-200 hover:text-white text-sm transition-colors">
                  info@pbtech.com
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <Globe size={16} className="text-orange-500" />
                </div>
                <a href="https://www.pbtech.com" className="text-blue-200 hover:text-white text-sm transition-colors">
                  www.pbtech.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-300 text-sm">
            © 2024 <span className="font-semibold text-white">P Btech</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-blue-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-blue-700">|</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-full hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-300 z-50 group"
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} className="group-hover:animate-bounce" />
      </button>
    </footer>
  );
};

export default FooterSection;