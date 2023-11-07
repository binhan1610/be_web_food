import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { STORAGE_BUCKET_URL } from 'src/configs/config';
@Module({
  providers: [
    {
      provide: 'FirebaseAdmin',
      useFactory: () => {
        const serviceAccount = require('C:/Users/dangb/Cart/Grap_Food/serviceAccountKey.json');
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: STORAGE_BUCKET_URL,
        });
      },
    },
  ],
  exports: ['FirebaseAdmin'],
})
export class FirebaseModule {}
