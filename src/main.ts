import config from 'config';

import { App } from './app';

async function bootstrap(): Promise<void> {
  const port: number = config.get('app.port');

  const app = new App();
  await app.start(port);
}

bootstrap();
