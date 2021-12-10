import React, { useContext } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import { UsersContext } from "./UsersContext";
import styled from "styled-components";

const LocateMe = ({ panTo }) => {
  const { error, setError } = useContext(CurrentUserContext);
  const {
    currentLatitude,
    currentLongitude,
    setCurrentLatitude,
    setCurrentLongitude,
  } = useContext(UsersContext);

  const handleLocationSet = () => {
    if (!navigator.geolocation) {
      setError("Sorry, Geolocation is not supposed by your browser.");
    } else {
      navigator.geolocation.getCurrentPosition(success, err);
    }
  };

  //callback function for geolocation API
  const success = (position) => {
    console.log(typeof position.coords.longitude, "TYPEOF");
    setCurrentLatitude(position.coords.latitude);
    setCurrentLongitude(position.coords.longitude);
    panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
  };

  //callback function for geolocation API
  const err = () => {
    setError("An error occured. Please try again!");
  };

  console.log(currentLatitude, currentLongitude);

  return (
    <div>
      <button onClick={handleLocationSet}>locate users in your area</button>
      {error !== "" && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default LocateMe;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  width: 300px;
  text-align: center;
  margin-top: 2px;
`;