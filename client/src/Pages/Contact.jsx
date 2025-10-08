import React, { useState } from "react";
import { Search, Phone, Mail, MapPin, Clock, Calendar, User, MessageSquare, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: ''
  });

  const [appointmentData, setAppointmentData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    message: ''
  });

  const [activeTab, setActiveTab] = useState('contact');

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'contact') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setAppointmentData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    if (formType === 'contact') {
      console.log('Contact form submitted:', formData);
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '', email: '', phone: '', subject: '', message: '', service: ''
      });
    } else {
      console.log('Appointment booked:', appointmentData);
      alert('Appointment booked successfully! We will confirm your appointment shortly.');
      setAppointmentData({
        name: '', email: '', phone: '', date: '', time: '', service: '', message: ''
      });
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Our Address",
      info: "Kumasi, Ashanti Region, Ghana",
      subInfo: "Visit our office for consultation"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Us",
      info: "+233 123 456 789",
      subInfo: "Mon - Fri: 8:00 AM - 6:00 PM"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Us",
      info: "info@pbtech.com",
      subInfo: "We'll respond within 24 hours"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Working Hours",
      info: "Mon - Fri: 8:00 AM - 6:00 PM",
      subInfo: "Sat: 9:00 AM - 4:00 PM"
    }
  ];

  const services = [
    "Building Construction",
    "Renovation and Remodeling", 
    "Project Management",
    "Consulting Services",
    "Other"
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  return (
    <div className="min-h-screen bg-white">
    

      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-gray-100 overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=800&fit=crop')"
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold text-blue-900 mb-8 leading-tight">
                Contact Us
              </h1>
            </div>

            {/* Right Content - Quick Contact Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white shadow-2xl p-8 max-w-sm w-full">
                <div className="border-t-4 border-orange-500 pt-6">
                  <div className="text-center space-y-4">
                    <p className="text-blue-900 font-semibold text-sm uppercase tracking-wider">
                      Get In Touch
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
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="text-orange-500 group-hover:text-blue-900 transition-colors duration-300 flex justify-center mb-6">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">{info.title}</h3>
                <p className="text-gray-900 font-semibold mb-2">{info.info}</p>
                <p className="text-gray-600 text-sm">{info.subInfo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Appointment Booking */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
              Get In Touch
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900">
              Let's Start Your Project
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-md">
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                    activeTab === 'contact' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-blue-900 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Send Message
                </button>
                <button
                  onClick={() => setActiveTab('appointment')}
                  className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                    activeTab === 'appointment' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-blue-900 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Contact Form */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Send us a Message</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange(e, 'contact')}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e, 'contact')}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange(e, 'contact')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="+233 xxx xxx xxx"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Service Interested In</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={(e) => handleInputChange(e, 'contact')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select a service</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange(e, 'contact')}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange(e, 'contact')}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Tell us about your project requirements..."
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={(e) => handleSubmit(e, 'contact')}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Send className="w-5 h-5 inline mr-2" />
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appointment Booking Form */}
            {activeTab === 'appointment' && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Book an Appointment</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={appointmentData.name}
                        onChange={(e) => handleInputChange(e, 'appointment')}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={appointmentData.email}
                        onChange={(e) => handleInputChange(e, 'appointment')}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={appointmentData.phone}
                        onChange={(e) => handleInputChange(e, 'appointment')}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="+233 xxx xxx xxx"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Service Type *</label>
                      <select
                        name="service"
                        value={appointmentData.service}
                        onChange={(e) => handleInputChange(e, 'appointment')}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select a service</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Preferred Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={appointmentData.date}
                        onChange={(e) => handleInputChange(e, 'appointment')}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Preferred Time *</label>
                      <select
                        name="time"
                        value={appointmentData.time}
                        onChange={(e) => handleInputChange(e, 'appointment')}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time, index) => (
                          <option key={index} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Additional Notes</label>
                    <textarea
                      name="message"
                      value={appointmentData.message}
                      onChange={(e) => handleInputChange(e, 'appointment')}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Any specific requirements or questions..."
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={(e) => handleSubmit(e, 'appointment')}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Calendar className="w-5 h-5 inline mr-2" />
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Find Us</h2>
            <p className="text-gray-600">Visit our office for a face-to-face consultation</p>
          </div>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive Map Coming Soon</p>
              <p className="text-sm text-gray-500 mt-2">Kumasi, Ashanti Region, Ghana</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;