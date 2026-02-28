export interface IDatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  schemaSynchronize: boolean;
}

export interface IMailerConfig {
  host: string;
  port: number;
}

export interface ICommonConfig {
  port: number;
  adminName: string;
  adminEmail: string;
  portalUrl: string;
  // consider to move to separate secure config interface if we have more secure settings in the future
  jwtSecret: string;
}

export interface AppConfig {
  common: ICommonConfig;
  database: IDatabaseConfig;
  mailer: IMailerConfig;
}
