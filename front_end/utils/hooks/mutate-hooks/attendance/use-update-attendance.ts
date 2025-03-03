

import { create_attendance, update_attendance } from "@/actions/attendance/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update_attendance,
    
    onSuccess: (res) => {
      if(res.message && res.updatedAttendance){
        queryClient.invalidateQueries({ queryKey: ["get_today_attendance"] })
      }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}