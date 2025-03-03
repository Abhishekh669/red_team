import { Loader as Loading } from "lucide-react";
export const Loader= () => {
  return (
    <div className=" h-full w-full flex justify-center items-center">
      <Loading className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
};