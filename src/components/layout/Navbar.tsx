'use client'
import React from 'react'
import { Divider, IconButton, Tooltip } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import QrCodeIcon from '@mui/icons-material/QrCode';
import EventIcon from '@mui/icons-material/Event';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export const Navbar = () => {

  const currentPath = usePathname();

  const navbarItems = [
    { id: "nav-1", icon: <HomeIcon className='text-gray-800'/>, title: 'Home Page', path: '/' },
    { id: "nav-2", icon: <ConfirmationNumberIcon className='text-gray-800'/>, title: 'Entradas', path: '/entradas' },
    { id: "nav-3", icon: <EventIcon className='text-gray-800'/>, title: 'Eventos', path: '/eventos' },
    { id: "nav-4", icon: <PeopleAltIcon className='text-gray-800'/>, title: 'Usuarios', path: '/usuarios' },
    { id: "nav-5", icon: <AssessmentIcon className='text-gray-800'/>, title: 'Reportes', path: '/reportes' },
    { id: "nav-6", icon: <QrCodeIcon className='text-gray-800'/>, title: 'Qr Scan', path: '/qr' },
];
  
  return (
    <section className='px-3'>
      <figure className='my-5 rounded-lg overflow-hidden'>
        <Image src='/assets/icons/logo.png' alt='logo' width={40} height={60}/>
      </figure>
        <Divider/>
        <div className='flex flex-col justify-center items-center'>
          {navbarItems.map( navItem => (
            <Tooltip key={navItem.id} title={navItem.title} placement='right'>
              <Link  href={navItem.path} className={clsx('my-2 rounded-xl',{'bg-gray-200': currentPath === navItem.path})}>
              <IconButton >
                {navItem.icon}
              </IconButton>
              </Link>
            </Tooltip>
          ))}
        </div>
    </section>
  )
}
