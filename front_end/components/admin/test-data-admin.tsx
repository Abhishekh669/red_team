"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";
import { ServerTestDataType } from "@/types";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TestCard, { testData } from "./test-card";
import { useCreateTest } from "@/utils/hooks/mutate-hooks/admin/use-create-test";
import { useSessionStore } from "@/utils/store/use-session-store";
import toast from "react-hot-toast";
import { z } from "zod";
import { Separator } from "../ui/separator";

export default function TestDataAdmin({
  testDatas,
}: {
  testDatas: ServerTestDataType[];
}) {
  const router = useRouter();
  const { mutate: create_test, isPending: creating_test } = useCreateTest();
  const [open, setOpen] = useState(false);
  const { user } = useSessionStore();

  const handleCreate = (values: z.infer<typeof testData>) => {
    if (creating_test) return;
    const newValues = { ...values, submittedBy: user?.codeName || "" };
    console.log("this is the newValues : ", newValues);
    create_test(newValues, {
      onSuccess: (res) => {
        if (res.status && res.message) {
          toast.success(res.message);
        } else {
          toast.error(res.error);
        }
      },
      onError: (error) => {
        toast.error(error.message || "failed to create test data");
      },
    });
  };

  // Group test data by year
  const testsByYear = useMemo(() => {
    const grouped: Record<string, ServerTestDataType[]> = {};

    testDatas?.forEach((test) => {
      const date = new Date(test.date);
      const year = date.getFullYear().toString();

      if (!grouped[year]) {
        grouped[year] = [];
      }

      grouped[year].push({
        ...test,
        createdAt: new Date(test.createdAt),
        date: new Date(test.date),
      });
    });

    return grouped;
  }, [testDatas]);

  // Get available years in reverse order (latest first)
  const availableYears = useMemo(() => {
    return Object.keys(testsByYear).sort(
      (a, b) => Number.parseInt(b) - Number.parseInt(a)
    );
  }, [testsByYear]);

  const [activeYear, setActiveYear] = useState<string>(
    availableYears[0] || new Date().getFullYear().toString()
  );

  // Group tests by month for the active year
  const testsByMonth = useMemo(() => {
    if (!testsByYear[activeYear]) return {};

    const grouped: Record<string, ServerTestDataType[]> = {};

    testsByYear[activeYear].forEach((test) => {
      const date = new Date(test.date);
      const month = format(date, "MMMM"); // Full month name

      if (!grouped[month]) {
        grouped[month] = [];
      }

      grouped[month].push(test);
    });

    return grouped;
  }, [testsByYear, activeYear]);

  // Get week number for a date
  const getWeekNumber = (date: Date) => {
    const day = date.getDate();
    return Math.ceil(day / 7);
  };

  const handleCardClick = (testId: string) => {
    router.push(`/test-data/${testId}`);
  };

  // If no test data, show a UI to create a new test
  if (!testDatas || testDatas.length === 0) {
    return (
      <>
        <TestCard
          open={open}
          setOpen={() => setOpen(false)}
          createTest={handleCreate}
          creating_test={creating_test}
        />
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Test Administration</h1>
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white">
                No Tests Taken Yet
              </h2>
              <p className="text-gray-400 mt-2">
                You haven't created any tests yet. Start by creating a new test.
              </p>
            </div>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => setOpen(true)} // Redirect to create test page
            >
              Create New Test
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-full lg:flex lg:justify-center">
      <TestCard
        open={open}
        setOpen={() => setOpen(false)}
        createTest={handleCreate}
        creating_test={creating_test}
      />
      <div className="container px-8 py-6 text-white">
        <div className=" w-full flex justify-between">
          <h1 className="text-3xl font-bold mb-6">Test Administration</h1>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => setOpen(true)} // Redirect to create test page
          >
            Create New Test
          </Button>
        </div>

        {/* Year Selector */}
        <div className="mb-6">
          <Select value={activeYear} onValueChange={setActiveYear}>
            <SelectTrigger className="w-[200px] bg-slate-900/50 text-white border-red-600">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900/50 text-white border-red-600">
              {availableYears.map((year) => (
                <SelectItem
                  key={year}
                  value={year}
                  className=" bg-slate-900 hover:bg-slate-900 text-white focus:bg-slate-950 focus:text-white"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Test Data by Month */}
        <div className="space-y-8 text-white w-full h-full  ">
          {Object.entries(testsByMonth)
            .sort(([monthA], [monthB]) => {
              // Sort months in reverse order (latest first)
              const dateA = new Date(`${monthA} 1, ${activeYear}`);
              const dateB = new Date(`${monthB} 1, ${activeYear}`);
              return dateB.getTime() - dateA.getTime();
            })
            .map(([month, tests]) => (
              <div key={month} className="space-y-4 ">
                <h2 className="text-2xl font-semibold capitalize">{month}</h2>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
                <div className=" flex flex-wrap  px-4  gap-y-4  gap-x-10">
                  {tests.map((test) => {
                    const weekNumber = getWeekNumber(new Date(test.date));
                    const monthShort = format(new Date(test.createdAt), "MMM");

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
                                {format(new Date(test.date), "MMM d, yyyy")}
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
                                    new Date(test.createdAt),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>Total Marks: {test.totalMarks}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>Pass Marks: {test.passMarks}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="outline"
                              className="w-full mt-2"
                              onClick={() =>
                                router.push(`/test-admin/${test?._id}`)
                              }
                            >
                              View Student Scores
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                  <Separator  className="w-full mt-4"/>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
