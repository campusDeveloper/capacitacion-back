export interface IOpportunityStateBody {
    name: string
    description: string
    color: string
    state?: number
}

export interface IOpportunityStateUpdateBody {
    name?: string
    description?: string
    color?: string
    state?: number
}