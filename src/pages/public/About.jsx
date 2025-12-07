import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center">About SwiftRide</h1>
      <p className="text-xl text-gray-500 text-center mb-16 leading-relaxed">
        We are Pakistan's first peer-to-peer car sharing marketplace, connecting trusted car owners with verified drivers.
      </p>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <img 
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
          alt="Our Mission" 
          className="rounded-2xl shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            To empower people to travel freely while helping car owners offset the cost of ownership. We believe in a future where mobility is shared, sustainable, and accessible.
          </p>
          <p className="text-gray-600">
            Whether it's a showroom managing a fleet or a family listing their spare car, SwiftRide provides the technology and trust layer to make it happen.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-10 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-6">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-indigo-600 mb-2">Trust First</h3>
            <p className="text-sm text-gray-600">Every user is verified via KYC.</p>
          </div>
          <div>
            <h3 className="font-bold text-indigo-600 mb-2">Transparency</h3>
            <p className="text-sm text-gray-600">No hidden fees, clear pricing.</p>
          </div>
          <div>
            <h3 className="font-bold text-indigo-600 mb-2">Community</h3>
            <p className="text-sm text-gray-600">24/7 Support for hosts and guests.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;