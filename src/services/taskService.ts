import axios from "axios";

// 🔥 เปลี่ยนจาก localhost เป็นลิงก์หลังบ้าน
const API = "https://server-1-89ke.onrender.com/api/tasks";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

/* ================= TYPES ================= */

export type TaskStatus = "todo" | "doing" | "done";

export type TaskPayload = {
  title: string;
  status: TaskStatus;
  startTime: string;
  endTime: string;
  category?: string;
  boardId?: string;
};

export type TaskUpdatePayload = Partial<{
  title: string;
  status: TaskStatus;
  description: string;
  startTime: string;
  endTime: string;
  category: string;
}>;

export type UserInfo = {
  _id: string;
  name: string;
  email: string;
};

export type TaskData = {
  _id: string;
  title: string;
  status: TaskStatus;
  description?: string;
  startTime: string;
  endTime: string;
  category?: string;
  boardId?: string;
  ownerId?: UserInfo;
  createdBy?: UserInfo;
};

export type TaskSuccess = {
  success: true;
  data: TaskData;
};

export type TaskConflict = {
  success: false;
  conflict: true;

  suggestion?: {
    suggestedStart: string;
    suggestedEnd: string;
  };

  suggestions?: {
    suggestedStart: string;
    suggestedEnd: string;
  }[];
};

export type TaskError = {
  success: false;
  message: string;
};

export type TaskResult = TaskSuccess | TaskConflict | TaskError;



/* ================= GET TASKS ================= */

export const getTasks = async (boardId: string): Promise<TaskData[]> => {

  const res = await axios.get(
    `${API}?boardId=${boardId}`,
    getAuthHeader()
  );

  return res.data;

};

/* ================= CREATE TASK ================= */

export const createTask = async (
  data: TaskPayload
): Promise<TaskResult> => {

  try {

    const res = await axios.post(
      API,
      data,
      getAuthHeader()
    );

    return {
      success: true,
      data: res.data
    };

  } catch (err: any) {

    if (err.response?.status === 409) {

      return {
        success: false,
        conflict: true,
        suggestion: err.response.data.suggestion,
        suggestions: err.response.data.suggestions
      };

    }

    return {
      success: false,
      message: err.response?.data?.message || "Create task failed"
    };

  }

};



/* ================= UPDATE TASK ================= */

export const updateTask = async (
  id: string,
  data: TaskUpdatePayload
): Promise<TaskResult> => {

  try {

    const res = await axios.put(
      `${API}/${id}`,
      data,
      getAuthHeader()
    );

    return {
      success: true,
      data: res.data
    };

  } catch (err: any) {

    if (err.response?.status === 409) {

      return {
        success: false,
        conflict: true,
        suggestion: err.response.data.suggestion,
        suggestions: err.response.data.suggestions
      };

    }

    return {
      success: false,
      message: err.response?.data?.message || "Update task failed"
    };

  }

};



/* ================= DELETE TASK ================= */

export const deleteTask = async (id: string) => {

  const res = await axios.delete(
    `${API}/${id}`,
    getAuthHeader()
  );

  return res.data;

};



/* ================= SHARE BOARD ================= */

export const shareBoard = async (
  boardId: string,
  email: string,
  role: "member" | "editor"
) => {

  const res = await axios.post(
    `${API}/${boardId}/share`,
    {
      email,
      role
    },
    getAuthHeader()
  );

  return res.data;

};



/* ================= LEAVE BOARD ================= */

export const leaveBoard = async (boardId: string) => {

  const res = await axios.post(
    `${API}/${boardId}/leave`,
    {},
    getAuthHeader()
  );

  return res.data;

};