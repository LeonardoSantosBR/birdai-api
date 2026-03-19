import { Controller, Get, Query } from '@nestjs/common';
import { HabitatsService } from './habitats.service';
import { querySearchHabitats } from './querys';
import { Prisma } from '@prisma/client';
import { habitats_filter } from 'src/filters';
import { pagination_helper, pagination_prisma } from 'src/helpers';

@Controller('habitats')
export class HabitatsController {
  constructor(private readonly habitatsService: HabitatsService) {}

  @Get()
  async findAll(@Query() querys: querySearchHabitats) {
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

    const data = await this.habitatsService.findAll({
      where,
      orderBy,
      include,
      ...pagination_prisma(limit, page),
    });

    return pagination_helper(page, limit, data.count, data);
  }
}
