import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { INovaPoshtaWarehouse } from "../../orders/summary/types";
import { WarehouseMark } from "./WarehouseMark";


interface Props
{
    warehouses?: INovaPoshtaWarehouse[];
    center?: INovaPoshtaWarehouse
}

interface ResenterProps
{
    lat: number;
    lng: number;
}

const RecenterAutomatically = ({lat,lng}:ResenterProps) => {
    const map = useMap();
     useEffect(() => {
       map.setView([lat, lng]);
     }, [lat, lng]);
     return null;
   }

const MapComponent : React.FC<Props> = ({
    warehouses,
    center
}) => {

  return (
    <>
      <MapContainer center={[center?.Latitude||50.4546600, center?.Longitude||30.5238000]} zoom={8}  scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {warehouses?.map((warehouse) => (
          <WarehouseMark
            key={warehouse.Description}
            position={[warehouse.Latitude, warehouse.Longitude]}
            description={warehouse.Description}
            selected={warehouse.Description === center?.Description}
          />
        ))}
        <RecenterAutomatically lat={center?.Latitude||50.4546600} lng={center?.Longitude||30.5238000} />
      </MapContainer>
    </>
  );
};
export default MapComponent;
