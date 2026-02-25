/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-unsafe-optional-chaining */
import { Transform } from 'class-transformer';

export function TransformSort() {
  return Transform(({ value }) => {
    if (!value) return undefined;
    const [camp, order] = value?.split('-');
    return { [camp]: order };
  });
}
