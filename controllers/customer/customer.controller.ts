import { Connection, Repository } from "typeorm";
import { ResponseToolkit, ServerRoute, Request, AuthCredentials } from "hapi";
import { CustomerEntity } from "../../db/entites";
import { genSalt, hash, compare } from "bcrypt";
import { string, object, date } from "@hapi/joi";
import { sign, verify } from "jsonwebtoken";
import Joi = require("@hapi/joi");

const jwt = require("jsonwebtoken");

export const customerController = (con: Connection): Array<ServerRoute> => {
  const customerRepo: Repository<CustomerEntity> =
    con.getRepository(CustomerEntity);
  return [
    {
      method: "POST",
      path: "/register",
      options: {
        auth: false,
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required().max(250).min(3),
            lastName: Joi.string().required().max(250).min(3),
            username: Joi.string().required().max(250).min(4),
            password: Joi.string().required().min(5).max(15),
          }) as any,
          failAction(request: Request, h: ResponseToolkit, err: Error) {
            throw err;
          },
          options: {
            abortEarly: false,
          },
        },
      },
      handler: async (
        { payload }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const { firstName, lastName, username, password } =
          payload as Partial<CustomerEntity>;
        const salt = await genSalt(10);
        let savecustomer: Partial<CustomerEntity> = new CustomerEntity(
          firstName,
          lastName,
          username,
          password
        );
        const hashedPassword = await hash(password, salt);
        savecustomer.password = hashedPassword;
        try {
          await customerRepo.save<Partial<CustomerEntity>>(savecustomer);
          return h
            .response({
              statusCode: 1,
              message: "Register successfully",
            })
            .code(201);
        } catch (error) {
          console.error(error);
          return h.response("Internal Server Error").code(500);
        }
      },
    },
    {
      method: "POST",
      path: "/login",
      options: {
        auth: false,
        validate: {
          payload: Joi.object({
            username: Joi.string().required().max(250).min(4),
            password: Joi.string().required().min(5).max(15),
          }) as any,
          failAction(request: Request, h: ResponseToolkit, err: Error) {
            throw err;
          },
          options: {
            abortEarly: false,
          },
        },
      },
      handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
        const { username, password } = request.payload as {
          username: string;
          password: string;
        };

        const customer = customerRepo.findOne({
          where: { username: username },
        });
        if (!customer) {
          return h
            .response({ message: "Invalid username or password" })
            .code(401);
        }
        const isValid = await compare(password, (await customer).password);
        if (!isValid) {
          return h
            .response({ message: "Invalid username or password" })
            .code(401);
        }
        delete (await customer).password;
        const secret = "my secret key";
        const token = sign({ id: (await customer).id }, secret, {
          expiresIn: "1h",
        });
        return h
          .response({ token, statusCode: 1, message: "Login success" })
          .code(200);
      },
    },
    {
      method: "GET",
      path: "/info",
      options: {
        auth: {
          strategy: "jwt",
        },
      },
      handler: async (request, h) => {
        const { id } = request.auth.credentials as { id: number };
        const customer = await customerRepo.findOne({ where: { id: id } });
        delete customer.password;
        return h.response({ customer: customer }).code(200);
      },
    },
  ];
};
