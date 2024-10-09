'use client'
import React from 'react'
import { Divider, IconButton } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import QrCodeIcon from '@mui/icons-material/QrCode';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export const Navbar = () => {

  const currentPath = usePathname();

  const navbarItems = [
    { id: "nav-1", icon: <HomeIcon className='text-gray-800'/>, title: 'Search', path: '/' },
    { id: "nav-2", icon: <ConfirmationNumberIcon />, title: 'Wishlists', path: '/' },
    { id: "nav-3", icon: <PeopleAltIcon />, title: 'Notification', path: '/' },
    { id: "nav-4", icon: <AssessmentIcon />, title: 'Profile', path: '/' },
    { id: "nav-4", icon: <QrCodeIcon />, title: 'Profile', path: '/' },
];
  
  return (
    <section className='px-3'>
      <figure className='my-5 rounded-lg overflow-hidden'>
        <Image src='/assets/icons/logo.png' alt='logo' width={40} height={60}/>
      </figure>
        <Divider/>
        <div className='flex flex-col justify-center items-center'>
          {navbarItems.map( navItem => (
            <Link key={navItem.id} href={navItem.path} className={clsx('my-2 rounded-xl',{'bg-gray-200': currentPath === navItem.path})}>
            <IconButton >
              {navItem.icon}
            </IconButton>
            </Link>
          ))}
        </div>
    </section>
  )
}
