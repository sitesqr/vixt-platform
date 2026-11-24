import { versionsRepository } from "./repository";

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export class VersionError extends Error {}

export const versionsService = {
  async list(applicationId: string) {
    return versionsRepository.findByApp(applicationId);
  },
  async create(data: Parameters<typeof versionsRepository.create>[0]) {
    if (!SEMVER.test(data.version)) {
      throw new VersionError("Versão deve seguir o formato 1.2.0.");
    }
    return versionsRepository.create(data);
  },
  async update(
    id: string,
    data: Parameters<typeof versionsRepository.update>[1],
  ) {
    if (data.version && !SEMVER.test(data.version)) {
      throw new VersionError("Versão deve seguir o formato 1.2.0.");
    }
    return versionsRepository.update(id, data);
  },
  async remove(id: string) {
    return versionsRepository.remove(id);
  },
};
