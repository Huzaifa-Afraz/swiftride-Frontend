import apiClient from './apiClient';

const reviewService = {
  // Submit a review
  addReview: async (reviewData) => {
    const response = await apiClient.post('/reviews/add', reviewData);
    return response.data;
  },

  // Get reviews for a car
  getCarReviews: async (carId) => {
    const response = await apiClient.get(`/reviews/car/${carId}`);
    return response.data;
  },

  // Get reviews by current user
  getMyReviews: async () => {
    const response = await apiClient.get('/reviews/my-reviews');
    return response.data;
  }
};

export default reviewService;
