import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

async function bootstrap() {
  try{

    const response = await fetch('/config.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
    }
    
    const runtimeConfig = await response.json();
    await bootstrapApplication(App, appConfig(runtimeConfig));
  } catch(err){
      console.error('Bootstrap failed:', err);
  }
}

bootstrap();