import "reflect-metadata";
import { Connection, createConnection, getConnectionManager } from "typeorm";
import {
  CustomerEntity,
  CategoryNoteEntity,
  NoteEntity,
  HistoryNoteEntity,
} from "./entites";

export const initDb = async (): Promise<Connection> => {
  const connectionManager = getConnectionManager();
  if (connectionManager.has("default")) {
    const connection = connectionManager.get("default");
    if (!connection.isConnected) {
      await connection.connect();
    }
    return connection;
  }
  const entities = [
    CategoryNoteEntity,
    CustomerEntity,
    NoteEntity,
    HistoryNoteEntity,
  ];
  const con = await createConnection({
    type: "mysql",
    host: "localhost",
    username: "root",
    password: "",
    database: "note_easy",
    entities,
  });
  await con.synchronize(false);
  entities.forEach((entity) => console.log(`Created ${entity.name}`));
  return con;
};
