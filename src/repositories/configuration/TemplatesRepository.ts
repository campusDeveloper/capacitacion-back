import { Templates } from "../../models/Templates";

export class TemplatesRepository {
  async getAllTemplates() {
    return await Templates.findAll({
      attributes: [
        ["id", "IdTemplate"],
        ["code", "Code"],
        ["state", "State"],
        ["description", "Description"],
        ["imageUrl", "ImageUrl"],
        ["buttonType", "ButtonType"],
        ["statusMeta", "StatusMeta"],
        ["createdAt", "CreatedAt"]
      ],
      order: [["createdAt", "DESC"]],
      raw: true
    });
  }

  async getTemplateById(idTemplate: number) {
    return await Templates.findOne({
      where: { id: idTemplate },
      attributes: [
        ["id", "IdTemplate"],
        ["description", "Description"],
        ["imageUrl", "ImageUrl"],
        ["buttonType", "ButtonType"],
        ["buttonText", "ButtonText"]
      ],
      raw: true
    });
  }

  async toggleTemplateState(idTemplate: number) {
    const template = await Templates.findOne({ where: { id: idTemplate } });
    if (!template) {
      return null;
    }

    const newState = template.state ? 0 : 1;
    await template.update({ state: newState });

    return true;
  }

  async deleteTemplate(idTemplate: number) {
    const deletedRows = await Templates.destroy({ where: { id: idTemplate } });
    return deletedRows > 0;
  }
}
