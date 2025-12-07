import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public price: number;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public city: string;

  @Expose()
  public image: string;

  @Expose()
  public favorite = false;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;
}
