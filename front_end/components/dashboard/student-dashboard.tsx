"use client";

import { useMemo, useState } from "react";
import { Line, Pie, Doughnut, Bar } from "react-chartjs-2"; // Import Bar component
import ReactActivityCalendar from "react-activity-calendar";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Import BarElement
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Calendar,
  Clock,
  Code,
  Download,
  GraduationCap,
  Key,
  Lock,
  Smartphone,
  User,
  CalendarDays,
  Users,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSessionStore } from "@/utils/store/use-session-store";
import { useGetAllAttendance } from "@/utils/hooks/query-hooks/attendance/use-get-all-attendance";
import { useGetTestByUserId } from "@/utils/hooks/query-hooks/users/use-get-test-by-user-id";
import { Loader } from "../ui/Loader";
import { ServerTestDataType } from "@/types";
import { format } from "date-fns";
import { object } from "zod";
import WeeKBarData from "./Week-bar-data";

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

export interface ChartDataPoint {
  date: string;
  rawDate: Date;
  grade: number;
  score: number;
  totalMarks: number;
  passMarks: number;
  status: string;
  isPassed: boolean;
}

const calculateGrade = (score: number, totalMarks: number): number => {
  const percentage = (score / totalMarks) * 100;
  return Math.max(1, Math.min(10, percentage / 10));
};

const isPassed = (score: number, passMarks: number): boolean => {
  return score >= passMarks;
};

// Define types based on the provided schema

export default function StudentDashboard() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const { data: allAttendance, isLoading: attendanceLoading } =
    useGetAllAttendance();
  const { data: testData, isLoading: testDataLoading } = useGetTestByUserId();
  const { user } = useSessionStore();

  const ChartData = useMemo(() => {
    if (testDataLoading) return [];

    if (testData?.testData && user) {
      const test = testData.testData;
      return test.map((test: ServerTestDataType) => {
        if (test.testData) {
          let score = Object.values(test.testData)[0].score;
          let attemptStatus = Object.values(test.testData)[0].status;
          return {
            date: format(new Date(test.date), "MMM d"),
            rawDate: new Date(test.date),
            grade: calculateGrade(score, test.totalMarks),
            score: score,
            totalMarks: test.totalMarks,
            passMarks: test.passMarks,
            status: attemptStatus,
            isPassed: isPassed(score, test.passMarks),
          };
        }
        return null;
      });
    }
    return [];
  }, [testDataLoading, testData?.testData, user]);

  ChartData &&
    ChartData.sort((a: ChartDataPoint | null, b: ChartDataPoint | null) => {
      if (!a || !b) return 0; // Handle null values
      return a.rawDate.getTime() - b.rawDate.getTime();
    });
  //to be added

  // Mock user data based on UserType

  // Mock attendance data based on AttendanceTracker
  const attendanceData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [85, 10],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(75, 85, 99, 0.6)",
          
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(75, 85, 99)",
          
        ],
        borderWidth: 1,
      },
    ],
  };

  // Mock test data based on Test

  // Calculate overall test performance for pie chart

  const generateAttendanceData = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const values = [];
    const date = new Date(oneYearAgo);

    while (date <= today) {
      // Randomly decide if the student was present (1) or absent (0)
      const isPresent = Math.random() > 0.5 ? 1 : 0;
      values.push({
        date: date.toISOString().split("T")[0],
        count: isPresent, // 1 for present, 0 for absent
        level: isPresent, // 1 for present, 0 for absent
      });
      date.setDate(date.getDate() + 1);
    }

    return values;
  };

  const attendanceCalendarData = generateAttendanceData();

  // Theme for the calendar (only red for present, no color for absent)
  const calendarTheme = {
    light: ["#27272a", "#ef4444"], // No color for level 0, red for level 1
    dark: ["#27272a", "#ef4444"], // No color for level 0, red for level 1
  };

  // Data for the bar graph (marks obtained)

  // Data for the line graph (trend of marks over time)

  const getWeekNumber = (date: Date) => {
    const day = date.getDate();
    return Math.ceil(day / 7);
  };
  // Generate random attendance data for GitHub calendar

  // Function to generate keys
  const generateKeys = () => {
    const mockPublicKey = "pk_" + Math.random().toString(36).substring(2, 15);
    const mockPrivateKey = "sk_" + Math.random().toString(36).substring(2, 15);

    setPublicKey(mockPublicKey);
    setPrivateKey(mockPrivateKey);
  };

  if (!user) return <Loader />;

  return (
    <div className="flex max-w-screen w-full  flex-col  text-white">
      <div className="flex flex-col">
        <main className=" flex flex-1 flex-col gap-4 p-2 md:gap-8 md:p-8">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4">
            <div className="grid grid-cols-1 gap-y-4 gap-x-4">
              <Card className=" info col-span-1 md:col-span-2 lg:col-span-3 text-red-600 bg-slate-950 border-zinc-800">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-red-600">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="bg-zinc-800 text-red-600">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <CardTitle className="text-2xl text-white">
                      {user?.name}
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
                <CardContent className="pt-3">
                  <div className="grid  grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-zinc-400">
                        Enrollment Date
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-red-600" />
                        <span>
                          {format(new Date(user.createdAt), "MMM d, yyyy")}
                        </span>
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
                      <div className="text-sm font-medium text-zinc-400">
                        Address
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-red-600" />
                        <span>{user?.address}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-zinc-400">
                        Age
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-red-600" />
                        <span>{user?.age}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-950 text-white">
                <CardHeader>
                  <CardTitle className="text-white">Week Tests</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your all week test records
                  </CardDescription>
                  
                </CardHeader>
                <div className=" text-red-600 float-right">
                   <span> X-axis : Grade(10)</span><br />
                    <span>Y-axis : Date</span>
                  </div>
                <CardContent className="w-full h-full">
                  <WeeKBarData chartData={ChartData} /> <CardFooter className="font-semibold mt-8 leading-none text-white-600 tracking-tight text-center flex justify-center ">
                          <span>All Weeks Progress </span>
                        </CardFooter>
                </CardContent>
               
              </Card>
              <Card className=" test-week col-span-1 md:col-span-2 bg-slate-950 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Test Performance</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your recent test performances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      {testData?.testData &&
                        testData?.testData?.map((test: ServerTestDataType) => {
                          const weekNumber = getWeekNumber(new Date(test.date));
                          const monthShort = format(
                            new Date(test.createdAt),
                            "MMM"
                          );
                          return (
                            <motion.div
                              key={test._id}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-gray-800  rounded-[15px] shadow-md overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-red-500/20   "
                            >
                              <Card className="cursor-pointer bg-slate-900 text-red-600 hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                  <CardTitle className="flex justify-between items-center gap-x-16">
                                    <span>
                                      Test{" "}
                                      {format(
                                        new Date(test.date),
                                        "MMM d, yyyy"
                                      )}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="bg-green-900/20 text-green-500 border-green-500 flex items-center gap-1"
                                    >
                                      {monthShort} Week {weekNumber}
                                    </Badge>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-2">
                                  <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                      <span>
                                        Created:{" "}
                                        {format(
                                          new Date(test.date),
                                          "MMM d, yyyy"
                                        )}
                                      </span>
                                    </div>

                                    {test.testData &&
                                      Object.entries(test.testData).map(
                                        ([key, value]) => (
                                          <div
                                            className="flex-1 space-y-1"
                                            key={key}
                                          >
                                            <div className="flex items-center text-sm gap-x-2">
                                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                              <span>
                                                Score: {value.score}/
                                                {test.totalMarks}
                                              </span>
                                              {value.score > test.passMarks ? (
                                                <Badge
                                                  variant="outline"
                                                  className="bg-green-900/20 text-green-500 border-green-500 flex items-center gap-1"
                                                >
                                                  passed
                                                </Badge>
                                              ) : (
                                                <Badge
                                                  variant="outline"
                                                  className="bg-red-900/20 text-red-500 border-red-500 flex items-center gap-1"
                                                >
                                                  failed
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="flex items-center text-sm">
                                              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                              <span>
                                                Correct : {value.correct}/
                                                {test.totalQuestions}
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      )}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Attendance Status</CardTitle>
                <CardDescription className="text-zinc-400">
                  Your attendance record this semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <Pie
                    data={attendanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            color: "rgba(255, 255, 255, 0.7)",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-zinc-400">Total Classes: 100</div>
                <div className="text-sm font-medium text-red-600">
                  Attendance Rate: 85%
                </div>
              </CardFooter>
            </Card>

            <Card className="col-span-1 md:col-span-2 bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Attendance Tracking
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  GitHub-style contribution chart showing your attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto pb-4">
                  <ReactActivityCalendar
                    data={attendanceCalendarData}
                    theme={calendarTheme} // Apply the custom theme
                    labels={{
                      legend: {
                        less: "Less",
                        more: "More",
                      },
                      months: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      weekdays: [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                      ],
                      totalCount: "{{count}} activities in {{year}}",
                    }}
                    showWeekdayLabels
                    hideColorLegend // Hide the color legend since we only have two statuses
                    hideTotalCount // Hide the total count
                    style={{
                      color: "#d4d4d8",
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-[#27272a]"></div>
                    <span className="text-zinc-400">Absent</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-[#ef4444]"></div>
                    <span className="text-zinc-400">Present</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Key Generation</CardTitle>
                <CardDescription className="text-zinc-400">
                  Generate keys for secure access to course materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={generateKeys}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Generate Keys
                  </Button>

                  {publicKey && (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Public Key</div>
                        <div className="rounded-md bg-zinc-800 p-2 text-xs font-mono break-all text-red-400">
                          {publicKey}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium">Private Key</div>
                        <div className="rounded-md bg-zinc-800 p-2 text-xs font-mono break-all text-red-400">
                          {privateKey}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Keys
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-zinc-400">
                These keys are required for accessing lab environments and
                submitting assignments securely.
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
