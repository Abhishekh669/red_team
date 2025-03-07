import AdminDashboard from '@/components/admin/admin-dashboard/admin-dashboard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Bell, GraduationCap, Settings } from 'lucide-react'
import React from 'react'

function AdminDashboardPage() {
  return (
    <div className='w-full h-full  bg-black'>
      <div>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-red-600" />
          <h1 className="text-lg font-semibold">Tech Academy Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-zinc-400" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-zinc-400" />
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      </div>
      <div className='p-4'>
      <AdminDashboard/>
      </div>
    </div>
  )
}

export default AdminDashboardPage
