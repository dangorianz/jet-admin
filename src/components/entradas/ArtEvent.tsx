/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useRef, useState } from 'react'
import { GenerateQr } from './GenerateQr';
import html2canvas from 'html2canvas';
import moment from 'moment';
import jsPDF from 'jspdf';
import { LoadingButton } from '@mui/lab';

export const ArtEvent = ({resp}:any) => {
    const divRef = useRef(null); // Referencia al div que queremos capturar

    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const downloadImage = async () => {
        if (!imageLoaded) {
            alert("Espera a que la imagen cargue completamente antes de descargar.");
            return;
        }

        setIsDownloading(true);

        const div = divRef.current;
        if (!div) return;

        try {
            // Captura el contenido del div como canvas
            const canvas = await html2canvas(div, {
                useCORS: true,
                allowTaint: true,
                scale: 2,
                scrollY: -window.scrollY
            });

            const imgData = canvas.toDataURL('image/png'); // Convierte el canvas a imagen
            const pdf = new jsPDF('portrait', 'mm', 'a4'); // Crea un nuevo documento PDF

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${resp.cliente.nombre}.pdf`);
            setIsDownloading(false);
        } catch (error) {
            console.error('Error al capturar la imagen:', error);
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div className="w-[400px] relative" ref={divRef}> 
                <img src={resp.artImageUrl} alt="" onLoad={handleImageLoad}/>
                <div className="absolute top-[125px] left-[135px]">
                    <GenerateQr ticket={resp} qrSize={130} downloadButton={false} />
                </div>
                <div className="absolute bottom-[140px] left-[60px] max-w-[280px] w-[280px] text-sm">
                    <p className='text-center text-base pb-2'>
                        {resp?.sector
                            ?<span className='font-bold uppercase'>{resp.sector} ( {resp.precio}.00 Bs.)</span>
                            :<span className='font-bold'>INVITADO </span>
                        }
                       
                    </p>
                    <p>
                        <span className='font-bold'>nombre: </span>{resp.cliente.nombre}
                    </p>
                    <p className=''>
                        {resp?.sector
                            ?<><span className='font-bold'>sector: </span> <span className='capitalize'>{resp?.sector}</span> <span className='font-bold ml-3'>Mesa:</span> <span>{resp?.mesa} </span></> 
                            :<span className='font-bold'>INVITADO </span>
                        }
                    </p>

                    <p className='text-center font-bold mt-2'>
                        La Paz, {moment().year()}   
                    </p>
                </div>
            </div>
            <div className='w-full px-5'>
                <LoadingButton loading={isDownloading} onClick={downloadImage} variant='contained' fullWidth sx={{marginY:'10px'}}>
                    Descargar Invitacion
                </LoadingButton>
            </div>
        </>
    );
}
