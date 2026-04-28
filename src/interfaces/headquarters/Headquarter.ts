export interface Headquarter {
    id?: number;
    name: string;
    code: string;
    state: number;
    adress: string;
    phone: string;
    email: string;
    city: string;
    createBy?: number | null;
    updatedB?: number | null;
    cratedAt?: Date;
    updatedAt?: Date;
}
 
export interface IHeadquarterCard {
  idHeadquarter: number | null; 
  name: string;
  categories: number;
  docs: number;
  state?: number; 
}