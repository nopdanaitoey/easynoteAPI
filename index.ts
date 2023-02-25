import * as Hapi from "@hapi/hapi";
import { ServerRoute } from "@hapi/hapi";
import { Server, ResponseToolkit, Request } from "hapi";
import { initDb } from "./db";
import { Connection } from "typeorm";
import "colors";
import { get } from "node-emoji";
import { request } from "http";
import { categorynoteController } from "./controllers";
import { noteController } from "./controllers/note/note.comtroller";
import { customerController } from "./controllers/customer/customer.controller";
import { validateJWT } from "./auth";

const HapiCors = require("hapi-cors");

const init = async () => {
  const server = new Hapi.Server({
    port: 8000,
    host: "localhost",
    routes: {
      cors: true,
    },
  });

  await server.register(require("hapi-auth-jwt2"));
  await server.register(require("@hapi/basic"));
  await server.register({
    plugin: HapiCors,
    options: {
      origins: [true],
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      headers: ["Content-Type", "Authorization"],
    },
  });

  const con: Connection = await initDb();

  server.route({
    method: "GET",
    path: "/",
    handler: (request: Request, h: ResponseToolkit, err?: Error) => {
      return "Hello World";
    },
  });

  server.auth.strategy("jwt", "jwt", {
    key: "my secret key",
    validate: validateJWT(con),
  });
  await initDb().then(() => {
    console.log(get("dvd"), "DB Connected", get("dvd"));
  });
  server.route([
    ...categorynoteController(con),
    ...noteController(con),
    ...customerController(con),
  ] as Array<ServerRoute>);
  await server.start().then();
  console.log(get("rocket"), "Server Run".green, get("rocket"));
};
process.on("unhandleRejection", (err) => {
  console.log(err);
  process.exit();
});
init();
