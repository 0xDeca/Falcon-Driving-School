import { api } from "./api-client";
import type { Role } from "@/types";

export async function getCurrentUser() {
  try {
    return await api.getProfile();
  } catch {
    return null;
  }
}

export async function getUserRole(): Promise<Role | null> {
  try {
    const user = await api.getProfile();
    return user?.role ?? null;
  } catch {
    return null;
  }
}

export async function getStudentProfile(userId: string) {
  try {
    return await api.get(`/students/by-user/${userId}`);
  } catch {
    return null;
  }
}

export async function getInstructorProfile(userId: string) {
  try {
    return await api.get(`/instructors/by-user/${userId}`);
  } catch {
    return null;
  }
}

export async function getEnrollments(studentId: string) {
  try {
    return await api.get("/enrollments", { params: { studentId } }) ?? [];
  } catch {
    return [];
  }
}

export async function getUpcomingLessons(studentId: string) {
  try {
    return await api.get("/lessons", {
      params: { studentId, upcoming: true, limit: 10, sortBy: "scheduled_date", sortOrder: "asc" },
    }) ?? [];
  } catch {
    return [];
  }
}

export async function getLessonHistory(studentId: string) {
  try {
    return await api.get("/lessons", {
      params: { studentId, sortBy: "scheduled_date", sortOrder: "desc" },
    }) ?? [];
  } catch {
    return [];
  }
}

export async function getNotifications(userId: string) {
  try {
    return await api.getNotifications({ userId, limit: 50 }) ?? [];
  } catch {
    return [];
  }
}

export async function getPayments(studentId: string) {
  try {
    return await api.get("/payments", { params: { studentId, sortBy: "created_at", sortOrder: "desc" } }) ?? [];
  } catch {
    return [];
  }
}

export async function getCertificates(studentId: string) {
  try {
    return await api.get("/certificates", { params: { studentId } }) ?? [];
  } catch {
    return [];
  }
}

export async function getCertificateRecommendations(studentId: string) {
  try {
    return await api.get("/certificate-recommendations", { params: { studentId } }) ?? [];
  } catch {
    return [];
  }
}
