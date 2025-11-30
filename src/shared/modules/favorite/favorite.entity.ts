import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user';
import { OfferEntity } from '../offer';

@modelOptions({
  schemaOptions: {
    collection: 'favorites'
  },
})

export class FavoriteEntity extends defaultClasses.TimeStamps {
  @prop({ ref: () => UserEntity, required: true })
  public userId!: Ref<UserEntity>;

  @prop({ ref: () => OfferEntity, required: true })
  public offerId!: Ref<OfferEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
