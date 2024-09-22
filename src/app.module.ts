import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { WhatsappController } from './whatsapp/whatsapp.controller';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { OpenAIService } from './openai/openai.service';

@Module({
  imports: [WhatsAppModule],
  controllers: [AppController, WhatsappController],
  providers: [AppService, WhatsappService, OpenAIService],
})
export class AppModule {}
