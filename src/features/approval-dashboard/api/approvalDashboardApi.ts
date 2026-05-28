import apiClient from "@/services/apiClient";

import type { UserProfile } from "../types";

export const approvalDashboardApi = {
  async fetchQueue(backendUrl: string) {
    const { data } = await apiClient.get(`${backendUrl}/api/workflow/queue`);
    return data as { success?: boolean; message?: unknown };
  },

  async fetchProfile(backendUrl: string) {
    const { data } = await apiClient.get(`${backendUrl}/api/user/profile`);
    return data as { success?: boolean; message?: string; user?: UserProfile };
  },

  async logout(backendUrl: string) {
    const { data } = await apiClient.post(`${backendUrl}/api/auth/logout`);
    return data as { success?: boolean; message?: string };
  },

  async updateWorkflowDecision(
    backendUrl: string,
    payload: { eventId: string; status: "approved" | "rejected"; comment: string },
  ) {
    const { data } = await apiClient.post(`${backendUrl}/api/workflow/decision`, payload);
    return data as { success?: boolean; message?: string };
  },
};
