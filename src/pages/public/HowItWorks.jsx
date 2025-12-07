import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Car, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How SwiftRide Works</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Rent a car in minutes, not hours. See how easy it is to get on the road.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 md:order-1">
            <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-indigo-200">1</div>
            <h2 className="text-3xl font-bold mb-4">Find your perfect car</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Enter your dates and location to browse thousands of cars shared by local hosts. Filter by price, vehicle type, and features to find exactly what you need.
            </p>
            <div className="flex gap-2 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Real photos</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Transparent pricing</span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center order-1 md:order-2">
            <Search className="w-32 h-32 text-gray-300" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center">
            <Calendar className="w-32 h-32 text-gray-300" />
          </div>
          <div>
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-purple-200">2</div>
            <h2 className="text-3xl font-bold mb-4">Book instantly</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Book on the app or online. Verify your identity securely with our KYC system, pay via Easypaisa, and you're set. No paperwork lines.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-green-200">3</div>
            <h2 className="text-3xl font-bold mb-4">Hit the road</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Pick up the car from the host or have it delivered. Check in with the app, grab the keys, and enjoy your trip.
            </p>
            <Link to="/search" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
              Browse Cars Now
            </Link>
          </div>
          <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center order-1 md:order-2">
            <Car className="w-32 h-32 text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;