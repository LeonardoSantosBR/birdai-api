import { Module } from '@nestjs/common';
import { HabitatsService } from './habitats.service';
import { HabitatsController } from './habitats.controller';
import { HabitatsRepository } from './habitats.repository';

@Module({
  controllers: [HabitatsController],
  providers: [HabitatsService, HabitatsRepository],
})
export class HabitatsModule {}
