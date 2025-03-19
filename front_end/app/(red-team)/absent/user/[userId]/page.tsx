"use client";

import {  redirect, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetUserAbsentById } from "@/utils/hooks/query-hooks/admin/use-get-user-absent-data";
import { useUserId } from "@/utils/use-user-id";
import { useGetUserById } from "@/utils/hooks/query-hooks/users/use-get-user-by-id";
import { useAcceptAbsentRequest } from "@/utils/hooks/mutate-hooks/admin/use-accept-absent";
import { useRejectAbsentRequest } from "@/utils/hooks/mutate-hooks/admin/use-reject-absent";
import toast from "react-hot-toast";
import { Loader } from "@/components/ui/Loader";
import { useGetAdminByToken } from "@/utils/hooks/query-hooks/admin/use-get-admin-by-token";

interface AbsentRequestType {
  codeName: string;
  createdAt: Date;
  date: Date;
  name: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
  updatedAt: Date;
  userId: string;
  _id: string;
}


export default function UserAbsenceRecords() {
  const userId = useUserId();
  const router = useRouter();
  const { data: userAbsentRequests, isLoading: userAbsentRequestsLoading } = useGetUserAbsentById(userId);
  const { data: userData, isLoading: userDataLoading } = useGetUserById(userId);
  const {mutate : accept_absent_request, isPending : accepting} = useAcceptAbsentRequest()
  const {mutate : reject_absent_request, isPending : rejecting} = useRejectAbsentRequest()
  const {data : admin_token, isLoading : admin_token_loading} = useGetAdminByToken()

  const handleAccept  = (id : string, userId : string) =>{
    if(userAbsentRequestsLoading)return;
    accept_absent_request({id, userId},{
      onSuccess : (res) =>{
        if(res.message && res.status){
          toast.success(res.message)
        }else if(res.error){
          toast.error(res.error)
        }
      }, onError : () =>{
        toast.error("failed to accept the request")
      }
    })


  }

  const handleReject = (id : string, userId : string) =>{
    if(userAbsentRequestsLoading)return;
    reject_absent_request({id ,userId},{
      onSuccess : (res) =>{
        if(res.message && res.status){
          toast.success(res.message)
        }else if(res.error){
          toast.error(res.error)
        }
      }, onError : () =>{
        toast.error("failed to accep the request")
      }
    })
    
  }
 
  

  // Function to get the appropriate status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-900/20 text-yellow-500 border-yellow-500 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-900/20 text-green-500 border-green-500 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-900/20 text-red-500 border-red-500 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if(userDataLoading || userAbsentRequestsLoading || admin_token_loading) return <Loader />
  if(!admin_token?.admin_data) return redirect("/absent")
  return (
    <div className="flex flex-col items-center lg:items-start bg-black p-8 lg:p-10">
      <div className="w-full max-w-6xl">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <Button
              variant="ghost"
              className="mb-4 text-red-600 hover:bg-black hover:text-red-400 p-0"
              onClick={() => router.push("/absent")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Absent page
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">
              Absence Records for {userData?.user?.name} (
              {userData?.user?.codeName})
            </h1>
            <p className="text-gray-400">
              View and manage employee absence records
            </p>
          </div>
        </header>
          <Card className="border-red-600 bg-slate-950 text-white shadow-lg">
          <CardHeader className="border-b border-red-800 pb-4">
            <CardTitle className="text-2xl font-bold text-red-600">
              Absence History
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {userAbsentRequests?.userAbsentRequest.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No absence records found for this user.
              </p>
            ) : (
              <div className="flex flex-wrap gap-x-4 gap-y-4">
                {userAbsentRequests?.userAbsentRequest &&
                  userAbsentRequests?.userAbsentRequest?.map(
                    (record: AbsentRequestType) => (
                      <Card
                        key={record._id}
                        className="border-gray-900 bg-gray-800 hover:border-red-500 transition-all md:max-w-[400px]  md:w-[350px] md:h-[200px]"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start ">
                            <CardTitle className="text-lg font-semibold">
                              {format(record.date, "PPP")}
                            </CardTitle>
                            
                            {getStatusBadge(record.status)} 
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between gap-y-8   ">
                          <div>
                          <p className="text-sm text-gray-400 mb-2  ">
                            {record.reason}
                          </p>
                          <div >
                          <p className="text-xs text-gray-500">
                            Created: {format(record.createdAt, "Pp")}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last Updated: {format(record.updatedAt, "Pp")}
                          </p>
                          </div>
                          </div>
                          <div>
                            {
                              record.status === "pending" && (
                                <CardFooter className="flex justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-300 text-rose-600  hover:text-rose-800  hover:bg-rose-400 border-none"
                                onClick={() =>{
                                  handleReject(record._id, record.userId)
                                }}
                                disabled={rejecting}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                {rejecting  ? "Rejecting..." : "Reject"}
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                className="text-rose-600 hover:text-rose-600 bg-green-300 hover:bg-green-300"
                                onClick={() =>{
                                  handleAccept(record._id, record.userId)
                                }}
                                disabled={accepting}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {accepting ? "Accepting..." : "Accept"}
                              </Button>
                            </CardFooter>
                              )
                            }
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
