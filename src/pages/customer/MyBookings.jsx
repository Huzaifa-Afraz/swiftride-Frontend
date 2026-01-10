import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
// 1. Update imports: We don't need 'redirectToPaymentGateway' anymore
import { paymentService } from '../../services/paymentService';
import reviewService from '../../services/reviewService';
import { showAlert } from '../../utils/alert';
import QRCode from "react-qr-code";
import { Calendar, Clock, AlertCircle, Star, QrCode, X } from 'lucide-react';
import ReviewForm from '../../components/reviews/ReviewForm';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  
  // Reviews State
  const [reviewedBookings, setReviewedBookings] = useState({}); // Map bookingId -> review object
  
  // QR Modal State
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState(null);
  const [qrBookingInfo, setQrBookingInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Bookings
        try {
          const bookingsRes = await bookingService.getMyBookings();
          const bookingsData = bookingsRes.data.docs || bookingsRes.data?.data?.items || [];
          setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        } catch (bookingErr) {
          console.error("Failed to load bookings", bookingErr);
          setBookings([]);
        }

        // Fetch Reviews (independently)
        try {
          const reviewsRes = await reviewService.getMyReviews();
          const reviewsData = reviewsRes || [];
          const reviewsMap = {};
          reviewsData.forEach(r => {
            if (r.booking) reviewsMap[r.booking] = r;
            // Handle populated booking object if API returns it that way
            else if (r.booking?._id) reviewsMap[r.booking._id] = r;
          });
          setReviewedBookings(reviewsMap);
        } catch (reviewErr) {
          console.warn("Failed to load reviews. This functionality may be unavailable.", reviewErr);
          // Don't crash the page, just review features won't show
        }

        setLoading(false);
      } catch (err) {
        console.error("Critical failure in loading dashboard", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleShowQR = async (bookingId, carName) => {
      try {
          const res = await bookingService.getBookingDetail(bookingId);
          console.log("Booking Detail:", res.data);
          const secret = res.data?.data?.booking?.handoverSecret;
          
          if (secret) {
              setQrCodeValue(secret);
              setQrBookingInfo(carName);
              setShowQRModal(true);
          } else {
              showAlert("Error", "QR Code not available yet", "info");
          }
      } catch (err) {
          console.error(err);
          showAlert("Error", "Could not fetch QR Code", "error");
      }
  };

  // =========================================================
  // SAFEPAY INTEGRATION: Updated Handle Pay
  // =========================================================
  const handlePay = async (bookingId) => {
    try {
      // 1. Call your new Safepay initialization API
      const res = await paymentService.initSafepayPayment(bookingId);

      // 2. Extract the URL from the response
      const { url } = res.data.data || res.data;

      if (url) {
        window.location.href = url;
      } else {
        showAlert('Error', 'Invalid payment URL received', 'error');
      }

    } catch (err) {
      console.error("Payment Error", err);
      showAlert('Error', 'Could not initialize Safepay payment', 'error');
    }
  };

  // Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  const handleViewInvoice = async (bookingId) => {
    try {
      const response = await bookingService.getInvoice(bookingId);
      console.log("Invoice Response:", response);
      
      const blob = response.data;
      
      // Check if backend returned JSON (URL) wrapped in Blob
      if (blob.type === 'application/json') {
          const text = await blob.text();
          const json = JSON.parse(text);
          if (json.data && json.data.url) {
              setInvoiceUrl(json.data.url);
              setShowInvoiceModal(true);
              return;
          }
      }

      // Fallback: It's a real PDF Blob
      const fileURL = URL.createObjectURL(blob);
      setInvoiceUrl(fileURL);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error(error);
      showAlert('Error', 'Could not load invoice', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-10 text-center">Loading bookings...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {(!bookings || bookings.length === 0) ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You haven't booked any cars yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition">

              {/* Car Info */}
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {booking.car.primaryPhoto ? (
                    <img src={booking.car.primaryPhoto} alt="Car" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{booking.car?.make || 'Unknown'} {booking.car?.model}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.startDateTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.durationHours} Hours</span>
                  </div>
                </div>
              </div>

              {/* Status & Price */}
              <div className="text-left md:text-right w-full md:w-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                <p className="text-2xl font-bold text-indigo-600 mt-2">PKR {booking.totalPrice}</p>
                <div className="flex items-center md:justify-end gap-1 text-xs text-gray-500 mt-1">
                  {booking.paymentStatus === 'unpaid' && <AlertCircle className="w-3 h-3 text-orange-500" />}
                  Payment: <span className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>{booking.paymentStatus}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full md:w-auto flex-wrap justify-end">
                {/* QR Code Button (Confirmed/Ongoing) */}
                {(booking.status === 'confirmed' || booking.status === 'ongoing') && (
                    <button
                        onClick={() => handleShowQR(booking.id, `${booking.car.make} ${booking.car.model}`)}
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm whitespace-nowrap"
                    >
                        <QrCode className="w-4 h-4" /> Show QR
                    </button>
                )}

                {/* Review Button or Status */}
                {booking.status === 'completed' && (
                  reviewedBookings[booking.id] ? (
                    <div className="flex flex-col items-center justify-center px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100">
                      <div className="flex items-center gap-1 font-bold">
                        <span className="text-sm">You Rated:</span>
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span>{reviewedBookings[booking.id].rating}</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setSelectedBookingId(booking.id); setShowReviewModal(true); }}
                      className="flex items-center justify-center gap-2 bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600 transition shadow-sm"
                    >
                      <Star className="w-4 h-4 fill-white" /> Rate Trip
                    </button>
                  )
                )}

                {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handlePay(booking.id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition shadow-sm whitespace-nowrap"
                  >
                    Pay
                  </button>
                )}
                
                {/* Invoice Button - Visible if paid */}
                {booking.paymentStatus === 'paid' && (
                  <button 
                    onClick={() => handleViewInvoice(booking.id)}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition border border-gray-200"
                    title="View Invoice"
                  >
                    Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showReviewModal && (
        <ReviewForm 
          bookingId={selectedBookingId} 
          onClose={() => { setShowReviewModal(false); setSelectedBookingId(null); }}
          onSuccess={() => { /* Optionally refresh bookings but generic alert is handled in form */ }}
        />
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative animate-in fade-in zoom-in duration-200">
                 <button 
                    onClick={() => setShowQRModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                 >
                     <X className="w-6 h-6" />
                 </button>
                 
                 <h2 className="text-xl font-bold mb-2">Scan for Handover</h2>
                 <p className="text-sm text-gray-500 mb-6">{qrBookingInfo}</p>
                 
                 <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 inline-block">
                     <QRCode value={qrCodeValue} size={200} />
                 </div>
                 
                 <p className="mt-6 text-xs text-gray-400">
                     Show this code to the host to start or end your trip.
                 </p>
             </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col relative animate-in fade-in zoom-in duration-200">
                 <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Booking Invoice</h2>
                    <button 
                        onClick={() => setShowInvoiceModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                     >
                         <X className="w-6 h-6" />
                     </button>
                 </div>
                 
                 <div className="flex-1 bg-gray-100 p-4">
                     <iframe 
                        src={invoiceUrl} 
                        className="w-full h-full rounded-lg border shadow-sm"
                        title="Invoice PDF"
                     />
                 </div>
                 
                 <div className="p-4 border-t flex justify-end">
                     <a 
                        href={invoiceUrl} 
                        download="invoice.pdf"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                     >
                        Download PDF
                     </a>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;