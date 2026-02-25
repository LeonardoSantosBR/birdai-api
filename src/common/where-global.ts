/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { optType } from '../types';
import { transformObject } from '../helpers/nested-object.hp';

export function whereGlobal(opt) {
  const dataString: any = Object.values(opt).reduce((ret: any, filter: any) => {
    const { path: nameProp, value, type } = filter;
    if ((!value && value !== false) || value === '[]') return ret;
    if (optType.number === type) {
      ret.push({ [nameProp]: Number(value) });
    }
    if (optType.string === type) {
      ret.push({ [nameProp]: value });
    }
    if (optType.less_equal_than === type) {
      ret.push({
        [nameProp]: {
          lte: Number(value),
        },
      });
    }
    if (optType.range === type) {
      ret.push({
        [nameProp]: {
          ...(value.min || value.min == 0 ? { gte: value.min } : {}),
          ...(value.max || value.max == 0 ? { lte: value.max } : {}),
        },
      });
    }
    if (optType.greater_equal_than === type) {
      ret.push({
        [nameProp]: {
          gte: Number(value),
        },
      });
    }
    if (type === optType.array) {
      ret.push({
        [nameProp]: {
          in: value,
        },
      });
    }
    if (type.includes('Array')) {
      ret.push({
        [nameProp]: {
          in: value.map((vl: any) => {
            if (type.includes('string')) {
              return String(vl);
            } else {
              return Number(vl);
            }
          }),
        },
      });
    }
    if (type.includes('Like')) {
      ret.push({
        [nameProp]: { contains: value },
      });
    }
    if (type === optType.boolean) {
      ret.push({
        [nameProp]: value?.toLowerCase() === 'false' ? 0 : 1,
      });
    }

    return ret;
  }, []);
  return dataString.map((dt) => {
    return transformObject(dt);
  });
}
