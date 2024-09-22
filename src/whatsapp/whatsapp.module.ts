import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { OpenAIService } from '../openai/openai.service';

@Module({
    providers: [WhatsappService, OpenAIService],
})
export class WhatsAppModule {}
