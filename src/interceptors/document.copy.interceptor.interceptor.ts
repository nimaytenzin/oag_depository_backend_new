import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class DocumentCopyUploadInterceptor extends FileInterceptor('file', {
  storage: diskStorage({
    destination: './storage/documentcopies',
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
}) {}
