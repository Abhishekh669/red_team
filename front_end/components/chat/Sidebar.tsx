"use client";
import { ChevronRight, Contact, Plus, Search, UserIcon, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useSocketIOStore } from "@/utils/store/use-socket-io";
import { useChatStore } from "@/utils/store/use-chat-store";
import { useGetUsers } from "@/utils/hooks/query-hooks/users/use-get-all-users";
import { UserType } from "../authorize/authorize-user";
import { useSessionStore } from "@/utils/store/use-session-store";
import { UserForConversation, UserInMessageType } from "@/types";
import { Button } from "../ui/button";
import Hint from "../Hint";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user } = useSessionStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const {
    isConversationLoading,
    isMessagesLoading,
    conversations,
    getConversations,
    
  } = useChatStore();
  const { data: users, isLoading: usersLoading } = useGetUsers();
  const [searchUser, setSearchUser] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const { onlineUsers, setSelectedChat, selectedChat } = useSocketIOStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const otherUserData = useMemo(() => {
    if (isConversationLoading || !conversations) return [];
    return conversations
      ?.map((conversation) => {
        let otherUser = conversation.members.filter(
          (member: UserInMessageType) => member._id !== user?._id
        )[0];
        otherUser = { ...otherUser, conversationId: conversation._id };

        // Return null if no other user is found
        return otherUser || null;
      })
      .filter((userData: UserForConversation) =>
        userData.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(Boolean);
  }, [user, isConversationLoading, conversations, searchTerm]);

  const otherContacts = useMemo(() => {
    if (usersLoading || !user) return [];
    return users?.users
      .filter((userData: UserType) => userData._id !== user?._id)
      .filter((userData: UserType) =>
        userData.name.toLowerCase().includes(searchUser.toLowerCase())
      );
  }, [user, usersLoading, , searchUser]);

  const handleCreateGroup = () => {
    if (newGroupName.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a group name.",
        variant: "destructive",
      });
      return;
    }

    if (selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one other user for the group.",
        variant: "destructive",
      });
      return;
    }

    setIsNewGroupOpen(false);
    setNewGroupName("");
    setSelectedUsers([]);

    toast({
      title: "Success",
      description: "Group created successfully!",
    });
  };

  useEffect(() => {
    getConversations();
  }, [getConversations]);

  const filteredUsers = useMemo(() => {
    return showOnlineOnly
      ? users?.users?.filter((user: UserType) => onlineUsers.includes(user._id))
      : users?.users;
  }, [showOnlineOnly, users?.users, onlineUsers]);

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  if (usersLoading) return <SidebarSkeleton />;

  const handleStartConversation = (user: any) => {
    console.log("this is user in the handle start conversation",selectedChat);
  };

  return (
    <div
      className={`  py-4 bg-secondary transition-all duration-300 ease-in-out 
        ${isHovered ? "sm:w-72 md:w-72" : "sm:w-16 md:w-16"} 
        lg:w-72 h-full flex flex-col`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isNewGroupOpen} onOpenChange={setIsNewGroupOpen}>
         <div className={`px-4 w-full flex items-center lg:justify-between ${isHovered ? "sm:justify-between" : ""}`}>
        <h2 className={`text-lg font-semibold ${!isHovered && "sm:hidden md:hidden"} lg:block`}>Chats</h2>
         <DialogTrigger asChild >
            <Hint label="create new group">
              <Button variant="outline" size="icon" >
                <Plus className="h-4 w-4" />
              </Button>
            </Hint>
          </DialogTrigger>
         </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <ScrollArea className="h-[200px]">
                {otherUserData &&
                  otherUserData.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className="flex items-center space-x-2"
                      >
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
        <TabsList className={`${!isHovered && "sm:hidden md:hidden"} lg:flex`}>
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList >
        <TabsContent
          value="chats"
          className=" space-y-4 "
        >
        <div className={` px-2 ${!isHovered && "sm:hidden md:hidden"} lg:block`}>
            <Input
              placeholder="Search chats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="">
            {otherUserData &&
              otherUserData?.map((user: UserForConversation) => (
                <Button
                key={user._id}
                variant="ghost"
                className="w-full  h-12 relative justify-start mb-2"
                onClick={() => setSelectedChat(user.conversationId)}
              >
                <Avatar className="absolute left-2">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className={`${!isHovered && "sm:hidden md:hidden"} lg:inline absolute left-16`}>{user.name}</span>
                {!isHovered && <ChevronRight className=" h-4 w-4 sm:block md:block lg:hidden absolute  right-0" />}
              </Button>
              ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="contacts" className="  flex-1 flex flex-col ">
          <div className={`mb-4 px-2 ${!isHovered && "sm:hidden md:hidden"} lg:block`}>
            <Input
              placeholder="Search contacts"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
          <div>
          {otherContacts &&
            otherContacts?.map((user: UserType) => (
              <Button
                key={user._id}
                variant="ghost"
                className="w-full relative justify-start mb-2"
                onClick={() => handleStartConversation(user)}
              >
                <Avatar className="absolute left-2">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className={`${!isHovered && "sm:hidden md:hidden"} lg:inline absolute left-16`}>{user.name}</span>
                {!isHovered && <ChevronRight className=" h-4 w-4 sm:block md:block lg:hidden absolute  right-0" />}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Sidebar;

{
  /* <div>
<Tabs defaultValue="chats" className="flex-1 flex flex-col">
<TabsList>
    <TabsTrigger value="chats">Chats</TabsTrigger>
    <TabsTrigger value="contacts">Contacts</TabsTrigger>
  </TabsList>
  <TabsContent value="chats">


<aside className="h-full w-20 lg:w-72 border-r border-base-300 text-white flex flex-col transition-all duration-200">
<div className="border-b border-base-300 w-full p-5">
  <div className="flex items-center gap-2">
    <Hint label="Create new contacts">
      <Button className="flex gap-x-4 p-2 hover:bg-black  hover:text-white" variant={"ghost"}>

      <Users className="size-6 cursor-pointer" />
      <span
        className="font-medium hidden lg:block"
        >
        Contacts
      </span>
        </Button>
    </Hint>
  </div>
  {/* TODO: Online filter toggle */
}
//   <div className="mt-3 hidden lg:flex items-center gap-2">
//     <label className="cursor-pointer flex items-center gap-2">
//       <input
//         type="checkbox"
//         checked={showOnlineOnly}
//         onChange={(e) => setShowOnlineOnly(e.target.checked)}
//         className="checkbox checkbox-sm"
//       />
//       <span className="text-sm">Show online only</span>
//     </label>
//     <span className="text-xs text-zinc-500">
//       ({onlineUsers.length} online)
//     </span>
//   </div>
// </div>

// <div className="overflow-y-auto w-full py-3">
//   {otherUserData &&
//     otherUserData?.map((user: UserForConversation) => (
//       <button
//         key={user._id}
//         onClick={() => setSelectedChat(user.conversationId)}
//         className={`
//         w-full p-3 flex items-center gap-3
//         hover:bg-base-300 transition-colors
//         ${
//           selectedChat === user.conversationId
//             ? "bg-base-300 ring-1 ring-base-300"
//             : ""
//         }
//       `}
//       >
//         <div className="relative mx-auto lg:mx-0">
//           <img
//             src={user.image || "/avatar.png"}
//             alt={user.name}
//             className="size-12 object-cover rounded-full"
//           />
//           {onlineUsers.includes(user._id) && (
//             <span
//               className="absolute bottom-0 right-0 size-3 bg-green-500
//             rounded-full ring-2 ring-zinc-900"
//             />
//           )}
//         </div>

//         {/* User info - only visible on larger screens */}
//         <div className="hidden lg:block text-left min-w-0">
//           <div className="font-medium truncate">{user.name}</div>
//           <div className="text-sm text-zinc-400">
//             {onlineUsers.includes(user._id) ? "Online" : "Offline"}
//           </div>
//         </div>
//       </button>
//     ))}

//   {otherUserData && otherUserData?.length === 0 && (
//     <div className="text-center text-zinc-500 py-4">
//       <Button
//         className=""
//         onClick={() => router.push("/new-chat/contacts")}
//       >
//         <Hint label="create new conversation">
//           <span>
//             <Plus />
//           </span>
//         </Hint>
//         <span className="hidden lg:flex">Create New Conversation</span>
//       </Button>
//     </div>
//   )}
// </div>
// </aside>

//   </TabsContent>
//   <TabsContent value="contacts" className="flex-1 flex flex-col">
//     <div className="mb-4">
//       <Input
//         placeholder="Search contacts"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         startAdornment={<Search className="h-4 w-4 text-muted-foreground" />}
//       />
//     </div>
//     <ScrollArea className="flex-1">
//       {filteredUsers.map((user) => (
//         <Button
//           key={user.id}
//           variant="ghost"
//           className="w-full justify-start mb-2"
//           onClick={() => handleStartConversation(user)}
//         >
//           <Avatar className="mr-2">
//             <AvatarImage src={user.avatar} alt={user.name} />
//             <AvatarFallback>{user.name[0]}</AvatarFallback>
//           </Avatar>
//           {user.name}
//         </Button>
//       ))}
//     </ScrollArea>
//   </TabsContent>

// </Tabs>

// </div> */}
