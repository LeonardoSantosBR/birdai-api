import { Injectable } from '@nestjs/common';
import { HabitatsRepository } from './habitats.repository';
import { habitats, Prisma } from '@prisma/client';

@Injectable()
export class HabitatsService {
  constructor(private readonly habitatsRepository: HabitatsRepository) {}

  async findAll(params: Prisma.habitatsFindManyArgs) {
    const [rows, count]: [habitats[], number] = await Promise.all([
      this.habitatsRepository.findAll(params),
      this.habitatsRepository.count({ where: params.where || {} }),
    ]);
    return { rows, count };
  }
}
