export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH:{
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },

  USERS:{
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
    CREATE_USER: "/api/users",
    UPDATE_USER: (userId) => `/api/users/${userId}`,
    DELETE_USER: (userId) => `/api/users/${userId}`,
  },

  TASKS:{
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS:"/api/tasks",
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
    CREATE_TASK: "/api/tasks",
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,
    
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`,

    //team members click 
    GET_TASKS_BY_USER: (userId) => `/api/tasks/user/${userId}`,
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users",
    UPCOMING_DEADLINES_ADMIN: "/api/reports/upcoming-deadlines/admin",
    UPCOMING_DEADLINES_USER: "/api/reports/upcoming-deadlines",
  },

  IMAGE:{
    UPLOAD_IMAGE: "/api/auth/upload-image"
  },
};