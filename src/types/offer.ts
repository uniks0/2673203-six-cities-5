import { User } from './user';

export type City =
  | 'Paris'
  | 'Cologne'
  | 'Brussels'
  | 'Amsterdam'
  | 'Hamburg'
  | 'Dusseldorf';

export type HousingType = 'apartment' | 'house' | 'room' | 'hotel';

export type Amenity =
  | 'Breakfast'
  | 'Air conditioning'
  | 'Laptop friendly workspace'
  | 'Baby seat'
  | 'Washer'
  | 'Towels'
  | 'Fridge';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export interface Offer {
  title: string;
  description: string;
  publicationDate: Date;
  city: City;

  previewImage: string;
  images: string[];

  isPremium: boolean;
  isFavorite: boolean;
  rating: number;

  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;

  amenities: Amenity[];
  author: User;
  commentsCount?: number;
  location: Coordinates;
}
