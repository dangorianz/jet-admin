/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { FormControl, FormGroup, InputAdornment, TextField } from '@mui/material'
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
        camel: 0,
        cbn: 0,
        parrales: 0,
        experiencia: 0,
        mambo: 0,
        digestan:0
    })

    const { name, date, camel, cbn, parrales, experiencia, mambo, digestan} = formCreateEvent

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
                    <h3 className='font-medium mb-2'>Precios por sector</h3>
                    <div className='flex flex-col '>
                        <div className='flex justify-evenly'>
                            <TextField sx={{marginY:'10px'}} onChange={onChangeForm} variant='standard' name='camel' value={camel} placeholder='Camel' label="Camel" type='number'        
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <p className='font-semibold text-black'>Bs.</p>
                                        </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField sx={{marginY:'10px'}} onChange={onChangeForm} variant='standard' name='cbn' value={cbn} placeholder='CBN' label="CBN" type='number'
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <p className='font-semibold text-black'>Bs.</p>
                                        </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </div>
                        <div className='flex justify-evenly'>
                            <TextField sx={{marginY:'10px'}} onChange={onChangeForm} variant='standard' name='parrales' value={parrales} placeholder='Parrales' label="Parrales" type='number'
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <p className='font-semibold text-black'>Bs.</p>
                                        </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField sx={{marginY:'10px'}} onChange={onChangeForm} variant='standard' name='experiencia' value={experiencia} placeholder='Experiencia' label="Experiencia" type='number'
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <p className='font-semibold text-black'>Bs.</p>
                                        </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                        </div>
                        <div className='flex justify-evenly'>
                            <TextField sx={{marginY:'10px'}} onChange={onChangeForm} variant='standard' name='mambo' value={mambo} placeholder='Mambo' label="Mambo" type='number'
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <p className='font-semibold text-black'>Bs.</p>
                                        </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField sx={{marginY:'10px'}} onChange={onChangeForm} variant='standard' name='digestan' value={digestan} placeholder='Digestan' label="Digestan" type='number'
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <p className='font-semibold text-black'>Bs.</p>
                                        </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                        </div>
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
