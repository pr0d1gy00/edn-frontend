import { describe, it, expect } from 'vitest';
import type { TourShow, CreateTourShowInput, UpdateTourShowInput } from '@/types/tourShow';

describe('TourShow types', () => {
  it('TourShow has all required and optional fields', () => {
    const minimalShow: TourShow = {
      id: 'show-1',
      city: 'Buenos Aires',
      country: 'Argentina',
      venueName: 'Estadio Monumental',
      showDate: '2026-06-15T20:00:00Z',
      ticketUrl: 'https://tickets.example.com/1',
      ticketStatus: 'AVAILABLE',
      images: [],
    };

    expect(minimalShow.id).toBe('show-1');
    expect(minimalShow.city).toBe('Buenos Aires');
    expect(minimalShow.country).toBe('Argentina');
    expect(minimalShow.venueName).toBe('Estadio Monumental');
    expect(minimalShow.showDate).toBe('2026-06-15T20:00:00Z');
    expect(minimalShow.ticketUrl).toBe('https://tickets.example.com/1');
    expect(minimalShow.ticketStatus).toBe('AVAILABLE');
    expect(minimalShow.images).toEqual([]);
    expect(minimalShow.latitude).toBeUndefined();
    expect(minimalShow.longitude).toBeUndefined();
    expect(minimalShow.createdAt).toBeUndefined();
    expect(minimalShow.updatedAt).toBeUndefined();
  });

  it('TourShow accepts all ticketStatus values', () => {
    const available: TourShow = {
      id: '1', city: 'X', country: 'Y', venueName: 'Z',
      showDate: '2026-01-01T00:00:00Z', ticketUrl: 'http://a.com',
      ticketStatus: 'AVAILABLE', images: [],
    };
    expect(available.ticketStatus).toBe('AVAILABLE');

    const few: TourShow = {
      id: '2', city: 'X', country: 'Y', venueName: 'Z',
      showDate: '2026-01-01T00:00:00Z', ticketUrl: 'http://a.com',
      ticketStatus: 'FEW_TICKETS', images: [],
    };
    expect(few.ticketStatus).toBe('FEW_TICKETS');

    const sold: TourShow = {
      id: '3', city: 'X', country: 'Y', venueName: 'Z',
      showDate: '2026-01-01T00:00:00Z', ticketUrl: 'http://a.com',
      ticketStatus: 'SOLD_OUT', images: [],
    };
    expect(sold.ticketStatus).toBe('SOLD_OUT');
  });

  it('TourShow accepts optional latitude and longitude', () => {
    const withCoords: TourShow = {
      id: 'coord-1',
      city: 'Santiago',
      country: 'Chile',
      venueName: 'Estadio Nacional',
      showDate: '2026-07-20T21:00:00Z',
      ticketUrl: 'https://tickets.example.com/2',
      ticketStatus: 'FEW_TICKETS',
      latitude: -33.464,
      longitude: -70.610,
      images: ['https://cdn.example.com/img1.jpg'],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    };

    expect(withCoords.latitude).toBe(-33.464);
    expect(withCoords.longitude).toBe(-70.610);
    expect(withCoords.images).toEqual(['https://cdn.example.com/img1.jpg']);
    expect(withCoords.createdAt).toBe('2026-01-01T00:00:00Z');
    expect(withCoords.updatedAt).toBe('2026-05-01T00:00:00Z');
  });

  it('CreateTourShowInput requires all mandatory fields and accepts optional coords and images', () => {
    const minimalInput: CreateTourShowInput = {
      city: 'Lima',
      country: 'Peru',
      venueName: 'Estadio Monumental',
      showDate: '2026-08-10T19:00:00Z',
      ticketUrl: 'https://tickets.example.com/3',
      ticketStatus: 'AVAILABLE',
      images: [],
    };

    expect(minimalInput.city).toBe('Lima');
    expect(minimalInput.country).toBe('Peru');
    expect(minimalInput.venueName).toBe('Estadio Monumental');
    expect(minimalInput.showDate).toBe('2026-08-10T19:00:00Z');
    expect(minimalInput.ticketUrl).toBe('https://tickets.example.com/3');
    expect(minimalInput.ticketStatus).toBe('AVAILABLE');
    expect(minimalInput.images).toEqual([]);
    expect(minimalInput.latitude).toBeUndefined();
    expect(minimalInput.longitude).toBeUndefined();

    const fullInput: CreateTourShowInput = {
      city: 'Bogota',
      country: 'Colombia',
      venueName: 'Estadio El Campin',
      showDate: '2026-09-01T20:00:00Z',
      ticketUrl: 'https://tickets.example.com/4',
      ticketStatus: 'FEW_TICKETS',
      latitude: 4.711,
      longitude: -74.072,
      images: ['https://cdn.example.com/img2.jpg'],
    };
    expect(fullInput.latitude).toBe(4.711);
    expect(fullInput.longitude).toBe(-74.072);
    expect(fullInput.images).toHaveLength(1);
  });

  it('UpdateTourShowInput makes all fields optional', () => {
    const emptyUpdate: UpdateTourShowInput = {};
    expect(emptyUpdate).toBeDefined();

    const cityOnly: UpdateTourShowInput = { city: 'Montevideo' };
    expect(cityOnly.city).toBe('Montevideo');
    expect(cityOnly.country).toBeUndefined();

    const statusOnly: UpdateTourShowInput = { ticketStatus: 'SOLD_OUT' };
    expect(statusOnly.ticketStatus).toBe('SOLD_OUT');

    const fullUpdate: UpdateTourShowInput = {
      city: 'Asuncion',
      country: 'Paraguay',
      venueName: 'Estadio Defensores',
      showDate: '2026-10-15T18:00:00Z',
      ticketUrl: 'https://tickets.example.com/5',
      ticketStatus: 'AVAILABLE',
      latitude: -25.263,
      longitude: -57.575,
      images: ['https://cdn.example.com/img3.jpg', 'https://cdn.example.com/img4.jpg'],
    };
    expect(fullUpdate.images).toHaveLength(2);
    expect(fullUpdate.latitude).toBe(-25.263);
  });
});
