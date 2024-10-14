'use client'
import React, { useRef } from 'react'
import { Ticket } from '@/interfaces/TicketInterface'

import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@mui/material';

interface GenerateQrProps {
    ticket: Ticket;
}

export const GenerateQr = ({ ticket }: GenerateQrProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const qrValue = JSON.stringify(ticket);

    const downloadQRCode = () => {
        const svg = svgRef.current;

        if (svg) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            img.src = "data:image/svg+xml;base64," + btoa(svgData);

            img.onload = function () {
                const scaleFactor = 10; // Puedes ajustar este valor para más calidad (mayor valor = mayor calidad)
                const marginSize = 50; 
                canvas.width = img.width * scaleFactor + marginSize * 2;
                canvas.height = img.height * scaleFactor + marginSize * 2;

                // Dibujamos la imagen en el canvas con mayor calidad

                ctx!.fillStyle = "#FFFFFF";
                ctx!.fillRect(0, 0, canvas.width, canvas.height);

                ctx?.scale(scaleFactor, scaleFactor);
                ctx?.drawImage(img, marginSize / scaleFactor, marginSize / scaleFactor);
                const pngFile = canvas.toDataURL("image/png", 1.0);

                const downloadLink = document.createElement("a");
                downloadLink.href = pngFile;
                downloadLink.download = `QR-${ticket.cliente.nombre}.png`;
                downloadLink.click();
            };
        }
    };


    return (
        <div className='w-full'>
            <div className='flex justify-center flex-col items-center my-5'>
                <h2 className='mb-5 font-bold text-2xl text-amber-900'>{ticket.cliente.nombre}</h2>
                <QRCodeSVG value={qrValue} size={256} ref={svgRef}/>
                <Button
                    sx={{marginY: 2 }}
                    onClick={downloadQRCode}>
                    Descargar QR
                </Button>
                
            </div>
        </div>
    )   
}
