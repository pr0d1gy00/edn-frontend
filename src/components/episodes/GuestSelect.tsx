"use client";

import { useCallback } from "react";
import AsyncSelect from "react-select/async";
import type { Guest } from "@/types/guest";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface GuestOption {
  value: string;
  label: string;
  data: Guest;
}

interface GuestSelectProps {
  onSelect: (guest: Guest) => void;
  selectedIds: string[];
}

export function formatGuestOption(guest: Guest): GuestOption {
  return {
    value: guest.id,
    label: guest.name,
    data: guest,
  };
}

export default function GuestSelect({
  onSelect,
  selectedIds,
}: GuestSelectProps) {
  const loadOptions = useCallback(
    async (inputValue: string): Promise<GuestOption[]> => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "10");

      if (inputValue.trim().length >= 2) {
        params.set("search", inputValue.trim());
      }

      const response = await fetch(`${API_BASE}/guests?${params.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      // Handle both array response and paginated response
      const guests: Guest[] = Array.isArray(data) ? data : (data.data ?? []);

      return guests
        .filter((g) => !selectedIds.includes(g.id))
        .map(formatGuestOption);
    },
    [selectedIds],
  );

  const handleChange = useCallback(
    (option: GuestOption | null) => {
      if (option) {
        onSelect(option.data);
      }
    },
    [onSelect],
  );

  const noOptionsMessage = useCallback(
    ({ inputValue }: { inputValue: string }) => "No se encontraron invitados",
    [],
  );

  const formatOptionLabel = useCallback((option: GuestOption) => {
    const { data } = option;
    const handles: string[] = [];
    if (data.twitterHandle) handles.push(`@${data.twitterHandle}`);
    if (data.instagramHandle) handles.push(`@${data.instagramHandle}`);

    return (
      <div className="flex items-center justify-between w-full">
        <span className="font-plus-jakarta text-black">{data.name}</span>
        {handles.length > 0 && (
          <span className="font-plus-jakarta text-xs text-black/50 ml-2">
            {handles.join(" · ")}
          </span>
        )}
      </div>
    );
  }, []);

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={true}
      loadOptions={loadOptions}
      onChange={handleChange}
      noOptionsMessage={noOptionsMessage}
      formatOptionLabel={formatOptionLabel}
      placeholder="Buscar invitados..."
      isClearable
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          borderWidth: 4,
          borderColor: "#000",
          borderRadius: 2,
          boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
          minHeight: 48,
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }),
        option: (base, { isFocused }) => ({
          ...base,
          backgroundColor: isFocused ? "#f9c937" : "white",
          color: "#000",
          cursor: "pointer",
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }),
        menu: (base) => ({
          ...base,
          border: "4px solid #000",
          borderRadius: 2,
          boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
        }),
        noOptionsMessage: (base) => ({
          ...base,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          color: "#666",
        }),
      }}
    />
  );
}
