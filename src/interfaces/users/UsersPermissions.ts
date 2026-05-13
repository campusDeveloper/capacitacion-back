export interface IUsersPermissionsBody {
  module?: number;
  idUser?: number;
  value: 0 | 1;
  id: number;
  createdBy?: number;
}

export interface IUsersUpdatePermissionsBody {
  module?: number;
  idUser?: number;
  value: 0 | 1;
  id: number;
  createdBy?: number;
}
