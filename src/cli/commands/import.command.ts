import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer } from '../../shared/helpers/offer.js';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { getMongoURI } from '../../shared/helpers/database.js';
import { DatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';
import { OfferService } from '../../shared/modules/offer/offer.service.interface.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { UserModel } from '../../shared/modules/user/user.entity.js';
import { UserService } from '../../shared/modules/user/user.service.interface.js';
import { Offer } from '../../types/offer.js';
import { DEFAULT_USER_PASSWORD, DEFAULT_DB_PORT } from './command.constant.js';
import { CityCoordinates } from '../../types/city-coordinates.js';
import { Logger, PinoLogger } from '../../shared/libs/logger/index.js';
import { CommentModel } from '../../shared/modules/comment/comment.entity.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt!: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new PinoLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel, CommentModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      name: offer.author.name,
      email: offer.author.email,
      avatar: offer.author.avatar,
      password: DEFAULT_USER_PASSWORD,
      type: offer.author.type
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      publicationDate: offer.publicationDate,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      rating: offer.rating,
      type: offer.type,
      bedrooms: offer.bedrooms,
      maxAdults: offer.maxAdults,
      price: offer.price,
      amenities: offer.amenities,
      author: user.id,
      commentsCount: offer.commentsCount || 0,
      location: CityCoordinates[offer.city]
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {

    if (parameters.length < 6) {
      throw new Error(`Expected 6 parameters (filename, user, password, host, dbname, salt), but got ${parameters.length}: ${parameters.join(', ')}`);
    }

    const [filename, login, password, host, dbname, salt] = parameters;

    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
