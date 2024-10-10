/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QrScann() {
  const qrCodeRegionRef = useRef<HTMLDivElement>(null);

  const [qrData, setQrData] = useState('')

  useEffect(() => {
    if (qrCodeRegionRef.current) {
      const qrCodeScanner = new Html5QrcodeScanner(
        'qr-reader', 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        true
      );

      qrCodeScanner.render(
        (decodedText: string, decodedResult: any) => {
          console.log(`Código QR escaneado: ${decodedText}`);
          console.log(`Código decodedResult escaneado: ${decodedResult}`);
          setQrData(decodedText)
        },
        (error: any) => {
          console.warn(`Error de escaneo: ${error}`);
        }
      );

      return () => {
        qrCodeScanner.clear();
      };
    }
  }, []);

  return (
    <div className='w-full max-h-screen'>
        <div id="qr-reader" ref={qrCodeRegionRef}></div>
        <div>{qrData}</div>
    </div>
);
};
