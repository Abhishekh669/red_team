"use client"
import Users from '@/components/chat/users'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function ContactPage() {
    const router = useRouter()
  return (
    <div>
      <Users />
      <div>
        <Button className='mt-4 p-4 '
        
        onClick={() =>router.push("/new-chat")}
        >
            <ArrowLeft />
            <span>Go to Chats</span>

        </Button>
      </div>
    </div>
  )
}

export default ContactPage
