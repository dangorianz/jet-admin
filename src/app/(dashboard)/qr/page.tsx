/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { updateTicket } from '@/services/ticketsService';
import { Backdrop, Button, CircularProgress } from '@mui/material';

export default function QrScann() {
  const qrCodeRegionRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);  // Añadido estado para bloqueo

  const checkTicketStatus  = async (qrDataToJson:any) => {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true)
    setOpen(true);
    try {
      const ticketUpdated = await updateTicket(qrDataToJson);
      setOpen(false);
      if (ticketUpdated?.ok) {
        await Swal.fire({
          title:'Entrada válida',
          icon:'success',
          timer:1500,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          title: ticketUpdated?.msg,
          icon:'error',
          timer:1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      setOpen(false);
      console.log('error', error);
      await Swal.fire({
        title:'Error al escanear QR',
        icon:'error',
        timer:1500,
        showConfirmButton: false,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (qrCodeRegionRef.current) {
      const qrCodeScanner = new Html5QrcodeScanner(
        'qr-reader', 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false  // El tercer argumento debe ser false para evitar que el escáner limpie la cámara
      );

      qrCodeScanner.render(
        async (decodedText: string, decodedResult: any) => {
          if (!isProcessing) {  // Solo procesar si no está bloqueado
            setIsProcessing(true);
            const qrDataToJson = JSON.parse(decodedText);
            await checkTicketStatus(qrDataToJson); // Procesar los datos escaneados
          }
        },
        (error: any) => {
          console.warn(`Error de escaneo: ${error}`);
        }
      );

      return () => {
        qrCodeScanner.clear(); 
      };
    }
  }, [isProcessing]);  // Dependencia de isProcessing para que solo permita escanear cuando está desbloqueado


  return (
    <>
      <div className='w-full max-h-screen'>
        <div className='flex justify-center py-6 font-bold'>
          {!isProcessing ? <p>Listo para scanear</p> : <Button onClick={() => setIsProcessing(false)}> Escanear otro QR </Button> }

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
