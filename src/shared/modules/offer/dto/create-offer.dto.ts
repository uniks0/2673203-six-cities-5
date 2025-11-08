import { Amenity, City, Coordinates, HousingType } from '../../../../types/offer';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public rating!: number;
  public type!: HousingType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public amenities!: Amenity[];
  public author!: string;
  public commentsCount!: number;
  public location!: Coordinates;
}
