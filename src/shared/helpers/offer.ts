import { Amenity, City, Coordinates, HousingType, Offer } from '../../types/offer';
import { User, UserType } from '../../types/user';

export function createOffer(offerData: string): Offer {
  const [
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
    latitude,
    longitude
  ] = offerData.replace('\n', '').split('\t');

  const author: User = {
    name: authorName,
    email: authorEmail,
    avatar: authorAvatar,
    password: authorPassword,
    type: authorIsPro === 'true' ? UserType.Pro : UserType.Standard
  };

  const location: Coordinates = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
  };

  return {
    title,
    description,
    publicationDate: new Date(publicationDate),
    city: city as City,
    previewImage,
    images: images.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseFloat(rating),
    type: type as HousingType,
    bedrooms: parseInt(bedrooms, 10),
    maxAdults: parseInt(maxAdults, 10),
    price: parseInt(price, 10),
    amenities: amenities.split(';') as Amenity[],
    author,
    location
  };
}
