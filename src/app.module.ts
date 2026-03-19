/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BirdsModule } from './modules/birds/birds.module';
import { PrismaModule } from './database';
import { HabitatsModule } from './modules/habitats/habitats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BirdsModule,
    HabitatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
