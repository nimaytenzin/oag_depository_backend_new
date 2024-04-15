import { Injectable } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class AnnexureUploadInterceptor extends FileFieldsInterceptor(
  [
    { name: 'file_eng', maxCount: 1 },
    { name: 'file_dzo', maxCount: 1 },
  ],
  {
    storage: diskStorage({
      destination: './storage/annexures',
      filename: (req, file, callback) => {
        if (file) {
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${fileExtName}`);
        } else {
          callback(null, null);
        }
      },
    }),
  },
) {}
