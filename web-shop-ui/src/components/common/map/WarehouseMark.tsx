import L from 'leaflet';

import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { Marker, Popup } from 'react-leaflet';


const icon = L.icon({ 
    iconRetinaUrl:iconRetina, 
    iconUrl: iconMarker, 
    shadowUrl: iconShadow 
});

const iconSelected = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Props
{
    position: [number, number];
    description: string;
    selected?: boolean;
}

export const WarehouseMark : React.FC<Props> = ({position, description, selected = false})=>{

    return (
        <Marker position={position} icon={selected?iconSelected:icon}>
          <Popup>
            {description}
          </Popup>
        </Marker>
    )
}