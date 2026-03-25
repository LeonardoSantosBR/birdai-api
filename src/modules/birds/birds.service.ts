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
import { querySearchBird } from './querys';
import { birds_filter } from 'src/filters';
import { pagination_helper, pagination_prisma } from 'src/helpers';

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
      const { habitats, ...rest } = data;
      const uploadedImage = await this.supabaseStorageService.uploadImage(
        file,
        'birds',
      );

      const hasHabitats = habitats?.length > 0;
      const habitatsIds = hasHabitats
        ? JSON.parse(habitats)?.map((id: number) => {
            return id;
          })
        : [];

      return tr.birds.create({
        data: {
          ...rest,
          url: uploadedImage.url,
          birdsHabitats: hasHabitats
            ? {
                create: habitatsIds.map((dt: { habitat_id: number }) => ({
                  habitat: {
                    connect: {
                      id: dt.habitat_id,
                    },
                  },
                })),
              }
            : {},
        },
      });
    };
    return this.prismaService.$transaction(transaction, { timeout: 50000 });
  }

  async findAll(querys: querySearchBird) {
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
    const params = {
      where,
      orderBy,
      include,
      ...pagination_prisma(limit, page),
    };

    const [rows, count]: [birds[], number] = await Promise.all([
      this.birdsRepository.findAll(params),
      this.birdsRepository.count({ where: params.where || {} }),
    ]);

    return pagination_helper(page, limit, count, rows);
  }

  async findOne(id?: number, arg?: Prisma.birdsFindFirstArgs) {
    if (!id) throw new BadRequestException('Id não enviado.');
    const where = arg?.where || { id, deleted_at: null };
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
    const query = await this.birdsRepository.findOne({
      where,
      include,
      ...arg,
    });
    return query;
  }

  update(id: number, file: Express.Multer.File, data: UpdateBirdDto) {
    if (!id) throw new BadRequestException('Id não enviado.');

    const transaction = async (tr: PrismaService) => {
      const { habitats, ...rest } = data;
      const incomingHabitats: { habitat_id: number }[] = JSON.parse(habitats);
      const incomingIds = incomingHabitats?.map((h) => h.habitat_id);

      const uploadedImage = file
        ? await this.supabaseStorageService.uploadImage(file, 'birds')
        : null;

      return tr.birds.update({
        where: {
          id,
        },
        data: {
          ...rest,
          ...(uploadedImage && { url: uploadedImage.url }),
          birdsHabitats: {
            deleteMany: {
              habitat_id: { notIn: incomingIds },
            },
            upsert: incomingHabitats.map((h) => ({
              where: {
                bird_id_habitat_id: {
                  bird_id: id,
                  habitat_id: h.habitat_id,
                },
              },
              create: { habitat_id: h.habitat_id },
              update: {},
            })),
          },
        },
      });
    };
    return this.prismaService.$transaction(transaction, { timeout: 50000 });
  }

  remove(id: number) {
    if (!id) throw new BadRequestException('Id não enviado.');
    return this.birdsRepository.delete({ where: { id } });
  }
}
