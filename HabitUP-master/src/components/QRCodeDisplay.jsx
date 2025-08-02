import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeDisplay = ({ value, size = 200, bgColor = "#FFFFFF", fgColor = "#000000" }) => {
  return (
    <div className="flex justify-center">
      <QRCode value={value} size={size} bgColor={bgColor} fgColor={fgColor} />
    </div>
  );
};

export default QRCodeDisplay;
