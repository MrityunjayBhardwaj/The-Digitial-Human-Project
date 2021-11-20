import React, { useState } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";

// HyperParams
const defaultMapZoom = 15;

/**
  given nearby therapist loc info, this function returns a custom google maps react component.
  @param {Object} list of therapist's info.
  @param {string} some filler text that comes before displaying the map.
  @returns {} react component which display google maps
*/
function customMapComponenet(
  therapist_info_list,
  formalReplyText = "There you go..."
) {
  const coords = {
    lat: +therapist_info_list[2].location.lat,
    lng: +therapist_info_list[2].location.lng,
  };

  console.log("therapist info list: ", therapist_info_list);

  const [selectedTherapist, setSelectedTherapist] = useState(null);

  const Map = () => (
    <GoogleMap
      defaultZoom={defaultMapZoom}
      defaultCenter={{ lat: +coords.lat, lng: +coords.lng }}
    >
      {therapist_info_list.map((therapist, id) => (
        <Marker
          key={id}
          position={{
            lat: +therapist.location.lat,
            lng: +therapist.location.lng,
          }}
          onClick={() => {
            setSelectedTherapist(therapist);
          }}
        />
      ))}

      {selectedTherapist && (
        <InfoWindow
          style={{ color: "black;" }}
          position={{
            lat: +selectedTherapist.location.lat,
            lng: +selectedTherapist.location.lng,
          }}
          onCloseClick={() => {
            setSelectedTherapist(null);
          }}
        >
          <div>
            <h2>{selectedTherapist.name}</h2>
            <p>{selectedTherapist.summary}</p>
            <p>
              <a href={selectedTherapist.link}>Learn More</a>
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
  const MapComponent = withScriptjs(withGoogleMap(Map));
  return (
    <div>
      <span>{formalReplyText}</span>
      <div style={{ width: "300px", height: "200px", margin: "5px" }}>
        <MapComponent
          // googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`}
          // googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCD8V-gtKOowTqqelgIxrnS7Sz7S8om1ZM`}
          loadingElement={<div style={{ height: "100%" }} />}
          containerElement={<div style={{ height: "100%" }} />}
          mapElement={
            <div style={{ height: "100%", "border-radius": "5px" }} />
          }
        ></MapComponent>
      </div>
    </div>
  );
}

export default customMapComponenet;
