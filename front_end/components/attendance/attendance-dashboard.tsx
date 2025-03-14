"use client";
import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Check,  Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { useGetUsers } from "@/utils/hooks/query-hooks/users/use-get-all-users";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { UserType } from "../authorize/authorize-user";
import { allFields } from "@/types";
import { useCreateAttendance } from "@/utils/hooks/mutate-hooks/attendance/use-create-attendance";
import { useGetTodayAttendance } from "@/utils/hooks/query-hooks/attendance/use-get-today-attendance";
import { useUpdateAttendance } from "@/utils/hooks/mutate-hooks/attendance/use-update-attendance";
import { Loader } from "../ui/Loader";

export interface AttendanceRecordType {
  userId: string;
  isPresent: boolean;
  reason?: string;
  recordedAt: Date;
}

export interface AttendanceTrackerRequest {
  attendance: AttendanceRecordType[];
  date: string;
  field: string;
  submittedBy: string;
  createdAt: Date;
}



const AttendanceTracker: React.FC = () => {
  const today = useMemo(()=> new Date(),[])
  const { data: session, isLoading: sessionLoading } = useGetSession();
  const { data: users, isLoading: usersLoading } = useGetUsers();
  const {
    data: todayAttendance,
    refetch: refetchTodayAttendance,
    isLoading: todayAttendanceLoading,
  } = useGetTodayAttendance();
  const { mutate: create_attendance, isPending: creating_attendance } =
    useCreateAttendance();
  const { mutate: update_attendance, isPending: updating_attendance } =
    useUpdateAttendance();

  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [field, setField] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [attendanceRecord, setAttendanceRecord] = useState<{
    [key: string]: AttendanceRecordType;
  }>({});


  const filteredUsers = useMemo(
    () =>
      allUsers.filter(
        (user) =>
          (field === "all" || user?.field === field) &&
          user?.name.toLowerCase().includes(search.toLowerCase())
      ) || [],
    [allUsers, field, search,]
  );
  // Initialize allUsers
  useEffect(() => {
    if (usersLoading || sessionLoading) return;
    if (users?.users && session?.user) {
      setAllUsers(
        users.users.filter((u: UserType) => u._id !== session.user._id)
      );
    }
  }, [usersLoading, sessionLoading, users?.users, session?.user]);



  // Initialize attendanceRecord based on today's attendance or default values
  useEffect(() => {
    if (todayAttendance) {
      const records: { [key: string]: AttendanceRecordType } = {};
      todayAttendance.todayAttendance.attendance.forEach((record : AttendanceRecordType) => {
        records[record.userId] = {
          userId: record.userId,
          isPresent: record.isPresent,
          reason: record.reason,
          recordedAt: record.recordedAt,
        };
      });
      console.log("Attendance Records:", records); // Debugging
      setAttendanceRecord(records);
    } else {
      const initialRecords: { [key: string]: AttendanceRecordType } = {};
      filteredUsers.forEach((user) => {
        initialRecords[user._id] = {
          userId: user._id,
          isPresent: false,
          reason: "",
          recordedAt: today,
        };
      });
      setAttendanceRecord(initialRecords);
    }
  }, [todayAttendance, users, filteredUsers, today]);

  // Filter users based on search and field


  useEffect(() => {
    const updatedRecords: { [key: string]: AttendanceRecordType } = {
      ...attendanceRecord,
    };

    filteredUsers.forEach((user) => {
      if (!updatedRecords[user._id]) {
        updatedRecords[user._id] = {
          userId: user._id,
          isPresent: false, // Default to absent
          reason: "", // Default reason
          recordedAt: today,
        };
      }
    });

    setAttendanceRecord(updatedRecords);
  }, [filteredUsers]);

  console.log("Filtered Users:", filteredUsers); // Debugging

  // Handle attendance checkbox change
  const handleAttendanceChange = (userId: string, isPresent: boolean) => {
    setAttendanceRecord((prev) => ({
      ...prev,
      [userId]: {
        userId,
        isPresent,
        reason: isPresent ? undefined : prev[userId]?.reason,
        recordedAt: today,
      },
    }));
  };

  // Handle reason input change
  const handleReasonChange = (userId: string, reason: string) => {
    setAttendanceRecord((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], reason },
    }));
  };

  const handleSubmit = () => {
    if (todayAttendanceLoading) return;

    // Validate if any absent user has no reason
    const hasMissingReason = Object.values(attendanceRecord).some(
      (record) => !record.isPresent && !record.reason
    );

    if (hasMissingReason) {
      toast.error("Please provide a reason for absent users.");
      return;
    }

    // Construct the attendance data
    const attendanceData: AttendanceTrackerRequest = {
      attendance: Object.values(attendanceRecord).map((record) => ({
        userId: record.userId,
        isPresent: record.isPresent,
        reason: record.isPresent ? undefined : record.reason, // Include reason only if absent
        recordedAt: record.recordedAt,
      })),
      date: today.toISOString(),
      field,
      submittedBy: session?.user?._id || "",
      createdAt: new Date(),
    };

    if (attendanceData.attendance.length === 0) {
      toast.error("Data is empty");
      return;
    }

    console.log("Attendance Data:", attendanceData); // Debugging

    if (todayAttendance?.todayAttendance) {
      console.log("i am for update ");
      const updated_attendance = {
        _id: todayAttendance?.todayAttendance?._id,
        ...attendanceData,
      };
      const isSameData =
        JSON.stringify(attendanceData.attendance) ===
        JSON.stringify(todayAttendance.todayAttendance.attendance);
      if (isSameData) {
        toast.error("No changes detected in attendance data");
        return;
      }
      // Update existing attendance
      update_attendance(updated_attendance, {
        onSuccess: (res) => {
          if (res.message && res.updatedAttendance) {
            toast.success(res.message);
          } else if(res.error) {
            toast.error(res.error);
          }
        },
        onError: () => {
          toast.error("Failed to update attendance");
        },
      });
    } else {
      // Create new attendance
      create_attendance(attendanceData, {
        onSuccess: (res) => {
          if(res.attendance && res.message){

            toast.success(res.message);
            refetchTodayAttendance();
          }
        },
        onError: () => {
          toast.error("Failed to submit attendance");
        },
      });
    }
  };

  // Calculate present, absent, and unmarked counts
  const presentCount = filteredUsers.filter(
    (user) => attendanceRecord[user._id]?.isPresent
  ).length;
  const absentCount = filteredUsers.filter(
    (user) => !attendanceRecord[user._id]?.isPresent
  ).length;
  const unmarkedCount = filteredUsers.length - presentCount - absentCount;

  // if (todayAttendanceLoading) {
  //   return <Loader />;
  // }

  return (
    <div className=" w-full h-full bg-black text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-red-600">
        Attendance Tracker
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3  lg:mx-[20px] gap-6 mb-10 ">
        {/* Today's Date Card */}
        <Card className="bg-slate-950 lg:max-w-[450px] cursor-pointer shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-red-500/40">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-100">Today&apos;s Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=" flex flex-col gap-y-8 items-center justify-between  text-gray-100">
              <div className="flex items-center gap-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-md lg:text-lg font-medium">
                  {format(today, "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex  gap-x-2 text-sm lg:text-lg ">
                <span className="font-semibold ">Status:</span>
                {todayAttendance?.todayAttendance ? (
                  <div className="text-green-600 flex gap-x-1">
                    <span>Done</span>
                    <Check />
                  </div>
                ) : (
                  <div className="text-red-600 flex gap-x-1">
                    <span>Not Done</span>
                    <X />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Card */}
        <Card className="bg-slate-950 lg:max-w-[450px] cursor-pointer shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-red-500/40">
          <CardHeader>
            <CardTitle className="text-gray-100">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-white">
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={setField} defaultValue="all">
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-100">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
                  <SelectItem value="all">All</SelectItem>
                  {allFields.map((f: string) => (
                    <SelectItem key={f} value={f} className="hover:bg-gray-800">
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-white">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-gray-100 pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary Card */}
        <Card className="bg-slate-950 lg:max-w-[450px] cursor-pointer shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-red-500/40">
          <CardHeader>
            <CardTitle className="text-gray-100">Attendance Summary</CardTitle>
            <CardDescription className="text-gray-400">
              {format(today, "MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-green-500">Present: {presentCount}</p>
              <p className="text-red-500">Absent: {absentCount}</p>
              <p className="text-yellow-500">Unmarked: {unmarkedCount}</p>
              <p className="text-gray-400">Total: {filteredUsers.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mark Attendance Card */}
      <Card className="bg-slate-950 lg:mx-6 px-4 md:px-8 py-4 cursor-pointer shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-red-500/20">
        <CardHeader>
          <CardTitle className="text-gray-100">Mark Attendance</CardTitle>
          <CardDescription className="text-gray-400">
            Select users who are present and provide reasons for absences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user: UserType) => (
              <div key={user._id} className="flex flex-col space-y-2">
                <div className="flex  flex-wrap  justify-between">
                  <div className="flex items-center gap-x-6">
                    <Checkbox
                      id={`user-${user._id}`}
                      checked={attendanceRecord[user._id]?.isPresent || false}
                      onCheckedChange={(checked) =>
                        handleAttendanceChange(user._id, checked as boolean)
                      }
                      className="border-white"
                    />
                    <Label
                      htmlFor={`user-${user._id}`}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Avatar>
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="">
                        <p className="text-sm font-medium text-gray-100">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400">{user.field}</p>
                      </div>
                    </Label>
                  </div>
                  {!attendanceRecord[user._id]?.isPresent && (
                    <div className="mt-2">
                      <Input
                        placeholder="Reason for absence (required)"
                        value={attendanceRecord[user._id]?.reason || ""}
                        onChange={(e) =>
                          handleReasonChange(user._id, e.target.value)
                        }
                        className={`w-full md:w-[300px] lg:w-[450px] bg-gray-700 border-gray-600 text-gray-100 ${
                          !attendanceRecord[user._id]?.reason
                            ? "border-red-500"
                            : ""
                        }`}
                        required
                      />
                      {!attendanceRecord[user._id]?.reason && (
                        <p className="text-red-500 text-sm mt-1">
                          Reason is required for absent users.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit/Update Button */}
      {filteredUsers.length > 0 && (
        <div className="mt-6">
          <Button
            disabled={creating_attendance || updating_attendance}
            onClick={handleSubmit}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {todayAttendance
              ? updating_attendance
                ? "Updating..."
                : "Update Attendance"
              : creating_attendance
              ? "Creating..."
              : "Submit Attendance"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
