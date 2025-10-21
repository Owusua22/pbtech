import React, { useState } from "react";
import { Building2, Wrench, ClipboardList, MessageSquare, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ServicesSection = () => {

  const navigate = useNavigate();


  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      id: 1,
      icon: Building2,
      title: "Building Construction",
      description: "We construct residential, commercial, and industrial buildings, ensuring timely completion and exceptional quality.",
      features: [
        "Residential Buildings",
        "Commercial Structures",
        "Industrial Facilities",
        "Quality Assurance"
      ],
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100/50"
    },
    {
      id: 2,
      icon: Wrench,
      title: "Renovation & Remodeling",
      description: "Our team renovates and remodels existing structures, enhancing their functionality, aesthetic appeal, and value.",
      features: [
        "Interior Renovation",
        "Exterior Upgrades",
        "Space Optimization",
        "Modern Design"
      ],
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100/50"
    },
    {
      id: 3,
      icon: ClipboardList,
      title: "Project Management",
      description: "We provide expert project management services, overseeing every aspect of the construction process to ensure seamless execution.",
      features: [
        "Timeline Management",
        "Budget Control",
        "Quality Oversight",
        "Risk Mitigation"
      ],
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100/50"
    },
    {
      id: 4,
      icon: MessageSquare,
      title: "Consulting Services",
      description: "Our experienced professionals offer consulting services, providing expert advice on construction-related matters.",
      features: [
        "Technical Guidance",
        "Feasibility Studies",
        "Environmental Compliance",
        "Cost Estimation"
      ],
      gradient: "from-orange-600 to-orange-700",
      bgGradient: "from-orange-50 to-orange-100/50"
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-30 -z-10" />
      
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #1e40af 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-orange-200 to-orange-100 border border-orange-200 rounded-full">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">
              What We Do
            </span>
          </div>
          
          <h2 className="text-2xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-blue-900  mb-6">
            Our Services
          </h2>
          
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            We offer a comprehensive range of general building and construction services designed to bring your vision to life with precision and excellence
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredService === service.id;
            
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`relative bg-gradient-to-br ${service.gradient} p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon size={32} className="text-white" />
                      
                      {/* Icon Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                    </div>
                    
                    {/* Service Number */}
                    <div className="text-6xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors">
                      0{service.id}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-blue-900 mb-4 group-hover:text-blue-800 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300"
                        style={{ transitionDelay: `${idx * 50}ms` }}
                      >
                        <div className={`bg-gradient-to-br ${service.gradient} p-1 rounded-full`}>
                          <Check size={14} className="text-white" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  
                </div>

                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-5 rounded-bl-full transform scale-0 group-hover:scale-100 transition-transform duration-500`} />
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-3xl p-12 shadow-2xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, transparent 48%, white 48%, white 52%, transparent 52%)', backgroundSize: '20px 20px' }} />
          </div>

          <div className="relative text-center">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
              Let's transform your vision into reality. Contact us today for a free consultation and project estimate.
            </p>
            
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Get Started → Contact Page */}
      <button
        onClick={() => navigate("/contact")}
        className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          Get Started
          <ArrowRight
            size={20}
            className="transform group-hover:translate-x-1 transition-transform"
          />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* View Our Portfolio → Projects Page */}
      <button
        onClick={() => navigate("/projects")}
        className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:-translate-y-1"
      >
        View Our Portfolio
      </button>
    </div>
          </div>
        </div>

      
      </div>
    </section>
  );
};

export default ServicesSection;