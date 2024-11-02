/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import { RiFileExcel2Fill } from "react-icons/ri";

import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { getEventsService } from '@/services/eventosService';
import { Autocomplete, Button, Dialog, DialogContent, IconButton, TextField, Tooltip } from '@mui/material';
import _ from 'lodash';
import { getTickesServiceByEvent } from '@/services/ticketsService';
import { Ticket } from '@/interfaces/TicketInterface';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { FormCreateTicket } from './FormCreateTicket';
import { ExcelUploader } from './ExcelUploader';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export const ReporteEntradas = () => {

    const router = useRouter();
    const [eventList, setEventList] = useState<any>([])
    const [ticketList, setTicketList] = useState<GridRowsProp>([])
    const [filterTickets, setFilterTickets] = useState<GridRowsProp>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isEventLoading, setIsEventLoading] = useState<boolean>(false)
    const [eventSelected, setEventSelected] = useState<any>(null)
    const [isOpenCreateTicketForm, setIsOpenCreateTicketForm] = useState(false)
    const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false)
    const [urls, setUrls] = useState([])
    const [generandoEntradas, setGenerandoEntradas] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const getEvents = async () => {
        setIsEventLoading(true)
        const rep = await getEventsService()
        const events = rep.events.map( event => ({
            ...event,
            label: event.name
        })) 
        setEventList(events)
        setIsEventLoading(false);
    }

    const getTicketByEvent = async () => {
        setIsLoading(true)
        try {
            const resp: any = await getTickesServiceByEvent(eventSelected.id)
            const list = resp.tickets.map( (ticket:Ticket) => {
                return { 
                    id: ticket.id, 
                    cliente: ticket.cliente.nombre,
                    edad: ticket.cliente.edad,
                    telefono: ticket.cliente.telefono,
                    estado: ticket.estado,
                    sector: ticket.sector
                }
            })
            setTicketList(list)
        } catch (error) {
            console.log(error);
            setTicketList([])
        }
        setIsLoading(false)
    }

    useEffect(() => {
      getEvents()
    }, [])

    useEffect(() => {
        if (!_.isNull(eventSelected)) {
            getTicketByEvent()
        }else{
            setTicketList([])
        }
    }, [eventSelected])

    const columns: GridColDef[] = [
        { field: 'cliente', headerName: 'Nombre de cliente', flex: 1},
        { 
            field: 'estado',
            headerName: 'Estado', 
            flex: 1,
            renderCell:(ticket)=>(
                <span className="flex items-center">
                <span
                    className={ clsx('inline-block w-2.5 h-2.5 rounded-full mr-2', {
                        'bg-green-500': ticket.value === 'activo',
                        'bg-red-500': ticket.value === 'usado',

                    })}
                />
                <span className='capitalize'>
                    {ticket.value}
                </span>
            </span>
            )
        },
        { field: 'sector', headerName: 'Sector', flex: 1},
        { 
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            renderCell:( ticket ) => (
                <div>
                    <Tooltip title='Ver entrada' placement='left'><IconButton onClick={() => router.push(`/entradas/${ticket.id}`)}><RemoveRedEyeIcon color='primary'/></IconButton></Tooltip>
                    <Tooltip title='Eliminar entrada' placement='right'>
                        <IconButton><DeleteIcon color='error'/></IconButton>
                    </Tooltip>
                </div>
            )
        },
    ];
    
    const onChangeEvent = ( _e: any, value: any) => {
        if (_.isNull(value)) {
            setEventSelected(null);
        } else{
            setEventSelected(value);
        }
    }
    const createEntradas = async () => {
        setGenerandoEntradas(true)
        try {
            const resp = await axios.post('https://gettickets-ngaqbaskkq-uc.a.run.app/getTickets', {
                evento: eventSelected.id
            })
            setUrls(resp.data.data)
            setGenerandoEntradas(false)
        } catch (error) {
            console.log(error);
            setGenerandoEntradas(false)
        }
    }
    
    const onchangeTermSearch = (e:any) => {
        setSearchTerm(e.target.value)
        const filterTickets = ticketList.filter( ticket => ticket.cliente.toLowerCase().includes(e.target.value))
        setFilterTickets(filterTickets);
    }

    return (
        <div>
            <div className='mb-10 flex w-full justify-between'>
                <div className='w-[300px]'>
                    <h3 className='font-medium mb-2'>Evento</h3>
                    <Autocomplete loading={isEventLoading} sx={{bgcolor:'white'}} onChange={onChangeEvent} disablePortal options={eventList} renderInput={(params) => <TextField name='evento' {...params} label="Eventos" />}/>
                </div>
                {  urls.length !== 0 && 
                
                <div className=' bg-white shadow-2xl px-10 py-5 mr-48'>
                    <p className='font-bold mb-2'>Lista de entradas: </p>
                    {urls.map( (url, index)=> (
                        <div key={`${index}-url`} className='flex'>
                            <ConfirmationNumberIcon color='warning'/> 
                            <a  href={url} target='_blank' className='text-blue-500 ml-2'>-  Descargar {index + 1}</a>
                        </div>
                    ))}
                </div>
            }
            </div>
            <p className='my-5 text-2xl font-semibold'>Entradas para el evento: <span className='text-amber-700'>{!_.isNull(eventSelected) && eventSelected.name}</span></p>
            {!_.isNull(eventSelected) && (
                <>
                <div>
                    <Button sx={{marginBottom:'20px'}} onClick={() => setIsOpenCreateTicketForm(true)} variant='contained'>Crear entrada</Button>
                    <Button sx={{marginBottom:'20px', ml:'10px'}} onClick={() => setIsExcelDialogOpen(true)} variant='contained' color='success'> <RiFileExcel2Fill color='white' size={20} className='mr-2'/> Subir un excel</Button>
                    <LoadingButton loading={generandoEntradas} sx={{marginBottom:'20px', ml:'10px'}} onClick={createEntradas} variant='outlined'>Generar Entradas</LoadingButton>
                </div>

                </>
            )}
            <TextField
                label="Buscar por nombre de cliente"
                variant="outlined"
                name='searchTerm'
                value={searchTerm}
                onChange={onchangeTermSearch}
                sx={{ mb: 2, width: '300px', bgcolor:'white' }}
            />
            <div className='bg-white'>
                <DataGrid   
                    autoHeight
                    rowSelection={false}
                    loading={isLoading}
                    rows={ _.isEmpty(searchTerm) ? ticketList : filterTickets}
                    columns={columns}
                /> 

            </div>
            <Dialog onClose={() => setIsOpenCreateTicketForm(false)} open={isOpenCreateTicketForm}>
                <DialogContent sx={{minHeight:'300px'}}>
                    <FormCreateTicket eventSelected={eventSelected} setIsOpenCreateTicketForm={setIsOpenCreateTicketForm} getTicketByEvent={getTicketByEvent}/>
                </DialogContent>
            </Dialog>

            <Dialog onClose={() => setIsExcelDialogOpen(false)} open={isExcelDialogOpen}>
                <DialogContent sx={{minHeight:'300px'}}>
                    <ExcelUploader evento={eventSelected} setIsExcelDialogOpen={setIsExcelDialogOpen}/>
                </DialogContent>
            </Dialog>
        </div>
    )
}
