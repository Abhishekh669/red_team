"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Users, UserIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type Conversation, dummyUsers, type User } from "@/lib/dummy-data"
import { toast } from "@/components/ui/use-toast"

interface SidebarProps {
  conversations: Conversation[]
  onSelectConversation: (conversation: Conversation) => void
  onCreateConversation: (conversation: Conversation) => void
  currentUser: User
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  onSelectConversation,
  onCreateConversation,
  currentUser,
}) => {
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const handleCreateGroup = () => {
    if (newGroupName.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a group name.",
        variant: "destructive",
      })
      return
    }

    if (selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one other user for the group.",
        variant: "destructive",
      })
      return
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      type: "group",
      participants: [currentUser.id, ...selectedUsers],
      messages: [],
    }
    onCreateConversation(newConversation)
    setIsNewGroupOpen(false)
    setNewGroupName("")
    setSelectedUsers([])

    toast({
      title: "Success",
      description: "Group created successfully!",
    })
  }

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const filteredUsers = dummyUsers.filter(
    (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) && user.id !== currentUser.id,
  )

  const handleStartConversation = (user: User) => {
    const existingConversation = conversations.find(
      (conv) => conv.type === "single" && conv.participants.includes(user.id),
    )

    if (existingConversation) {
      onSelectConversation(existingConversation)
    } else {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        name: user.name,
        type: "single",
        participants: [currentUser.id, user.id],
        messages: [],
      }
      onCreateConversation(newConversation)
    }
  }

  return (
    <div className="w-80 bg-secondary p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Chats</h2>
        <Dialog open={isNewGroupOpen} onOpenChange={setIsNewGroupOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Group name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
              <ScrollArea className="h-[200px]">
                {dummyUsers
                  .filter((user) => user.id !== currentUser.id)
                  .map((user) => (
                    <div key={user.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                      <label htmlFor={`user-${user.id}`} className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </label>
                    </div>
                  ))}
              </ScrollArea>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="chats" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        <TabsContent value="chats" className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSelectConversation(conversation)}
            >
              {conversation.type === "group" ? (
                <Users className="mr-2 h-4 w-4" />
              ) : (
                <UserIcon className="mr-2 h-4 w-4" />
              )}
              <div className="text-left">
                <div>{conversation.name}</div>
                <div className="text-xs text-muted-foreground">{conversation.lastMessage}</div>
              </div>
            </Button>
          ))}
        </TabsContent>
        <TabsContent value="contacts" className="flex-1 flex flex-col">
          <div className="mb-4">
            <Input
              placeholder="Search contacts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startAdornment={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <ScrollArea className="flex-1">
            {filteredUsers.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start mb-2"
                onClick={() => handleStartConversation(user)}
              >
                <Avatar className="mr-2">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                {user.name}
              </Button>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Sidebar

