import { Model, ModelStatic } from "sequelize-typescript"
import { FindOptions, WhereOptions } from "sequelize"

/**
 * @description Validate that an entity exists in the database.
 * @template T - Sequelize model type.
 * @template Attributes - Model attributes type.
 * @param {ModelStatic<T>} model - Sequelize model to query.
 * @param {WhereOptions<Attributes>} where - Conditions to find the entity.
 * @param {string} errorMessage - Error message if the entity does not exist.
 * @returns {Promise<T>} The found entity.
 * @throws {Error} If no entity matches the given conditions.
 */
export async function validateEntityExists<
    T extends Model,
    Attributes = T["_attributes"]
>(
    model: ModelStatic<T>,
    where: WhereOptions<Attributes>,
    errorMessage: string
): Promise<T> {
    const options: FindOptions<Attributes> = { where }
    const entity = await (model as any).findOne(options)

    if (!entity) throw new Error(errorMessage)

    return entity
}

/**
 * Useful to avoid duplicates.
 * @description Validate that an entity does not exist in the database.
 * @template T - Sequelize model type.
 * @template Attributes - Model attributes type.
 * @param {ModelStatic<T>} model - Sequelize model to query.
 * @param {WhereOptions<Attributes>} where - Conditions to check uniqueness.
 * @param {string} errorMessage - Error message if the entity already exists.
 * @returns {Promise<void>}
 * @throws {Error} If an entity matching the given conditions already exists.
 */
export async function validateEntityNotExists<
    T extends Model,
    Attributes = T["_attributes"]
>(
    model: ModelStatic<T>,
    where: WhereOptions<Attributes>,
    errorMessage: string
): Promise<void> {
    const options: FindOptions<Attributes> = { where }
    const entity = await (model as any).findOne(options)

    if (entity) throw new Error(errorMessage)
}

/**
 * @description Validate that multiple entities exist in the database.
 * @template T - Sequelize model type.
 * @template Attributes - Model attributes type.
 * @param {ModelStatic<T>} model - Sequelize model to query.
 * @param {WhereOptions<Attributes>} where - Conditions to find the entities.
 * @param {string} errorMessage - Error message if some entities do not exist.
 * @param {number} expectedCount - Expected number of entities (e.g. length of IDs array).
 * @returns {Promise<T[]>} The found entities.
 * @throws {Error} If not all entities matching the conditions are found.
 */
export async function validateEntitiesExist<
    T extends Model,
    Attributes = T["_attributes"]
>(
    model: ModelStatic<T>,
    where: WhereOptions<Attributes>,
    errorMessage: string,
    expectedCount: number
): Promise<T[]> {
    const options: FindOptions<Attributes> = { where }
    const entities = await (model as any).findAll(options)

    if (!entities || entities.length !== expectedCount) {
        throw new Error(errorMessage)
    }

    return entities
}
