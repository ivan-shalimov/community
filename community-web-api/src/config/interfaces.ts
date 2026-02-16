export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  schemaSynchronize: boolean;
}

export interface AppConfig {
  port: number;
  database: DatabaseConfig;
}
