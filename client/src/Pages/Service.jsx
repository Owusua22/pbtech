import React from "react";
import { Search, Phone, Building2, RefreshCw, ClipboardList, MessageCircle, Star, Users, Lightbulb, ThumbsUp, Mail, MapPin } from "lucide-react";
import Project from '../assets/escavator.jpeg';
import FooterSection from "../Component/FooterSection";
const Services = () => {
  const services = [
    {
      icon: <Building2 className="w-12 h-12" />,
      title: "Building Construction",
      description: "We construct residential, commercial, and industrial buildings, ensuring timely completion and exceptional quality.",
      features: ["Residential Buildings", "Commercial Structures", "Industrial Facilities", "Quality Assurance"]
    },
    {
      icon: <RefreshCw className="w-12 h-12" />,
      title: "Renovation and Remodeling",
      description: "Our team renovates and remodels existing structures, enhancing their functionality, aesthetic appeal, and value.",
      features: ["Interior Renovation", "Exterior Upgrades", "Space Optimization", "Value Enhancement"]
    },
    {
      icon: <ClipboardList className="w-12 h-12" />,
      title: "Project Management",
      description: "We provide expert project management services, overseeing every aspect of the construction process to ensure seamless execution.",
      features: ["Timeline Management", "Budget Control", "Quality Oversight", "Risk Management"]
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: "Consulting Services",
      description: "Our experienced professionals offer consulting services, providing expert advice on construction-related matters.",
      features: ["Technical Consultation", "Design Review", "Cost Estimation", "Feasibility Studies"]
    }
  ];

  const whyChooseUs = [
    {
      icon: <Star className="w-10 h-10" />,
      title: "Quality and Reliability",
      description: "We prioritize quality and reliability, ensuring that our clients receive exceptional construction services."
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Experienced Team",
      description: "Our team of seasoned professionals has extensive experience in general building and construction."
    },
    {
      icon: <Lightbulb className="w-10 h-10" />,
      title: "Innovative Solutions",
      description: "We employ innovative construction techniques and materials, ensuring that our clients receive cutting-edge solutions."
    },
    {
      icon: <ThumbsUp className="w-10 h-10" />,
      title: "Customer Satisfaction",
      description: "We prioritize customer satisfaction, striving to exceed our clients' expectations in every project."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
    

      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-gray-100 overflow-hidden">
        {/* Background construction image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${Project})`
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold text-blue-900 mb-8 leading-tight">
                Our Services
              </h1>
            </div>

            {/* Right Content - Contact Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white shadow-2xl p-8 max-w-sm w-full">
                <div className="border-t-4 border-orange-500 pt-6">
                  <div className="text-center space-y-4">
                    <p className="text-blue-900 font-semibold text-sm uppercase tracking-wider">
                      Get a Quote Today
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2 text-lg text-blue-900">
                        <Phone className="w-5 h-5" />
                        <span>+233 123 456 789</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-lg text-blue-900">
                        <Mail className="w-5 h-5" />
                        <span>info@pbtech.com</span>
                      </div>
                    </div>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 transition-colors duration-300">
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
              What We Do
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
              Comprehensive Construction Services
            </h2>
            <p className="text-gray-700 text-xl leading-relaxed max-w-3xl mx-auto">
              We offer a comprehensive range of general building and construction services, 
              ensuring quality, reliability, and customer satisfaction in every project.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start space-x-6">
                  <div className="text-orange-500 group-hover:text-blue-900 transition-colors duration-300">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">{service.title}</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900">
              Why Choose P Btech?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="text-center group">
                <div className="bg-orange-500 text-white p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-900 transition-all duration-300 transform group-hover:-translate-y-2">
                  {reason.icon}
                </div>
                <h4 className="text-xl font-bold text-blue-900 mb-4">{reason.title}</h4>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
              Our Process
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900">
              How We Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Initial meeting to understand your vision and requirements" },
              { step: "02", title: "Planning", desc: "Detailed project planning and design development" },
              { step: "03", title: "Execution", desc: "Professional construction with quality oversight" },
              { step: "04", title: "Delivery", desc: "Final inspection and project handover" }
            ].map((process, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-blue-900 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  {process.step}
                </div>
                <h4 className="text-xl font-bold text-blue-900 mb-4">{process.title}</h4>
                <p className="text-gray-600 leading-relaxed">{process.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-orange-500 transform -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and let's discuss how we can bring your construction vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              Get Free Quote →
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-4 transition-all duration-300">
              View Portfolio
            </button>
          </div>
        </div>
      </section>
        <FooterSection/>
    </div>
  );
};

export default Services
;