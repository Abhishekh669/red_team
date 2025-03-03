"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarIcon, CheckCircle, Clock, XCircle, Edit2 } from "lucide-react"
import { format, isToday, isThisWeek, isThisMonth, isAfter } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions"
import { useCreateAbsentRequest } from "@/utils/hooks/mutate-hooks/absent/use-create-absent-request"
import { useGetUserAllAbsentRequest } from "@/utils/hooks/query-hooks/absent/use-get-user-all-absent-request"
import { Loader } from "../ui/Loader"
import { useUpdateAbsentRequest } from "@/utils/hooks/mutate-hooks/absent/use-update-absent-request"

// Define the interface for the absent request


interface ServerAbsentRequestType {
  _id  : string
  date: Date
  reason: string
  name: string
  codeName: string
  status : "pending" | "accepted" | "rejected"
  updatedAt : Date,
  createdAt : Date,
  userId : string,

}

const isTodayOrFuture = (date: Date) => {
  const today = new Date();
  return isToday(date) || isAfter(date, today);
};




// Create a schema for form validation
const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date for your absence.",
  }),
  reason: z.string().min(5, {
    message: "Reason must be at least 5 characters.",
  }),
})

// Dummy data for the user
const userData = {
  name: "John Doe",
  codeName: "Eagle Eye",
}


export default function AbsentRequestForm() {
    const {data : session, isLoading : session_loading} = useGetSession();
    const {data  : all_absentRequests, isLoading : absentRequestsLoading} = useGetUserAllAbsentRequest();
    const {mutate : create_absent_request} = useCreateAbsentRequest();
    const {mutate : update_absent_request} = useUpdateAbsentRequest();


  const [absentRequests, setAbsentRequests] = useState<ServerAbsentRequestType[]>()

  const [AbsentFilteredRequests, setAbsentFilteredRequests] = useState<ServerAbsentRequestType[]>()


  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all")

  const [editingRequest, setEditingRequest] = useState<ServerAbsentRequestType | null>(null)

  
  const [isDialogOpen, setIsDialogOpen] = useState(false)



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  })

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  })




  useEffect(()=>{
    if(absentRequestsLoading)return;
    if(all_absentRequests?.absentResults.length > 0){
      setAbsentRequests(all_absentRequests?.absentResults)
      setAbsentFilteredRequests(all_absentRequests?.absentResults)
    }
    
  },[absentRequestsLoading, all_absentRequests?.absentResults])

  const filterRequests = useCallback(
    (filterType: "all" | "today" | "week" | "month") => {
      if (absentRequestsLoading) return;
  
      setFilter(filterType);
  
      let filtered = absentRequests;
  
      switch (filterType) {
        case "today":
          filtered = absentRequests?.filter((request) => isToday(request.date));
          break;
        case "week":
          filtered = absentRequests?.filter((request) => isThisWeek(request.date));
          break;
        case "month":
          filtered = absentRequests?.filter((request) => isThisMonth(request.date));
          break;
      }
  
      setAbsentFilteredRequests(filtered);
    },
    [absentRequestsLoading, absentRequests, setFilter, setAbsentFilteredRequests]
  );

  useEffect(() => {
    filterRequests(filter)
  }, [filter, filterRequests])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if(session_loading || absentRequestsLoading) return ;
    // Check if a request for today already exists
    const todayRequest = absentRequests?.find((request) => isToday(request.date)) //setAbsentRequest
    if (todayRequest) {
      toast.error("Request already done")
      return
    }

    const utcDate = new Date(values.date.getTime() - values.date.getTimezoneOffset() * 60000);

    // Create a new absent request
    const newRequest = {
      date: utcDate,
      reason: values.reason,
      name: session?.user?.name,
      codeName: session?.user?.codeName,
    }
    console.log("this ishte new reques for absent : ",newRequest)
    create_absent_request(newRequest,{
        onSuccess : (res) =>{
            if(res.message && res.creationStatus){
              toast.success(res.message)
              form.reset()
            }else{
                toast.error(res.error)
            }
        }, 
        onError : () =>{
            toast.error("failed to create request")
        }
    })
  }

  function onEditSubmit(values: z.infer<typeof formSchema>) {

    if (editingRequest) {
      if(values.date === editingRequest.date && values.reason === editingRequest.reason){
        toast.error("No change detected")
        return
      }
      const data = {
        _id : editingRequest._id,
        reason  : values.reason,
        date : values.date,
        status : editingRequest.status,
      }

      update_absent_request(data,{
        onSuccess : (res) =>{
          if(res.message && res.status){
            toast.success(res.message)
            setEditingRequest(null) 
      setIsDialogOpen(false)
          }else{
            toast.error(res.error)
          }
        },
        onError : () =>{
          toast.error("failed to edit  the it ")
        }
      })
     
      

    }
    editForm.reset()
  }

  function startEdit(request: ServerAbsentRequestType) {
    // Check if the request date is today or in the future
    if (isTodayOrFuture(request.date)) {
      setEditingRequest(request);
      editForm.setValue("date", request.date);
      editForm.setValue("reason", request.reason);
      setIsDialogOpen(true);
    } else {
      toast.error("Cannot edit this request. Only today's or future requests can be edited.");
    }
  }

  // function startEdit(request: ServerAbsentRequestType) {
  //   if (isToday(request.date)) {
  //     setEditingRequest(request) 
  //     editForm.setValue("date", request.date)
  //     editForm.setValue("reason", request.reason)
  //     setIsDialogOpen(true)
  //   } else {
  //     toast.error("Cannot edit this request")
  //   }
  // }

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
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-500 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  // const todayRequest = absentRequests?.find((request) => isToday(request.date))
  const convertToLocalDate = (utcDate : Date) => {
    // Ensure utcDate is a Date object
    const date = new Date(utcDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };
  
  const todayRequest = absentRequests?.find((request) => {
    const localDate = convertToLocalDate(request.date);
    return isToday(localDate);
  });
  

  return (
    <div className="flex  flex-col items-center   px-4">
      <div className="w-full   flex justify-center  md:justify-start">
        <Tabs defaultValue="new-request" className="w-full  md:max-w-[700px] lg:max-w-[800px] ">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-6">
            <TabsTrigger value="new-request" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              New Request
            </TabsTrigger>
            <TabsTrigger value="my-requests" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              My Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-request" >
            <Card className="border-red-600 bg-gray-900 text-white mb-6">
              <CardHeader className="border-b border-red-800 pb-4">
                <CardTitle className="text-2xl font-bold text-red-500">New Absent Request</CardTitle>
                <CardDescription className="text-gray-400">
                  Submit your absence request for {userData.name} ({userData.codeName})
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {
                  absentRequestsLoading ? (<Loader />) 
                  : (
                    <>
                        {todayRequest ? (
                  <p className="text-yellow-500">
                    You have already submitted a request for today. You can edit it in the My Requests tab.
                  </p>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-gray-300">Absence Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full border-gray-700 bg-gray-800 pl-3 text-left font-normal text-gray-300 hover:bg-gray-700 hover:text-white",
                                      !field.value && "text-gray-500",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto bg-gray-800 p-0 text-white">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                  initialFocus
                                  className="border-red-600"
                                  classNames={{
                                    day_selected: "bg-red-600 text-white hover:bg-red-700",
                                    day_today: "bg-gray-700 text-white",
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Reason for Absence</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide a detailed reason for your absence"
                                {...field}
                                className="min-h-[100px] border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:border-red-500"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700">
                        Submit Request
                      </Button>
                    </form>
                  </Form>
                )}
                    </>
                  )
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-requests" >
            <div className="flex justify-between gap-x-2 items-center mb-4">
              <h2 className="text-xl font-bold text-white">My Absent Requests</h2>
              <Select onValueChange={(value: "all" | "today" | "week" | "month") => filterRequests(value)}>
                <SelectTrigger className="w-[180px]  bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {AbsentFilteredRequests && AbsentFilteredRequests?.map((request) => (
                <Card key={request._id} className="border-gray-800 bg-gray-900 text-white min-h-[194px] p-4 space-y-6">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start  gap-x-2">
                      <CardTitle className="text-md font-semibold">{format(request.date, "PPP")}</CardTitle>
                      {getStatusBadge(request.status || "pending")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400 mb-2">{request.reason}</p>
                    <p className="text-xs text-gray-500">
                      {request.name} ({request.codeName})
                    </p>
                  </CardContent>
                  {isTodayOrFuture(new Date(request.date)) && request.status === "pending" && (
  <CardFooter>
    <Button
      onClick={() => startEdit(request)}
      className="w-full bg-gray-800 text-white hover:bg-gray-700"
    >
      <Edit2 className="mr-2 h-4 w-4" /> Edit Request
    </Button>
  </CardFooter>
)}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-900 text-white border rounded-md max-w-[calc(100vw-10px)] md:max-w-auto md:w-auto   border-red-600">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-500">Edit Absent Request</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update your absence request for {editingRequest?.name} ({editingRequest?.codeName})
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                <FormField
                  control={editForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-300">Absence Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full border-gray-700 bg-gray-800 pl-3 text-left font-normal text-gray-300 hover:bg-gray-700 hover:text-white",
                                !field.value && "text-gray-500",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto bg-gray-800 p-0 text-white">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                            className="border-red-600"
                            classNames={{
                              day_selected: "bg-red-600 text-white hover:bg-red-700",
                              day_today: "bg-gray-700 text-white",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Reason for Absence</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide a detailed reason for your absence"
                          {...field}
                          className="min-h-[100px] border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:border-red-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700">
                  Update Request
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

