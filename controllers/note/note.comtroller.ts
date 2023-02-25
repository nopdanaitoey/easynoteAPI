import { Connection, Repository, createQueryBuilder } from "typeorm";
import { NoteEntity } from "../../db/entites";
import { ResponseToolkit, ServerRoute, Request } from "hapi";
import { request } from "http";
import { HistoryNoteEntity } from "../../db/entites";
import { sign } from "jsonwebtoken";
import { CategoryNoteEntity } from "../../db/entites";
const jwt = require("jsonwebtoken");
export const noteController = (con: Connection): Array<ServerRoute> => {
  const noteRepo: Repository<NoteEntity> = con.getRepository(NoteEntity);
  const historyNoteRepo: Repository<HistoryNoteEntity> =
    con.getRepository(HistoryNoteEntity);
  return [
    {
      method: "GET",
      path: "/note",
      options: {
        auth: {
          strategy: "jwt",
        },
      },
      handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
        try {
          const { id } = request.auth.credentials as { id: number };
          const data = await noteRepo.find({
            where: {
              isActive: "Y",
              userid: id,
            },
          });
          return data;
        } catch (error) {
          console.error(error);
          return h.response("Internal Server Error").code(500);
        }
      },
    },
    {
      method: "GET",
      path: "/history/{hid}",
      options: {
        auth: {
          strategy: "jwt",
        },
      },
      handler: async (
        { params: { hid }, auth }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        try {
          const { id } = auth.credentials as { id: number };
          const numericId = parseInt(hid);
          const data = await historyNoteRepo.find({
            where: {
              isActive: "Y",
              userid: id,
              noteId: numericId,
            },
            order: {
              createdAt: "DESC",
            },
          });
          return data;
        } catch (error) {
          console.error(error);
          return h.response("Internal Server Error").code(500);
        }
      },
    },
    {
      method: "GET",
      path: "/note/type/{typeid}",
      options: {
        auth: {
          strategy: "jwt",
        },
      },
      handler: async (
        { params: { typeid }, auth }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        try {
          const { id } = auth.credentials as { id: number };
          const numericId = parseInt(typeid);
          const data = await noteRepo.find({
            where: {
              noteType: numericId,
              isActive: "Y",
              userid: id,
            },
            order: {
              createdAt: "DESC",
            },
          });
          return data;
        } catch (error) {
          console.error(error);
          return h.response("Internal Server Error").code(500);
        }
      },
    },
    {
      method: "POST",
      path: "/note",
      options: {
        auth: {
          strategy: "jwt",
        },
      },
      handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
        const { id } = request.auth.credentials as { id: number };
        const { title, body, noteType, loveFlag } =
          request.payload as Partial<NoteEntity>;
        let savenote: Partial<NoteEntity> = new NoteEntity(
          title,
          body,
          id,
          noteType,
          loveFlag
        );
        try {
          const savedNote = await noteRepo.save<Partial<NoteEntity>>(savenote);
          return h
            .response({ statusCode: 1, message: "Note saved successfully." })
            .code(201);
        } catch (error) {
          console.error(error);
          return h.response("Internal Server Error").code(500);
        }
      },
    },

    {
      method: "PATCH",
      path: "/note/{id}",
      options: {
        auth: {
          strategy: "jwt",
        },
      },
      handler: async (
        { params: { id }, payload }: Request,
        h: ResponseToolkit
      ) => {
        try {
          const numericId = parseInt(id);
          const note = await noteRepo.findOne({
            where: { id: numericId },
          });
          if (!note) {
            return h.response("Note not found").code(404);
          }
          payload as Partial<NoteEntity>;
          const noteid = note.id;
          delete note.id;
          const noteHistory = {
            noteId: noteid,
            ...note,
          };
          historyNoteRepo.save(noteHistory);
          Object.assign(note, payload);
          const updatedNote = await noteRepo.save(note);
          return h
            .response({
              statusCode: 1,
              message: "Note updated successfully.",
              data: updatedNote,
            })
            .code(200);
        } catch (error) {
          console.error(error);
          return h.response("Internal Server Error").code(500);
        }
      },
    },

    {
      method: "DELETE",
      path: "/note/{id}",
      options: {
        auth: {
          strategy: "jwt",
        },
      },
      handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
        try {
          const numericId = parseInt(request.params.id);
          const note = await noteRepo.findOne({
            where: { id: numericId },
          });
          if (!note) {
            return h.response("Note not found").code(404);
          }
          await noteRepo.delete(note.id);
          return h
            .response({ statusCode: 1, message: "Note deleted successfully." })
            .code(200);
        } catch (error) {
          console.error(error);
          return h.response("Internal Server Error").code(500);
        }
      },
    },
  ];
};
