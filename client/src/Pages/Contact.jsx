import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Mail, MapPin, Clock, Calendar, MessageSquare, Send, CheckCircle } from "lucide-react";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import FooterSection from "../Component/FooterSection";
import { addAppointment, clearStatus } from "../Redux/Slice/appointmentSlice";

const Contact = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { loading, error, success } = useSelector((state) => state.appointments || {});
  
  const WHATSAPP_NUMBER = "233244245257"; // WhatsApp number without + or spaces
  const PHONE_NUMBER = "+233 244 245 257";
  const EMAIL_ADDRESS = "pbtechconst@gmail.com";
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: ''
  });

  const [appointmentData, setAppointmentData] = useState({
    contactNumber: '',
    mode: 'In-Person',
    date: '',
    timeSlot: '',
    address: '',
    city: '',
    region: '',
  });

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [activeTab, setActiveTab] = useState('contact');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState('');

  // Update timeSlot when both times are selected
  useEffect(() => {
    if (startTime && endTime) {
      const formattedStartTime = startTime.format("hh:mm A");
      const formattedEndTime = endTime.format("hh:mm A");
      setAppointmentData(prev => ({
        ...prev,
        timeSlot: `${formattedStartTime} - ${formattedEndTime}`
      }));
    }
  }, [startTime, endTime]);

  // Handle appointment success
  useEffect(() => {
    if (success) {
      setSuccessMessage('Appointment booked successfully! We will confirm your appointment shortly.');
      setShowSuccessModal(true);
      setAppointmentData({
        contactNumber: '',
        mode: 'In-Person',
        date: '',
        timeSlot: '',
        address: '',
        city: '',
        region: '',
      });
      setStartTime(null);
      setEndTime(null);
      dispatch(clearStatus());
    }
  }, [success, dispatch]);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello! I'd like to inquire about your construction services.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${EMAIL_ADDRESS}`;
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'contact') {
      setFormData(prev => ({ ...prev, [name]: value }));
      setMessageError('');
    } else {
      setAppointmentData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setMessageError('Please fill in all required fields');
      return;
    }

    setMessageLoading(true);
    setMessageError('');

    try {
      // Send message to backend
      const response = await fetch('/api/contact/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Thank you for your message! We will get back to you soon.');
        setShowSuccessModal(true);
        setFormData({
          name: '', email: '', phone: '', subject: '', message: '', service: ''
        });
      } else {
        const data = await response.json();
        setMessageError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setMessageError('An error occurred. Please try again later.');
    } finally {
      setMessageLoading(false);
    }
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setMessageError('Please log in to book an appointment');
      return;
    }

    // Check if time is selected
    if (!startTime || !endTime) {
      setMessageError('Please select both start and end time');
      return;
    }

    // Prepare appointment payload matching schema exactly
    const appointmentPayload = {
      user: user?._id || user?.id,
      contactNumber: appointmentData.contactNumber,
      mode: appointmentData.mode,
      date: appointmentData.date,
      timeSlot: appointmentData.timeSlot,
      location: {
        address: appointmentData.address,
        city: appointmentData.city,
        region: appointmentData.region,
      }
    };

    dispatch(addAppointment(appointmentPayload));
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Our Address",
      info: "Kumasi, Ashanti Region, Ghana",
      subInfo: "Visit our office for consultation",
      clickable: false
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Us",
      info: PHONE_NUMBER,
      subInfo: "Mon - Fri: 8:00 AM - 6:00 PM",
      clickable: true,
      onClick: handlePhoneClick
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Us",
      info: EMAIL_ADDRESS,
      subInfo: "We'll respond within 24 hours",
      clickable: true,
      onClick: handleEmailClick
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Working Hours",
      info: "Mon - Fri: 8:00 AM - 6:00 PM",
      subInfo: "Sat: 9:00 AM - 4:00 PM",
      clickable: false
    }
  ];

  const services = [
    "Building Construction",
    "Renovation and Remodeling", 
    "Project Management",
    "Consulting Services",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-fadeIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={closeSuccessModal}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-blue-50 to-orange-50 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=800&fit=crop')"
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
                We're Here to Help
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-blue-900 mb-6 leading-tight">
                Get In Touch
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Ready to start your construction project? Contact us today for a consultation.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full transform hover:scale-105 transition-transform duration-300">
                <div className="border-t-4 border-orange-500 pt-6">
                  <div className="text-center space-y-6">
                    <h3 className="text-blue-900 font-bold text-xl">Quick Contact</h3>
                    <div className="space-y-4">
                      <button 
                        onClick={handlePhoneClick}
                        className="w-full flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-300"
                      >
                        <Phone className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">{PHONE_NUMBER}</span>
                      </button>
                      <button 
                        onClick={handleEmailClick}
                        className="w-full flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-300"
                      >
                        <Mail className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">{EMAIL_ADDRESS}</span>
                      </button>
                    </div>
                    <button 
                      onClick={handlePhoneClick}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                    >
                      Call Now
                    </button>
                    <button 
                      onClick={handleWhatsAppClick}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>WhatsApp Us Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                onClick={info.clickable ? info.onClick : undefined}
                className={`text-center bg-white rounded-xl border-2 border-gray-100 p-8 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 ${
                  info.clickable ? 'cursor-pointer' : ''
                }`}
              >
                <div className="text-orange-500 group-hover:text-blue-900 transition-colors duration-300 flex justify-center mb-6 transform group-hover:scale-110">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">{info.title}</h3>
                <p className={`text-gray-900 font-semibold mb-2 ${info.clickable ? 'group-hover:text-orange-600' : ''}`}>
                  {info.info}
                </p>
                <p className="text-gray-600 text-sm">{info.subInfo}</p>
                {info.clickable && (
                  <p className="text-orange-500 text-xs mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to {info.title.toLowerCase()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Appointment Booking */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
              Get Started Today
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
              Let's Build Something Amazing
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose how you'd like to connect with us
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === 'contact' 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105' 
                      : 'text-blue-900 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
                <button
                  onClick={() => setActiveTab('appointment')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === 'appointment' 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105' 
                      : 'text-blue-900 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>

            {/* Contact Form */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
                <h3 className="text-3xl font-bold text-blue-900 mb-2 text-center">Send Us a Message</h3>
                <p className="text-gray-600 text-center mb-8">We'll get back to you within 24 hours</p>
                
                {messageError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                    <p className="text-red-700 font-medium">{messageError}</p>
                  </div>
                )}

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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="+233 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Service Interested In</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={(e) => handleInputChange(e, 'contact')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="How can we help you?"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your project requirements..."
                    ></textarea>
                  </div>

                  <div className="text-center pt-4">
                    <button
                      onClick={handleContactSubmit}
                      disabled={messageLoading}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-12 py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                    >
                      <Send className="w-5 h-5" />
                      <span>{messageLoading ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appointment Booking Form */}
            {activeTab === 'appointment' && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
                <h3 className="text-3xl font-bold text-blue-900 mb-2 text-center">Book an Appointment</h3>
                <p className="text-gray-600 text-center mb-8">Schedule a consultation with our team</p>
                
                {!user && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
                    <p className="text-yellow-700 font-medium">Please log in to book an appointment</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {messageError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                    <p className="text-red-700 font-medium">{messageError}</p>
                  </div>
                )}

                <form onSubmit={handleAppointmentSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Contact Number *</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={appointmentData.contactNumber}
                        onChange={(e) => handleInputChange(e, 'appointment')}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="+233 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Appointment Mode *</label>
                      <select
                        name="mode"
                        value={appointmentData.mode}
                        onChange={(e) => handleInputChange(e, 'appointment')}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="In-Person">In-Person</option>
                        <option value="Virtual">Virtual</option>
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Time Slot *</label>
                      <div className="flex gap-2 items-center">
                        <TimePicker
                          use12Hours
                          format="h:mm A"
                          placeholder="Start"
                          value={startTime}
                          onChange={setStartTime}
                          className="flex-1"
                        />
                        <span className="text-gray-500">to</span>
                        <TimePicker
                          use12Hours
                          format="h:mm A"
                          placeholder="End"
                          value={endTime}
                          onChange={setEndTime}
                          className="flex-1"
                        />
                      </div>
                      {appointmentData.timeSlot && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected: {appointmentData.timeSlot}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Location Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={appointmentData.address}
                          onChange={(e) => handleInputChange(e, 'appointment')}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={appointmentData.city}
                          onChange={(e) => handleInputChange(e, 'appointment')}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Region</label>
                        <input
                          type="text"
                          name="region"
                          value={appointmentData.region}
                          onChange={(e) => handleInputChange(e, 'appointment')}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="Region"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      disabled={loading || !user}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-12 py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>{loading ? 'Booking...' : 'Book Appointment'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

    <FooterSection/>
    </div>
  );
};

export default Contact;