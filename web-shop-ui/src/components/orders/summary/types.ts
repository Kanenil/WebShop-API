import { ICartItem } from './../../common/basket/types';
export interface IDelivery
{
    area: string;
    city: string;
    warehouse: string;
}

export interface INovaPoshta
{
    areas: INovaPoshtaArea[];
    cities: INovaPoshtaCity[];
    expires: Date;
}

export interface INovaPoshtaArea
{
    Description: string;
}

export interface INovaPoshtaCity
{
    Description: string;
    AreaDescription: string;
    SettlementTypeDescription: string;
}

export interface INovaPoshtaWarehouse {
  Description: string;
  Longitude: number;
  Latitude: number;
  Delivery: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Schedule: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  PostalCodeUA : string;
  WarehouseStatus : string;
}

export interface ICreateOrder
{
  products: ICartItem[];
}