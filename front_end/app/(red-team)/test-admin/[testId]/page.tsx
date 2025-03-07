"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowLeft,
  Save,
  Edit,
  Plus,
  X,
  UserPlus,
  BarChartIcon as ChartIcon,
  FileQuestion,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTestId } from "@/utils/use-test-id";
import test from "node:test";
import { useGetTestById } from "@/utils/hooks/query-hooks/admin/use-get-test-by-id";
import { useGetUsers } from "@/utils/hooks/query-hooks/users/use-get-all-users";
import { UserType } from "@/components/authorize/authorize-user";
import { useSessionStore } from "@/utils/store/use-session-store";
import { Loader } from "@/components/ui/Loader";
import { useUpdateTestScore } from "@/utils/hooks/mutate-hooks/admin/use-update-test-score";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

interface TestData {
  score: number;
  correct: number;
  status: "attempted" | "not attempted";
}

interface ServerTestDataType {
  _id: string;
  createdAt: Date;
  date: Date;
  totalMarks: number;
  passMarks: number;
  totalQuestions: number;
  testData?: Record<string, TestData>;
  submittedBy: string;
}

// Dummy data for the test (can be null to simulate no data scenario)

export default function TestDataPage() {
  const router = useRouter();
  const testId = useTestId();
  const { user } = useSessionStore();
  

  const { data: testData, isLoading: testDataLoading } = useGetTestById(testId);
  const { data: allUsers, isLoading: usersLoading } = useGetUsers();
  const { mutate: update_test_score, isPending: updatingTestScore } =
    useUpdateTestScore();

  const [editedScores, setEditedScores] = useState<Record<string, TestData>>(
    {}
  );
  const [originalScores, setOriginalScores] = useState<
    Record<string, TestData>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("scores");
  const [hasStudentData, setHasStudentData] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const students = useMemo(
    () => allUsers?.users?.filter((u: UserType) => u._id !== user?._id),
    [user, usersLoading, allUsers?.users]
  );

  useEffect(() => {
    if (testDataLoading) return;
    if (testData?.testData?.testData) {
      setEditedScores(testData.testData?.testData);

      setOriginalScores(testData.testData?.testData);
      setHasStudentData(true)
    }
  }, [testDataLoading, testData?.testData]);

  // Check for unsaved changes
  useEffect(() => {
    if (JSON.stringify(editedScores) !== JSON.stringify(originalScores)) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [editedScores, originalScores]);

  if (testDataLoading || usersLoading) return <Loader />;

  const validateScores = () => {
    if (!testData) return false;

    const errors: Record<string, string[]> = {};

    Object.entries(editedScores).forEach(([userId, data]) => {
      const userErrors: string[] = [];

      if (data.score > testData?.testData.totalMarks) {
        userErrors.push(
          `Score cannot exceed total marks (${testData?.testData.totalMarks})`
        );
      }

      if (data.score < 0) {
        userErrors.push("Score cannot be negative");
      }

      if (data.correct > testData?.testData.totalQuestions) {
        userErrors.push(
          `Correct answers cannot exceed total questions (${testData?.testData.totalQuestions})`
        );
      }

      if (data.correct < 0) {
        userErrors.push("Correct answers cannot be negative");
      }

      if (userErrors.length > 0) {
        errors[userId] = userErrors;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleScoreChange = (
    userId: string,
    field: keyof TestData,
    value: number | string
  ) => {
    if (!testData) return;

    let parsedValue: number | string = value;

    if (field !== "status") {
      parsedValue = Number(value);

      if (
        field === "correct" &&
        parsedValue > testData?.testData.totalQuestions
      ) {
        toast.error("Correct answers cannot exceed total questions");
        return;
      }

      if (field === "score" && parsedValue > testData?.testData.totalMarks) {
        toast.error("Score cannot exceed total marks");
        return;
      }
    }

    setEditedScores((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || { score: 0, correct: 0, status: "not attempted" }),
        [field]: parsedValue,
      },
    }));
  };

  const handleSave = async () => {
    if (!testData?.testData || testDataLoading || usersLoading) return;

    if (!validateScores()) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    setIsSaving(true);

    // Mock API call - replace with actual API call
    update_test_score(
      { serverValue: editedScores, id: testId },
      {
        onSuccess: (res) => {
          if (res.status && res.message) {
            setOriginalScores({ ...editedScores });

            setIsEditing(false);

            toast.success("Test data saved successfully");
          } else {
            toast.error(res.error);
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );

    setIsSaving(false);
    setShowConfirmDialog(false);
  };

  const handleAddStudents = () => {
    if (!testData) return;

    const newScores = { ...editedScores };

    students.forEach((student: UserType) => {
      if (!newScores[student._id]) {
        newScores[student._id] = {
          score: 0,
          correct: 0,
          status: "not attempted",
        };
      }
    });

    setEditedScores(newScores);
    setIsEditing(true);
    setHasStudentData(true)
    setActiveTab("scores");
  };


  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      setIsEditing(false);
      setEditedScores({ ...originalScores });
    }
  };

  const confirmCancel = () => {
    setIsEditing(false);
    setEditedScores({ ...originalScores });
    setShowConfirmDialog(false);
  };

  const getWeekNumber = (date: Date | undefined | null): number => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 0;
    }

    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const pastDaysOfMonth = date.getDate() - 1;
    return Math.ceil((pastDaysOfMonth + firstDayOfMonth.getDay()) / 7);
  };

  const getPassStatus = (score: number) => {
    return testData ? score >= testData?.testData.passMarks : false;
  };

  // Prepare data for the bar chart
  const chartData =  Object.entries(editedScores || {}).map(([userId, data]) => {
      const student = students?.find((s: UserType) => s._id === userId);
      return {
        userId,
        name: student?.name || userId.substring(0, 8),
        score: data.score,
        correct: data.correct,
        passed: getPassStatus(data.score),
        status: data.status,
      };
    });
  // Check if there is any student data
  

  if(!chartData || usersLoading || testDataLoading)return <Loader />

  if (!testData) {
    return (
      <div className="container mx-auto py-6 bg-black text-white px-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            className="bg-gray-900 text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tests
          </Button>
        </div>

        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle>No Test Data Available</CardTitle>
            <CardDescription className="text-gray-400">
              This test has not been set up yet or the data is missing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileQuestion className="w-16 h-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Test Not Found</h3>
            <p className="text-gray-400 text-center mb-6">
              The test you're looking for doesn't exist or hasn't been created
              yet. Please check the test ID or create a new test.
            </p>
            <Button className="bg-red-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create New Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto py-6 bg-black text-white px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            className="bg-gray-900 text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tests
          </Button>

          {hasStudentData && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    className="bg-gray-800 text-white"
                    onClick={handleCancelEdit}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      validateScores() && setShowConfirmDialog(true)
                    }
                    disabled={isSaving || !hasUnsavedChanges}
                    className="bg-red-600 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-red-600 text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Scores
                </Button>
              )}
            </div>
          )}
        </div>

        <Card className="mb-6 bg-gray-900 text-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Test Details</CardTitle>
              <Badge className="bg-red-600 text-white">
                {format(testData?.testData.date, "MMM dd, yyyy")} - Week{" "}
                {getWeekNumber(testData?.testData.date)}
              </Badge>
            </div>
            <CardDescription className="text-gray-400">
              View and manage test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Created</p>
                <p className="text-lg font-medium">
                  {format(testData?.testData.createdAt, "PPP")}
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Total Marks</p>
                <p className="text-lg font-medium">
                  {testData?.testData.totalMarks}
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Pass Marks</p>
                <p className="text-lg font-medium">
                  {testData?.testData.passMarks}
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Total Questions</p>
                <p className="text-lg font-medium">
                  {testData?.testData.totalQuestions}
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Submitted By</p>
                <p className="text-lg font-medium">
                  {testData?.testData.submittedBy}
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Students</p>
                <p className="text-lg font-medium">
                  {Object.keys(editedScores).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-800 w-full lg:w-auto ">
            <TabsTrigger
              value="scores"
              className="data-[state=active]:bg-red-600 w-full lg:w-[300px] lg:min-w-[100px] "
            >
              Student Scores
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-red-600 w-full lg:w-[300px] lg:min-w-[100px] "
            >
              <ChartIcon className=" h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="grid  grid-cols-1 lg:grid-cols-2 gap-x-6  items-center justify-center  p-2 lg:p-8">
            <Card className=" bg-gray-900 text-white w-full lg:w-auto">
                <CardHeader>
                  <CardTitle>Student Scores</CardTitle>
                  <CardDescription className="text-gray-400">
                    {isEditing
                      ? "Edit student scores and mark their test status"
                      : "View student performance on this test"}
                  </CardDescription>
                </CardHeader>
              <CardContent>
                {hasStudentData ? (
                  <div className="h-80">
                    <Table className="w-full h-full"> 
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">Student</TableHead>
                          <TableHead className="text-white text-right">
                            Score
                          </TableHead>
                          <TableHead className="text-white text-right">
                            Correct
                          </TableHead>
                          <TableHead className="text-white">Status</TableHead>
                          {!isEditing && (
                            <TableHead className="text-white">Result</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        { editedScores && Object.entries(editedScores).map(
                          ([userId, data]) => {
                            const student = students?.find(
                              (s: UserType) => s._id === userId
                            );
                            const hasErrors =
                              validationErrors[userId]?.length > 0;

                            return (
                              <TableRow
                                key={userId}
                                className={
                                  hasErrors
                                    ? "border-red-500 bg-red-900/20"
                                    : ""
                                }
                              >
                                <TableCell className="text-white font-medium">
                                  {student?.name || userId.substring(0, 8)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-end gap-2">
                                    {isEditing ? (
                                      <Input
                                        type="number"
                                        value={data.score}
                                        onChange={(e) =>
                                          handleScoreChange(
                                            userId,
                                            "score",
                                            e.target.value
                                          )
                                        }
                                        min={0}
                                        max={testData?.testData.totalMarks}
                                        className={`bg-gray-800 text-white w-16 text-right ${
                                          hasErrors ? "border-red-500" : ""
                                        }`}
                                      />
                                    ) : (
                                      <span className="text-white">
                                        {data.score}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-end gap-2">
                                    {isEditing ? (
                                      <Input
                                        type="number"
                                        value={data.correct}
                                        onChange={(e) =>
                                          handleScoreChange(
                                            userId,
                                            "correct",
                                            e.target.value
                                          )
                                        }
                                        min={0}
                                        max={testData?.testData.totalQuestions}
                                        className={`bg-gray-800 text-white w-16 text-right ${
                                          hasErrors ? "border-red-500" : ""
                                        }`}
                                      />
                                    ) : (
                                      <span className="text-white">
                                        {data.correct}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {isEditing ? (
                                    <Select
                                      value={data.status}
                                      onValueChange={(value) =>
                                        handleScoreChange(
                                          userId,
                                          "status",
                                          value as "attempted" | "not attempted"
                                        )
                                      }
                                    >
                                      <SelectTrigger className="w-full bg-gray-800 text-white">
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-800 text-white">
                                        <SelectItem value="attempted">
                                          Attempted
                                        </SelectItem>
                                        <SelectItem value="not attempted">
                                          Not Attempted
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Badge
                                      variant={
                                        data.status === "attempted"
                                          ? "default"
                                          : "outline"
                                      }
                                      className="bg-gray-700"
                                    >
                                      {data.status}
                                    </Badge>
                                  )}
                                </TableCell>
                                {
                                  !isEditing && (
                                    <TableCell>
                                  <Badge
                                    className={
                                      getPassStatus(data.score)
                                        ? "bg-green-600"
                                        : "bg-red-600"
                                    }
                                  >
                                    {getPassStatus(data.score)
                                      ? "Passed"
                                      : "Failed"}
                                  </Badge>
                                </TableCell>
                                  )
                                }
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>

                    {Object.keys(validationErrors).length > 0 && (
                      <Alert
                        variant="destructive"
                        className="mt-4 bg-red-900 border-red-600"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Validation Errors</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 mt-2">
                            {Object.entries(validationErrors).map(
                              ([userId, errors]) => {
                                const student = students?.find(
                                  (s: UserType) => s._id === userId
                                );
                                return errors.map((error, index) => (
                                  <li key={`${userId}-${index}`}>
                                    <strong>
                                      {student?.name || userId.substring(0, 8)}:
                                    </strong>{" "}
                                    {error}
                                  </li>
                                ));
                              }
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <UserPlus className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No Student Data
                    </h3>
                    <p className="text-gray-400 mb-6">
                      No student scores have been added to this test yet.
                    </p>
                    <Button
                      onClick={handleAddStudents}
                      className="bg-red-600 text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Student Scores
                    </Button>
                  </div>
                )}
              </CardContent>
              </Card>
              {testData?.testData?.testData && (
                <div className="grid grid-cols-1  gap-6 mt-6   w-full lg:grid-cols-2">
                  <Card className="bg-gray-900 text-white">
                    <CardHeader>
                      <CardTitle>Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                          <span>Average Score</span>
                          <span className="font-bold">
                            {(
                              chartData &&
                              chartData?.reduce(
                                (acc, item) => acc + item.score,
                                0
                              ) / chartData.length
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                          <span>Highest Score</span>
                          <span className="font-bold">
                            {Math.max(...chartData.map((item) => item.score))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                          <span>Lowest Score</span>
                          <span className="font-bold">
                            {Math.min(...chartData.map((item) => item.score))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                          <span>Pass Rate</span>
                          <span className="font-bold">
                            {(
                              (chartData.filter((item) => item.passed).length /
                                chartData.length) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 text-white w-full">
                    <CardHeader>
                      <CardTitle>Student Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                          <span>Total Students</span>
                          <span className="font-bold">{chartData.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                          <span>Attempted</span>
                          <span className="font-bold">
                            {chartData &&
                              chartData.filter(
                                (item) =>
                                  editedScores[item.userId]?.status ===
                                  "attempted"
                              ).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                          <span>Not Attempted</span>
                          <span className="font-bold">
                            {chartData &&
                              chartData.filter(
                                (item) =>
                                  editedScores?.[item.userId]?.status ===
                                  "not attempted"
                              ).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                          <span>Passed</span>
                          <span className="font-bold text-green-500">
                            {chartData.filter((item) => item.passed).length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
          </TabsContent>

          <TabsContent
            value="analytics"
            className="grid bg-red-600 grid-cols-1 lg:grid-cols-2 gap-x-6  items-center justify-center  p-2 lg:p-8"
          >
            <Card className="bg-gray-900 text-white w-full lg:w-auto">
            <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription className="text-gray-400">
                  Visual representation of student performance
                </CardDescription>
              </CardHeader>
              
              <CardContent>
              
                {testData?.testData?.testData ? (
                  <div className="h-80 ">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          tick={{ fill: "#fff" }}
                        />
                        <YAxis
                          domain={[0, testData?.testData.totalMarks]}
                          tick={{ fill: "#fff" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            color: "#fff",
                            border: "none",
                          }}
                          formatter={(value, name) => [
                            value,
                            name === "score" ? "Score" : "Correct",
                          ]}
                          labelFormatter={(label) => `Student: ${label}`}
                        />
                        <Bar
                          dataKey="score"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                          name="Score"
                        />
                        <Bar
                          dataKey="correct"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          name="Correct"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <ChartIcon className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No Data to Visualize
                    </h3>
                    <p className="text-gray-400">
                      Add student scores first to see analytics.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {testData?.testData?.testData && (
              <div className="grid grid-cols-1  gap-6 mt-6   w-full lg:grid-cols-2">
                <Card className="bg-gray-900 text-white">
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span>Average Score</span>
                        <span className="font-bold">
                          {(
                            chartData &&
                            chartData.reduce(
                              (acc, item) => acc + item.score,
                              0
                            ) / chartData.length
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span>Highest Score</span>
                        <span className="font-bold">
                          {Math.max(...chartData.map((item) => item.score))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span>Lowest Score</span>
                        <span className="font-bold">
                          {Math.min(...chartData.map((item) => item.score))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span>Pass Rate</span>
                        <span className="font-bold">
                          {(
                            (chartData.filter((item) => item.passed).length /
                              chartData.length) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 text-white w-full">
                  <CardHeader>
                    <CardTitle>Student Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span>Total Students</span>
                        <span className="font-bold">{chartData.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span>Attempted</span>
                        <span className="font-bold">
                          {chartData &&
                            chartData.filter(
                              (item) =>
                                editedScores[item.userId]?.status ===
                                "attempted"
                            ).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span>Not Attempted</span>
                        <span className="font-bold">
                          {chartData &&
                            chartData.filter(
                              (item) =>
                                editedScores?.[item.userId]?.status ===
                                "not attempted"
                            ).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <span>Passed</span>
                        <span className="font-bold text-green-500">
                          {chartData.filter((item) => item.passed).length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle>Save Changes</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to save these changes? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {Object.keys(validationErrors).length > 0 && (
                <Alert
                  variant="destructive"
                  className="mb-4 bg-red-900 border-red-600"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Cannot Save</AlertTitle>
                  <AlertDescription>
                    Please fix the validation errors before saving.
                  </AlertDescription>
                </Alert>
              )}

              <p className="text-sm text-gray-400">
                You are about to update scores for{" "}
                {Object.keys(editedScores).length} students.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="bg-gray-800 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || Object.keys(validationErrors).length > 0}
                className="bg-red-600 text-white"
              >
                {isSaving ? "Saving..." : "Confirm Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Toaster for toast notifications */}
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
