import { Injectable } from '@nestjs/common';
import { Client, List, LocalAuth } from 'whatsapp-web.js';
import { qrcode } from 'qrcode-terminal';
import { OpenAIService } from 'src/openai/openai.service';

@Injectable()
export class WhatsappService {
  private clients: Map<string, Client> = new Map();

  constructor(private readonly openAIService: OpenAIService) { }

  async initializeClient(deviceId: string) {
    const client = new Client({
      authStrategy: new LocalAuth() // Menggunakan strategi autentikasi lokal
    });

    client.on('qr', (qr) => {
      console.log(`QR for device ${deviceId}:`, qr);
      qrcode.generate(qr, {small: true});
      // Anda bisa menyimpan QR untuk ditampilkan di UI atau mengirim ke pengguna.
    });

    client.on('ready', async () => {
      console.log(`Client ${deviceId} is ready!`);

      // Set custom display name
      await client.setDisplayName("Indivara Group");
      
      // Set custom profile picture
  });

  client.on('message', async (msg) => {
    if (msg.body.startsWith('wahyu')) {
      const prompt = msg.body.substring(5);
      const response = await this.openAIService.getResponse(prompt);
      await msg.reply(response);
  }
    if (msg.body === '!menu') {
      const body = "Here's our list of products at 50% off";
      const buttonText = "View all products";
      const sections = [
          {
              title: "Products list",
              rows: [
                  { id: "apple", title: "Apple" },
                  { id: "mango", title: "Mango" },
                  { id: "banana", title: "Banana" },
              ],
          },
      ];
      const title = "Menu Pilihan";
      const footer = "Please select a product";

      const productsList = new List(body, buttonText, sections, title, footer);

      console.log("Before replying with productsList");
      await client.sendMessage(msg.from, productsList);
    }else if (msg.body.toLowerCase().includes('jam')) {
      const currentTime = new Date().toLocaleTimeString();
      await client.sendMessage(msg.from, `Saat ini jam: ${currentTime}`);
  }else if (msg.body.toLowerCase().includes('venny')) {
    const currentTime = new Date().toLocaleTimeString();
    await client.sendMessage(msg.from, `I LOVE YOU`);
} else if (msg.type === 'list_response') {
        switch (msg.selectedRowId) {
            case 'apple':
                await client.sendMessage(msg.from, 'You selected Apple!');
                break;
            case 'mango':
                await client.sendMessage(msg.from, 'You selected Mango!');
                break;
            case 'banana':
                await client.sendMessage(msg.from, 'You selected Banana!');
                break;
            default:
                await client.sendMessage(msg.from, 'Unknown selection.');
        }
    }
});


    await client.initialize();
    this.clients.set(deviceId, client);
  }

  async sendMenu(chatId: string): Promise<void> {
   

    await this.clients.get(chatId).sendMessage(chatId, "listMessage");
}




  async sendMessage(deviceId: string, to: string, message: string) {
    const client = this.clients.get(deviceId);
    if (!client) {
      throw new Error('Client not found');
    }

    const formattedPhoneNumber = this.phoneNumberFormatter(to);
    await client.sendMessage(formattedPhoneNumber, message);
  }

  async logoutClient(deviceId: string): Promise<void> {
    const client = this.clients.get(deviceId);
    if (!client) {
        throw new Error('Client tidak ditemukan');
    }

    await client.logout();
    this.clients.delete(deviceId);
    console.log(`Client ${deviceId} telah logout.`);
}

  phoneNumberFormatter(number: string): string {
    // 1. Remove non-digit characters
    let formatted = number.replace(/\D/g, '');

    // 2. Remove leading zero and replace with '62'
    if (formatted.startsWith('0')) {
      formatted = '62' + formatted.substr(1);
    } else if (!formatted.startsWith('62')) {
      formatted = '62' + formatted; // Ensure it starts with '62' if not already
    }

    // 3. Append '@c.us' if not already present
    if (!formatted.endsWith('@c.us')) {
      formatted += '@c.us';
    }

    return formatted;
  }
}
