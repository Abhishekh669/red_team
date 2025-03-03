"use client"
import AbsentRequestForm from '@/components/absent/absent-dashboard';
import AdminAbsent from '@/components/admin/admin-absent';
import useSidebar from '@/components/ui/sidebar';
import { useAdminStore } from '@/utils/store/use-admin-store';
import React, { useEffect } from 'react'
function Absent() {
    const {AdminStatus} = useAdminStore();
     const {  isMobile, setOpenMobile } = useSidebar();
        useEffect(() => {
         
          if (isMobile) {
            setOpenMobile(false);
          }
        }, []);

  return (
    <div className='h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)]  max-w-screen w-screen md:max-w-full md:w-full   text-white p-4'>
      <div>
      <h1 className="text-4xl font-bold text-red-600 mb-8 px-4 text-center md:text-start">Absent Requests{AdminStatus ? (<><span className='text-red-600 underline text-[20px] ml-2'>(admin)</span></>) : ""}</h1>
      </div>
      <div>
        {
          AdminStatus ? (<AdminAbsent />) : (<AbsentRequestForm />)
        }
      

      </div>
    </div>
  )
}

export default Absent
