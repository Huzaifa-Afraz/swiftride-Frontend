import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
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
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
            <li><Link to="/press" className="hover:text-white transition">Press</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
            <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/trust" className="hover:text-white transition">Trust & Safety</Link></li>
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