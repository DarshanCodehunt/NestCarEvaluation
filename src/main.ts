import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Setting up below middlewares in App module for e2e support
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.use(
  //   cookieSession({
  //     keys: ['abcdefg'],
  //   }),
  // );
  await app.listen(3000);
}
bootstrap();
