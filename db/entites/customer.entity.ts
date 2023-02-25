import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { SharedProp } from "./sharedProp.entity";
import { NoteEntity } from "./note.entity";

export type customerType = "admin" | "user";

@Entity({ name: "customer" })
export class CustomerEntity extends SharedProp {
  constructor(
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name", nullable: false })
  firstName: string;

  @Column({ name: "last_name", nullable: false })
  lastName: string;
  @Column({ name: "username", nullable: false })
  username: string;

  @Column({ name: "password", nullable: false })
  password: string;

  @Column({ default: "user" })
  type: customerType;

  @Column({ default: "Y", length: 1, nullable: false, name: "is_Active" })
  isActive: string;

  @OneToMany(() => NoteEntity, (note: NoteEntity) => note.customer, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  notes: Array<NoteEntity>;
}
