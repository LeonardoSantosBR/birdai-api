import { Module } from '@nestjs/common';
import { BirdsModule } from './modules/birds/birds.module';
import { PrismaService } from './database';

@Module({
  imports: [BirdsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
