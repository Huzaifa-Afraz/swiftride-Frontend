import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import reviewService from '../../services/reviewService';

const ReviewList = ({ carId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getCarReviews(carId);
        setReviews(data.reviews);
        setStats({
          average: data.averageRating,
          total: data.totalReviews
        });
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchReviews();
    }
  }, [carId]);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading reviews...</div>;

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500">Be the first to rent and review this car!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Guest Reviews</h3>
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400 fill-yellow-400" size={24} />
          <span className="text-2xl font-bold text-gray-900">{stats.average}</span>
          <span className="text-gray-500">({stats.total} reviews)</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{review.reviewer?.fullName || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <span key={i} className="relative">
                      {/* Empty Star Background */}
                      <Star size={16} className="text-gray-200 absolute top-0 left-0" />
                      
                      {/* Full or Half Star */}
                      {review.rating >= ratingValue ? (
                        <Star size={16} className="text-yellow-400 fill-yellow-400 relative z-10" />
                      ) : review.rating >= ratingValue - 0.5 ? (
                         <div className="relative z-10 w-[8px] overflow-hidden">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                         </div>
                      ) : (
                         <Star size={16} className="text-gray-200 relative z-10" />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
