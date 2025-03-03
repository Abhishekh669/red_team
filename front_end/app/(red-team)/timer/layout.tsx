import React from 'react'

function TimerLayout({children } : {children : React.ReactNode}) {
  return (
    <div className='w-full h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)] overflow-y-auto'>
      {children}
    </div>
  )
}

export default TimerLayout
