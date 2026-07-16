const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface UserSession {
  token: string;
  email: string;
  userId: string;
  role: string;
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const sessionJson = localStorage.getItem("resumeai_session");
  if (!sessionJson) return null;
  try {
    return JSON.parse(sessionJson) as UserSession;
  } catch (e) {
    return null;
  }
}

export function setSession(session: UserSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem("resumeai_session", JSON.stringify(session));
  } else {
    localStorage.removeItem("resumeai_session");
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  console.log(`[API Request] Path: ${path}`, options);
  const session = getSession();
  const headers = new Headers(options.headers || {});

  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const url = `${API_BASE_URL}${path}`;
    console.log(`[API Request] Fetching: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
    });
    console.log(`[API Response] Status: ${response.status} for ${path}`);

    if (!response.ok) {
      if (response.status === 401 && !path.startsWith("/auth/")) {
        console.warn(`[API Response] Unauthorized access on ${path}, clearing session...`);
        setSession(null);
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // JSON parsing failed
      }
      console.warn(`[API Response] Error status: ${response.status}, message: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // Handle empty response bodies (like DELETE or 204 status)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(`[API Response] Success JSON:`, data);
      return data as T;
    }
    console.log(`[API Response] Success (no JSON content)`);
    return null as unknown as T;
  } catch (err) {
    console.error(`[API Request] Failed fetching ${path}:`, err);
    throw err;
  }
}

// Local Storage Resume Helpers for Guest Mode
export interface LocalResume {
  id: string;
  title: string;
  targetJobRole?: string;
  summary?: string;
  templateId?: string;
  personalDetails?: any;
  experiences?: any[];
  projects?: any[];
  educations?: any[];
  skills?: any[];
  certifications?: any[];
  languages?: any[];
  font?: string;
  fontSize?: string;
  lineSpacing?: number;
  margins?: number;
  paperSize?: string;
  accentColor?: string;
  showIcons?: boolean;
  showPhoto?: boolean;
  sectionOrder?: string;
  updatedAt: string;
}

export function getLocalResumes(): LocalResume[] {
  if (typeof window === "undefined") return [];
  const localJson = localStorage.getItem("resumeai_guest_resumes");
  if (!localJson) return [];
  try {
    return JSON.parse(localJson) as LocalResume[];
  } catch (e) {
    return [];
  }
}

export function saveLocalResumes(resumes: LocalResume[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("resumeai_guest_resumes", JSON.stringify(resumes));
}

// Sync Local Resumes to Backend after user log in or registers
export async function syncLocalResumesWithBackend(): Promise<void> {
  const resumes = getLocalResumes();
  if (resumes.length === 0) return;

  try {
    for (const resume of resumes) {
      // Strip local ID so backend generates a new DB UUID
      const { id, ...resumeData } = resume;
      await apiRequest("/resumes", {
        method: "POST",
        body: JSON.stringify(resumeData),
      });
    }
    // Clear local guest resumes once successfully synced
    localStorage.removeItem("resumeai_guest_resumes");
  } catch (e) {
    console.error("Failed to sync local guest resumes to backend:", e);
  }
}
