import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '@entities/location.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocationController } from '@controllers/location.controller';
import { LocationService } from '@services/location.service';
import { LoggingMiddleware } from './middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // Path to your .env file
      isGlobal: true, // Makes environment variables globally accessible
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<'postgres'>('DATABASE_TYPE', 'postgres'),
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        database: configService.get<string>('DATABASE_NAME'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        entities: [Location],
        synchronize: true,
      }),
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),
    TypeOrmModule.forFeature([Location]),
  ],
  controllers: [AppController, LocationController],
  providers: [AppService, LocationService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // Áp dụng cho mọi route
  }
}
