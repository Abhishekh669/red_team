"use client"
import AuthorizePage from '@/components/authorize/authorize-me'
import useSidebar from '@/components/ui/sidebar';
import React, { useEffect } from 'react'

function Authorize() {

  const {  isMobile, setOpenMobile } = useSidebar();
    useEffect(() => {
      
      if (isMobile) {
        setOpenMobile(false);
      }
    }, [isMobile, setOpenMobile]);
  

  
  return (
    <div className='h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)] overflow-y-auto bg-black px-8 py-6'>
      <AuthorizePage />
    </div>
  )
}

export default Authorize