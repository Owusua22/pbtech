import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import buildingImage from '../assets/building.jpg';
import buildingImage2 from '../assets/home.jpg';
import buildingImage3 from '../assets/slide2.jpg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Reliable Construction Services",
      subtitle: "Building Excellence Since 1998",
      backgroundImage: buildingImage,
    },
    {
      id: 2,
      title: "Quality Craftsmanship",
      subtitle: "Your Vision, Our Expertise",
      backgroundImage: buildingImage2,
    },
    {
      id: 3,
      title: "Modern Infrastructure",
      subtitle: "Innovative Solutions for Tomorrow",
      backgroundImage: buildingImage3,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Carousel Container */}
      <div className="relative h-screen max-h-[700px] min-h-[500px]">
        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl font-light opacity-90">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                currentSlide === index
                  ? "bg-white shadow-lg scale-125"
                  : "bg-white/50 hover:bg-white/75 hover:scale-110"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Optional: Statistics Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold text-orange-500 mb-2">147</div>
              <div className="text-lg">Completed Projects</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold text-orange-500 mb-2">25</div>
              <div className="text-lg">Years Experience</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold text-orange-500 mb-2">98%</div>
              <div className="text-lg">Client Satisfaction</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-lg">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;