import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCodeDisplay from '../components/QRCodeDisplay';

const UPIPayment = ({ entityId, entityType, amount, description }) => {
  const [upiData, setUpiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUPIData = async () => {
      try {
        const response = await axios.post('/api/payments/upi/generate-qr', {
          entityId,
          entityType,
          amount,
          description,
        });
        setUpiData(response.data);
      } catch (error) {
        console.error('Error generating UPI QR:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUPIData();
  }, [entityId, entityType, amount, description]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!upiData) {
    return <div>Error generating UPI Payment. Please try again later.</div>;
  }

  const { qr, instructions } = upiData.data;

  return (
    <div className="payment-container">
      <h2>Complete your payment</h2>
      <QRCodeDisplay value={qr.dataURL} />
      <h3>Instructions:</h3>
      <ol>
        {instructions.steps.map((step) => (
          <li key={step.step}>
            <strong>{step.title}:</strong> {step.description}
          </li>
        ))}
      </ol>
      <p><strong>Amount:</strong> ₹{amount}</p>
      <p><strong>Note:</strong> {description}</p>
    </div>
  );
};

export default UPIPayment;
