/**
 * PovertyWatch API Client
 * Standard wrapper di atas native fetch untuk memanggil Next.js Route Handlers
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(message: string, code = "API_ERROR", status = 500, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : endpoint;

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body && typeof options.body === "string") {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  let payload: ApiResponse<T>;

  try {
    payload = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(
        `HTTP Error ${response.status}: ${response.statusText}`,
        "HTTP_ERROR",
        response.status
      );
    }
    throw new ApiError("Gagal mengurai respons JSON dari server", "PARSE_ERROR", response.status);
  }

  if (!response.ok || payload.success === false) {
    const errorMsg =
      payload.error?.message ||
      `Permintaan gagal dengan status ${response.status}`;
    const errorCode = payload.error?.code || "REQUEST_FAILED";
    throw new ApiError(errorMsg, errorCode, response.status, payload.error?.details);
  }

  return payload;
}
