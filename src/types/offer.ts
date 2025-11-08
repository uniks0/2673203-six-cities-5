import { User } from './user';

export type City =
  | 'Paris'
  | 'Cologne'
  | 'Brussels'
  | 'Amsterdam'
  | 'Hamburg'
  | 'Dusseldorf';

export enum HousingType {
    Apartment = 'apartment',
    House = 'house',
    Room = 'room',
    Hotel = 'hotel'
  }

export enum Amenity {
    Breakfast = 'Breakfast',
    AirConditioning = 'Air conditioning',
    LaptopFriendlyWorkspace = 'Laptop friendly workspace',
    BabySeat = 'Baby seat',
    Washer = 'Washer',
    Towels = 'Towels',
    Fridge = 'Fridge'
  }

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
