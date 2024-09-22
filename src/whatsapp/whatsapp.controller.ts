import { Body, Controller, Param, Post } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('initialize')
  async initializeClient(@Body() body: { deviceId: string }) {
    await this.whatsappService.initializeClient(body.deviceId);
    return { status: `Client ${body.deviceId} initialized` };
  }

  @Post('send')
  async sendMessage(@Body() body: { deviceId: string; to: string; message: string }) {
    await this.whatsappService.sendMessage(body.deviceId, body.to, body.message);
    return { status: 'Message sent' };
  }

  @Post('logout/:deviceId')
  async logout(@Param('deviceId') deviceId: string): Promise<string> {
      await this.whatsappService.logoutClient(deviceId);
      return `Client ${deviceId} telah logout.`;
  }
}
