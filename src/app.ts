import { Server as OvernightServer } from '@overnightjs/core';
import bodyParser from 'body-parser';
import config from 'config';
import cors, { type CorsOptions } from 'cors';
import helmet, { type HelmetOptions } from 'helmet';
import glob from 'tiny-glob';

import { CacheModule, RedisCacheModule } from '@modules/cache';
import { DatabaseModule, PrismaDatabaseModule } from '@modules/database';
import { HttpServerModule, ServerModule } from '@modules/server';
import { routeNotFound } from '@utils/http';

export class App extends OvernightServer {
  private server: ServerModule;
  private cache: CacheModule;
  private database: DatabaseModule;

  constructor() {
    super();
  }

  private setupExpress(): void {
    const corsOptions: CorsOptions = config.get('cors');
    const helmetOptions: HelmetOptions = config.get('helmet');

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.use(cors(corsOptions));
    this.app.use(helmet(helmetOptions));

    console.info(`Cors: ${JSON.stringify(corsOptions)}`);
    console.info(`Helmet: ${JSON.stringify(helmetOptions)}`);
  }

  private setupDatabase(): void {
    this.database = new PrismaDatabaseModule();
  }

  private setupCache(): void {
    this.cache = new RedisCacheModule();
  }

  private async setupControllers(): Promise<void> {
    const files = await glob(`${__dirname}/use-cases/**/controller.[t|j]s`);

    const controllers = await Promise.all(
      files.map(async (file) => {
        const module = await import(file);
        return module[Object.keys(module)[0]];
      })
    );

    super.addControllers(controllers.map((Controller) => new Controller()));
    this.app.use(routeNotFound);

    console.info(
      `Controllers: ${JSON.stringify(
        controllers.map((Controller) => Controller.name)
      )}`
    );
  }

  async start(port = 3000): Promise<void> {
    this.setupExpress();
    this.setupDatabase();
    this.setupCache();
    await this.setupControllers();

    const server = this.app.listen(port, () => {
      const tz: string = config.get('app.tz');
      const env: string = config.get('app.env');

      console.info(`Timezone: ${tz}`);
      console.info(`Environment: ${env}`);
      console.info(`Port: ${port}`);
      console.info(`Server started`);
    });

    this.server = new HttpServerModule(server);
    this.server.handleConnections();
    await this.database.connect();
    await this.cache.connect();

    process.on('SIGINT', async () => await this.stop());
    process.on('SIGTERM', async () => await this.stop());
  }

  async stop(): Promise<void> {
    await this.cache.disconnect();
    await this.database.disconnect();
    this.server.handleDisconnections();

    console.info('Server stopped');
  }
}
