import { distributionsRepository } from "./repository";
import { urlSchema } from "@/lib/validation";

export const distributionsService = {
  async list(applicationId: string) {
    return distributionsRepository.findByApp(applicationId);
  },
  async create(data: Parameters<typeof distributionsRepository.create>[0]) {
    urlSchema.parse(data.url);
    return distributionsRepository.create(data);
  },
  async update(
    id: string,
    data: Parameters<typeof distributionsRepository.update>[1],
  ) {
    if (data.url) urlSchema.parse(data.url);
    return distributionsRepository.update(id, data);
  },
  async remove(id: string) {
    return distributionsRepository.remove(id);
  },
};
