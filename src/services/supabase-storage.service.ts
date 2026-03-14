/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly supabase: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    const bucket = this.configService.get<string>('SUPABASE_BUCKET');

    if (!supabaseUrl || !supabaseKey || !bucket) {
      throw new Error('Supabase env vars não configuradas corretamente.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.bucket = bucket;
  }

  async uploadImage(file: Express.Multer.File, folder = 'uploads') {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado.');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo inválido.');
    }

    const fileExt = this.getFileExtension(file.originalname, file.mimetype);
    const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Erro ao fazer upload: ${error.message}`,
      );
    }

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(fileName);

    return {
      path: fileName,
      url: data.publicUrl,
    };
  }

  async deleteImage(path: string) {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([path]);

    if (error) {
      throw new InternalServerErrorException(
        `Erro ao deletar imagem: ${error.message}`,
      );
    }

    return { message: 'Imagem removida com sucesso.' };
  }

  private getFileExtension(originalName: string, mimeType: string) {
    const extensionFromName = originalName.split('.').pop()?.toLowerCase();

    if (extensionFromName) {
      return extensionFromName;
    }

    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      default:
        return 'bin';
    }
  }
}
