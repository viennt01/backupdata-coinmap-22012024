import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('@/components/commons/qr/qr-code'), {
  ssr: false,
});

export default QRCode;
