/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import { Divider, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, TextField } from '@mui/material'
import { createTicketService } from '@/services/ticketsService'
import { LoadingButton } from '@mui/lab'
import _ from 'lodash'
import Swal from 'sweetalert2'
import { useUser } from '@/context/UserContext'

export const FormCreateTicket = ({eventSelected, setIsOpenCreateTicketForm, getTicketByEvent}: any) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false)
    const [ticketPrice, setTicketPrice] = useState(0)
    const [formCreateTicket, setFormCreateTicket] = useState({
        evento: eventSelected.id,
        nombre: '',
        edad: 0,
        telefono: 0,
        sector: 'camel'
    })

    const { evento, nombre, edad, telefono, sector } = formCreateTicket;

    useEffect(() => {
        if (!_.isNull(eventSelected)) {
         const price = eventSelected.sectores[sector] || 0;
         setTicketPrice(price);  
        }
    }, [eventSelected, sector])

    const onChangeFormTickets = (e: any) => {
        setFormCreateTicket({
            ...formCreateTicket,
            [e.target.name]: e.target.value
        })
    }

    const createTicket = async () => {

        setIsLoading(true)
        const resp = await createTicketService({...formCreateTicket, precio: ticketPrice}, user)
        if (resp.ok) {
            setIsOpenCreateTicketForm(false)
            await Swal.fire({
                icon:'success',
                title: 'Entrada creada correctamente',
                showConfirmButton: false,
                timer: 1500
            })
            setIsLoading(false)
            getTicketByEvent()
        }
        setIsOpenCreateTicketForm(false)
        setIsLoading(false)

    }
    
    const createButtonDisabled = _.isEmpty(evento) || _.isEmpty(nombre) || _.isEmpty(edad) || _.isEqual(edad.toString(), '0') || _.isEmpty(telefono) || _.isEqual(telefono.toString(), '0')
    
  return (
    <FormControl fullWidth>
        <p className='text-center font-bold text-3xl'> Creacion de entradas</p>
        <small className='text-center mt-1'>Formulario para crear entradas para los clientes de forma individual</small>
        <br />
        <FormGroup>
            <p className='text-amber-800 text-center font-bold text-2xl'>{eventSelected?.name}</p>
        </FormGroup>
        {
            !_.isEmpty(evento) &&
            (
                <>
                <p className='text-center font-bold text-xl mt-5'>Datos del cliente</p>
                <Divider sx={{marginTop:1, marginBottom: 2}}/>
                
                <FormGroup>
                    <h3 className='font-medium mb-2'>Nombre y apellido</h3>
                    <TextField name='nombre' onChange={onChangeFormTickets} value={nombre} size='small' fullWidth id='my-input'  placeholder='Nombre del cliente' type='text'/>
                </FormGroup>
                
                <div className='flex justify-between mt-3'>
                    <div>
                        <h3 className='font-medium mb-2'>Edad</h3>
                        <TextField name='edad' value={edad} onChange={onChangeFormTickets} size='small' placeholder='Edad' type='number' 
                            onInput={(e:any) => {
                                e.target.value = e.target.value < 0 ? 0 : e.target.value;
                            }}
                        />
                    </div>
                    <div>
                        <h3 className='font-medium mb-2'>Telefono</h3>
                        <TextField size='small' value={telefono} name='telefono' onChange={onChangeFormTickets} placeholder='Telefono' type='number'
                            onInput={(e:any) => {
                                e.target.value = e.target.value < 0 ? 0 : e.target.value;
                            }}
                        />

                    </div>
                </div>
                <p className='text-center font-bold text-xl mt-5'>Sector</p>
                <Divider sx={{marginTop:1, marginBottom: 2}}/>
                <div className='flex flex-col justify-center items-center'>
                    <p className='w-full'>Selecciona el sector</p>
                    <RadioGroup row defaultValue="camel" name='sector' value={sector} onChange={onChangeFormTickets}>
                        <div className=' flex w-full'>
                            <FormControlLabel sx={{flex:'1'}} value="camel" control={<Radio />} label="Camel" />
                            <FormControlLabel sx={{flex:'1'}} value="cbn" control={<Radio />} label="CBN" />
                            <FormControlLabel sx={{flex:'1'}} value="parrales" control={<Radio />} label="Parrales" />

                        </div>
                        <div className='w-full flex'>
                            <FormControlLabel sx={{flex:'1'}} value="experiencia" control={<Radio />} label="Experiencia" />
                            <FormControlLabel sx={{flex:'1'}} value="mambo" control={<Radio />} label="Mambo" />
                            <FormControlLabel sx={{flex:'1'}} value="digestan" control={<Radio />} label="Digestan" />
                        </div>
                    </RadioGroup>
                </div>
                <p className='text-end text-2xl font-bold mt-5'>Precio: <span className='font-normal ml-5'>{ticketPrice} Bs.</span></p>
                <Divider/>
                <br />
                <FormGroup>
                    <LoadingButton onClick={createTicket} disabled={createButtonDisabled} loading={isLoading} variant='contained'>Crear Entrada</LoadingButton>
                </FormGroup>
                </>
            )
        }
    </FormControl>
  )
}
