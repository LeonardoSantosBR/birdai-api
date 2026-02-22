import { Module } from '@nestjs/common';
import { BirdsModule } from './modules/birds/birds.module';
import { PrismaModule } from './database';

@Module({
  imports: [PrismaModule, BirdsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
