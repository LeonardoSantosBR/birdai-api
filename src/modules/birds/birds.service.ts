/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBirdDto } from './dto';
import { UpdateBirdDto } from './dto';
import { BirdsRepository } from './birds.repository';
import { birds, Prisma } from '@prisma/client';
import { SupabaseStorageService } from 'src/services';
import { PrismaService } from 'src/database';

@Injectable()
export class BirdsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly birdsRepository: BirdsRepository,
    private readonly supabaseStorageService: SupabaseStorageService,
  ) {}

  create(file: Express.Multer.File, data: CreateBirdDto) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype != 'image/png')
      throw new BadRequestException(
        `Tipo de imagem ${file.mimetype.split('/')[1]} não aceita.`,
      );

    const transaction = async (tr: PrismaService) => {
      const uploadedImage = await this.supabaseStorageService.uploadImage(
        file,
        'birds',
      );
      return tr.birds.create({
        data: {
          ...data,
          url: uploadedImage.url,
        },
      });
    };
    return this.prismaService.$transaction(transaction, { timeout: 50000 });
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
