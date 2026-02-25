import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { BirdsService } from './birds.service';
import { CreateBirdDto } from './dto';
import { UpdateBirdDto } from './dto';
import { querySearchBird } from './querys';
import { Prisma } from '@prisma/client';
import { birds_filter } from 'src/filters';
import { pagination_helper } from '../../helpers';
import { pagination_prisma } from '../../helpers';

@Controller('birds')
export class BirdsController {
  constructor(private readonly birdsService: BirdsService) {}

  @Post()
  create(@Body() createBirdDto: CreateBirdDto) {
    return this.birdsService.create(createBirdDto);
  }

  @Get()
  async findAll(@Query() querys: querySearchBird) {
    const page = +querys?.page;
    const limit = +querys?.limit;
    const orderBy: Prisma.birdsOrderByWithAggregationInput = querys?.order ?? {
      created_at: 'desc',
    };
    const where: Prisma.birdsWhereInput = {
      deleted_at: null,
    };
    const filter: any = birds_filter(querys);
    if (filter?.length) where.OR = filter;
    const include: Prisma.birdsInclude = {};

    const data = await this.birdsService.findAll({
      where,
      orderBy,
      include,
      ...pagination_prisma(limit, page),
    });

    return pagination_helper(page, limit, data.count, data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.birdsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBirdDto: UpdateBirdDto) {
    return this.birdsService.update(+id, updateBirdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.birdsService.remove(+id);
  }
}
