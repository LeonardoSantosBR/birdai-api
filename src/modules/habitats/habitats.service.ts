import { Injectable } from '@nestjs/common';
import { HabitatsRepository } from './habitats.repository';
import { habitats, Prisma } from '@prisma/client';
import { querySearchHabitats } from './querys';
import { habitats_filter } from 'src/filters';
import { pagination_helper, pagination_prisma } from 'src/helpers';

@Injectable()
export class HabitatsService {
  constructor(private readonly habitatsRepository: HabitatsRepository) {}

  async findAll(querys: querySearchHabitats) {
    const page = +querys?.page;
    const limit = +querys?.limit;
    const orderBy: Prisma.habitatsOrderByWithAggregationInput =
      querys?.order ?? {
        created_at: 'desc',
      };
    const where: Prisma.habitatsWhereInput = {};

    const filter: any = habitats_filter(querys);
    if (filter?.length) where.OR = filter;
    const include: Prisma.habitatsInclude = {};
    const params = {
      where,
      orderBy,
      include,
      ...pagination_prisma(limit, page),
    };

    const [rows, count]: [habitats[], number] = await Promise.all([
      this.habitatsRepository.findAll(params),
      this.habitatsRepository.count({ where: params.where || {} }),
    ]);
    return pagination_helper(page, limit, count, rows);
  }
}
