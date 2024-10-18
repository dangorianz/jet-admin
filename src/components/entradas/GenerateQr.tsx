'use client'
import React, { useRef } from 'react'
import { Ticket } from '@/interfaces/TicketInterface'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@mui/material';
import jsPDF from 'jspdf';

interface GenerateQrProps {
    ticket: Ticket;
}

export const GenerateQr = ({ ticket }: GenerateQrProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const qrValue = ticket.id;

    const downloadPDF = () => {
        const svg = svgRef.current;

        if (svg) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            img.src = "data:image/svg+xml;base64," + btoa(svgData);

            img.onload = function () {
                // Dibujamos el QR en el canvas para obtener la imagen en formato PNG
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                const qrPng = canvas.toDataURL("image/png");

                // Crear un nuevo documento PDF
                const doc = new jsPDF({
                    orientation: "portrait", // vertical
                    unit: "pt", // puntos (72 por pulgada)
                    format: "letter" // tamaño carta
                });

                // Establecemos algunas coordenadas iniciales
                const marginX = 50;
                const marginY = 50;

                // Añadir el nombre del cliente
                doc.setFontSize(20);
                doc.text(`Cliente: ${ticket.cliente.nombre}`, marginX, marginY);

                // Añadir otros detalles del cliente
                doc.setFontSize(12);
                doc.text(`Teléfono: ${ticket.cliente.telefono}`, marginX, marginY + 20);
                doc.text(`Edad: ${ticket.cliente.edad}`, marginX, marginY + 40);

                // Añadir el QR en el PDF (lo añadimos 100px más abajo del último texto)
                const qrSize = 150;
                doc.addImage(qrPng, "PNG", marginX, marginY + 60, qrSize, qrSize);

                // Descargar el PDF
                doc.save(`Entrada-${ticket.cliente.nombre}.pdf`);
            };
        }
    };

    return (
        <div className='w-full'>
            <div className='flex justify-center flex-col items-center my-5'>
                <h2 className='mb-5 font-bold text-2xl text-amber-900'>{ticket.cliente.nombre}</h2>
                <QRCodeSVG value={qrValue} size={256} ref={svgRef}/>
                <Button
                    sx={{ marginY: 2 }}
                    onClick={downloadPDF}>
                    Descargar PDF
                </Button>
            </div>
        </div>
    );
};
