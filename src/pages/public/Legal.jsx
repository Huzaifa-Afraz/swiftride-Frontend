import React from 'react';

export const Terms = () => (
  <div className="max-w-4xl mx-auto px-6 py-16">
    <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
    <div className="prose text-gray-600 space-y-4">
      <p>Last updated: December 2025</p>
      <h3 className="text-xl font-bold text-gray-900 mt-6">1. Acceptance of Terms</h3>
      <p>By accessing and using SwiftRide, you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h3 className="text-xl font-bold text-gray-900 mt-6">2. Driver Eligibility</h3>
      <p>All drivers must be at least 21 years of age and hold a valid driver's license for at least 2 years with no major violations.</p>
      <h3 className="text-xl font-bold text-gray-900 mt-6">3. Booking Cancellations</h3>
      <p>Cancellations made 24 hours before the trip starts are fully refundable. Late cancellations may incur a fee.</p>
    </div>
  </div>
);

export const Privacy = () => (
  <div className="max-w-4xl mx-auto px-6 py-16">
    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
    <div className="prose text-gray-600 space-y-4">
      <p>At SwiftRide, we take your privacy seriously. This policy describes how we collect and use your data.</p>
      <h3 className="text-xl font-bold text-gray-900 mt-6">Data Collection</h3>
      <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
      <h3 className="text-xl font-bold text-gray-900 mt-6">Data Usage</h3>
      <p>We use your data to provide, maintain, and improve our services, including facilitating payments, sending receipts, and providing products and services you request.</p>
    </div>
  </div>
);

export const TrustSafety = () => (
  <div className="max-w-4xl mx-auto px-6 py-16">
    <h1 className="text-3xl font-bold mb-6">Trust & Safety</h1>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h3 className="font-bold text-green-800 mb-2">Verified Community</h3>
        <p className="text-green-700 text-sm">Every user on SwiftRide goes through a strict ID verification process (KYC) before they can book or list cars.</p>
      </div>
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-2">Secure Payments</h3>
        <p className="text-blue-700 text-sm">All payments are processed securely. We hold funds until the trip starts to ensure fairness for both parties.</p>
      </div>
    </div>
  </div>
);