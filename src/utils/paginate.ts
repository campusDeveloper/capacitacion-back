import { FindAndCountOptions, Model, ModelStatic } from 'sequelize'

interface PaginationOptions<T extends Model> extends Omit<FindAndCountOptions, 'offset' | 'limit'> {
    page?: number
    limit?: number
    model: ModelStatic<T>
}

export async function paginate<T extends Model>(options: PaginationOptions<T>) {
    const { page = 1, limit = 10, model, ...restOptions } = options
    const offset = (page - 1) * limit

    const result = await model.findAndCountAll({
        ...restOptions,
        offset,
        limit,
    })

    return formatPaginationResult<T>(result.count, result.rows, page, limit)
}

function formatPaginationResult<T>(total: number, data: T[], page: number, limit: number) {
    return {
        total,
        currentPage: page,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: total > page * limit ? page + 1 : null,
        limit,
        totalPages: Math.ceil(total / limit),
        data,
    }
}
