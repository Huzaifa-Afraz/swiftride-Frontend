import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">SwiftRide</h2>
          <p className="text-sm leading-relaxed mb-6">
            Experience the freedom of the road with SwiftRide. We connect you with 
            verified hosts for seamless, premium car rentals across the country.
          </p>
          <div className="flex space-x-4">
            <Facebook className="w-5 h-5 hover:text-indigo-400 cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-indigo-400 cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-indigo-400 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Press</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Trust & Safety</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>123 Blue Area, Islamabad</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-indigo-500" />
              <span>+92 300 1234567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-indigo-500" />
              <span>support@swiftride.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs">
        &copy; {new Date().getFullYear()} SwiftRide Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;