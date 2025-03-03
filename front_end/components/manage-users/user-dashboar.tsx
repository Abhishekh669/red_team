"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Trash,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetUsers } from "@/utils/hooks/query-hooks/users/use-get-all-users";
import { UserType } from "../authorize/authorize-user";
import { useDeleteUser } from "@/utils/hooks/mutate-hooks/admin/use-delete-user";
import { useSetOrDeleteUser } from "@/utils/hooks/mutate-hooks/admin/use-setorremove-user";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { useGetAdminByToken } from "@/utils/hooks/query-hooks/admin/use-get-admin-by-token";

const UserDashboard: React.FC = () => {
    const {data : session} = useGetSession();
  const { data: all_users, isLoading: users_loading } = useGetUsers();
  const [users, setUsers] = useState<UserType[]>([]);
  const { isLoading : admin_loading} = useGetAdminByToken();
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const {mutate : delete_user} = useDeleteUser()
  const {mutate : set_or_delete_user} = useSetOrDeleteUser()
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");



  

  

  // useEffect(() =>{
  //   if(checkToken){
  //     if(users_loading || admin_loading) return ;
  //   if(!admin_data?.admin_data && !admin_data?.message){
  //     toast.error("not authorized")
  //     router.push("/dashboard")
  //     setCheckToken(false)
  //   }
  //   }
  // },[users_loading, admin_loading, setCheckToken, admin_data?.admin_data])

  useEffect(() => {
    if (users_loading) return;
    if (all_users?.users) setUsers(all_users?.users);
  }, [all_users?.users, users_loading]);

  useEffect(() => {
    let result = users;
    if (filter !== "all") {
      result = result.filter((user) => {
        if (filter === "admin") return user.isAdmin;
        if (filter === "verified") return user?.isVerified;
        if (filter === "students") return !user?.isAdmin;
        return true;
      });
    }
    if (search) {
      result = result.filter(
        (user) =>
          user?.name.toLowerCase().includes(search.toLowerCase()) ||
          user?.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredUsers(result);
  }, [users, filter, search]);

  const handleSetOrRemove = (userId: string) => {
    if(!userId || admin_loading || users_loading){
        toast.error("Wait some moments")
        return
    };
    if(!session?.user?.isAdmin){
      toast.error("not authorized")
      return
    }
    set_or_delete_user({userId, currentUserId : session?.user?._id},{
        onSuccess : (res) =>{
            if(res.status && res.message){
                toast.success(res.message);
               
            } else{
                toast.error(res.error)
            }

        },
        onError : () =>{
            toast.error("fialed to update ")
        }
    })
     

  };

  const handleDeleteUser = (id: string) => {
    if(!id) return;
    if(!session?.user?.isAdmin){
      toast.error("not authorized")
      return
    }
    delete_user(id,{
        onSuccess : (res) =>{
            if(res.status && res.message){
                toast.success(res.message);
            } else{
                toast.error(res.error)
            }

        },
        onError : () =>{
            toast.error("fialed to update ")
        }
    })
  };

  const handleVisitUser = (userId: string) => {
    // This would typically navigate to a user profile page
    console.log("this ishte user id : ",userId)
    toast.success("set to admin successfully");
  };

 

  return (
    <div className="flex h-full bg-gray-900 text-gray-100 ">

      {/* Main content */}
      <div className="flex-1 flex flex-col ">
        {/* User list */}
        <main className="flex-1  overflow-y-auto bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-100 text-2xl font-semibold">Users</h3>
             
            </div>

            <div className="flex space-x-4 mb-6">
              <Select onValueChange={setFilter} defaultValue="all">
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-100">
                  <SelectValue placeholder="Filter users" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-gray-100 pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {users_loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-gray-800" />
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="bg-gray-800 rounded-lg ">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b hover:bg-gray-800 border-gray-700 ">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Age</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {filteredUsers &&
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user?._id}
                          className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer "
                        >
                          <TableCell className=" flex  items-center h-full  gap-x-4 max-w-[150px] truncate ">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={user?.image} />
                              <AvatarFallback>
                                {user?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                          <span className="text-gray-100 truncate">
                              {user?.name} {user?._id == session?.user?._id && (<span>(you)</span>)}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-300 max-w-[150px] truncate ">
                            {user?.email}
                          </TableCell>
                          <TableCell className="text-gray-300 max-w-[100px] truncate">
                            {user?.age || "N/A"}
                          </TableCell>
                          <TableCell className="">
                            <div className="flex flex-wrap gap-x-1 gap-y-1">
                              {user?.isAdmin && (
                                <Badge className="bg-rose-600 text-white">
                                  Admin
                                </Badge>
                              )}
                              {user?.isVerified && (
                                <Badge className="bg-green-600 text-white">
                                  Verified
                                </Badge>
                              )}
                              
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[120px] truncate">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-gray-100"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-100">
                                {
                                  (user?._id !== session?.user?._id) && (
                                    <>
                                      <DropdownMenuItem
                                  onClick={() => handleSetOrRemove(user?._id)}
                                  className="hover:bg-gray-700"
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  <span>
                                    {user?.isAdmin
                                      ? "Remove Admin"
                                      : "Set as Admin"}
                                  </span>
                                </DropdownMenuItem>
                                    </>
                                  )
                                }
                               
                                     <DropdownMenuItem
                                  onClick={() => handleVisitUser(user?._id)}
                                  className="hover:bg-gray-700"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  <span>Visit User</span>
                                </DropdownMenuItem>

                                {
                                (user?._id !== session?.user?._id) && (
                                  <>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user?._id)}
                                  className="text-rose-500 hover:bg-gray-700 hover:text-rose-500"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete User</span>
                                </DropdownMenuItem>
                                  </>
                                )
                               }
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-800 rounded-lg">
                <p className="text-gray-400">No users found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
