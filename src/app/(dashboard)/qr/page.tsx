/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScanner } from 'html5-qrcode';
import Swal from 'sweetalert2';
import { updateTicket } from '@/services/ticketsService';
import { Backdrop, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

export default function QrScann() {
  const qrCodeRegionRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null); // Almacenar la referencia del escáner
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);  // Lista de cámaras disponibles
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');  // ID de la cámara seleccionada

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
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          html5QrCodeRef.current?.resume();  // Reanudar el escaneo cuando el Swal finalice
        });
      } else {
        await Swal.fire({
          title: ticketUpdated?.msg,
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          html5QrCodeRef.current?.resume();  // Reanudar el escaneo cuando el Swal finalice
        });
      }
    } catch (error) {
      setOpen(false);
      console.log('error', error);
      await Swal.fire({
        title: 'Error al escanear QR',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        html5QrCodeRef.current?.resume();  // Reanudar el escaneo cuando el Swal finalice
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const startCamera = () => {
    if (qrCodeRegionRef.current && selectedCameraId && !cameraStarted) {
      const html5QrCode = new Html5Qrcode("qr-reader", { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], verbose:false });

      html5QrCodeRef.current = html5QrCode;  // Guardar la referencia

      // Iniciar la cámara seleccionada y el escaneo de QR
      html5QrCode.start(
        { deviceId: { exact: selectedCameraId } }, // Usar la cámara seleccionada por el usuario
        {
          fps: 10,    // Fotogramas por segundo
          qrbox: { width: 250, height: 250 }  // Área de escaneo
        },
        async (decodedText: string) => {
          if (!isProcessing) {
            setIsProcessing(true);
            html5QrCode.pause();  // Pausar el escaneo temporalmente
            const qrDataToJson = decodedText;
            await checkTicketStatus(qrDataToJson);
          }
        },
        (error: any) => {
          console.warn(`Error de escaneo: ${error}`);
        }
      ).catch((err: any) => {
        console.error(`Error iniciando el escaneo: ${err}`);
      });

      setCameraStarted(true);  // Marcar que la cámara ha sido activada
    }
  };

  const loadCameras = () => {
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setCameras(devices);  // Guardar la lista de cámaras disponibles
        setSelectedCameraId(devices[0].id);  // Seleccionar la primera cámara como predeterminada
      }
    }).catch(err => {
      console.error("Error obteniendo las cámaras: ", err);
    });
  };

  useEffect(() => {
    loadCameras();  // Cargar las cámaras cuando el componente se monta
  }, []);

  return (
    <>
      <div className='w-full max-h-screen'>
        <div className='flex justify-center py-6 px-8 w-fit font-bold flex-col'>
          {!cameraStarted ? (
            <>
              <FormControl fullWidth>
                <InputLabel id="select-camera-label">Seleccionar Cámara</InputLabel>
                <Select
                  labelId="select-camera-label"
                  value={selectedCameraId}
                  label="Seleccionar Cámara"
                  onChange={(e) => setSelectedCameraId(e.target.value as string)}
                >
                  {cameras.map((camera) => (
                    <MenuItem key={camera.id} value={camera.id}>
                      {camera.label || `Cámara ${camera.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={startCamera}
                style={{ marginTop: '16px' }}
                disabled={!selectedCameraId} // Deshabilitar si no hay cámara seleccionada
              >
                Activar Cámara para Escanear QR
              </Button>
            </>
          ) : (
            !isProcessing ? <p>Listo para escanear</p> : <p>Procesando...</p>
          )}
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
