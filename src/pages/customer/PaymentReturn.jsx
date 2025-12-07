import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Depending on your backend implementation, status might come in query params
  // e.g. ?success=true or ?status=0000
  const success = searchParams.get('success') === 'true' || searchParams.get('status') === '0000';

  useEffect(() => {
    // Redirect to bookings after 3 seconds
    const timer = setTimeout(() => {
      navigate('/my-bookings');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${success ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
        {success ? <CheckCircle className="w-10 h-10" /> : <Loader className="w-10 h-10 animate-spin" />}
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Processing Payment</h1>
      <p className="text-gray-500 max-w-md">
        Please wait while we confirm your transaction status with the payment gateway. You will be redirected shortly.
      </p>
    </div>
  );
};

export default PaymentReturn;