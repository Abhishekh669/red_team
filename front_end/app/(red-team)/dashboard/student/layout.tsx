"use client"
import { Loader } from '@/components/ui/Loader';
import { useAdminStore } from '@/utils/store/use-admin-store'
import React from 'react'
import toast from 'react-hot-toast';


function layout({children} : {children : React.ReactNode}) {
    const {AdminStatus} = useAdminStore();
    
  return (
    <div className='w-full h-full'>
      {children}
    </div>
  )
}

export default layout
