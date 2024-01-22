import React, { useEffect, useRef, memo } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Options } from 'qr-code-styling/lib/types/index';

const QRCode: React.FC<Options> = (props) => {
  const ref = useRef(null);
  const qrCode = new QRCodeStyling(props);

  useEffect(() => {
    if (!ref.current) return;
    qrCode.append(ref.current);
    qrCode.update(props);
  });

  return (
    <div
      ref={ref}
      style={{
        width: props.width,
        height: props.height,
      }}
    />
  );
};

export default memo(QRCode);
