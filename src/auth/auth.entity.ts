import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Insert success for id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Update success for id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Remove success for id', this.id);
  }
}
