import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import Hint from "../Hint";

export interface UserType {
  address: string;
  age: number;
  allowCreate ?: boolean;
  codeName: string;
  field: string;
  isAdmin: boolean;
  isOnBoarded: boolean;
  isVerified: boolean;
  phoneNumber: string;
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  image: string;
}

interface OnboardingRequestCardProps {
  request: UserType;
  verifying : boolean,
  rejecting : boolean;
  onAccept: ({ id }: { id: string }) => void;
  onReject: (id: string) => void;
}

export function OnboardingRequestCard({ request, onAccept, onReject, verifying, rejecting }: OnboardingRequestCardProps) {
  const handleAccept = async () => {
    await onAccept({ id: request?._id });
  };

  const handleReject = async () => {
    await onReject(request?._id);
  }; 

  return (
    <Card className="w-[300px] p-1  bg-gray-900 border-gray-700">
      <CardHeader className="flex-row gap-x-6 ">
        <Avatar className="h-12 w-12">
          <AvatarImage src={request?.image} alt={request?.name} />
          <AvatarFallback>{request?.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col w-full">
          <CardTitle className="text-red-600">{request?.name.toUpperCase()}</CardTitle>
          <span className="text-sm text-white break-words w-[150px]  overflow-hidden whitespace-normal">
            {request?.email} 
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-semibold text-red-600">Code Name</p>
            <p className="text-sm text-white">{request?.codeName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600">Field</p>
            <p className="text-sm text-white max-w-[100px] truncate">{request?.field}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600">Age</p>
            <p className="text-sm text-white">{request?.age}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600">Onboarded</p>
            <p className="text-sm text-white">{request?.isOnBoarded ? "True" : "False"}</p>
          </div>
        </div>
        <div className="mt-4 cursor-pointer">
         <Hint label={format(parseISO(request.createdAt), "EEEE, dd MMMM yyyy, hh:mm a")}>
         <Badge variant="secondary" className="bg-gray-700 text-red-600 hover:bg-gray-700">
            {formatDistanceToNow(parseISO(request?.createdAt), { addSuffix: true, includeSeconds: true })}
          </Badge>
         </Hint>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="bg-red-300 text-rose-600  hover:text-rose-800  hover:bg-rose-400 border-none"
          onClick={handleReject}
          disabled={rejecting}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleAccept}
          disabled={verifying}
          className="text-rose-600 hover:text-rose-600 bg-green-300 hover:bg-green-300"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Verify
        </Button>
      </CardFooter>
    </Card>
  );
}