import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBirdDto } from './dto';
import { UpdateBirdDto } from './dto';
import { BirdsRepository } from './birds.repository';
import { birds, Prisma } from '@prisma/client';

@Injectable()
export class BirdsService {
  constructor(private readonly birdsRepository: BirdsRepository) {}

  create(data: CreateBirdDto) {
    return this.birdsRepository.create({ data });
  }

  async findAll(params: Prisma.birdsFindManyArgs) {
    const [rows, count]: [birds[], number] = await Promise.all([
      this.birdsRepository.findAll(params),
      this.birdsRepository.count({ where: params.where || {} }),
    ]);
    return { rows, count };
  }

  async findOne(id?: number, arg?: Prisma.birdsFindFirstArgs) {
    if (!id) throw new BadRequestException('Id não enviado.');
    const where = arg?.where || { id, deleted_at: null };
    const query = await this.birdsRepository.findOne({ where, ...arg });
    return query;
  }

  update(id: number, data: UpdateBirdDto) {
    if (!id) throw new BadRequestException('Id não enviado.');
    return this.birdsRepository.update({ where: { id }, data });
  }

  remove(id: number) {
    if (!id) throw new BadRequestException('Id não enviado.');
    return this.birdsRepository.delete({ where: { id } });
  }
}
