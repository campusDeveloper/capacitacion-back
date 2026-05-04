export interface IUserBody {
    name: string
    type: number
    state: number
    email: string
    password: string
    mainHeadquarter: number
    headquarters?: number[];
    specialAgent: number
    paymentAgent: number
}
export interface IUserUpdateBody {
    name: string
    type: number
    state: number
    email: string
    password: string
    mainHeadquarter: number
    specialAgent: number
    paymentAgent: number
}
export interface IUserHeadUpdateBody {
    idHeadquarter: number
}
export interface IUserSubHeadUpdateBody {
    idHeadquarter: number
    value: number
}
