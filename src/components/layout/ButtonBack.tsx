'use client'
import React from 'react'
import { IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

export const ButtonBack = () => {
    const router = useRouter();
  return (
    <IconButton onClick={()=> router.back()}>
        <ArrowBackIcon/>
    </IconButton>
  )
}
