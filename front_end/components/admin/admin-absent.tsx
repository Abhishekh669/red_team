"use client";

import {  useMemo } from "react";
import { UserCircle, Calendar } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetAllAbsentRequest } from "@/utils/hooks/query-hooks/absent/use-gell-all-absent-request";
import { Loader } from "../ui/Loader";

// Updated AbsentRequestType to match the new structure


// New interface for user summary
interface UserSummary {
  userId: string;
  name: string;
  codeName: string;
  totalAbsences: number;
}

// Dummy data for users (you would fetch this from your server in a real application)


export default function AdminDashboard() {
  const { data: absentRequests, isLoading: absentRequestLoading } =
    useGetAllAbsentRequest();


  const users = useMemo(() => {
    if (!absentRequests?.absentRequests) return [];

    const userMap = new Map();

    absentRequests.absentRequests.forEach((user: UserSummary) => {
      if (!userMap.has(user.userId)) {
        userMap.set(user.userId, {
          name: user.name,
          userId: user.userId,
          codeName: user.codeName,
          totalAbsences: 0,
        });
      }
      userMap.get(user.userId).totalAbsences += 1;
    });

    return Array.from(userMap.values());
  }, [absentRequests?.absentRequests]);

//   useEffect(() => {
//     if (absentRequestLoading) return;
//     if (absentRequests?.absentRequests.length > 0) {
//       setAbsentRequestsData(absentRequests?.absentRequests);
//     }
//   }, [absentRequestLoading, absentRequests?.absentRequests]);
if(absentRequestLoading)return <Loader />

  return (
    <div className="flex  flex-col items-center bg-black">
      <div className="w-full max-w-6xl">
        
        <Card className="border-red-600 bg-slate-950 text-white shadow-lg">
          <CardHeader className="border-b border-red-800 pb-4">
            <CardTitle className="text-2xl font-bold text-red-500">
              Employee Absence Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users &&
                users?.map((user: UserSummary) => (
                  <Link href={`/absent/user/${user.userId}`} key={user.userId}>
                    <Card className="border-gray-700 bg-slate-900/90 hover:border-red-500 transition-all cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold text-white">
                            {user.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-blue-900/20 text-blue-400 border-blue-400"
                          >
                            {user.codeName}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <UserCircle className="text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {user.codeName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {user.totalAbsences} absences
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-red-600 hover:bg-red-700 transition-colors">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
