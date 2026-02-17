export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  schemaSynchronize: boolean;
}

export interface MailerConfig {
  host: string;
  port: number;
  adminName: string;
  adminEmail: string;
}

export interface AppConfig {
  port: number;
  database: DatabaseConfig;
  mailer: MailerConfig;
}
