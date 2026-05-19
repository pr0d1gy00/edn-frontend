import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface TourShow {
  id: string;
  city: string;
  country: string;
  venueName: string;
  showDate: string;
  ticketUrl: string;
  ticketStatus: "AVAILABLE" | "FEW_TICKETS" | "SOLD_OUT";
  latitude?: number;
  longitude?: number;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function getAuthHeadersMultipart(): HeadersInit {
  const token = Cookies.get("accessToken");
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

export const tourShowsApi = {
  // GET /tour-shows — paginated list with optional filters
  getTourShows: async (
    page = 1,
    limit = 10,
    ticketStatus?: string,
    upcoming?: boolean,
    search?: string,
  ): Promise<PaginatedResponse<TourShow>> => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (ticketStatus) params.set("ticketStatus", ticketStatus);
    if (upcoming !== undefined) params.set("upcoming", String(upcoming));
    if (search?.trim()) params.set("search", search.trim());

    const response = await fetch(`${API_BASE}/tour-shows?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al cargar fechas de tour");
    return response.json();
  },

  // GET /tour-shows/:id — single show
  getTourShowById: async (id: string): Promise<TourShow> => {
    const response = await fetch(`${API_BASE}/tour-shows/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al cargar fecha de tour");
    return response.json();
  },

  // POST /tour-shows — create with multipart FormData
  createTourShow: async (formData: FormData): Promise<TourShow> => {
    const response = await fetch(`${API_BASE}/tour-shows`, {
      method: "POST",
      headers: getAuthHeadersMultipart(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear fecha de tour");
    }
    return response.json();
  },

  // PATCH /tour-shows/:id — update with multipart FormData
  updateTourShow: async (id: string, formData: FormData): Promise<TourShow> => {
    const response = await fetch(`${API_BASE}/tour-shows/${id}`, {
      method: "PATCH",
      headers: getAuthHeadersMultipart(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar fecha de tour");
    }
    return response.json();
  },

  // DELETE /tour-shows/:id — remove show
  deleteTourShow: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await fetch(`${API_BASE}/tour-shows/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al eliminar fecha de tour");
    return response.json();
  },
};
