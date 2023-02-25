import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { SharedProp } from "./sharedProp.entity";
import { CustomerEntity } from "./customer.entity";
import { CategoryNoteEntity } from "./categorynote.entity";
import { NoteEntity } from "./note.entity";

@Entity({ name: "historynote" })
export class HistoryNoteEntity extends SharedProp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "title", nullable: false })
  title: string;

  @Column({ name: "body", nullable: false })
  body: string;

  @Column({ name: "user_id", nullable: false })
  userid: number;

  @Column({ name: "note_type", nullable: false })
  noteType: number;

  @Column({ name: "note_id", nullable: false })
  noteId: number;

  @Column({ length: 1, nullable: false, name: "is_Active" })
  isActive: string;

  @OneToMany(() => CustomerEntity, (customer: CustomerEntity) => customer.notes)
  @JoinColumn({ name: "user_id" })
  customer: CustomerEntity;

  @OneToMany(
    () => CategoryNoteEntity,
    (categoryNote: CategoryNoteEntity) => categoryNote.notes
  )
  type: CategoryNoteEntity;

  @OneToMany(() => NoteEntity, (note: NoteEntity) => note.id)
  @JoinColumn({ name: "note_id" })
  note: NoteEntity;
}
