"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Circle } from "lucide-react";
import { UserType } from "../authorize/authorize-user";

function UserCard({ user }: { user: UserType }) {
  return (
    <Card className=" pr-2 border-b border-gray-200 rounded-none bg-black text-red-600  md:w-[290px] lg:w-[350px] md:h-[90px] hover:bg-rose-500 hover:rounded-md items-center"
    >
      <CardContent className="flex justify-between items-center p-2 md:p-1">
        <div className="flex py-3 gap-x-10 px-8  md:py-1 lg:py-2 md:px-2 lg:px-3 md:gap-x-4 lg:gap-x-8">
          <Avatar className="h-14 w-14 md:h-12 md:w-12 lg:h-14 lg:w-14 border border-white">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback>
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 ">
            <h1 className="font-semibold text-white text-[18px] md:text-[16px] lg:text-[18px]">
              {user?.name}
            </h1>
            <p className="text-muted-foreground">latest message</p>
          </div>
        </div>

        <div className="flex items-center gap-x-1  text-gray-200 ">
          <Circle className=" bg-gray-200 rounded-full size-2" /> 5m
        </div>
      </CardContent>
    </Card>
  );
}

export default UserCard;
