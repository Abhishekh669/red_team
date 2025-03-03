"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2"
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
} from "chart.js"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

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
      })
    }, 500)
  })
}

const fetchRecentEnrollments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "STU001", name: "Alice Johnson", course: "Web Development", date: "2024-02-25" },
        { id: "STU002", name: "Bob Smith", course: "Cybersecurity", date: "2024-02-24" },
        { id: "STU003", name: "Charlie Brown", course: "Mobile App Development", date: "2024-02-23" },
        { id: "STU004", name: "Diana Prince", course: "Data Science", date: "2024-02-22" },
      ])
    }, 500)
  })
}

const fetchStudents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "STU005", name: "Eva Green", gpa: 4.0, course: "AI/ML" },
        { id: "STU006", name: "Frank Castle", gpa: 3.9, course: "Cybersecurity" },
        { id: "STU007", name: "Grace Lee", gpa: 3.9, course: "Data Science" },
        { id: "STU008", name: "Henry Ford", gpa: 3.8, course: "Cloud Computing" },
        { id: "STU009", name: "Iris West", gpa: 3.7, course: "Web Development" },
        { id: "STU010", name: "Jack Ryan", gpa: 3.6, course: "Mobile App Development" },
      ])
    }, 500)
  })
}

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
      ])
    }, 500)
  })
}

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
      ])
    }, 500)
  })
}

const fetchRecentAlerts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "ALT001", type: "warning", message: "Server load high", timestamp: "2024-02-28 14:30" },
        { id: "ALT002", type: "error", message: "Payment gateway down", timestamp: "2024-02-28 13:45" },
        { id: "ALT003", type: "success", message: "Backup completed", timestamp: "2024-02-28 12:00" },
        { id: "ALT004", type: "info", message: "New course proposal received", timestamp: "2024-02-28 10:15" },
      ])
    }, 500)
  })
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<any>("overview")
  const [overviewData, setOverviewData] = useState<any>({
    totalStudents: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    averageGPA: 0,
    totalRevenue: 0,
    pendingApplications: 0,
  })
  const [recentEnrollments, setRecentEnrollments] = useState<any>([])
  const [students, setStudents] = useState<any>([])
  const [courses, setCourses] = useState<any>([])
  const [facultyMembers, setFacultyMembers] = useState<any>([])
  const [recentAlerts, setRecentAlerts] = useState<any>([])
  const [searchTerm, setSearchTerm] = useState<any>("")
  const [courseFilter, setCourseFilter] = useState<any>("")
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState<any>(false)
  const [newCourseName, setNewCourseName] = useState<any>("")

  useEffect(() => {
    const fetchData = async () => {
      const overview = await fetchOverviewData()
      const enrollments = await fetchRecentEnrollments()
      const studentData = await fetchStudents()
      const courseData = await fetchCourses()
      const facultyData = await fetchFacultyMembers()
      const alertsData = await fetchRecentAlerts()

      setOverviewData(overview)
      setRecentEnrollments(enrollments)
      setStudents(studentData)
      setCourses(courseData)
      setFacultyMembers(facultyData)
      setRecentAlerts(alertsData)
    }

    fetchData()
  }, [])

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }, [])

  const handleCourseFilter = useCallback((value: string) => {
    setCourseFilter(value)
  }, [])

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = courseFilter ? student.course === courseFilter : true
    return matchesSearch && matchesCourse
  })

  const handleAddCourse = () => {
    if (newCourseName) {
      const newCourse = {
        id: `CRS${courses.length + 1}`.padStart(6, "0"),
        name: newCourseName,
        avgScore: 0,
      }
      setCourses([...courses, newCourse])
      setNewCourseName("")
      setIsAddCourseDialogOpen(false)
      toast.success("added course")
    }
  }

  const handleRemoveCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course.id !== courseId))
    toast({
      title: "Course Removed",
      description: "The course has been removed from the list.",
      variant: "destructive",
    })
  }

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
  }

  const genderDistribution = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        data: [600, 580, 70],
        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(236, 72, 153, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderColor: ["rgb(59, 130, 246)", "rgb(236, 72, 153)", "rgb(16, 185, 129)"],
        borderWidth: 1,
      },
    ],
  }

  const coursePerformance = {
    labels: courses.map((course) => course.name),
    datasets: [
      {
        label: "Average Score",
        data: courses.map((course) => course.avgScore),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
    ],
  }

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [150000, 180000, 210000, 200000, 250000, 260000],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.3,
      },
    ],
  }

  const applicationStatus = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [250, 75, 25],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(234, 179, 8, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["rgb(34, 197, 94)", "rgb(234, 179, 8)", "rgb(239, 68, 68)"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
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
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r border-zinc-800 bg-zinc-900 lg:block">
          <nav className="flex flex-col gap-2 p-4">
            <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("overview")}>
              <Users className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("students")}>
              <User className="mr-2 h-4 w-4" />
              Students
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("courses")}>
              <BookOpen className="mr-2 h-4 w-4" />
              Courses
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("faculty")}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Faculty
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("finance")}>
              <DollarSign className="mr-2 h-4 w-4" />
              Finance
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("reports")}>
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-6 bg-zinc-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="students" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Students
                </TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Courses
                </TabsTrigger>
                <TabsTrigger value="faculty" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Faculty
                </TabsTrigger>
                <TabsTrigger value="finance" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Finance
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Reports
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                      <Users className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewData.totalStudents}</div>
                      <p className="text-xs text-zinc-400">+20% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                      <BookOpen className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewData.totalCourses}</div>
                      <p className="text-xs text-zinc-400">+2 new courses added</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
                      <GraduationCap className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewData.activeEnrollments}</div>
                      <p className="text-xs text-zinc-400">+5% from last week</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
                      <GraduationCap className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewData.averageGPA}</div>
                      <p className="text-xs text-zinc-400">+0.2 from last semester</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
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
                              legend: { labels: { color: "rgba(255, 255, 255, 0.7)" } },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Gender Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <Doughnut
                          data={genderDistribution}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: "right", labels: { color: "rgba(255, 255, 255, 0.7)" } },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Recent Enrollments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentEnrollments.map((enrollment) => (
                        <div key={enrollment.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {enrollment.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{enrollment.name}</p>
                              <p className="text-xs text-zinc-400">{enrollment.course}</p>
                            </div>
                          </div>
                          <div className="text-sm text-zinc-400">{enrollment.date}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>System Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center space-x-4 bg-zinc-800 p-3 rounded-md">
                          {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                          {alert.type === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                          {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {alert.type === "info" && <Clock className="h-5 w-5 text-blue-500" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-zinc-400">{alert.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="students" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>View and manage student information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <Input
                        className="w-64 bg-zinc-800 border-zinc-700"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <Select onValueChange={handleCourseFilter} value={courseFilter}>
                        <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700">
                          <SelectValue placeholder="Filter by course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Courses">All Courses</SelectItem>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.name}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      {filteredStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{student.name}</p>
                              <p className="text-xs text-zinc-400">{student.course}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-red-600 text-white">
                              GPA: {student.gpa}
                            </Badge>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-zinc-900 text-white">
                                <DialogHeader>
                                  <DialogTitle>{student.name}</DialogTitle>
                                  <DialogDescription>Student ID: {student.id}</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="course" className="text-right">
                                      Course
                                    </Label>
                                    <Input id="course" value={student.course} className="col-span-3" readOnly />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="gpa" className="text-right">
                                      GPA
                                    </Label>
                                    <Input id="gpa" value={student.gpa} className="col-span-3" readOnly />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                    <CardDescription>Overview of student applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <Pie
                        data={applicationStatus}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: "right", labels: { color: "rgba(255, 255, 255, 0.7)" } },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="courses" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                    <CardDescription>Average scores across different courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <Bar
                        data={coursePerformance}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              grid: { color: "rgba(75, 85, 99, 0.2)" },
                              ticks: { color: "rgba(255, 255, 255, 0.7)" },
                            },
                            x: {
                              grid: { color: "rgba(75, 85, 99, 0.2)" },
                              ticks: { color: "rgba(255, 255, 255, 0.7)" },
                            },
                          },
                          plugins: {
                            legend: { display: false },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>Add, edit, or remove courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                          <div>
                            <p className="text-sm font-medium">{course.name}</p>
                            <p className="text-xs text-zinc-400">Avg. Score: {course.avgScore}%</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveCourse(course.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-red-600 hover:bg-red-700">
                          <Plus className="mr-2 h-4 w-4" /> Add New Course
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 text-white">
                        <DialogHeader>
                          <DialogTitle>Add New Course</DialogTitle>
                          <DialogDescription>Enter the details for the new course.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="courseName" className="text-right">
                              Course Name
                            </Label>
                            <Input
                              id="courseName"
                              value={newCourseName}
                              onChange={(e) => setNewCourseName(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddCourse} className="bg-red-600 hover:bg-red-700">
                            Add Course
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="faculty" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Faculty Management</CardTitle>
                    <CardDescription>View and manage faculty information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Courses</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facultyMembers.map((faculty) => (
                          <TableRow key={faculty.id}>
                            <TableCell>{faculty.name}</TableCell>
                            <TableCell>{faculty.department}</TableCell>
                            <TableCell>{faculty.courses.join(", ")}</TableCell>
                            <TableCell>{faculty.rating}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="finance" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>Revenue and financial metrics</CardDescription>
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
                            legend: { labels: { color: "rgba(255, 255, 255, 0.7)" } },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">${overviewData.totalRevenue.toLocaleString()}</div>
                      <p className="text-sm text-zinc-400">+15% from last year</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Pending Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{overviewData.pendingApplications}</div>
                      <p className="text-sm text-zinc-400">
                        Potential revenue: ${(overviewData.pendingApplications * 1000).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Generated Reports</CardTitle>
                    <CardDescription>Access and download system reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                        <div>
                          <p className="text-sm font-medium">Monthly Enrollment Report</p>
                          <p className="text-xs text-zinc-400">Generated on: 2024-02-28</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                        <div>
                          <p className="text-sm font-medium">Course Performance Analysis</p>
                          <p className="text-xs text-zinc-400">Generated on: 2024-02-27</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                        <div>
                          <p className="text-sm font-medium">Financial Summary Q1 2024</p>
                          <p className="text-xs text-zinc-400">Generated on: 2024-02-26</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-red-600 hover:bg-red-700">Generate New Report</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

