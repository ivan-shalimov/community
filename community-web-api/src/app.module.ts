import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres-container',
      port: 5432,
      username: 'postgres',
      password: 'Password1!',
      database: 'community-dev',
      entities: [],
      synchronize: false,
      autoLoadEntities: true,
    }),
    MembersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
