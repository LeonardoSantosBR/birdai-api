/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { BirdsService } from './birds.service';
import { CreateBirdDto } from './dto';
import { UpdateBirdDto } from './dto';
import { querySearchBird } from './querys';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('birds')
export class BirdsController {
  constructor(private readonly birdsService: BirdsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBirdDto: CreateBirdDto,
  ) {
    return this.birdsService.create(file, createBirdDto);
  }

  @Get()
  async findAll(@Query() querys: querySearchBird) {
    return this.birdsService.findAll(querys);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.birdsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBirdDto: UpdateBirdDto,
  ) {
    return this.birdsService.update(+id, file, updateBirdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.birdsService.remove(+id);
  }
}
