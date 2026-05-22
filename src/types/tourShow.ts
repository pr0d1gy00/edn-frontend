export interface TourShowImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

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
  images: TourShowImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTourShowInput {
  city: string;
  country: string;
  venueName: string;
  showDate: string;
  ticketUrl?: string;
  ticketStatus: "AVAILABLE" | "FEW_TICKETS" | "SOLD_OUT";
  latitude?: number;
  longitude?: number;
  images?: string[]; // URLs as strings
}

export interface UpdateTourShowInput {
  city?: string;
  country?: string;
  venueName?: string;
  showDate?: string;
  ticketUrl?: string;
  ticketStatus?: "AVAILABLE" | "FEW_TICKETS" | "SOLD_OUT";
  latitude?: number;
  longitude?: number;
  images?: string[];
}
