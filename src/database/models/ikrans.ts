import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "ikrans" })
export class Ikran {
  @PrimaryColumn()
  id!: string;

  @Column({ type: "integer", default: 0 })
  coins!: number;

  @Column({ type: "integer", default: 0 })
  xp!: number;

  @Column({ type: "integer", default: 1 })
  level!: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  lastDaily!: Date;
}
