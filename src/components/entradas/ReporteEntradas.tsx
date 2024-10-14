/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';

import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { getEventsService } from '@/services/eventosService';
import { Autocomplete, Button, Dialog, DialogContent, FormGroup, IconButton, TextField, Tooltip } from '@mui/material';
import _ from 'lodash';
import { getTickesServiceByEvent } from '@/services/ticketsService';
import { Ticket } from '@/interfaces/TicketInterface';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { FormCreateTicket } from './FormCreateTicket';

export const ReporteEntradas = () => {

    const router = useRouter();
    const [eventList, setEventList] = useState<any>([])
    const [ticketList, setTicketList] = useState<GridRowsProp>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isEventLoading, setIsEventLoading] = useState<boolean>(false)
    const [eventSelected, setEventSelected] = useState<any>(null)
    const [isOpenCreateTicketForm, setIsOpenCreateTicketForm] = useState(false)

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
        { field: 'edad', headerName: 'Edad', flex: 1},
        { field: 'telefono', headerName: 'Telefono', flex: 1},
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

    return (
        <div>
            <div className='mb-10 w-[300px]'>
                <h3 className='font-medium mb-2'>Evento</h3>
                <Autocomplete loading={isEventLoading} sx={{bgcolor:'white'}} onChange={onChangeEvent} disablePortal options={eventList} renderInput={(params) => <TextField name='evento' {...params} label="Eventos" />}/>
            </div>
            <p className='my-5 text-2xl font-semibold'>Entradas para el evento: <span className='text-amber-700'>{!_.isNull(eventSelected) && eventSelected.name}</span></p>
            {!_.isNull(eventSelected) && (
                <Button sx={{marginBottom:'20px'}} onClick={() => setIsOpenCreateTicketForm(true)} variant='contained'>Crear Entrada</Button>
            )}
            <div className='bg-white'>
                <DataGrid   
                    autoHeight
                    rowSelection={false}
                    loading={isLoading}
                    rows={ticketList}
                    columns={columns}
                /> 

            </div>
            <Dialog onClose={() => setIsOpenCreateTicketForm(false)} open={isOpenCreateTicketForm}>
                <DialogContent sx={{minHeight:'300px'}}>
                    <FormCreateTicket eventSelected={eventSelected} setIsOpenCreateTicketForm={setIsOpenCreateTicketForm} getTicketByEvent={getTicketByEvent}/>
                </DialogContent>
            </Dialog>
        </div>
    )
}
