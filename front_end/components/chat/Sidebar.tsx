"use client";
import {
  ChevronRight,
  Contact,
  Plus,
  Search,
  UserIcon,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useSocketIOStore } from "@/utils/store/use-socket-io";
import { useChatStore } from "@/utils/store/use-chat-store";
import { useGetUsers } from "@/utils/hooks/query-hooks/users/use-get-all-users";
import { UserType } from "../authorize/authorize-user";
import { useSessionStore } from "@/utils/store/use-session-store";
import { ConversationFromServer, UserForConversation, UserInMessageType } from "@/types";
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
import { useCreateChat } from "@/utils/hooks/mutate-hooks/chat/use-create-chat";

const Sidebar = () => {
  const { user } = useSessionStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchWorkspace, setSearchWorkspace] = useState("")
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("chats"); // State to track active tab

  const {
    isConversationLoading,
    isMessagesLoading,
    conversations,
    getConversations,
  } = useChatStore();

  const { mutate: create_chat, isPending: creating_chat } = useCreateChat();
  const { data: users, isLoading: usersLoading } = useGetUsers();
  const [searchUser, setSearchUser] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [groupConversation, setGroupConversation] = useState<any[]>([]);

  const { onlineUsers, setSelectedChat } = useSocketIOStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    if (conversations) {
      const groupConversations = conversations.filter(
        (c) => (c.isGroup || c.name || c.groupImage) &&
        (!searchWorkspace || c.name?.toLowerCase().includes(searchWorkspace.toLowerCase()))
      );
      setGroupConversation(groupConversations);
    }
  }, [conversations, searchWorkspace]); // Only update when conversations change
  
  const otherUserData = useMemo(() => {
    if (isConversationLoading || !conversations) return [];
  
    // Filter out group conversations
    const nonGroupConversations = conversations.filter(
      (c) => !c.isGroup && !c.name && !c.groupImage
    );
  
    // Process non-group conversations
    return nonGroupConversations
      .map((conversation) => {
        let otherUser = conversation.members.filter(
          (member: UserInMessageType) => member._id !== user?._id
        )[0];
        otherUser = { ...otherUser, conversationId: conversation._id };
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
  }, [user, usersLoading, searchUser]);

  const handleCreateGroup = () => {
    if(selectedUsers.length == 0 || !user)return;
    if(!newGroupName){
      toast.error("group name is necessary")
      return;
    }
    const groupMembers = selectedUsers.filter((u)=> u !== user?._id);
    const values ={
      members : groupMembers,
      name : newGroupName,
      groupImage : "",
    }

    create_chat(values,{
      onSuccess: (res) => {
        if (res.chat && res.message) {
          const data = JSON.parse(res.chat);
          setSelectedChat(data._id);
          toast.success("Conversation created successfully");
          setIsNewGroupOpen(false)
          if(data.isGroup){
            setActiveTab("workspaces");
          }else{
            setActiveTab("chats")
          } 
          getConversations();
        } else if (res.error) {
          toast.error(res.error as string);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong");
      },

    })

    // Group creation logic
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

  const handleStartConversation = (userData: UserType) => {
    if (creating_chat || usersLoading || !user) return;
    if (user?._id === userData?._id) return;

    const values = {
      members: [userData._id], // Include both users in the conversation
    };

    create_chat(values, {
      onSuccess: (res) => {
        if (res.chat && res.message) {
          const data = JSON.parse(res.chat);
          setSelectedChat(data._id);
          toast.success("Conversation created successfully");

          setActiveTab("chats"); // Switch to the "Chats" tab
          getConversations();
        } else if (res.error) {
          toast.error(res.error as string);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong");
      },
    });
  };

  return (
    <div
      className={`py-4 bg-secondary transition-all duration-300 ease-in-out 
        ${isHovered ? "sm:w-72 md:w-72" : "sm:w-16 md:w-16"} 
        lg:w-72 h-full flex flex-col`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isNewGroupOpen} onOpenChange={setIsNewGroupOpen}>
          <div
            className={`px-4 w-full flex items-center lg:justify-between ${
              isHovered ? "sm:justify-between" : ""
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                !isHovered && "sm:hidden md:hidden"
              } lg:block`}
            >
              Chats
            </h2>
            <DialogTrigger asChild>
              <Hint label="Create new group">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsNewGroupOpen(true)}
                >
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
                {otherContacts &&
                  otherContacts.map((user : UserType) => (
                    <div
                      key={user._id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Checkbox
                        id={`user-${user._id}`} // Use user._id for unique ID
                        checked={selectedUsers.includes(user._id)} // Use user._id for comparison
                        onCheckedChange={() => handleSelectUser(user._id)} // Use user._id for selection
                      />
                      <label
                        htmlFor={`user-${user._id}`} // Use user._id for unique htmlFor
                        className="flex items-center space-x-2"
                      >
                        <Avatar>
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback className="bg-blue-600 rounded-full">
                            {user.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </label>
                    </div>
                  ))}
              </ScrollArea>
              <div className="w-full   flex justify-between gap-x-3">
                <Button
                  onClick={() => setIsNewGroupOpen(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className={`${!isHovered && "sm:hidden md:hidden"} lg:flex`}>
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        <TabsContent value="chats" className="space-y-4">
          <div
            className={`px-2 ${!isHovered && "sm:hidden md:hidden"} lg:block`}
          >
            <Input
              placeholder="Search chats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea>
            {otherUserData &&
              otherUserData?.map((user: UserForConversation) => (
                <Button
                  key={user._id}
                  variant="ghost"
                  className="w-full h-12 relative justify-start mb-2"
                  onClick={() => setSelectedChat(user.conversationId)}
                >
                  <Avatar className="absolute left-2">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="bg-blue-300 rounded-full">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`${
                      !isHovered && "sm:hidden md:hidden"
                    } lg:inline absolute left-16`}
                  >
                    {user.name}
                  </span>
                  {!isHovered && (
                    <ChevronRight className="h-4 w-4 sm:block md:block lg:hidden absolute right-0" />
                  )}
                </Button>
              ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="workspaces" className="flex flex-col">
        <div
            className={`px-2 ${!isHovered && "sm:hidden md:hidden"} lg:block`}
          >
            <Input
              placeholder="Search workspace"
              value={searchWorkspace}
              onChange={(e) => setSearchWorkspace(e.target.value)}
            />
          </div>
          <ScrollArea>
            {groupConversation &&
              groupConversation?.map((con : ConversationFromServer) => (
                <Button
                  key={con._id}
                  variant="ghost"
                  className="w-full h-12 relative justify-start mb-2"
                  onClick={() => setSelectedChat(con._id)}
                >
                  <Avatar className="absolute left-2">
                    <AvatarImage src={con.groupImage} alt={"image"} />
                    <AvatarFallback className="bg-blue-300 rounded-full">
                      {user?.name.charAt(0).toUpperCase() || "G"}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`${
                      !isHovered && "sm:hidden md:hidden"
                    } lg:inline absolute left-16`}
                  >
                    {con.name}
                  </span>
                  {!isHovered && (
                    <ChevronRight className="h-4 w-4 sm:block md:block lg:hidden absolute right-0" />
                  )}
                </Button>
              ))}
          </ScrollArea>

        </TabsContent>
        <TabsContent value="contacts" className="flex-1 flex flex-col">
          <div
            className={`mb-4 px-2 ${
              !isHovered && "sm:hidden md:hidden"
            } lg:block`}
          >
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
                  disabled={creating_chat}
                  className="w-full relative justify-start mb-2"
                  onClick={() => handleStartConversation(user)}
                >
                  <Avatar className="absolute left-2">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="bg-blue-300 rounded-full">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`${
                      !isHovered && "sm:hidden md:hidden"
                    } lg:inline absolute left-16`}
                  >
                    {user.name}
                  </span>
                  {!isHovered && (
                    <ChevronRight className="h-4 w-4 sm:block md:block lg:hidden absolute right-0" />
                  )}
                </Button>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
