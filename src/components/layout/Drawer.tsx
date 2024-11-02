/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import {  Divider, IconButton, Tooltip, Drawer, CircularProgress } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import AssessmentIcon from '@mui/icons-material/Assessment';
import QrCodeIcon from '@mui/icons-material/QrCode';
import EventIcon from '@mui/icons-material/Event';
import Image from 'next/image';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useUser } from '@/context/UserContext';

export const DrawerComponent = () => {

  const currentPath = usePathname();
  const [open, setOpen] = useState(false);
  const { role, loading } = useUser();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navbarItems = role === "portero"
    ? [{ id: "nav-7", icon: <QrCodeIcon className='text-gray-800'/>, title: 'Qr Scan', path: '/qr' }]
    : [
        { id: "nav-1", icon: <HomeIcon className='text-gray-800'/>, title: 'Home Page', path: '/' },
        { id: "nav-2", icon: <ConfirmationNumberIcon className='text-gray-800'/>, title: 'Entradas', path: '/entradas' },
        { id: "nav-3", icon: <EventIcon className='text-gray-800'/>, title: 'Eventos', path: '/eventos' },
        { id: "nav-4", icon: <PeopleAltIcon className='text-gray-800'/>, title: 'Usuarios', path: '/usuarios' },
        { id: "nav-5", icon: <QrCodeIcon className='text-gray-800'/>, title: 'Qr Scan', path: '/qr' }
      ];
  
  return (
    <>
        <div className='pt-1 pl-1'>
            <IconButton onClick={toggleDrawer}><MenuIcon fontSize='large' sx={{color:'black', fontWeight:'600'}}/></IconButton>
        </div>
        <Drawer open={open} onClose={toggleDrawer}>
            <div className='px-3 w-[270px]'>
                <figure className='my-5 rounded-lg w-fit overflow-hidden'>
                    <Image src='/assets/icons/logo.png' alt='logo' width={50} height={50}/>
                </figure>
                    <Divider/>
                    {
                       loading ?
                       <div className='px-3'>
                        <CircularProgress size={20}/>
                     </div> 
                        : 
                    <div className='flex flex-col justify-center'>
                    {navbarItems.map( navItem => (
                        <Tooltip key={navItem.id} title={navItem.title} placement='right'>
                            <Link href={navItem.path} onClick={toggleDrawer} className={clsx('my-2 rounded-xl',{'bg-gray-200': currentPath === navItem.path})}>
                                <IconButton >
                                    {navItem.icon}
                                </IconButton>
                                    {navItem.title}
                            </Link>
                        </Tooltip>
                    ))}
                    </div>
                    }

            </div>
        </Drawer>
    </>
  )
}
