import apiClient from "./client.native";

export type DevicePlatform = "IOS" | "ANDROID" | "WEB";

export interface RegisterDeviceTokenDto {
  token: string;
  platform: DevicePlatform;
}

export interface ActivityItem {
  id?: string;
  type?: string;
  title?: string;
  message?: string;
  body?: string;
  description?: string;
  createdAt?: string;
  read?: boolean;
  metadata?: Record<string, unknown>;
}

export interface NotificationActivityResponse {
  data: ActivityItem[];
  unreadCount: number;
}

export const getNotificationActivity = async (): Promise<NotificationActivityResponse> => {
  const response = await apiClient.get<
    ActivityItem[] | { data: ActivityItem[]; unreadCount?: number }
  >("/notifications/activity");
  const payload = response.data;

  if (Array.isArray(payload)) {
    return {
      data: payload,
      unreadCount: payload.filter((item) => !item.read).length,
    };
  }

  const data = payload.data ?? [];
  return {
    data,
    unreadCount: payload.unreadCount ?? data.filter((item) => !item.read).length,
  };
};

export const markNotificationRead = async (id: string) => {
  const response = await apiClient.patch(
    `/notifications/activity/${encodeURIComponent(id)}/read`,
  );
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await apiClient.patch("/notifications/activity/read-all");
  return response.data;
};

export const registerDeviceToken = async (data: RegisterDeviceTokenDto) => {
  const response = await apiClient.post("/notifications/device-token", data);
  return response.data;
};

export const deregisterDeviceToken = async (token: string) => {
  const response = await apiClient.delete(
    `/notifications/device-token/${encodeURIComponent(token)}`,
  );
  return response.data;
};

export function getActivityTitle(item: ActivityItem): string {
  return item.title ?? item.type ?? "Notification";
}

export function getActivityBody(item: ActivityItem): string {
  return item.body ?? item.message ?? item.description ?? "";
}

export function formatActivityTime(value?: string): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) {
    return "Just now";
  }
  if (mins < 60) {
    return `${mins} min${mins > 1 ? "s" : ""} ago`;
  }
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) {
    return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString();
}

export function mapActivityType(
  type?: string,
): "ride" | "payment" | "promo" | "account" {
  const normalized = (type ?? "").toLowerCase();
  if (normalized.includes("pay") || normalized.includes("wallet")) {
    return "payment";
  }
  if (
    normalized.includes("promo") ||
    normalized.includes("referral") ||
    normalized.includes("miles")
  ) {
    return "promo";
  }
  if (
    normalized.includes("account") ||
    normalized.includes("verify") ||
    normalized.includes("document")
  ) {
    return "account";
  }
  return "ride";
}
