"use server";

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";
import { readSync } from "fs";
import { Update } from "next/dist/build/swc/types";

interface AbsentRequestType {
  date: Date;
  reason: string;
  name: string;
  codeName: string;
}

interface UpdateAbsentRequestType {
  _id: string;
  reason: string;
  date: Date;
  status: "pending" | "accepted" | "rejected";
}

export const update_absent_request = async (
  values: UpdateAbsentRequestType
) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  if (values.status === "accepted" || values.status === "rejected") {
    return { error: "Now you cannot reqeust for the edit" };
  }

  try {
    const res = await axios.post(
      `${backendUrl}/api/student/absent/edit`,
      { _id: values._id, reason: values.reason, date: values.date.toISOString() },
      {
        withCredentials: true,
        headers: {
          Cookie: `__session=${session_cookie}`,
        },
      }
    );

    if (res.statusText != "OK") {
      return {
        error: "failed to get absent request",
      };
    }

    const data = await res.data;

    if (!data) {
      return {
        error: "failed to get absent request",
      };
    }

    return {
      message: "successfully got absent requests",
      status: JSON.stringify(data),
    };
  } catch (error) {
    return { error: "failed to  get the absent request" };
  }
};

export const get_user_all_absent_results = async () => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  try {
    const res = await axios.get(`${backendUrl}/api/student/absent/all`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    if (res.statusText != "OK") {
      return {
        error: "failed to get absent request",
      };
    }

    const data = await res.data;

    if (!data) {
      return {
        error: "failed to get absent request",
      };
    }

    return {
      message: "successfully got absent requests",
      absentResults: JSON.stringify(data),
    };
  } catch (error) {
    return { error: "failed to  get the absent request" };
  }
};

export const createAbsentRequest = async (values: AbsentRequestType) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  console.log("this are the values : ", values);
  try {
    const res = await axios.post(`${backendUrl}/api/student/absent`, values, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });


    if (res.statusText != "OK") {
      return {
        error: "failed to create absent request",
      };
    }

    const data = await res.data;

    if (!data) {
      return {
        error: "failed to create absent request",
      };
    }

    return {
      message: "successfully created absent request",
      creationStatus: JSON.stringify(data),
    };
  } catch (error : any) {
    console.log("this ishte error in absetn : ",error?.response.data)
    return { error : error?.response.data };
  }
};
