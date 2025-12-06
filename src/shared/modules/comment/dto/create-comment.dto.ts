import { Type } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(5)
  @MaxLength(1024)
  @IsNotEmpty()
  public text!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  public rating!: number;

  @IsString()
  @IsNotEmpty()
  public offerId!: string;

  @IsString()
  @IsNotEmpty()
  public userId!: string;
}
