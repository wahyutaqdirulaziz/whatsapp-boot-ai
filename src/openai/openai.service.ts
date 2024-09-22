import { Injectable } from '@nestjs/common';
import axios from 'axios';


@Injectable()
export class OpenAIService {
    private apiKey: string;

    constructor() {
this.apiKey = 'AIzaSyCr7lK3udPawF4u1Anf6q3x_MJHepCKz4A'; // Use your environment variable
    }

    async getResponse(prompt: string): Promise<string> {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

        const data = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                    ],
                },
            ],
        };

        try {
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    key: this.apiKey,
                },
            });
           // Safely access the response data
           if (response.data.candidates && response.data.candidates.length > 0) {
            return response.data.candidates[0].content.parts[0].text; // Access the required text
        } else {
            throw new Error('No candidates found in response');
        }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return 'Sorry, I encountered an error while processing your request.';
        }
    }
    
}
