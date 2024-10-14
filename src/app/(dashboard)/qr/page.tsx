/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import _ from 'lodash';
import { Ticket } from '@/interfaces/TicketInterface';
import Swal from 'sweetalert2';
import { updateTicket } from '@/services/ticketsService';
import { Backdrop, CircularProgress } from '@mui/material';

export default function QrScann() {
  const qrCodeRegionRef = useRef<HTMLDivElement>(null);

  const [qrData, setQrData] = useState<Ticket|null>(null)
  const [open, setOpen] = useState(false);
  
  const checkTicketStatus  = async () => {
    setOpen(true);
    try {
      const ticketUpdated = await updateTicket(qrData);
      setOpen(false);
      if (ticketUpdated?.ok) {
        await Swal.fire({
          title:'Entrada valida',
          icon:'success',
          timer:1500,
          showConfirmButton: false,
        })
        
      }else{
        await Swal.fire({
          title: ticketUpdated?.msg,
          icon:'error',
          timer:1500,
          showConfirmButton: false,
        })
      }
    } catch (error) {
      setOpen(false);
      console.log('error', error);
      await Swal.fire({
        title:'Error al scanear qr',
        icon:'error',
        timer:1500,
        showConfirmButton: false,
      })
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (qrCodeRegionRef.current) {
      const qrCodeScanner = new Html5QrcodeScanner(
        'qr-reader', 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        true
      );

      qrCodeScanner.render(
        (decodedText: string, decodedResult: any) => {
          const qrDataToJson = JSON.parse(decodedText)
          setQrData(qrDataToJson)
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
  

  useEffect(() => {
    if (!_.isNull(qrData)) {
      checkTicketStatus()
    }
  }, [qrData])
  

  return (
    <>
      <div className='w-full max-h-screen'>
          <div id="qr-reader" ref={qrCodeRegionRef}></div>
          {!_.isNull(qrData) && (
            <div>{qrData.cliente.nombre}</div>

          )}
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
