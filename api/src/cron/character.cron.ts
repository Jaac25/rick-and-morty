import cron from "node-cron";
import { CharacterService } from "../services/character.service";

export const startCharacterCron = () => {
  const service = new CharacterService();

  cron.schedule("0 */12 * * *", async () => {
    console.log("Running character update job...");
    await service.updateCharacters();
  });
};
