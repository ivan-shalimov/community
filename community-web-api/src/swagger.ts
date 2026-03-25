import { INestApplication } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';

export const configureOpenApi = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Community Web API')
    .setDescription('The Community API description')
    .setVersion('1.0')
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: 'api/auth/login', // Your actual login endpoint
            scopes: {},
          },
        },
      },
      `my-auth`,
    )
    .addSecurityRequirements('my-auth')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });
};
