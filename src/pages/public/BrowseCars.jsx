import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carService } from '../../services/carService';
import { MapPin, Filter, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrowseCars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Local state for filters
  const [filters, setFilters] = useState({
    locationAddress: searchParams.get('locationAddress') || '',
    make: searchParams.get('make') || '',
    page: 1,
    limit: 10
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      // Clean up empty filters before sending to API
      const params = {};
      if (filters.locationAddress) params.locationAddress = filters.locationAddress;
      if (filters.make) params.make = filters.make;
      params.page = filters.page;
      params.limit = filters.limit;

      const res = await carService.getCars(params);
      const data = res.data.docs || res.data.data || [];
      console.log("Fetched cars:", data);
      setCars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filters or URL params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      locationAddress: searchParams.get('locationAddress') || '',
      make: searchParams.get('make') || ''
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, searchParams]); // Trigger on page change or URL change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Update URL to match state, which triggers the useEffect above
    setSearchParams({ 
      locationAddress: filters.locationAddress, 
      make: filters.make 
    });
  };

  const clearFilters = () => {
    setFilters({ ...filters, locationAddress: '', make: '' });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* SIDEBAR FILTERS */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" /> Filters
                </h2>
                {(filters.make || filters.locationAddress) && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
                  <input 
                    type="text"
                    placeholder="e.g. Lahore"
                    className="w-full border p-2 rounded focus:ring-2 ring-indigo-500 outline-none"
                    value={filters.locationAddress}
                    onChange={e => setFilters({...filters, locationAddress: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Car Make</label>
                  <input 
                    type="text"
                    placeholder="e.g. Honda"
                    className="w-full border p-2 rounded focus:ring-2 ring-indigo-500 outline-none"
                    value={filters.make}
                    onChange={e => setFilters({...filters, make: e.target.value})}
                  />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 transition">
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* RESULTS GRID */}
          <div className="w-full md:w-3/4">
            <h1 className="text-2xl font-bold mb-6">
              {loading ? 'Searching...' : `Available Cars (${cars.length})`}
            </h1>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[1,2,3,4].map(n => <div key={n} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>)}
              </div>
            ) : cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map(car => (
                  <div key={car._id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition group">
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                       {car.photos?.[0] ? (
                         <img src={car.photos[0]} alt={car.make} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                       )}
                       <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow flex items-center gap-1">
                         <MapPin className="w-3 h-3 text-indigo-600" /> {car.locationAddress}
                       </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{car.make} {car.model}</h3>
                          <p className="text-sm text-gray-500">{car.year} • {car.transmission}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-xl font-bold text-indigo-600">PKR {car.pricePerDay}</span>
                          <span className="text-xs text-gray-400">per day</span>
                        </div>
                      </div>
                      <Link 
                        to={`/cars/${car._id}`} 
                        className="block w-full text-center bg-gray-900 text-white py-2 rounded mt-4 hover:bg-black transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-600">No cars found</h3>
                <p className="text-gray-400">Try changing your filters or location.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCars;