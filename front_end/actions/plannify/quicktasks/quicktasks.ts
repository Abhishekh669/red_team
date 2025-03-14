'use server'

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";

interface createQuickTaskType{
    title : string,
    author ?: string,
    completed : boolean,
    favorite : boolean,
    notes ?: string,
    type : 'todo' | 'book'
}


interface ToggleQuickTasks{
  field : string,
  status : boolean,
  _id : string,
}



export const deleteQuicksTasks  = async(id : string) =>{
  const session_cookie = await get_cookies("__session");
    if (!session_cookie) {
      return {
        error: "user not authenticated",
      };
    }
console.log("this is the id to delte : ",id)
    try {
      const res = await axios.delete(`${backendUrl}/api/planify/tasks/quicktasks/delete/${id}`,{
          withCredentials: true,
          headers: {
            Cookie: `__session=${session_cookie}`
          },
      })
      if (res.statusText !== "OK"){
          return {
            error : "failed to delete task"
          }
        }
        const data = await res.data;
        if(!data){
          return {
            error : "failed to delete task"
          }
        }
        return { message: "Successfully delete task", status : true};

  } catch (error) {
      if (axios.isAxiosError(error)) {
          return { error: error.response?.data || "Unknown Axios error" };
        }
        return { error: "An unexpected error occurred" };
      
  }
}






export const toggleQuickTasks  = async(values : ToggleQuickTasks) =>{
  const session_cookie = await get_cookies("__session");
    if (!session_cookie) {
      return {
        error: "user not authenticated",
      };
    }
    console.log("this is toggle vlaues : ",values)
    try {
      const res = await axios.post(`${backendUrl}/api/planify/tasks/quicktasks/toggle`,values,{
          withCredentials: true,
          headers: {
            Cookie: `__session=${session_cookie}`,
          },
      })
      if (res.statusText !== "OK"){
          return {
            error : "failed to toggle task"
          }
        }
        const data = await res.data;
        if(!data){
          return {
            error : "failed to toggle task"
          }
        }
        return { message: "Successfully toogled task", status : true};

  } catch (error) {
      if (axios.isAxiosError(error)) {
          return { error: error.response?.data || "Unknown Axios error" };
        }
        return { error: "An unexpected error occurred" };
      
  }
}



export const createQuickTask = async(values : createQuickTaskType) =>{
    const session_cookie = await get_cookies("__session");
    if (!session_cookie) {
      return {
        error: "user not authenticated",
      };
    }

  try {
      const res = await axios.post(`${backendUrl}/api/planify/tasks/quicktasks/create`,values,{
          withCredentials: true,
          headers: {
            Cookie: `__session=${session_cookie}`,
          },
      })
      if (res.statusText !== "OK"){
          return {
            error : "failed to create  task"
          }
        }
        const data = await res.data;
        if(!data){
          return {
            error : "failed to create task"
          }
        }
        return { message: "Successfully created new task", status : true}

  } catch (error) {
      if (axios.isAxiosError(error)) {
          return { error: error.response?.data || "Unknown Axios error" };
        }
        return { error: "An unexpected error occurred" };
      
  }

}


export const getUserQuickTasks = async() =>{
  const session_cookie = await get_cookies("__session");
    if (!session_cookie) {
      return {
        error: "user not authenticated",
      };
    }


  try {
      const res = await axios.get(`${backendUrl}/api/planify/tasks/quicktasks/all`,{
          withCredentials: true,
          headers: {
            Cookie: `__session=${session_cookie}`,
          },
      })
      if (res.statusText !== "OK"){
          return {
            error : "failed to get resposne "
          }
        }
        const data = await res.data || [];
        
        return { message: "Successfully got user pages", quickTasks : JSON.stringify(data)};

  } catch (error) {
      if (axios.isAxiosError(error)) {
          return { error: error.response?.data || "Unknown Axios error" };
        }
        return { error: "An unexpected error occurred" };
      
  }
}
