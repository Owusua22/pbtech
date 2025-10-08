import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import image from "../assets/const.jpeg";
import constructionImage from "../assets/escavator.jpeg";

const AboutSection = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleSeeMore = () => {
    navigate("/about"); // ✅ Navigate to the about page
  };

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Images */}
          <div className="relative">
            <div className="relative">
              <div className="absolute top-0 right-0 z-20 w-64 h-80 bg-white p-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src={image}
                  alt="construction engineer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-80 h-96 bg-white p-4 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <img
                  src={constructionImage}
                  alt="Construction excavator at work"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -top-4 -left-4 w-20 h-20 bg-orange-500 opacity-20 rounded-full"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-900 opacity-20 rounded-full"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="lg:pl-8">
            <div className="mb-4">
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
                About Us
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6 leading-tight">
              Welcome to P Btech
            </h2>

            <div className="space-y-4 mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                At P Btech, we specialize in delivering top-notch general building and 
                construction services. With a team of experienced professionals and a 
                commitment to excellence, we provide our clients with unparalleled quality, 
                reliability, and satisfaction.
              </p>
            </div>

            {/* ✅ Updated Button */}
            <button
              onClick={handleSeeMore}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-none transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              See more →
            </button>

            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">25+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">500+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
