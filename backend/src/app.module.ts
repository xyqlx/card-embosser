import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://db/card_embosser', {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASSWORD,
      // if authSource is not specified, there will be no user@database
      authSource: 'admin',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
