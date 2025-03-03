"use server";

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import { TestData } from "@/types";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

interface AdminType {
  email: string;
  password: string;
  userId: string;
}

interface TestType{
  date : Date,
  totalMarks : number,
  passMarks : number,
  totalQuestions : number,
  submittedBy : string
}


interface UpdateTestScoreType{
  serverValue : Record<string, TestData>,
  id : string
}







export const update_test_score = async(values : UpdateTestScoreType ) =>{
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.post(`${backendUrl}/api/admin/test/update/${values.id}`,values.serverValue ,{
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    if (res.statusText !== "OK"){
      return {
        error : "failed to update  test score"
      }
    }
    const data = await res.data;
    if(!data){
      return {
        error : "failed to update test score"
      }
    }
   
    return { message: "Successfully updated test score", status : data};
  } catch (error  : unknown) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || "Unknown Axios error" };
    }
    return { error: "An unexpected error occurred" };
  }


}



export const get_test_by_id  = async(id : string) =>{
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.get(`${backendUrl}/api/admin/test/${id}`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    if (res.statusText !== "OK"){
      return {
        error : "failed to get  test"
      }
    }
    const data = await res.data;
    if(!data){
      return {
        error : "failed to get test"
      }
    }
   
    return { message: "Successfully got test data", testData : JSON.stringify(data)};
  } catch (error  : unknown) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || "Unknown Axios error" };
    }
    return { error: "An unexpected error occurred" };
  }

}




export const get_all_test_data = async() =>{
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.get(`${backendUrl}/api/admin/test/all`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    if (res.statusText !== "OK"){
      return {
        error : "failed to get get test"
      }
    }
    const data = await res.data;
    if(!data){
      return {
        error : "failed to get test"
      }
    }
   
    return { message: "Successfully got test data", testData : JSON.stringify(data)};
  } catch (error  : unknown) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || "Unknown Axios error" };
    }
    return { error: "An unexpected error occurred" };
  }

}





export const create_test = async(values : TestType) =>{
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  console.log("this are the values : ",values)
  try {
    const res = await axios.post(`${backendUrl}/api/admin/test/create`,values, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    if (res.statusText !== "OK"){
      return {
        error : "failed to get create test"
      }
    }
    const data = await res.data;
    if(!data){
      return {
        error : "failed to create test"
      }
    }
   
    return { message: "Successfully created test", status : data };
  } catch (error  : unknown) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || "Unknown Axios error" };
    }
    return { error: "An unexpected error occurred" };
  }

}


  export const accept_absent_request = async({id , userId} : {id : string, userId : string}) =>{
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.post(`${backendUrl}/api/admin/absent/user/accept`,{id, userId}, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    if (res.statusText !== "OK"){
      return {
        error : "failed to get accept request"
      }
    }
    const data = await res.data;
    if(!data){
      return {
        error : "failed to accept request"
      }
    }
   
    return { message: "Successfully accepted  request", status : data };
  } catch (error) {
    return { error: "failed to  accepts" };
  }

}

export const reject_absent_request = async({id , userId} : {id : string, userId : string}) =>{
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.post(`${backendUrl}/api/admin/absent/user/reject`,{id, userId}, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    if (res.statusText !== "OK"){
      return {
        error : "failed to get reject request"
      }
    }
    const data = await res.data;
    if(!data){
      return {
        error : "failed to reject request"
      }
    }
   
    return { message: "Successfully rejected  request", status : data };
  } catch (error) {
    return { error: "failed to get absents" };
  }

}

export const get_user_absent_by_id = async(id : string) =>{
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.get(`${backendUrl}/api/admin/absent/user/${id}`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    if (res.statusText !== "OK"){
      return {
        error : "failed to get absent request"
      }
    }
    const data = await res.data || [];
   
    return { message: "Successfully got absent requests", userAbsentRequest: JSON.stringify(data) };
  } catch (error) {
    return { error: "failed to get absents" };
  }

}
 
export const get_all_absent_request = async () => {
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.get(`${backendUrl}/api/admin/absent/all`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    if (res.statusText !== "OK"){
      return {
        error : "failed to get absent request"
      }
    }
    const data = await res.data || [];
   
    return { message: "Successfully got absent requests", absentRequests: JSON.stringify(data) };
  } catch (error) {
    return { error: "failed to get absents" };
  }
};

export const set_or_delete_user = async ({
  userId,
  currentUserId,
}: {
  userId: string;
  currentUserId: string;
}) => {
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.post(
      `${backendUrl}/api/admin/users/setoremove`,
      { userID: userId },
      {
        withCredentials: true,
        headers: {
          Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
        },
      }
    );
    console.log("this is hte response : ", res.data);

    if (res.statusText != "OK") {
      return {
        error: "failed to do update",
      };
    }

    const data = await res.data;
    if (!data) {
      return {
        error: "failed to do update",
      };
    }
    return {
      message: "successfully updated",
      status: data,
    };
  } catch (error) {
    return {
      error: "fialed to do update",
    };
  }
};

export const delete_user = async (id: string) => {
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.delete(
      `${backendUrl}/api/admin/users/delete/${id}`,
      {
        withCredentials: true,
        headers: {
          Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
        },
      }
    );

    if (res.statusText != "OK") {
      return { error: "failed to delete user" };
    }

    const data = await res.data;
    if (!data) {
      return {
        error: "failed to delete user",
      };
    }

    return {
      message: "successfully deleted user",
      status: data,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const verify_user = async (id: string) => {
  console.log("i am for verifying hte user ");
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  console.log(
    "thi ish te sesion and admi cookie : ",
    session_cookie,
    admin_cookie
  );
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  console.log("fine till now");
  try {
    const res = await axios.get(`${backendUrl}/api/admin/verify/${id}`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    const data = await res.data;

    if (!data) {
      return {
        error: "failed to verify user",
      };
    }
    Cookies.set("admin_token", "", {
      expires: -1,
      path: "/",
      domain: "localhost",
    });

    return {
      message: "verified user successfully",
      status: data,
    };
  } catch (error) {
    return {
      error: "failed to verify user",
    };
  }
};

export const reject_user = async (id: string) => {
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.get(`${backendUrl}/api/admin/reject/${id}`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    const data = await res.data;

    if (!data) {
      return {
        error: "failed to reject user",
      };
    }
    return {
      message: "rejected user successfully",
      status: data,
    };
  } catch (error) {
    return {
      error: "failed to  reject user",
    };
  }
};

export const login_admin = async (values: AdminType) => {
  if (!values.email || !values.password || !values.userId) {
    return { error: "Login data missing" };
  }

  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.post(`${backendUrl}/api/admin/login`, values, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    const data = await res.data;

    if (!data) {
      return {
        error: "failed to login",
      };
    }

    const cookie = res.headers["set-cookie"] || [];
    console.log("this is the cookies : ", cookie);
    const admin_cookie = cookie.find((cookie: string) =>
      cookie.trim().startsWith("admin_token=")
    );

    if (!admin_cookie) {
      return {
        error: "failed to login",
      };
    }

    const cookie_value = admin_cookie?.split(";")[0];

    let session_name = cookie_value.split("=")[0];
    let session_token = cookie_value.slice(session_name.length + 1);
    console.log("this ishte ocokie : ", session_name, session_token);

    Cookies.set(session_name, session_token, {
      expires: 7,
      path: "/",
      secure: false,
      sameSite: "None",
    });

    return {
      message: "login successfull",
      success: true,
    };
  } catch (error) {
    return { error: "failed to login admin" };
  }
};

export const get_admin_data_from_token = async () => {
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.get(`${backendUrl}/api/admin/token`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    const data = await res.data.data;

    if (!data) {
      return {
        error: "failed to get admin",
      };
    }
    return {
      message: "got admin data",
      admin_data: JSON.stringify(data),
    };
  } catch (error) {
    return {
      error: "failed to get the admin data",
    };
  }
};

export const create_admin = async (values: AdminType) => {
  if (!values.email || !values.password || !values.userId) {
    return { error: "Login data missing" };
  }

  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.post(`${backendUrl}/api/admin/new`, values, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    console.log("this the res header : ", res.headers);

    const data = await res.data;
    console.log("this is the dat aafter creating admin : ", data);
    if (!data) {
      return { error: "failed to create admin" };
    }

    return {
      message: "created admin successfully",
      admin_data: JSON.stringify(data),
    };
  } catch (error) {
    return {
      error: "failed to create admin",
    };
  }
};

export const get_all_admin = async () => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.get(`${backendUrl}/api/admin/all`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    const data = await res.data;
    if (!data) {
      return { error: "failed to get admins" };
    }
    return { message: "Successfully got admins", all_admin: data.admin_length };
  } catch (error) {
    return { error: "failed to get admins" };
  }
};

export const get_unverified_users = async () => {
  const session_cookie = await get_cookies("__session");
  const admin_cookie = await get_cookies("admin_token");
  if (!session_cookie || !admin_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.get(`${backendUrl}/api/admin/unverified/all`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie};  admin_token=${admin_cookie}`,
      },
    });

    const data = await res.data;

    return {
      message: "got unverified users data",
      users: JSON.stringify(data || []),
    };
  } catch (error) {
    return {
      error: "failed to get the admin data",
    };
  }
};
