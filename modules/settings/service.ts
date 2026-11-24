import { settingsRepository } from "./repository";

export const settingsService = {
  async list() {
    return settingsRepository.findAll();
  },
  async get(key: string, fallback: unknown = null): Promise<unknown> {
    const row = await settingsRepository.findByKey(key);
    return row?.value ?? fallback;
  },
  async save(key: string, value: unknown) {
    return settingsRepository.upsert(key, value);
  },
};
