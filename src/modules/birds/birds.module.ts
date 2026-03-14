import { Module } from '@nestjs/common';
import { BirdsService } from './birds.service';
import { BirdsController } from './birds.controller';
import { BirdsRepository } from './birds.repository';
import { SupabaseStorageService } from 'src/services';

@Module({
  controllers: [BirdsController],
  providers: [BirdsRepository, BirdsService, SupabaseStorageService],
})
export class BirdsModule {}
