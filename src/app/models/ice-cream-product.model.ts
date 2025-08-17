export interface IceCreamProduct {
  id: string;
  name: string;
  description: string;
  account: string;
  price: number;
  originalPrice: number;
  discount: number;
  unitOfMeasurement: UnitOfMeasurement;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UnitOfMeasurement {
  LITER = 'liter',
  GALLON = 'gallon',
  SCOOP = 'scoop',
  CONTAINER = 'container',
  PINT = 'pint',
  QUART = 'quart'
}

export interface CreateIceCreamProductDto {
  name: string;
  description: string;
  account: string;
  price: number;
  originalPrice: number;
  discount: number;
  unitOfMeasurement: UnitOfMeasurement;
}

export interface UpdateIceCreamProductDto extends Partial<CreateIceCreamProductDto> {
  id: string;
}
