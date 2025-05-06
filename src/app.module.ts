import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chat/chat.module';
import { MessagesModule } from './message/messages.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ChatsModule,
    UsersModule,
    MessagesModule,
    AuthModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: process.env.DATABASE_URL,
    //   host: process.env.DATABASE_HOST || 'localhost',
    //   port: parseInt(process.env.DATABASE_PORT) || 5432,
    //   username: process.env.DATABASE_USER || 'postgres',
    //   password: process.env.DATABASE_PASSWORD || 'postgres',
    //   database: process.env.DATABASE_NAME || 'nestdb',

    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
