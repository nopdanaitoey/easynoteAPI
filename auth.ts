import { Request, ResponseToolkit } from "@hapi/hapi";
import { Connection, Repository } from "typeorm";
import { CustomerEntity } from "./db/entites/customer.entity";
import { compare, hash, genSalt } from "bcrypt";

export const validateJWT = (con: Connection) => {
  const userRepo: Repository<CustomerEntity> =
    con.getRepository(CustomerEntity);
  return async (
    { id }: Partial<CustomerEntity>,
    request: Request,
    h: ResponseToolkit
  ) => {
    const user: CustomerEntity = await userRepo.findOne({ where: { id: id } });
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: { id } };
  };
};
