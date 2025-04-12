import { DataSource } from "typeorm";
import { Ikran } from "./models/ikrans";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "src/database/blu.db", // Archivo SQLite
  entities: [Ikran],
  synchronize: true, // Auto-genera esquema (solo desarrollo)
  logging: false,
  migrations: [],
  subscribers: [],
});
