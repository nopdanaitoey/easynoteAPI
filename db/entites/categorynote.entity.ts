import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { NoteEntity } from "./note.entity";
@Entity({ name: "category_note" })
export class CategoryNoteEntity {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryType: string;

  @Column({ nullable: false, name: "user_id" })
  userId: number;

  @Column({ length: 1, nullable: false, name: "is_Active" })
  isActive: string;

  @OneToMany(() => NoteEntity, (note: NoteEntity) => note.noteType, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  notes: Array<NoteEntity>;
}
