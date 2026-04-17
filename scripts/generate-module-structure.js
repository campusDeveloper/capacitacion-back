#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Capitalize first letter of string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase to PascalCase (already capitalized)
 */
function toPascalCase(str) {
    return str
        .split(/[-_]/)
        .map(word => capitalize(word.toLowerCase()))
        .join('');
}

/**
 * Convert string to lowercase with hyphens
 */
function toKebabCase(str) {
    return str
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();
}

/**
 * Convert string to singular form (basic)
 */
function toSingular(str) {
    if (str.endsWith('ies')) {
        return str.slice(0, -3) + 'y';
    }
    if (str.endsWith('es')) {
        return str.slice(0, -2);
    }
    if (str.endsWith('s')) {
        return str.slice(0, -1);
    }
    return str;
}

const moduleName = process.argv[2];

if (!moduleName) {
    console.error('❌ Error: Module name is required');
    console.error('Usage: node scripts/generate-module.js <moduleName>');
    console.error('Example: node scripts/generate-module.js headquarter');
    process.exit(1);
}

const pascalName = toPascalCase(moduleName);
const singularName = toSingular(moduleName);
const singularPascal = toPascalCase(singularName);
const kebabName = toKebabCase(moduleName);

const basePath = path.join(__dirname, '../src');

// Directories to create
const dirs = [
    path.join(basePath, 'repositories', kebabName),
    path.join(basePath, 'services', kebabName),
    path.join(basePath, 'controllers', kebabName),
    path.join(basePath, 'routes', kebabName),
    path.join(basePath, 'validators', kebabName),
];

// Repository Template
const repositoryTemplate = `import { ${singularPascal} } from "../../models/${singularPascal}";
import { Op, CreationAttributes, Transaction } from "sequelize";
import { paginate } from "../../utils/paginate";
import * as ${singularPascal}ValidatorType from "../../validators/${kebabName}/${singularPascal}Validator";

export interface GetAll${pascalName}Options {
    filter?: ${singularPascal}ValidatorType.GetAll${pascalName}QueryPayload
}

export class ${singularPascal}Repository {
    async getAll${pascalName}(options?: GetAll${pascalName}Options) {
        const ${kebabName}Where: any = {};

        if (options?.filter?.name) {
            ${kebabName}Where.name = { [Op.like]: \`%\${options.filter.name}%\` };
        }

        if (options?.filter?.state !== undefined) {
            ${kebabName}Where.state = options.filter.state;
        }

        if (options?.filter?.limit || options?.filter?.page) {
            return await paginate({
                model: ${singularPascal},
                page: options?.filter?.page,
                limit: options?.filter?.limit,
                where: ${kebabName}Where,
            })
        }

        return await ${singularPascal}.findAll({
            where: ${kebabName}Where,
            order: [["id", "DESC"]]
        });
    }

    async get${singularPascal}ById(id: number) {
        return await ${singularPascal}.findByPk(id);
    }

    async create${singularPascal}(
        data: CreationAttributes<${singularPascal}>,
        transaction: Transaction
    ) {
        return await ${singularPascal}.create(data, { transaction });
    }

    async update${singularPascal}ById(
        id: number,
        data: Partial<CreationAttributes<${singularPascal}>>,
        transaction: Transaction
    ) {
        const ${singularName} = await ${singularPascal}.findByPk(id, { transaction });

        if (${singularName}) {
            return await ${singularName}.update(data, { transaction });
        }
    
        return null;
    }

    async delete${singularPascal}ById(
        id: number,
        transaction: Transaction
    ) {
        const ${singularName} = await ${singularPascal}.findByPk(id, { transaction });

        if (${singularName}) {
            return await ${singularName}.destroy({ transaction });
        }

        return null;
    }
}
`;

// Service Template
const serviceTemplate = `import { sequelize } from "../../config/database";
import { ${singularPascal}Repository } from "../../repositories/${kebabName}/${singularPascal}Repository";
import * as ${singularPascal}ValidatorType from "../../validators/${kebabName}/${singularPascal}Validator";
import { ${singularPascal} } from "../../models/${singularPascal}";
import { validateEntityExists } from "../../utils/validateEntity";

export class ${singularPascal}Service {
    private repository;

    constructor(repo: ${singularPascal}Repository) {
        this.repository = repo;
    }

    async getAll${pascalName}(
        filter?: ${singularPascal}ValidatorType.GetAll${pascalName}QueryPayload
    ) {
        return await this.repository.getAll${pascalName}({ filter });
    }

    async get${singularPascal}ById(id: number) {
        const entry = await this.validate${singularPascal}(id);

        return await this.repository.get${singularPascal}ById(entry.id);
    }

    async create${singularPascal}(
        data: ${singularPascal}ValidatorType.Create${singularPascal}BodyPayload,
        createdBy: number
    ) {
        return sequelize.transaction(async (transaction) => {
            return await this.repository.create${singularPascal}({
                name: data.name,
                state: data.state,
                createdBy
            }, transaction);
        });
    }

    async update${singularPascal}ById(
        id: number,
        data: ${singularPascal}ValidatorType.Update${singularPascal}BodyPayload,
        updatedBy: number
    ) {
        const entry = await this.validate${singularPascal}(id);

        return sequelize.transaction(async (transaction) => {
            return await this.repository.update${singularPascal}ById(entry.id, {
                name: data.name,
                state: data.state,
                updatedBy
            }, transaction);
        });
    }

    async delete${singularPascal}ById(id: number) {
        const entry = await this.validate${singularPascal}(id);

        return sequelize.transaction(async (transaction) => {
            return await this.repository.delete${singularPascal}ById(entry.id, transaction);
        });
    }

    private async validate${singularPascal}(id: number) {
        return await validateEntityExists(
            ${singularPascal},
            { id },
            "No existe registro de ${singularName}"
        );
    }
}
`;

// Controller Template
const controllerTemplate = `import { Request, Response } from "express";
import { ${singularPascal}Repository } from "../../repositories/${kebabName}/${singularPascal}Repository";
import * as ${singularPascal}ValidatorType from "../../validators/${kebabName}/${singularPascal}Validator";
import { ${singularPascal}Service } from "../../services/${kebabName}/${singularPascal}Service";
import { ApiResponse } from "../../utils/apiResponse";

const service = new ${singularPascal}Service(new ${singularPascal}Repository());

export class ${singularPascal}Controller {
    static async getAll${pascalName}(req: Request, res: Response) {
        try {
            const { page, limit, name, state } = req.query as ${singularPascal}ValidatorType.GetAll${pascalName}QueryPayload;

            const filter = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                name: name as string,
                state: state ? Number(state) : undefined,
            };

            const data = await service.getAll${pascalName}(filter);

            return ApiResponse.success(res, "Consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async get${singularPascal}ById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const data = await service.get${singularPascal}ById(id);

            return ApiResponse.success(res, "Consultado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async create${singularPascal}(req: Request, res: Response) {
        try {
            if (!req.user || !req.user.id) {
                return res
                    .status(401)
                    .json({ error: "Usuario no identificado en la petición" });
            }

            const payload = req.body as ${singularPascal}ValidatorType.Create${singularPascal}BodyPayload

            const userId = req.user.id;

            const data = await service.create${singularPascal}(payload, userId);

            return ApiResponse.success(res, "Creado correctamente", data, 201);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async update${singularPascal}ById(req: Request, res: Response) {
        try {
            if (!req.user || !req.user.id) {
                return res
                    .status(401)
                    .json({ error: "Usuario no identificado en la petición" });
            }

            const id = Number(req.params.id);

            const payload = req.body as ${singularPascal}ValidatorType.Update${singularPascal}BodyPayload

            const userId = req.user.id;

            const data = await service.update${singularPascal}ById(id, payload, userId);

            return ApiResponse.success(res, "Actualizado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }

    static async delete${singularPascal}ById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const data = await service.delete${singularPascal}ById(id);
            return ApiResponse.success(res, "Eliminado correctamente", data);
        } catch (error) {
            return ApiResponse.error(res, error);
        }
    }
}
`;

// Validator Template
const validatorTemplate = `import { z } from "zod";

export const getAll${pascalName}QuerySchema = z.object({
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    name: z.string().optional(),
    state: z.string().transform(Number).optional(),
});

export const ${singularName}IdParamSchema = z.object({
    id: z.string().transform(Number),
});

export const create${singularPascal}BodySchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    state: z.number().int().min(0).max(1),
});

export const update${singularPascal}BodySchema = z.object({
    name: z.string().optional(),
    state: z.number().int().min(0).max(1).optional(),
});

export type GetAll${pascalName}QueryPayload = z.infer<typeof getAll${pascalName}QuerySchema>;
export type Create${singularPascal}BodyPayload = z.infer<typeof create${singularPascal}BodySchema>;
export type Update${singularPascal}BodyPayload = z.infer<typeof update${singularPascal}BodySchema>;
`;

// Routes Template
const routesTemplate = `import { Router } from "express";
import { AuthMiddleware as isAuth } from "../../middlewares/AuthMiddleware";
import { ${singularPascal}Controller } from "../../controllers/${kebabName}/${singularPascal}Controller";
import { validateSchema } from "../../middlewares/ValidateSchema";
import * as ${singularPascal}Validator from "../../validators/${kebabName}/${singularPascal}Validator";

const router = Router();

router.get(
    "/${kebabName}/list",
    isAuth,
    validateSchema(${singularPascal}Validator.getAll${pascalName}QuerySchema),
    ${singularPascal}Controller.getAll${pascalName}
);

router.get(
    "/${kebabName}/:id",
    isAuth,
    validateSchema(${singularPascal}Validator.${singularName}IdParamSchema),
    ${singularPascal}Controller.get${singularPascal}ById
);

router.post(
    "/${kebabName}",
    isAuth,
    validateSchema(${singularPascal}Validator.create${singularPascal}BodySchema),
    ${singularPascal}Controller.create${singularPascal}
);

router.put(
    "/${kebabName}/:id",
    isAuth,
    validateSchema(${singularPascal}Validator.${singularName}IdParamSchema),
    validateSchema(${singularPascal}Validator.update${singularPascal}BodySchema),
    ${singularPascal}Controller.update${singularPascal}ById
);

router.delete(
    "/${kebabName}/:id",
    isAuth,
    validateSchema(${singularPascal}Validator.${singularName}IdParamSchema),
    ${singularPascal}Controller.delete${singularPascal}ById
);

export default router;
`;

// Files to create
const files = [
    {
        path: path.join(basePath, 'repositories', kebabName, `${singularPascal}Repository.ts`),
        content: repositoryTemplate,
    },
    {
        path: path.join(basePath, 'services', kebabName, `${singularPascal}Service.ts`),
        content: serviceTemplate,
    },
    {
        path: path.join(basePath, 'controllers', kebabName, `${singularPascal}Controller.ts`),
        content: controllerTemplate,
    },
    {
        path: path.join(basePath, 'validators', kebabName, `${singularPascal}Validator.ts`),
        content: validatorTemplate,
    },
    {
        path: path.join(basePath, 'routes', kebabName, `${singularPascal}Routes.ts`),
        content: routesTemplate,
    },
];

try {
    // Create directories
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${path.relative(process.cwd(), dir)}`);
        } else {
            console.log(`⚠️  Directory already exists: ${path.relative(process.cwd(), dir)}`);
        }
    });

    // Create files
    files.forEach(file => {
        if (fs.existsSync(file.path)) {
            console.log(`⚠️  File already exists: ${path.relative(process.cwd(), file.path)}`);
        } else {
            fs.writeFileSync(file.path, file.content);
            console.log(`✅ Created file: ${path.relative(process.cwd(), file.path)}`);
        }
    });

    console.log(`\n✨ Module structure created successfully for '${moduleName}'!`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Update the Model import if using a different name`);
    console.log(`   2. Add the route to src/routes/index.ts`);
    console.log(`   3. Update validator schemas according to your model fields`);
    console.log(`   4. Add any specific business logic to the Service layer`);
} catch (error) {
    console.error('❌ Error creating module structure:', error.message);
    process.exit(1);
}
