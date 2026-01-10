import React, { useState } from 'react';
import { Star, StarHalf, X } from 'lucide-react';
import reviewService from '../../services/reviewService';
import Swal from 'sweetalert2';

const ReviewForm = ({ bookingId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      Swal.fire('Error', 'Please select a rating star', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.addReview({ bookingId, rating, comment });
      Swal.fire('Success', 'Review submitted successfully!', 'success');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMouseMove = (e, starIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const isHalf = x < rect.width / 2;
    setHover(isHalf ? starIndex - 0.5 : starIndex);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-fade-in shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate your trip</h2>
        <p className="text-gray-500 mb-6">How was your experience with this car?</p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => {
               const isFull = (hover || rating) >= star;
               const isHalf = (hover || rating) === star - 0.5;
               
               return (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110 focus:outline-none relative"
                  onClick={() => setRating(hover)}
                  onMouseMove={(e) => handleMouseMove(e, star)}
                  onMouseLeave={() => setHover(rating)}
                >
                  {isHalf ? (
                     <div className="relative">
                       <Star size={42} className="text-gray-200" />
                       <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                         <Star size={42} className="text-yellow-400 fill-yellow-400" />
                       </div>
                     </div>
                  ) : (
                    <Star
                      size={42}
                      className={`${
                        isFull
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      } transition-colors duration-200`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share your experience
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the car, pick-up process, and host..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none min-h-[120px]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
