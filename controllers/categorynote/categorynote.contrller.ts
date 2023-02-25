import { Connection, Repository } from "typeorm";
import { CategoryNoteEntity } from "../../db/entites";
import { ResponseToolkit, ServerRoute, Request } from "hapi";

export const categorynoteController = (con: Connection): Array<ServerRoute> => {
  const categorynoteRepo: Repository<CategoryNoteEntity> =
    con.getRepository(CategoryNoteEntity);
  return [
    {
      method: "GET",
      path: "/categorynote",
      handler: async ({ query }: Request, h: ResponseToolkit, err?: Error) => {
        try {
          const data = await categorynoteRepo.find({
            where: {
              isActive: "Y",
            },
          });
          return data;
        } catch (error) {
          console.error(error);
          return h.response("Internal Server Error").code(500);
        }
      },
    },
  ];
};
