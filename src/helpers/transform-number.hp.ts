/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transform } from 'class-transformer';

export function TransformToNumber() {
  return Transform(({ value }) => (value ? Number(value) : undefined));
}
