import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { UserType } from "../authorize/authorize-user";
import { ServerTestDataType } from "@/types";

type EditUserDataProps = {
  users: UserType[];
  open: boolean;
  setOpen: (open: boolean) => void;
  testData: ServerTestDataType; // Single object, not an array
};

function EditUserData({ users, open, setOpen, testData }: EditUserDataProps) {
  return (
    <Dialog open={true} onOpenChange={setOpen}>
      <DialogContent className="bg-slate-950 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit User Data</DialogTitle>
        </DialogHeader>

        {/* User Data Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Code Name</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="text-white">{user.name}</TableCell>
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell className="text-white">{user.codeName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isVerified ? "default" : "destructive"}
                      className={user.isVerified ? "bg-green-500" : "bg-red-500"}
                    >
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="bg-slate-900/50 text-white border-red-600 hover:bg-slate-800/50"
                      onClick={() => {
                        // Handle edit action for the user
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Test Data Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Test Data</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="text-white">
                {new Date(testData?.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Marks</p>
              <p className="text-white">{testData?.totalMarks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Pass Marks</p>
              <p className="text-white">{testData?.passMarks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Questions</p>
              <p className="text-white">{testData?.totalQuestions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Submitted By</p>
              <p className="text-white">{testData?.submittedBy}</p>
            </div>
          </div>

          {/* User Test Data */}
          { testData?.testData && testData?.testData && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">User Scores</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">User ID</TableHead>
                    <TableHead className="text-white">Score</TableHead>
                    <TableHead className="text-white">Correct Questions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(testData.testData).map(([userId, testResult]) => (
                    <TableRow key={userId}>
                      <TableCell className="text-white">{userId}</TableCell>
                      <TableCell className="text-white">{testResult.score}</TableCell>
                      <TableCell className="text-white">{testResult.correct}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserData;