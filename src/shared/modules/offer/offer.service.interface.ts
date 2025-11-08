import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { City } from '../../../types/index.js';

export interface OfferService {
    create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
    findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    find(limit?: number): Promise<DocumentType<OfferEntity>[]>;
    updateById(offerId: string, dto: Partial<CreateOfferDto>): Promise<DocumentType<OfferEntity> | null>;
    deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
    exists(offerId: string): Promise<boolean>;
    incrementCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
