'use server';

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";
import { ZodString } from "zod";

interface AttendaceRecord{
    userId : string,
    isPresent : boolean,
    reason ?: string,
    recordedAt : Date
}


interface AttendaceTracer{
    attendance : AttendaceRecord[],
    date : string,
    field : string,
    submittedBy : string,
}


interface UpdateAttendanceType{
  _id : string,
  attendance : AttendaceRecord[],
  date : string,
  field : string,
  submittedBy : string,
  createdAt : Date
}



export const get_all_attendance = async() =>{
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.get(`${backendUrl}/api/user/attendance/all` ,{
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });


    if (res.statusText !== "OK"){
      return {
        error : "failed to get  all the attendance"
      }
    }
    const data = await res.data;
    if(!data){
      return {
        error : "failed to get all the attendance"
      }
    }

   
    return { message: "Successfully got  all the attendance ", allAttendance : JSON.stringify(data)};
  } catch (error  : unknown) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || "Unknown Axios error" };
    }
    return { error: "An unexpected error occurred" };
  }


}


export const update_attendance = async(values : UpdateAttendanceType) =>{
  console.log("this ishte values : ",values)
  const session_cookie = await get_cookies("__session");
      const admin_cookie = await get_cookies("admin_token");
      if (!session_cookie || !admin_cookie) {
        return {
          error: "user not authenticated",
        };
      }


      try {
        const res = await axios.post(`${backendUrl}/api/admin/attendance/update`,values,{
          headers: {
            Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
          },
        })

        if(res.statusText != "OK"){
          return {
            error : "failed to get data"
          }
        }

        const data  = await res.data ;
        if(!data){
          return {
            error : "failed to update attendance",
          }
        }

        return {
          message : "successfully updated attendance attendance",
          updatedAttendance : JSON.stringify(data)
        }
        
      } catch (error) {
        return {
          error : "failed to get the attendance"
        }
        
      }


}


export  const get_today_attendance = async() =>{
  const session_cookie = await get_cookies("__session");
      const admin_cookie = await get_cookies("admin_token");
      if (!session_cookie || !admin_cookie) {
        return {
          error: "user not authenticated",
        };
      }


      try {
        const res = await axios.get(`${backendUrl}/api/admin/attendance/today`,{
          headers: {
            Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
          },
        })

        if(res.statusText != "OK"){
          return {
            error : "failed to get data"
          }
        }

        const data  = await res.data || {};

        return {
          message : "successfully got attendance",
          todayAttendance : JSON.stringify(data)
        }
        
      } catch (error) {
        return {
          error : "failed to get the attendance"
        }
        
      }


}


export const get_attendance_by_date = async(date : Date) =>{
  const session_cookie = await get_cookies("__session");
      const admin_cookie = await get_cookies("admin_token");
      if (!session_cookie || !admin_cookie) {
        return {
          error: "user not authenticated",
        };
      }


      try {
        const res = await axios.get(`${backendUrl}/api/admin/attendance/date`,{
          headers: {
            Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
          },
        })

        if(res.statusText != "OK"){
          return {
            error : "failed to get data"
          }
        }

        const data  = await res.data || {};

        return {
          message : "successfully got attendance",
          attendance : data
        }
        
      } catch (error) {
        return {
          error : "failed to get the attendance"
        }
        
      }


}


export const create_attendance = async(values : AttendaceTracer) =>{
      const session_cookie = await get_cookies("__session");
      const admin_cookie = await get_cookies("admin_token");
      if (!session_cookie || !admin_cookie) {
        return {
          error: "user not authenticated",
        };
      }

      try {
        const res = await axios.post(`${backendUrl}/api/admin/attendance`,values,{
            headers: {
                Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
              },
        })

        if (res.statusText != "OK"){
            return {
                error : "failed to create attendance"
            }
        }

        const data = await res.data;
        if(!data) {
            return {
                error : "failed to create attendance"
            }
        }

        return {
            message : "successfully created attendance",
            attendance : data
        }

      } catch (error) {
        return {
            error : error
        }
        
      }
}