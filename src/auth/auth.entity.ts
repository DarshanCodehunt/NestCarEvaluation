import { Reports } from 'src/reports/reports.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
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

  @Column({ default: true })
  isAdmin: boolean;

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

  @OneToMany(() => Reports, (report) => report.user)
  reports: Reports[];
}
