import { Offer } from "../../../types/offer.js";
import { UserType } from "../../../types/user.js";
import { FileReader } from "./file-reader.interface.js";
import { readFileSync } from "node:fs";

export class TSVFileReader implements FileReader {
  private rawData = "";

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: "utf-8" });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error("File was not read");
    }

    return this.rawData
      .split("\n")
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split("\t"))
      .map(
        ([
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
          name,
          avatar,
          password,
          email,
          commentsCount,
          latitude,
          longitude,
        ]) => ({
          title,
          description,
          publicationDate: new Date(publicationDate),
          city: city as
            | "Paris"
            | "Cologne"
            | "Brussels"
            | "Amsterdam"
            | "Hamburg"
            | "Dusseldorf",
          previewImage,
          images: images.split(";"),
          isPremium: isPremium.toLowerCase() === "true",
          isFavorite: isFavorite.toLowerCase() === "true",
          rating: Number.parseFloat(rating),
          type: type as "apartment" | "house" | "room" | "hotel",
          bedrooms: Number.parseInt(bedrooms, 10),
          maxAdults: Number.parseInt(maxAdults, 10),
          price: Number.parseInt(price, 10),
          amenities: amenities.split(";") as Array<
            | "Breakfast"
            | "Air conditioning"
            | "Laptop friendly workspace"
            | "Baby seat"
            | "Washer"
            | "Towels"
            | "Fridge"
          >,
          author: {
            name,
            email,
            avatar,
            password,
            type: UserType.Standard,
          },
          commentsCount: commentsCount ? Number.parseInt(commentsCount, 10) : 0,
          location: {
            latitude: Number.parseFloat(latitude),
            longitude: Number.parseFloat(longitude),
          },
        })
      );
  }
}
