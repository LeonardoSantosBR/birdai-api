import { Controller, Get, Query } from '@nestjs/common';
import { HabitatsService } from './habitats.service';
import { querySearchHabitats } from './querys';

@Controller('habitats')
export class HabitatsController {
  constructor(private readonly habitatsService: HabitatsService) {}

  @Get()
  async findAll(@Query() querys: querySearchHabitats) {
    return this.habitatsService.findAll(querys);
  }
}
