export class CreateBirdDto {
  name: string;
  cientific_name: string;
  url?: string;
  description: string;
  habitats: Array<string>;
}
