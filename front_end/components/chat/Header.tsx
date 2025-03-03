import React from "react";
import { UserType } from "../authorize/authorize-user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EllipsisIcon } from "lucide-react";

interface HeaderProps {
  user: UserType;
}
function Header({ user }: HeaderProps) {
  return (
    <div className="bg-black border-b border-red-600 h-[60px] lg:h-[80px] text-white flex items-center py-4 px-4 justify-between ">
      <div className="flex items-center  gap-x-4">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 lg:h-10 lg:w-10 border border-white">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-[18px]">{user?.name}</span>
      </div>
      <div>
        <EllipsisIcon  />
      </div>
    </div>
  );
}

export default Header;
