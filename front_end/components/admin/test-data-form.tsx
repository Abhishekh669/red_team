"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

export function TestDataForm({ serverData, userId }: { serverData: ServerTestDataType; userId: string }) {
  const [score, setScore] = useState<number>(serverData.testData?.[userId]?.score || 0);
  const [correct, setCorrect] = useState<number>(serverData.testData?.[userId]?.correct || 0);
  const [status, setStatus] = useState<"attempted" | "not attempted">(serverData.testData?.[userId]?.status || "not attempted");

  const handleSubmit = async () => {
    // Update the serverData with the new values
    const updatedData = {
      ...serverData,
      testData: {
        ...serverData.testData,
        [userId]: { score, correct, status },
      },
    };

    // Send the updated data to the server (you can use an API route for this)
    const response = await fetch("/api/update-test-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      alert("Test data updated successfully!");
    } else {
      alert("Failed to update test data.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Update Test Data</CardTitle>
        <CardDescription>Enter your test score and details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="score">Score</label>
          <Input
            id="score"
            type="number"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            placeholder="Enter your score"
          />
        </div>
        <div>
          <label htmlFor="correct">Correct Answers</label>
          <Input
            id="correct"
            type="number"
            value={correct}
            onChange={(e) => setCorrect(Number(e.target.value))}
            placeholder="Enter number of correct answers"
          />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <Select value={status} onValueChange={(value: "attempted" | "not attempted") => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attempted">Attempted</SelectItem>
              <SelectItem value="not attempted">Not Attempted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}