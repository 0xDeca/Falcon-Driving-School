// Falcon Driving School — API Client
// Replaces all Supabase client calls with backend API calls

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

type RequestOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
};

class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
      this.refreshToken = localStorage.getItem("refreshToken");
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) throw new ApiError("No refresh token", 401);

    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!res.ok) {
      this.clearTokens();
      throw new ApiError("Session expired", 401);
    }

    const data = await res.json();
    this.setTokens(data.data.accessToken, data.data.refreshToken);
  }

  private async request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(`${API_BASE}${path}`);
    if (options.params) {
      Object.entries(options.params).forEach(([k, v]) => {
        if (v !== undefined) url.searchParams.set(k, String(v));
      });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    let res = await fetch(url.toString(), {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include",
    });

    // Token refresh on 401
    if (res.status === 401 && this.refreshToken) {
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshAccessToken().finally(() => {
          this.refreshPromise = null;
        });
      }
      await this.refreshPromise;

      headers["Authorization"] = `Bearer ${this.accessToken}`;
      res = await fetch(url.toString(), {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: "include",
      });
    }

    const json = await res.json();

    if (!res.ok) {
      throw new ApiError(json.message || "Request failed", res.status, json.errors);
    }

    return json.data !== undefined ? json.data : json;
  }

  get<T = any>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T = any>(path: string, body?: any, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "POST", body });
  }

  put<T = any>(path: string, body?: any, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "PUT", body });
  }

  patch<T = any>(path: string, body?: any, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "PATCH", body });
  }

  delete<T = any>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }

  // ─── Auth ──────────────────────────────────────────────────
  async login(email: string, password: string, rememberMe = false) {
    const data: any = await this.post("/auth/login", { email, password, rememberMe });
    this.setTokens(data.accessToken, data.refreshToken);
    return data.user;
  }

  async register(data: { email: string; password: string; fullName: string; phone: string }) {
    const res: any = await this.post("/auth/register", data);
    this.setTokens(res.accessToken, res.refreshToken);
    return res.user;
  }

  async logout() {
    try { await this.post("/auth/logout"); } catch {}
    this.clearTokens();
  }

  async getProfile() {
    return this.get("/auth/profile");
  }

  // ─── Users ─────────────────────────────────────────────────
  async getUsers(params?: any) {
    return this.get("/users", { params });
  }

  async getUser(id: string) {
    return this.get(`/users/${id}`);
  }

  async updateUser(id: string, data: any) {
    return this.patch(`/users/${id}`, data);
  }

  async deleteUser(id: string) {
    return this.delete(`/users/${id}`);
  }

  // ─── Students ──────────────────────────────────────────────
  async getStudents(params?: any) {
    return this.get("/students", { params });
  }

  async getStudent(id: string) {
    return this.get(`/students/${id}`);
  }

  async createStudent(data: any) {
    return this.post("/students", data);
  }

  async updateStudent(id: string, data: any) {
    return this.patch(`/students/${id}`, data);
  }

  // ─── Instructors ───────────────────────────────────────────
  async getInstructors(params?: any) {
    return this.get("/instructors", { params });
  }

  async getInstructor(id: string) {
    return this.get(`/instructors/${id}`);
  }

  async createInstructor(data: any) {
    return this.post("/instructors", data);
  }

  async updateInstructor(id: string, data: any) {
    return this.patch(`/instructors/${id}`, data);
  }

  // ─── Courses ───────────────────────────────────────────────
  async getCourses(params?: any) {
    return this.get("/courses", { params });
  }

  async createCourse(data: any) {
    return this.post("/courses", data);
  }

  async updateCourse(id: string, data: any) {
    return this.patch(`/courses/${id}`, data);
  }

  // ─── Enrollments ───────────────────────────────────────────
  async getEnrollments(params?: any) {
    return this.get("/enrollments", { params });
  }

  async createEnrollment(data: any) {
    return this.post("/enrollments", data);
  }

  async updateEnrollment(id: string, data: any) {
    return this.patch(`/enrollments/${id}`, data);
  }

  // ─── Lessons ───────────────────────────────────────────────
  async getLessons(params?: any) {
    return this.get("/lessons", { params });
  }

  async createLesson(data: any) {
    return this.post("/lessons", data);
  }

  async updateLesson(id: string, data: any) {
    return this.patch(`/lessons/${id}`, data);
  }

  // ─── Payments ──────────────────────────────────────────────
  async getPayments(params?: any) {
    return this.get("/payments", { params });
  }

  async createPayment(data: any) {
    return this.post("/payments", data);
  }

  // ─── Certificates ──────────────────────────────────────────
  async getCertificates(params?: any) {
    return this.get("/certificates", { params });
  }

  async approveCertificate(id: string) {
    return this.post(`/certificates/${id}/approve`);
  }

  async rejectCertificate(id: string, notes?: string) {
    return this.post(`/certificates/${id}/reject`, { notes });
  }

  // ─── Vehicles ──────────────────────────────────────────────
  async getVehicles(params?: any) {
    return this.get("/vehicles", { params });
  }

  async createVehicle(data: any) {
    return this.post("/vehicles", data);
  }

  async updateVehicle(id: string, data: any) {
    return this.patch(`/vehicles/${id}`, data);
  }

  // ─── Notifications ─────────────────────────────────────────
  async getNotifications(params?: any) {
    return this.get("/notifications", { params });
  }

  async markNotificationRead(id: string) {
    return this.patch(`/notifications/${id}/read`);
  }

  // ─── Settings ──────────────────────────────────────────────
  async getSettings() {
    return this.get("/settings");
  }

  async updateSetting(key: string, value: string) {
    return this.put(`/settings/${key}`, { value });
  }

  // ─── Blog ──────────────────────────────────────────────────
  async getBlogPosts(params?: any) {
    return this.get("/blog", { params });
  }

  async createBlogPost(data: any) {
    return this.post("/blog", data);
  }

  // ─── Driving Licenses ──────────────────────────────────────
  async getLicense(studentId: string) {
    return this.get(`/licenses/${studentId}`);
  }

  async uploadLicense(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.post("/licenses/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async verifyLicense(id: string, status: string, notes?: string) {
    return this.patch(`/licenses/${id}`, { status, notes });
  }

  // ─── OTP ───────────────────────────────────────────────────
  async sendOtp(type: "email" | "phone", target: string) {
    return this.post("/otp/send", { type, target });
  }

  async verifyOtp(type: string, code: string) {
    return this.post("/otp/verify", { type, code });
  }

  // ─── Dashboard ─────────────────────────────────────────────
  async getAdminDashboard() {
    return this.get("/dashboard/admin");
  }

  async getStudentDashboard() {
    return this.get("/dashboard/student");
  }

  async getInstructorDashboard() {
    return this.get("/dashboard/instructor");
  }

  // ─── File Upload ───────────────────────────────────────────
  async uploadFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res: any = await this.post("/storage/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.url;
  }
}

// Singleton
export const api = new ApiClient();
export { ApiError };
