import React from "react";
import { Search, Phone, Target, Eye, Heart, Shield, Award, Users } from "lucide-react";
import FooterSection from "../Component/FooterSection";
import Builds from '../assets/team.jpeg';

const About = () => {
  const coreValues = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "We maintain the highest standards in every project, ensuring superior quality and craftsmanship in all our work."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Integrity",
      description: "We conduct business with honesty and transparency, building trust through reliable and ethical practices."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer Focus",
      description: "Our clients are at the heart of everything we do. We prioritize their needs and exceed their expectations."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Teamwork",
      description: "We believe in collaborative efforts, leveraging our collective expertise to deliver outstanding results."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
     

      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-gray-100 overflow-hidden">
        {/* Background architectural image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop')"
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold text-blue-900 mb-8 leading-tight">
                About us
              </h1>
            </div>

            {/* Right Content - Call Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white shadow-2xl p-8 max-w-sm w-full">
                <div className="border-t-4 border-orange-500 pt-6">
                  <div className="text-center">
                    <p className="text-blue-900 font-semibold text-sm uppercase tracking-wider mb-4">
                      Call us today
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-3xl font-bold text-blue-900">
                      <Phone className="w-8 h-8" />
                      <span>+233 244 245 257</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Image */}
            <div className="relative">
              <img
                src={Builds}
                alt="Construction team"
                className="w-full h-[600px] object-cover shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500 opacity-20"></div>
            </div>

            {/* Right Content */}
            <div>
              <div className="mb-6">
                <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
                  About Us
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-8 leading-tight">
                We are providing the best customer service
              </h2>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  At <strong>P Btech</strong>, we specialize in delivering <strong>top-notch general building and construction services</strong> designed to turn visions into reality. With a team of highly skilled professionals and years of hands-on experience, we pride ourselves on combining <strong>innovation, craftsmanship, and reliability</strong> in every project we undertake.
                </p>
                
                <p>
                  From <strong>residential homes</strong> to <strong>commercial developments</strong> and <strong>large-scale infrastructure</strong>, our work is guided by a commitment to <strong>excellence, durability, and customer satisfaction</strong>. We don't just build structures—we build long-lasting relationships with our clients by ensuring every detail meets the highest standards.
                </p>
                
                <p>
                  Whether you're planning a <strong>new construction project, renovation, or expansion</strong>, P Btech is your trusted partner for delivering results <strong>on time, within budget, and beyond expectations</strong>. With us, you're not just investing in construction; you're investing in <strong>quality, integrity, and peace of mind</strong>.
                </p>
              </div>

              <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-none transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              Contact Us →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Target className="w-12 h-12 text-orange-500 mr-4" />
                <h3 className="text-3xl font-bold text-blue-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our mission is to become the go-to construction partner for individuals, businesses, and organizations seeking exceptional building solutions. We strive to exceed our clients' expectations by providing innovative, efficient, and cost-effective construction services.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-6">
                <Eye className="w-12 h-12 text-orange-500 mr-4" />
                <h3 className="text-3xl font-bold text-blue-900">Our Vision</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                To be recognized as the leading construction company in Ghana and beyond, setting industry standards for quality, innovation, and customer service. We envision a future where our constructions stand as testaments to excellence and contribute to sustainable community development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
              Our Values
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900">
              Core Values That Drive Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="bg-orange-500 text-white p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-900 transition-colors duration-300">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-blue-900 mb-4">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-orange-500 mb-4">150+</div>
              <div className="text-xl">Projects Completed</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-orange-500 mb-4">25+</div>
              <div className="text-xl">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-orange-500 mb-4">98%</div>
              <div className="text-xl">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-orange-500 mb-4">50+</div>
              <div className="text-xl">Expert Team</div>
            </div>
          </div>
        </div>
      </section>
      <FooterSection/>

    </div>
  );
};

export default About;