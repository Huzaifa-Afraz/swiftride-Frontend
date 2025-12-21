import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom'; // Assuming react-router-dom v6

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);

  // 1. Capture parameters from URL
  const authToken = searchParams.get('auth_token');
  const status = searchParams.get('status');
  const desc = searchParams.get('desc');

  // 2. Decide Environment (Sandbox vs Production)
  // MUST match what you used in the Backend Init
  const isSandbox = false; // Set to TRUE if using Sandbox credentials
  const confirmUrl = isSandbox 
    ? "https://easypaystg.easypaisa.com.pk/easypay/Confirm.jsf" 
    : "https://easypay.easypaisa.com.pk/easypay/Confirm.jsf";

  // 3. Auto-Submit the Handshake Form
  useEffect(() => {
    if (authToken && formRef.current) {
      console.log("Token received, confirming payment...", authToken);
      formRef.current.submit();
    }
  }, [authToken]);

  // 4. Render Logic
  if (status === 'Success') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
        <p>Transaction ID: {desc}</p>
        <a href="/bookings" className="btn btn-primary mt-4">Go to Bookings</a>
      </div>
    );
  }

  if (status === 'Failed') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p>Reason: {desc}</p>
        <a href="/" className="btn mt-4">Try Again</a>
      </div>
    );
  }

  // 5. The "Handshake" Screen (Hidden Form)
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl">Verifying Payment...</h2>
      <p>Please wait while we confirm your transaction.</p>

      {/* This form is invisible but crucial for the 2nd Redirection */}
      {authToken && (
        <form 
          ref={formRef} 
          action={confirmUrl} 
          method="POST" 
          style={{ display: 'none' }}
        >
          <input type="hidden" name="auth_token" value={authToken} />
          {/* This postBackURL must match the one in your .env exactly */}
          <input type="hidden" name="postBackURL" value={window.location.href.split('?')[0]} />
        </form>
      )}
    </div>
  );
};

export default PaymentCallback;