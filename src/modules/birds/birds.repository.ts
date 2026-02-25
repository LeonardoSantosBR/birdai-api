import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database';

@Injectable()
export class BirdsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.birdsCreateArgs) {
    const query = await this.prisma.birds.create(data);
    return query;
  }

  async findAll(params: Prisma.birdsFindManyArgs) {
    const query = await this.prisma.birds.findMany(params);
    return query;
  }

  async count(params: Prisma.birdsCountArgs): Promise<number> {
    const query = await this.prisma.birds.count(params);
    return query;
  }

  async findOne(params: Prisma.birdsFindFirstArgs) {
    const query = await this.prisma.birds.findFirst(params);
    return query;
  }

  async update(params: Prisma.birdsUpdateArgs) {
    await this.prisma.birds.update(params);
    return true;
  }

  async delete(params: Prisma.birdsDeleteArgs) {
    await this.prisma.birds.delete(params);
    return true;
  }
}
