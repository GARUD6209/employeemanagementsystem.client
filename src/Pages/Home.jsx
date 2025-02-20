import React from "react";
import AuthorizeView from "../components/common/AuthorizeView";
import WeatherForecast from "../components/common/WeatherForecast";

function Home() {
  return (
    <AuthorizeView>
      <WeatherForecast />
    </AuthorizeView>
  );
}

export default Home;
