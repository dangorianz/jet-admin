/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { FormControl, FormGroup, TextField } from '@mui/material'
import {LoadingButton} from '@mui/lab';
import {createEventService} from '@/services/eventosService'
import _ from 'lodash'
import Swal from 'sweetalert2';
import { useUser } from '@/context/UserContext';

export const FormCreateEvent = () => {

    const { user } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [formCreateEvent, setFormCreateEvent] = useState({
        name: '',
        date: '',
        general: 0,
        vip: 0,
        supervip: 0
    })

    const { name, date, general, vip, supervip } = formCreateEvent

    const onChangeForm = ( e: any ) => {
        setFormCreateEvent({
            ...formCreateEvent,
            [e.target.name]: e.target.value
        })
    }

    const createEvent = async () => {
        setIsLoading(true)
        const resp = await createEventService(formCreateEvent, user)
        setIsLoading(false)
        if (resp) {
            await Swal.fire({
                icon:'success',
                title: 'Evento creado correctamente',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    
    const createButtonDisabled = _.isEmpty(name) || _.isEmpty(date);

    return (
        <>
            <FormControl fullWidth>
                <p className='text-center font-bold text-3xl'> Eventos </p>
                <small className='text-center'>Formulario para crear eventos</small>
                <br />
                <FormGroup>
                    <h3 className='font-medium mb-2'>Nombre del evento</h3>
                    <TextField onChange={onChangeForm} name='name' value={name} fullWidth id='my-input' placeholder='Nombre del evento' type='text'/>
                </FormGroup>
                <br />
                <FormGroup>
                    <h3 className='font-medium mb-2'>Fecha del Evento</h3>
                    <TextField onChange={onChangeForm} name='date' value={date} placeholder='fecha del evento' type='date'/>
                </FormGroup>
                <br />
                <FormGroup>
                    <h3 className='font-medium mb-2'>Precios del evento</h3>
                    <div>
                        <TextField onChange={onChangeForm} name='general' value={general} placeholder='precio General' label="General" type='number'/>
                        <TextField onChange={onChangeForm} name='vip' value={vip} sx={{marginX:'20px'}} placeholder='precio VIP' label="VIP" type='number'/>
                        <TextField onChange={onChangeForm} name='supervip' value={supervip} placeholder='precio Super VIP' label="Super VIP" type='number'/>
                    </div>
                </FormGroup>
                <br />
                <FormGroup>
                    <LoadingButton loading={isLoading} disabled={createButtonDisabled} onClick={createEvent} variant='contained'> Crear Evento </LoadingButton>
                </FormGroup>
                <br />
            </FormControl>
        </>
    )
}
