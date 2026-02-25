import { TransformSort } from '../helpers/transform-sort.hp';
import { TransformToNumber } from '../helpers/transform-number.hp';

export class GlobalAllDto {
  search: string;

  @TransformToNumber()
  page: number;

  @TransformToNumber()
  limit: number;

  @TransformSort()
  order: any;
}
