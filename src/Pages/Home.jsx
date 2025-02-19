import AuthorizeView from "../Common/AuthorizeView";
import WeatherForecast from "../Common/WeatherForecast.jsx";

function Home() {
  return (
    <AuthorizeView>
      <WeatherForecast />
    </AuthorizeView>
  );
}

export default Home;
