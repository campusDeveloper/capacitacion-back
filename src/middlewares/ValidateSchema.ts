import { NextFunction, Request, Response } from "express";
import z, { ZodType } from "zod";

export const validateSchema =
    (schema: ZodType<any>) =>
    (req: Request, res: Response, next: NextFunction): any => {
        const dataToValidate = { ...req.body, ...req.query, ...req.params };
        const result = schema.safeParse(dataToValidate);

        if (!result.success) {
            if (req.method === "POST") {
                const errorsObject: Record<string, string[]> = {};

                result.error.issues.forEach((error) => {
                    const fieldName = error.path[0] as string;
                    const errorMessage = error.message;

                    if (!errorsObject[fieldName]) {
                        errorsObject[fieldName] = [];
                    }

                    errorsObject[fieldName].push(
                        `El campo ${fieldName ?? ""} ${errorMessage}`,
                    );
                });

                return res.status(400).json({ errors: errorsObject });
            } else {
                // Para GET u otros métodos, devolvemos solo el primer error
                const firstError = result.error.issues[0];
                const fieldName = firstError.path[0] as string;
                const errorMessage = firstError.message;

                return res.status(400).json({
                    error: `El ${fieldName ? "campo " + fieldName + " " : ""}${errorMessage}`,
                });
            }
        }

        next();
    };

export const validateSchemaAsync =
    (schema: ZodType<any>) =>
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const dataToValidate = { ...req.body, ...req.query, ...req.params };
        const result = await schema.safeParseAsync(dataToValidate);

        if (!result.success) {
            const errorsObject: Record<string, string[]> = {};

            result.error.issues.forEach((error) => {
                const fieldName = error.path[0] as string;
                const errorMessage = error.message;

                if (!errorsObject[fieldName]) {
                    errorsObject[fieldName] = [];
                }

                errorsObject[fieldName].push(
                    `El campo ${fieldName ?? ""} ${errorMessage}`,
                );
            });

            return res.status(400).json({ errors: errorsObject });
        }

        next();
    };

export const validateQuerySchema =
    (schema: ZodType<any>) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const errorsObject: Record<string, string> = {};

            result.error.issues.forEach((error) => {
                const fieldName = error.path[0] as string;
                const errorMessage = error.message;
                errorsObject[fieldName] = errorMessage;
            });

            res.status(400).json({
                error: "Parámetros inválidos",
                data: errorsObject,
            });
            return;
        }
        next();
    };

export const validateData = <T>(schema: ZodType<T>, data: any) => {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errorsObject: Record<string, string[]> = {};

        result.error.issues.forEach((error) => {
            const fieldName = error.path[0] as string;
            const errorMessage = error.message;

            if (!errorsObject[fieldName]) {
                errorsObject[fieldName] = [];
            }

            errorsObject[fieldName].push(
                `El campo ${fieldName ?? ""} ${errorMessage}`,
            );
        });

        throw errorsObject;
    }

    return result.data;
};

export const validateRequestData =
    (attribute: "body" | "query" | "params" | "files", schema: ZodType<Object | null>) =>
    (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = validateData(schema, req[attribute]);

            req[attribute] = result;

            next();
        } catch (error) {
            res.status(400).json({ errors: error });
        }
    };
