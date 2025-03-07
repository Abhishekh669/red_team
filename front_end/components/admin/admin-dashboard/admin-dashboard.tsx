"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Users,
  GraduationCap,
  BookOpen,
  User,
  Bell,
  Settings,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Calendar,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useSessionStore } from "@/utils/store/use-session-store";
import { format } from "date-fns";
import { Loader } from "@/components/ui/Loader";
import { useGetUsers } from "@/utils/hooks/query-hooks/users/use-get-all-users";
import { UserType } from "@/components/authorize/authorize-user";
import { useRouter } from "next/navigation";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock API functions
const fetchOverviewData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalStudents: 1250,
        totalCourses: 45,
        activeEnrollments: 3750,
        averageGPA: 3.4,
        totalRevenue: 1250000,
        pendingApplications: 75,
      });
    }, 500);
  });
};

const fetchRecentEnrollments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "STU001",
          name: "Alice Johnson",
          course: "Web Development",
          date: "2024-02-25",
        },
        {
          id: "STU002",
          name: "Bob Smith",
          course: "Cybersecurity",
          date: "2024-02-24",
        },
        {
          id: "STU003",
          name: "Charlie Brown",
          course: "Mobile App Development",
          date: "2024-02-23",
        },
        {
          id: "STU004",
          name: "Diana Prince",
          course: "Data Science",
          date: "2024-02-22",
        },
      ]);
    }, 500);
  });
};

const fetchStudents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "STU005", name: "Eva Green", gpa: 4.0, course: "AI/ML" },
        {
          id: "STU006",
          name: "Frank Castle",
          gpa: 3.9,
          course: "Cybersecurity",
        },
        { id: "STU007", name: "Grace Lee", gpa: 3.9, course: "Data Science" },
        {
          id: "STU008",
          name: "Henry Ford",
          gpa: 3.8,
          course: "Cloud Computing",
        },
        {
          id: "STU009",
          name: "Iris West",
          gpa: 3.7,
          course: "Web Development",
        },
        {
          id: "STU010",
          name: "Jack Ryan",
          gpa: 3.6,
          course: "Mobile App Development",
        },
      ]);
    }, 500);
  });
};

const fetchCourses = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "CRS001", name: "Web Development", avgScore: 78 },
        { id: "CRS002", name: "Cybersecurity", avgScore: 82 },
        { id: "CRS003", name: "Mobile App Development", avgScore: 75 },
        { id: "CRS004", name: "Data Science", avgScore: 88 },
        { id: "CRS005", name: "AI/ML", avgScore: 70 },
        { id: "CRS006", name: "Cloud Computing", avgScore: 85 },
      ]);
    }, 500);
  });
};

const fetchFacultyMembers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "FAC001",
          name: "Dr. John Doe",
          department: "Computer Science",
          courses: ["Web Development", "AI/ML"],
          rating: 4.8,
        },
        {
          id: "FAC002",
          name: "Prof. Jane Smith",
          department: "Information Security",
          courses: ["Cybersecurity", "Network Security"],
          rating: 4.7,
        },
        {
          id: "FAC003",
          name: "Dr. Mike Johnson",
          department: "Software Engineering",
          courses: ["Mobile App Development", "Software Architecture"],
          rating: 4.9,
        },
        {
          id: "FAC004",
          name: "Prof. Sarah Williams",
          department: "Data Science",
          courses: ["Big Data Analytics", "Machine Learning"],
          rating: 4.6,
        },
      ]);
    }, 500);
  });
};

const fetchRecentAlerts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "ALT001",
          type: "warning",
          message: "Server load high",
          timestamp: "2024-02-28 14:30",
        },
        {
          id: "ALT002",
          type: "error",
          message: "Payment gateway down",
          timestamp: "2024-02-28 13:45",
        },
        {
          id: "ALT003",
          type: "success",
          message: "Backup completed",
          timestamp: "2024-02-28 12:00",
        },
        {
          id: "ALT004",
          type: "info",
          message: "New course proposal received",
          timestamp: "2024-02-28 10:15",
        },
      ]);
    }, 500);
  });
};

export default function AdminDashboard() {
  const { user } = useSessionStore();
  const { data: users, isLoading: users_loading } = useGetUsers();
  const students = useMemo(
    () => users?.users?.filter((u: UserType) => u._id !== user?._id),
    [user, users_loading, users?.users]
  );

  const router = useRouter()

  const [activeTab, setActiveTab] = useState<any>("overview");
  const [overviewData, setOverviewData] = useState<any>({
    totalStudents: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    averageGPA: 0,
    totalRevenue: 0,
    pendingApplications: 0,
  });
  const [searchTerm, setSearchTerm] = useState<any>("");

 

  useEffect(()=>{
    if(students){
      students.forEach((student : UserType)=>{
        router.prefetch(`/dashboard/student/${student._id}`)
      })
    }
  },[students, router])

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  

  const filteredStudents = useMemo(() => {
    return students?.filter((student: UserType) => {
      const matchesSearch = student?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [students, searchTerm]);
  


  

  const studentGrowth = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Students",
        data: [50, 60, 70, 65, 80, 90],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const genderDistribution = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        data: [600, 580, 70],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(236, 72, 153)",
          "rgb(16, 185, 129)",
        ],
        borderWidth: 1,
      },
    ],
  };

  
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [150000, 180000, 210000, 200000, 250000, 760000],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const applicationStatus = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [250, 75, 25],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(234, 179, 8)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };
  if (!user) return <Loader />;
  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white p-4 ">
      <div>
        <Card className=" info  w-auto text-red-600  bg-slate-950 border-zinc-800  ">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-red-600">
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback className="bg-zinc-800 text-red-600">
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <CardTitle className="text-2xl text-white">
                {user?.name} <span className="text-red-600">[</span> Admin{" "}
                <span className="text-red-600">]</span>
              </CardTitle>
              <CardDescription className="text-zinc-400">
                {user?.email}
              </CardDescription>
              <div className="flex items-center gap-2 pt-1">
                <Badge className="bg-red-600 hover:bg-red-700">
                  {user?.field}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-zinc-400 border-zinc-700"
                >
                  ID: {user?._id}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-zinc-400 border-zinc-700"
                >
                  Code: {user?.codeName}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-6 ">
            <div className="grid  grid-cols-2 gap-6 md:grid-cols-2 ">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-zinc-400">
                  Enrollment Date
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <span>{format(new Date(user.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-zinc-400">
                  Phone Number
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-red-600" />
                  <span>{user?.phoneNumber}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-zinc-400">Address</div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-red-600" />
                  <span>{user?.address}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-zinc-400">Age</div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-red-600" />
                  <span>{user?.age}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-1  w-full">
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full "
            >
              <TabsList className="grid w-full grid-cols-4 bg-gray-900">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Students
                </TabsTrigger>

                <TabsTrigger
                  value="finance"
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Finance
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Reports
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-slate-950 border-zinc-800 text-red-600">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Students
                      </CardTitle>
                      <Users className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {users?.users.length || 0}
                      </div>
                      <p className="text-xs text-zinc-400">
                        +20% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-950 border-zinc-800 text-red-600">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Courses
                      </CardTitle>
                      <BookOpen className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {overviewData.totalCourses}
                      </div>
                      <p className="text-xs text-zinc-400">
                        +2 new courses added
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-950 border-zinc-800 text-red-600">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Enrollments
                      </CardTitle>
                      <GraduationCap className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {users?.users.length || 0}
                      </div>
                      <p className="text-xs text-zinc-400">
                        +5% from last week
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-950 border-zinc-800 text-red-600">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Average GPA
                      </CardTitle>
                      <GraduationCap className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {overviewData.averageGPA}
                      </div>
                      <p className="text-xs text-zinc-400">
                        +0.2 from last semester
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-slate-950 text-red-600 border-zinc-800 md:col-span-2">
                    <CardHeader>
                      <CardTitle>Student Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <Line
                          data={studentGrowth}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                grid: { color: "rgba(75, 85, 99, 0.2)" },
                                ticks: { color: "rgba(255, 255, 255, 0.7)" },
                              },
                              x: {
                                grid: { color: "rgba(75, 85, 99, 0.2)" },
                                ticks: { color: "rgba(255, 255, 255, 0.7)" },
                              },
                            },
                            plugins: {
                              legend: {
                                labels: { color: "rgba(255, 255, 255, 0.7)" },
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-950 text-red-600 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Gender Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <Doughnut
                          data={genderDistribution}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                              legend: {
                                position: "right",
                                labels: { color: "rgba(255, 255, 255, 0.7)" },
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-slate-950 text-red-600 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Recent Enrollments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users?.users &&
                        users?.users?.map((user: UserType) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {user.name}
                                </p>
                                <p className="text-xs text-zinc-400">
                                  {user.field}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-zinc-400">
                              {format(new Date(user.createdAt), "MMM d, yyyy")}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="students" className="space-y-4">
                <Card className="bg-slate-950 border-zinc-800 text-red-600">
                  <CardHeader>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>
                      View and manage student information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <Input
                        className="w-64 bg-gray-900 border-zinc-700"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                    <div className="space-y-4">
                      {filteredStudents &&
                        filteredStudents?.map((student: UserType) => (
                          <div
                            key={student._id}
                            className="flex items-center justify-between bg-gray-900 text-red-600 p-3 rounded-md"
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src={student.image} alt="xxx"/>
                                <AvatarFallback>
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {student.name}
                                </p>
                                <p className="text-xs text-zinc-400">
                                  {student.field}
                                </p>
                              </div>
                            </div>
                            <div>
                            <Button variant="outline" size="sm"
                                    onClick={()=>{
                                      router.push(`/dashboard/student/${student._id}`)
                                    }}
                            >
                                  View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-950 border-zinc-800 text-red-600">
                  <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                    <CardDescription>
                      Overview of student applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <Pie
                        data={applicationStatus}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                              labels: { color: "rgba(255, 255, 255, 0.7)" },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="finance" className="space-y-4">
                <Card className="bg-slate-950 text-red-600 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>
                      Revenue and financial metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <Line
                        data={revenueData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: { color: "rgba(75, 85, 99, 0.2)" },
                              ticks: { color: "rgba(255, 255, 255, 0.7)" },
                            },
                            x: {
                              grid: { color: "rgba(75, 85, 99, 0.2)" },
                              ticks: { color: "rgba(255, 255, 255, 0.7)" },
                            },
                          },
                          plugins: {
                            legend: {
                              labels: { color: "rgba(255, 255, 255, 0.7)" },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-slate-950 text-red-600 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        ${overviewData.totalRevenue.toLocaleString()}
                      </div>
                      <p className="text-sm text-zinc-400">
                        +15% from last year
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-950 text-red-600 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Pending Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {overviewData.pendingApplications}
                      </div>
                      <p className="text-sm text-zinc-400">
                        Potential revenue: $
                        {(
                          overviewData.pendingApplications * 1000
                        ).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Generated Reports</CardTitle>
                    <CardDescription>
                      Access and download system reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                        <div>
                          <p className="text-sm font-medium">
                            Monthly Enrollment Report
                          </p>
                          <p className="text-xs text-zinc-400">
                            Generated on: 2024-02-28
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                        <div>
                          <p className="text-sm font-medium">
                            Course Performance Analysis
                          </p>
                          <p className="text-xs text-zinc-400">
                            Generated on: 2024-02-27
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                        <div>
                          <p className="text-sm font-medium">
                            Financial Summary Q1 2024
                          </p>
                          <p className="text-xs text-zinc-400">
                            Generated on: 2024-02-26
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Generate New Report
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
