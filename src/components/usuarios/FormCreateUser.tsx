/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { Divider, FormControl, FormGroup, MenuItem, Select, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Swal from 'sweetalert2'
import _ from 'lodash'
import { createUserService } from '@/services/authService'


export const FormCreateUser = ({ setIsOpenCreateUserForm }: any) => {

    const [isLoading, setIsLoading] = useState(false)
    const [formCreateTicket, setFormCreateTicket] = useState({
        nombre: '',
        rol:'',
        email: '',
        password: '',
    })

    const { nombre, rol, email, password } = formCreateTicket;

    const onChangeFormTickets = (e: any) => {
        setFormCreateTicket({
            ...formCreateTicket,
            [e.target.name]: e.target.value
        })
    }

    const createUser = async () => {
        setIsLoading(true)

        const resp = await createUserService(formCreateTicket);
        if (resp?.ok) {
            Swal.fire({
                title:'Usuario creado correctamente',
                icon:'success',
                showConfirmButton: false,
                timer: 1500
            })
        }else{
            Swal.fire({
                title:'Error al crear usuario',
                icon:'error',
                showConfirmButton: false,
                timer: 1500
            })
        }
        setIsOpenCreateUserForm(false)
        setIsLoading(false)

    }

    const validarEmail = (email:string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return _.isString(email) && regex.test(email);
    };

    const isCreateDisabled = _.isEmpty(nombre) || _.isEmpty(rol) || _.isEmpty(password) || !validarEmail(email)

    return (
        
        <FormControl fullWidth sx={{width:'320px'}}>
            <p className='text-center font-bold text-3xl'>Creacion de Usuario</p>
            <small className='text-center mt-1'>Formulario para crear nuevos usuarios</small>
            <Divider sx={{marginTop:1, marginBottom: 2}}/>
            <FormGroup>
                <h3 className='font-medium my-2'>Nombre</h3>
                <TextField name='nombre' onChange={onChangeFormTickets} value={nombre} size='small' fullWidth placeholder='John Doe' type='text'/>
            </FormGroup>
            <FormGroup>
                <h3 className='font-medium my-2'>Rol</h3>
                <Select
                    size='small'
                    value={rol}
                    name='rol'
                    label="Age"
                    onChange={onChangeFormTickets}
                >
                    <MenuItem value={'administrador'}>Administrador</MenuItem>
                    <MenuItem value={'socio'}>Socio</MenuItem>
                    <MenuItem value={'colaborador'}>Colaborador</MenuItem>
                    <MenuItem value={'portero'}>Guardia</MenuItem>
                </Select>
            </FormGroup>
            <FormGroup>
                <h3 className='font-medium my-2'>Email</h3>
                <TextField name='email' onChange={onChangeFormTickets} value={email} size='small' fullWidth placeholder='example@gmail.com' type='email'/>
            </FormGroup>
        
            <FormGroup>
                <h3 className='font-medium my-2'>Password</h3>
                <TextField name='password' onChange={onChangeFormTickets} value={password} size='small' fullWidth placeholder='******' type='password'/>
            </FormGroup>
            <br />
            <FormGroup>
                <LoadingButton onClick={createUser} disabled={isCreateDisabled} loading={isLoading} variant='contained'>Crear usuario</LoadingButton>
            </FormGroup>
                
        </FormControl>
    )
}
