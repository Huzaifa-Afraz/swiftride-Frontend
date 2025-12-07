import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10 text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full border p-3 rounded-lg outline-none focus:ring-2 ring-indigo-500" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full border p-3 rounded-lg outline-none focus:ring-2 ring-indigo-500" placeholder="Your Email" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
              <textarea className="w-full border p-3 rounded-lg outline-none focus:ring-2 ring-indigo-500 h-32" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">Send Message</button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Info</h2>
            <p className="text-gray-600 mb-8">
              Have questions about booking a car or listing your fleet? Our team is available Mon-Fri, 9am to 6pm.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Email</h3>
              <p className="text-gray-600">support@swiftride.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Phone</h3>
              <p className="text-gray-600">+92 300 1234567</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Office</h3>
              <p className="text-gray-600">Plot 5, Blue Area, Islamabad, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;