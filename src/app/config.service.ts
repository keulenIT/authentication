import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: { [key: string]: string } = {};

  constructor() {
    this.config['FIREBASE_API_KEY'] = 'your-api-key-here'; // Replace with your actual API key
  }

  get(key: string): string {
    return this.config[key];
  }
}
