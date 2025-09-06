/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI, type GenerateContentResult } from '@google/generative-ai';

export class AIClient {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gemini-1.5-flash') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result: GenerateContentResult = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Client Error:', error);
      throw error;
    }
  }

  async generateContentStream(prompt: string): Promise<AsyncGenerator<string>> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContentStream(prompt);
      
      async function* streamText() {
        for await (const chunk of result.stream) {
          yield chunk.text();
        }
      }
      
      return streamText();
    } catch (error) {
      console.error('AI Client Error:', error);
      throw error;
    }
  }
}