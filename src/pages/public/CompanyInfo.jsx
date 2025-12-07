import React from 'react';
import { Briefcase, Newspaper, PenTool, HelpCircle } from 'lucide-react';

export const Careers = () => (
  <div className="max-w-4xl mx-auto px-6 py-16 text-center">
    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
      <Briefcase className="w-8 h-8" />
    </div>
    <h1 className="text-3xl font-bold mb-4">Join Our Team</h1>
    <p className="text-xl text-gray-500 mb-8">We're building the future of mobility in Pakistan.</p>
    <div className="bg-white p-8 rounded-xl shadow border">
      <p className="text-gray-600">There are currently no open positions. Please check back later!</p>
    </div>
  </div>
);

export const Blog = () => (
  <div className="max-w-4xl mx-auto px-6 py-16">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">SwiftRide Blog</h1>
      <p className="text-gray-500">Latest news, travel tips, and updates.</p>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <h3 className="font-bold text-lg mb-2">Top 5 Road Trips from Islamabad</h3>
            <p className="text-gray-500 text-sm mb-4">Discover the most scenic routes you can take this weekend with a SwiftRide rental.</p>
            <span className="text-indigo-600 text-sm font-bold cursor-pointer">Read More &rarr;</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Press = () => (
  <div className="max-w-4xl mx-auto px-6 py-16">
    <h1 className="text-3xl font-bold mb-8">Press & Media</h1>
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border flex items-center gap-4">
        <Newspaper className="w-8 h-8 text-gray-400" />
        <div>
          <h3 className="font-bold">SwiftRide launches in 3 new cities</h3>
          <p className="text-gray-500 text-sm">Oct 2025 • TechNews Pakistan</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border flex items-center gap-4">
        <Newspaper className="w-8 h-8 text-gray-400" />
        <div>
          <h3 className="font-bold">How Peer-to-Peer Rental is changing travel</h3>
          <p className="text-gray-500 text-sm">Aug 2025 • Business Daily</p>
        </div>
      </div>
    </div>
  </div>
);

export const HelpCenter = () => (
  <div className="max-w-4xl mx-auto px-6 py-16">
    <div className="text-center mb-12">
      <HelpCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
      <h1 className="text-3xl font-bold">How can we help?</h1>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      {['How do I book a car?', 'What is the cancellation policy?', 'How do I list my car?', 'Insurance & Safety'].map((topic, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border hover:shadow-md transition cursor-pointer">
          <h3 className="font-bold text-gray-900">{topic}</h3>
        </div>
      ))}
    </div>
  </div>
);