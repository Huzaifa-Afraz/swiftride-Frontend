import React, { useEffect, useState } from 'react';
import { carService } from '../../services/carService';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search State (Visual only for now, but wired to UI)
  const [location, setLocation] = useState('');
  const [make, setMake] = useState('');

  useEffect(() => {
    // Fetch cars from your API
    carService.getCars({ page: 1, limit: 6 }) // Limiting to top 6 for the homepage
      .then(res => {
        setCars(res.data.docs || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white py-24 lg:py-32 overflow-hidden">
        {/* Background Pattern/Image overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-6">
            The #1 Car Rental Marketplace
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Drive the car you've <br /> always wanted.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Choose from thousands of unique cars for your next trip. 
            From daily drivers to luxury weekends, we have it all.
          </p>
        </div>
      </div>

      {/* 2. SEARCH BAR (Floating) */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-4 items-end border border-gray-100">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location</label>
            <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3 border focus-within:ring-2 ring-indigo-500 focus-within:border-transparent transition">
              <MapPin className="text-indigo-500 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Car Make</label>
            <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3 border focus-within:ring-2 ring-indigo-500 focus-within:border-transparent transition">
              <Search className="text-indigo-500 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="e.g. Toyota, Honda" 
                className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-lg transition shadow-lg shadow-indigo-200">
            Search Cars
          </button>
        </div>
      </div>

      {/* 3. API DATA SECTION (Featured Cars) */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Rated Vehicles</h2>
            <p className="text-gray-500">Explore the highest-rated cars from our hosts</p>
          </div>
          <Link to="/search" className="hidden md:block text-indigo-600 font-semibold hover:text-indigo-800 transition">
            View All Cars &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1,2,3].map(i => (
               <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map(car => (
              <div key={car._id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                {/* Image Area */}
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  {car.photos && car.photos.length > 0 ? (
                    <img 
                      src={car.photos[0]} 
                      alt={`${car.make} ${car.model}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image Available</div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow">
                    {car.year}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{car.make} {car.model}</h3>
                      <p className="text-sm text-gray-500">{car.transmission} • {car.fuelType}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                       Available
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{car.locationAddress || 'Islamabad, Pakistan'}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t pt-4">
                    <div>
                      <span className="text-2xl font-bold text-indigo-600">PKR {car.pricePerDay}</span>
                      <span className="text-xs text-gray-400 ml-1">/ day</span>
                    </div>
                    <Link 
                      to={`/cars/${car._id}`} 
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. STATIC "WHY CHOOSE US" SECTION */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SwiftRide?</h2>
            <p className="text-gray-600">We are redefining the car rental experience with transparency, safety, and convenience at the core.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Hosts</h3>
              <p className="text-gray-500 leading-relaxed">Every host and car goes through a strict vetting process to ensure your safety and comfort.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
              <p className="text-gray-500 leading-relaxed">No waiting around. Book your favorite car instantly and get on the road in minutes.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Best Price Guarantee</h3>
              <p className="text-gray-500 leading-relaxed">We monitor market prices daily to ensure you get the best deal on every rental.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 5. CALL TO ACTION */}
      <div className="bg-indigo-600 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-indigo-100 mb-8 text-lg">Join thousands of happy customers exploring the country with SwiftRide.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/signup" className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg">
               Sign Up Now
             </Link>
             <Link to="/login" className="bg-indigo-700 border border-indigo-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-800 transition">
               Login to Account
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;