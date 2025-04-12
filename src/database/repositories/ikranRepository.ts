import { AppDataSource } from "../data-source";
import { Ikran } from "../models/ikrans";

export const IkranRepository = AppDataSource.getRepository(Ikran).extend({
  async findOrCreate(userId: string): Promise<Ikran> {
    let ikran = await this.findOne({ where: { id: userId } });

    if (!ikran) {
      ikran = this.create({
        id: userId,
        coins: 0,
        xp: 0,
        level: 1,
      });
      await this.save(ikran);
    }

    return ikran;
  },
});
