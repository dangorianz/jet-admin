/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import * as XLSX from 'xlsx';
import { useState } from 'react';
import { Divider } from '@mui/material';
import Swal from 'sweetalert2';
import { bulkCreateTicketService } from '@/services/ticketsService';
import { useUser } from '@/context/UserContext';
import moment from 'moment';
import { LoadingButton } from '@mui/lab';

export const ExcelUploader = ({evento, setIsExcelDialogOpen}: any) => {
  const { user } = useUser();
  const [excelData, setExcelData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Suponiendo que deseas la primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convertir los datos a JSON y filtrar columnas específicas
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      // Filtrar filas para tener solo las columnas necesarias (nombre, sector, mesa)
      const headers = jsonData[0].map((header: string) => header.trim()); // Eliminar espacios alrededor
      const nameIndex = headers.indexOf('nombre');
      const sectorIndex = headers.indexOf('sector');
      const mesaIndex = headers.indexOf('mesa');

      const filteredData = jsonData
        .slice(1)
        .map((row) => ({
          evento: evento.id,
          precio: evento.sectores[row[sectorIndex].trim().toLowerCase()],
          cliente: {
            nombre: row[nameIndex] || ''
          },
          usuario: {
            id: user?.uid,
            nombre: user?.displayName || '',
            email: user?.email,
          },
          sector: row[sectorIndex].trim().toLowerCase() || '',
          estado:'activo',
          createAt: moment().format('DD/MM/YYYY hh:mm:ss'),
          mesa: row[mesaIndex] || '',
        }))
        .filter((row) => row.cliente.nombre.trim() !== '');

      setExcelData(filteredData);
    };

    reader.readAsArrayBuffer(file);
  };

  const registrarEntradas = async() => {
    try {
      setIsLoading(true)
      const resp = await bulkCreateTicketService(excelData)
      if (resp.ok) {
        setIsExcelDialogOpen(false)
        Swal.fire({
          icon:'success',
          showConfirmButton: false,
          text:'Se registrador los usuarios',
          timer: 1000
        })
        setIsLoading(true)
      }else{
        setIsExcelDialogOpen(false)
        Swal.fire({
          icon:'error',
          showConfirmButton: false,
          text:'Error al registrar los usuarios',
          timer: 1000
        })
        setIsLoading(true)
      }
    } catch (error) {
      setIsExcelDialogOpen(false)
      Swal.fire({
        icon:'error',
        showConfirmButton: false,
        text:'Error al registrar los usuarios',
        timer: 1000
      })
      setIsLoading(true)
      console.log(error);
    }
  }

  return (
    <div>
      <p className='font-bold text-xl'>Sube un archivo .xls o .xslx</p>
      <Divider/>
      <div className='mt-5 flex justify-center'>
       <input type="file" name="excelFile" accept=".xls,.xlsx" onChange={handleFileUpload} />
      </div>
    <div className='my-5'>
      <p className='text-center'> Numero de clientes que seran registrados: </p>
      <p className='text-center text-3xl font-bold'>{excelData.length}</p>
    </div>
    <LoadingButton loading={isLoading} onClick={registrarEntradas} fullWidth variant='contained' color='success'> Crear clientes</LoadingButton>
  </div>
  );
}
