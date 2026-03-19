import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database';

@Injectable()
export class HabitatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: Prisma.habitatsFindManyArgs) {
    const query = await this.prisma.habitats.findMany(params);
    return query;
  }

  async count(params: Prisma.habitatsCountArgs): Promise<number> {
    const query = await this.prisma.habitats.count(params);
    return query;
  }
}
