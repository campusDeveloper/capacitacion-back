export interface ISelectHeadquarterResponse {
    idHeadquarter: number
    name: string
}

export interface IUserHeadquartersResponse {
    mainHeadquarter: number | null
    headquarters: number[]
}

export interface IUpdateMainHeadquarterBody {
    idHeadquarter: number
}

export interface IUpdateUserHeadquarterBody {
    idHeadquarter: number
    value: number
}
