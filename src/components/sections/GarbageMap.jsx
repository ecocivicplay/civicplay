import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './GarbageMap.css';


function youAreHereIcon() {
  return L.divIcon({
    className: 'gmap__you',
    html: `
      <span class="gmap__youDot"></span>
      <span class="gmap__youPulse"></span>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}


function pinIcon(emoji, tone) {
  return L.divIcon({
    className: `gmap__marker gmap__marker--${tone}`,
    html: `<span>${emoji}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}


function boundaryAround([lat, lng], deltaMeters = 400) {
  const d = deltaMeters / 111000;

  return [
    [lat + d, lng - d],
    [lat + d, lng + d],
    [lat - d, lng + d],
    [lat - d, lng - d],
  ];
}


function RecenterOnLocate({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);

  return null;
}


function ClickToReport({ onAdd }) {
  const map = useMap();

  useEffect(() => {
    const clickHandler = (e) => {
      const desc = window.prompt(
        'Describe the issue (Example: Overflowing garbage bin)'
      );

      if (desc) {
        onAdd({
          pos: [e.latlng.lat, e.latlng.lng],
          title: desc,
        });
      }
    };

    map.on('click', clickHandler);

    return () => {
      map.off('click', clickHandler);
    };

  }, [map, onAdd]);

  return null;
}



export default function GarbageMap() {

  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('loading');
  const [reports, setReports] = useState([]);


  useEffect(() => {

    if (!navigator.geolocation) {
      setStatus('unsupported');
      return;
    }


    navigator.geolocation.getCurrentPosition(

      (pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude
        ]);

        setStatus('ready');
      },


      () => {
        setStatus('denied');
      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
      }

    );

  }, []);



  const boundary = useMemo(
    () => position ? boundaryAround(position) : null,
    [position]
  );



  function handleAddReport({pos,title}) {

    setReports((prev)=>[
      ...prev,
      {
        id:Date.now(),
        pos,
        title,
        icon:'🗑️',
        tone:'garbage',
        status:'Reported'
      }
    ]);

  }



  if(status !== "ready" || !position){

    return (
      <section className="gmap-section">

        <div className="gmap__card gmap__stateCard">

          {
            status === "denied"
            ?
            <>
              <h3>Location Permission Required</h3>
              <p>
                Enable location access to view your garbage map.
              </p>
            </>
            :
            <h3>
              Finding your location...
            </h3>
          }

        </div>

      </section>
    );

  }



  return (

    <section className="gmap-section">


      <div className="gmap__title">

        <h2>
          Community Garbage Map
        </h2>

        <p>
          Report garbage issues and help keep your city clean.
        </p>

      </div>



      <div className="gmap__card">


        <MapContainer

          center={position}
          zoom={16}
          scrollWheelZoom
          attributionControl={false}
          className="gmap__map"

        >


          <TileLayer

            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

          />



          <RecenterOnLocate position={position}/>



          <ClickToReport 
            onAdd={handleAddReport}
          />



          <Circle

            center={position}

            radius={400}

            pathOptions={{
              color:'#2563eb',
              weight:3,
              fillColor:'#60a5fa',
              fillOpacity:0.2
            }}

          />



          <Marker

            position={position}

            icon={youAreHereIcon()}

          >

            <Tooltip
              permanent
              direction="top"
              offset={[0,-10]}
            >

              You are here

            </Tooltip>


          </Marker>



          {
            reports.map((r)=>(

              <Marker

                key={r.id}

                position={r.pos}

                icon={
                  pinIcon(
                    r.icon,
                    r.tone
                  )
                }

              >

                <Popup>

                  <strong>
                    {r.title}
                  </strong>

                  <br/>

                  Status: {r.status}

                </Popup>


              </Marker>

            ))
          }



        </MapContainer>



        <p className="gmap__hint">

          Click anywhere on map to report garbage.

        </p>



      </div>


    </section>

  );

}