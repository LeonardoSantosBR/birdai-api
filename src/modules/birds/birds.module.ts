import { Module } from '@nestjs/common';
import { BirdsService } from './birds.service';
import { BirdsController } from './birds.controller';
import { BirdsRepository } from './birds.repository';

@Module({
  controllers: [BirdsController],
  providers: [BirdsRepository, BirdsService],
})
export class BirdsModule {}
