"use client"
import AttendanceTracker from '@/components/attendance/attendance-dashboard'
import useSidebar from '@/components/ui/sidebar';
import React, { useEffect } from 'react'

function Attendance() {
  const { toggleSidebar, open, isMobile, setOpenMobile } = useSidebar();
     useEffect(() => {
              
              if (isMobile) {
                setOpenMobile(false);
              }
            }, []);
  return (
    <div className='h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)]  max-w-screen w-screen  md:max-w-full md:w-full overflow-y-auto'>
      <AttendanceTracker />
    </div>
  )
}

export default Attendance
