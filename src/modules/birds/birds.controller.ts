/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { BirdsService } from './birds.service';
import { CreateBirdDto } from './dto';
import { UpdateBirdDto } from './dto';
import { querySearchBird } from './querys';
import { Prisma } from '@prisma/client';
import { birds_filter } from 'src/filters';
import { pagination_helper } from '../../helpers';
import { pagination_prisma } from '../../helpers';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('birds')
export class BirdsController {
  constructor(private readonly birdsService: BirdsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBirdDto: CreateBirdDto,
  ) {
    return this.birdsService.create(file, createBirdDto);
  }

  @Get()
  async findAll(@Query() querys: querySearchBird) {
    const page = +querys?.page;
    const limit = +querys?.limit;
    const orderBy: Prisma.birdsOrderByWithAggregationInput = querys?.order ?? {
      created_at: 'desc',
    };
    const habitatsIds = querys.habitatsSelected
      ? querys.habitatsSelected.split(',').map(Number)
      : [];

    const where: Prisma.birdsWhereInput = {
      deleted_at: null,
      ...(habitatsIds.length > 0 && {
        AND: habitatsIds.map((habitatId) => ({
          birdsHabitats: {
            some: {
              habitat_id: habitatId,
            },
          },
        })),
      }),
    };
    const filter: any = birds_filter(querys);
    if (filter?.length) where.OR = filter;
    const include: Prisma.birdsInclude = {
      birdsHabitats: {
        include: {
          habitat: {
            select: {
              name: true,
              color: true,
            },
          },
        },
      },
    };

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
