/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogContent, IconButton, Tooltip } from '@mui/material'
import { FormCreateUser } from './FormCreateUser'
import { getUsers } from '@/services/authService'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const ReporteUsuarios = () => {

    const [isOpenCreateUserForm, setIsOpenCreateUserForm] = useState(false)
    const [userList, setUserList] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false)

    const getAllUsers = async () => {
        setIsLoading(true)
        const resp = await getUsers();
        setIsLoading(false)
        setUserList(resp.users)
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre', flex: 1},
        { field: 'email', headerName: 'Email', flex: 1},
        { field: 'role', headerName: 'Rol', flex: 1},

        { 
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            renderCell:( _ticket ) => (
                <div>
                    <Tooltip title='Editar' placement='left'><IconButton onClick={() => {}}><EditIcon color='warning'/></IconButton></Tooltip>
                    <Tooltip title='Ver entrada' placement='top'><IconButton onClick={() => {}}><RemoveRedEyeIcon color='primary'/></IconButton></Tooltip>
                    <Tooltip title='Eliminar entrada' placement='right'>
                        <IconButton><DeleteIcon color='error'/></IconButton>
                    </Tooltip>
                </div>
            )
        },
    ];


    return (
        <div>
            <Button onClick={()=>setIsOpenCreateUserForm(true)} variant='contained'>Crear nuevo usuario</Button>
            <br />
            <br />
            <div className='bg-white'>
                <DataGrid  
                    autoHeight
                    rowSelection={false}
                    loading={isLoading}
                    rows={userList}
                    columns={columns}
                /> 

            </div>

            <Dialog onClose={() => setIsOpenCreateUserForm(false)} open={isOpenCreateUserForm}>
                <DialogContent sx={{minHeight:'300px'}}>
                    <FormCreateUser setIsOpenCreateUserForm={setIsOpenCreateUserForm}/>
                </DialogContent>
            </Dialog>

        </div>
    )
}
