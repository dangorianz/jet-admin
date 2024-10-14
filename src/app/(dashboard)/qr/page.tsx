/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Swal from 'sweetalert2';
import { updateTicket } from '@/services/ticketsService';
import { Backdrop, Button, CircularProgress } from '@mui/material';

export default function QrScann() {
  const qrCodeRegionRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null); // Almacenar la referencia del escáner
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const checkTicketStatus = async (qrDataToJson: any) => {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);
    setOpen(true);

    try {
      const ticketUpdated = await updateTicket(qrDataToJson);
      setOpen(false);

      if (ticketUpdated?.ok) {
        await Swal.fire({
          title: 'Entrada válida',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(()=>{
          html5QrCodeRef.current?.resume(); 
          setIsProcessing(false);
        });
      } else {
        await Swal.fire({
          title: ticketUpdated?.msg,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
        }).then(()=>{
          html5QrCodeRef.current?.resume(); 
          setIsProcessing(false);
        });
      }
    } catch (error) {
      setOpen(false);
      console.log('error', error);
      await Swal.fire({
        title: 'Error al escanear QR',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      }).then(()=>{
        setIsProcessing(false);
        html5QrCodeRef.current?.resume(); 
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (qrCodeRegionRef.current) {
      const html5QrCode = new Html5QrcodeScanner(
        'qr-reader', 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      html5QrCodeRef.current = html5QrCode;  // Guardar la referencia

      // Iniciar la cámara y el escaneo de QR
      html5QrCode.render(
        async (decodedText: string, decodedResult: any) => {
          if (!isProcessing) {
            setIsProcessing(true);
            html5QrCode.pause();  // Pausar el escaneo temporalmente
            const qrDataToJson = JSON.parse(decodedText);
            await checkTicketStatus(qrDataToJson);
          }
        },
        (error: any) => {
          console.warn(`Error de escaneo: ${error}`);
        }
      )

      return () => {
        // No limpiar ni detener la cámara aquí para mantenerla activa
      };
    }
  }, [isProcessing]);

  return (
    <>
      <div className='w-full max-h-screen'>
        <div className='flex justify-center py-6 font-bold'>
          {!isProcessing ? <p>Listo para scanear</p> : <Button onClick={() => html5QrCodeRef.current?.resume()}> Escanear otro QR </Button>}
        </div>
        <div id="qr-reader" ref={qrCodeRegionRef}></div>
      </div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
