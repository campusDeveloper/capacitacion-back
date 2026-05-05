import { TemplatesRepository } from "../../repositories/configuration/TemplatesRepository";

export class TemplatesService {
  private readonly repository: TemplatesRepository;

  constructor(repository: TemplatesRepository) {
    this.repository = repository;
  }

  async getAllTemplates() {
    return await this.repository.getAllTemplates();
  }

  async getTemplateDetail(idTemplate: number) {
    const template = await this.repository.getTemplateById(idTemplate);
    if (!template) {
      throw new Error("Plantilla no encontrada");
    }

    return template;
  }

  async changeTemplateState(idTemplate: number) {
    const updated = await this.repository.toggleTemplateState(idTemplate);
    if (!updated) {
      throw new Error("Plantilla no encontrada");
    }

    return true;
  }

  async deleteTemplate(idTemplate: number) {
    const deleted = await this.repository.deleteTemplate(idTemplate);
    if (!deleted) {
      throw new Error("Plantilla no encontrada");
    }

    return true;
  }
}
