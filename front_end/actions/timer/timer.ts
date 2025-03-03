"use server";

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";
import { UserRoundIcon } from "lucide-react";

export interface TimerCreateType {
  timerWorkspaceId: string;
  userId: string;
  name: string;
  endDate: Date;
  type: "till" | "from";
}

interface TimerWorkspaceType {
  userId: string;
  name: string;
  description: string;
}

export interface EditTimerDataType {
  workspaceId: string;
  timerId: string;
  userId: string;
  name: string;
  endDate: Date;
  type: string;
}

interface EditTimerWorkspaceType {
  workspaceId: string;
  userId: string;
  name: string;
  description: string;
}

interface DeleteTimerType {
  workspaceId: string;
  id: string;
}

export const delete_workspace = async (id: string) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    console.log("i am hre gfor deleting",id)
    const res = await axios.delete(
      `${backendUrl}/api/timer/workspace/delete/${id}`,
      {
        withCredentials: true,
        headers: {
          Cookie: `__session=${session_cookie}`,
        },
      }
    );  
    console.log("yhis is delete workspace :",res)

    if (res.statusText != "OK") {
      return {
        error: "failed to get delete",
      };
    }

    const data = await res.data;
    if (!data) {
      return {
        error: "failed to get delete response",
      };
    }
    return {
      message: "successfully deleted timer workspace",
      status: data,
    };
  } catch (error) {
    return {
      error: "failed to delete timer workspace",
    };
  }
};

export const delete_timer = async ({ workspaceId, id }: DeleteTimerType) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const res = await axios.post(
      `${backendUrl}/api/timer/delete/${id}`,{workspaceId},
      {
        withCredentials: true,
        headers: {
          Cookie: `__session=${session_cookie}`,
        },
      }
    );

    if (res.statusText != "OK") {
      return {
        error: "failed to get delete",
      };
    }

    const data = await res.data;
    if (!data) {
      return {
        error: "failed to get delete response",
      };
    }
    return {
      message: "successfully deleted timer",
      status: data,
    };
  } catch (error) {
    return {
      error: "failed to delete timer",
    };
  }
};

export const edit_workspace_timer_data = async (
  values: EditTimerWorkspaceType
) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const id = values.workspaceId;
    const edit_value = {
      userId: values.userId,
      name: values.name,
      description: values.description,
    };

    const res = await axios.post(
      `${backendUrl}/api/timer/workspace/edit/${id}`,
      edit_value,
      {
        withCredentials: true,
        headers: {
          Cookie: `__session=${session_cookie}`,
        },
      }
    );

    console.log("this isht eupdate : repsonse : ", res);

    if (res.statusText != "OK") {
      return {
        error: "failed to update timer",
      };
    }

    const data = await res.data;
    console.log("this is hte data in update : ", data);
    if (!data) {
      return { error: "failed to update data" };
    }

    return {
      message: "successfully updated values",
      status: data,
    };
  } catch (error) {
    return {
      error: "failed to update the timer data",
    };
  }
};

export const edit_timer_data = async (values: EditTimerDataType) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }

  try {
    const id = values.workspaceId;
    const edit_value = {
      timerId: values.timerId,
      userId: values.userId,
      name: values.name,
      endDate: values.endDate,
      type: values.type,
    };


    const res = await axios.post(
      `${backendUrl}/api/timer/edit/${id}`,
      edit_value,
      {
        withCredentials: true,
        headers: {
          Cookie: `__session=${session_cookie}`,
        },
      }
    );


    if (res.statusText != "OK") {
      return {
        error: "failed to update timer",
      };
    }

    const data = await res.data;
    if (!data) {
      return { error: "failed to get data" };
    }

    return {
      message: "successfully updated values",
      status: data,
    };
  } catch (error) {
    return {
      error: "failed to update the timer data",
    };
  }
};

export const get_user_timer_workspaces = async () => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  try {
    const res = await axios.get(`${backendUrl}/api/timer/workspace`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    if (res.statusText != "OK") {
      return {
        error: "failed to get  timer workspaces ",
      };
    }

    const data = await res.data;

    return {
      message: "successfully got  timer workspaces ",
      timer_workspaces: JSON.stringify(data),
    };
  } catch (error) {
    return { error: "failed to create message" };
  }
};

export const create_timer_wrokspace = async (values: TimerWorkspaceType) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  try {
    const res = await axios.post(`${backendUrl}/api/timer/workspace`, values, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    if (res.statusText != "OK") {
      return {
        error: "failed to create workspace",
      };
    }

    const data = await res.data;

    if (!data) {
      return {
        error: "failed to create workspace",
      };
    }

    return {
      message: "successfully created workspace",
      timerWorkspace: JSON.stringify(data),
    };
  } catch (error) {
    return { error: "failed to  create the workspace" };
  }
};

export const get_timer_by_id = async (id: string) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  try {
    const res = await axios.get(`${backendUrl}/api/timer/${id}`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    if (res.statusText !== "OK") {
      return {
        error: "fialed to get timer",
      };
    }

    const data = await res.data;
    if (!data) {
      return { error: "failed to get data" };
    }
    return {
      message: "successfully got the timer data",
      timer: JSON.stringify(data),
    };
  } catch (error) {
    return {
      error: "failed to get the timer",
    };
  }
};

export const get_user_workspace_timers = async (id: string) => {
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  try {
    console.log(" i am going for api call", id);
    const res = await axios.get(`${backendUrl}/api/timer/workspace/${id}`, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    if (res.statusText != "OK") {
      return {
        error: "failed to create timer",
      };
    }

    const data = await res.data;
    console.log("this ish te data  fo timers in workspaces: ", data);

    return {
      message: "successfully created timer",
      timers: JSON.stringify(data),
    };
  } catch (error) {
    return { error: "failed to create message" };
  }
};

export const create_timer = async (values: TimerCreateType) => {
  console.log(" i m her");
  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return {
      error: "user not authenticated",
    };
  }
  console.log("this is hte create itmer : ", values);
  try {
    const res = await axios.post(`${backendUrl}/api/timer`, values, {
      withCredentials: true,
      headers: {
        Cookie: `__session=${session_cookie}`,
      },
    });

    if (res.statusText != "OK") {
      return {
        error: "failed to create timer",
      };
    }

    const data = await res.data;

    if (!data) {
      return {
        error: "failed to create timer",
      };
    }

    return {
      message: "successfully created timer",
      timer: JSON.stringify(data),
    };
  } catch (error) {
    return { error: "failed to create message" };
  }
};
