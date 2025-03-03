

import { create_attendance } from "@/actions/attendance/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create_attendance,
    
    onSuccess: (res) => {
      if(res.message && res.attendance){
        queryClient.invalidateQueries({ queryKey: ["get_today_attendance"] })
      }
      
        
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}