import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
  getRandomBoolean,
} from '../../helpers/index.js';
import { City, HousingType } from '../../../types/offer.js';
import { MockData } from '../../../types/mock-server-data-types.js';

const MIN_PRICE = 100;
const MAX_PRICE = 1000;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_BEDROOMS = 1;
const MAX_BEDROOMS = 5;
const MIN_ADULTS = 1;
const MAX_ADULTS = 10;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const CITY_COORDINATES: Record<City, { latitude: number; longitude: number }> =
  {
    Paris: { latitude: 48.8566, longitude: 2.3522 },
    Cologne: { latitude: 50.9375, longitude: 6.9603 },
    Brussels: { latitude: 50.8503, longitude: 4.3517 },
    Amsterdam: { latitude: 52.3676, longitude: 4.9041 },
    Hamburg: { latitude: 53.5511, longitude: 9.9937 },
    Dusseldorf: { latitude: 51.2277, longitude: 6.7735 },
  };

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const city = getRandomItem<City>(this.mockData.cities);
    const coordinates = CITY_COORDINATES[city];

    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const previewImage = getRandomItem<string>(this.mockData.images);
    const images = getRandomItems<string>(this.mockData.images)
      .slice(0, 6)
      .join(';');

    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();

    const type = getRandomItem<HousingType>(this.mockData.types);
    const bedrooms = generateRandomValue(
      MIN_BEDROOMS,
      MAX_BEDROOMS,
      0
    ).toString();
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS, 0).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE, 0).toString();

    const amenities = getRandomItems<string>(this.mockData.goods).join(';');

    const authorName = getRandomItem<string>(this.mockData.names);
    const authorEmail = getRandomItem<string>(this.mockData.emails);
    const authorAvatar = getRandomItem<string>(this.mockData.avatarPaths);
    const authorPassword = getRandomItem<string>(this.mockData.passwords);
    const authorIsPro = getRandomBoolean().toString();

    return [
      title,
      description,
      publicationDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      amenities,
      authorName,
      authorEmail,
      authorAvatar,
      authorPassword,
      authorIsPro,
      coordinates.latitude,
      coordinates.longitude,
    ].join('\t');
  }
}
