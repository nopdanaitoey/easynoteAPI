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
import { HistoryNoteEntity } from "./historynote.entity";

@Entity({ name: "note" })
export class NoteEntity extends SharedProp {
  constructor(
    title: string,
    body: string,
    userid: number,
    noteType: number,
    loveFlag: Boolean
  ) {
    super();
    this.title = title;
    this.body = body;
    this.userid = userid;
    this.noteType = noteType;
    this.loveFlag = loveFlag;
  }
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

  @Column({ default: "Y", length: 1, nullable: false, name: "is_Active" })
  isActive: string;
  @Column({ default: false, nullable: false, name: "love_Flag" })
  loveFlag: Boolean;

  @OneToMany(() => CustomerEntity, (customer: CustomerEntity) => customer.notes)
  @JoinColumn({ name: "user_id" })
  customer: CustomerEntity;

  @OneToMany(
    (type) => NoteEntity,
    (note) => note.type
    // () => NoteEntity,
    // (categoryNote: NoteEntity) => type.notes.
  )
  type: CategoryNoteEntity;

  @OneToMany(
    () => HistoryNoteEntity,
    (history: HistoryNoteEntity) => history.note
  )
  history: Array<HistoryNoteEntity>;
}
