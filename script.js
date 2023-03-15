// getting places from APIs
function loadPlaces(position) {
  const params = {
    radius: 300, // search places not farther than this value (in meters)
    clientId: "V5DQXUWBOOBLFI51T1MQE1YS20SVN2TMXJHCQXWSUVNMIYL5",
    clientSecret: "AROLHKNV2HGOJ4SRH5TTHXBLTM0VQVVHTTDJXJB31YUGS5VL",
    version: "20300101", // foursquare versioning, required but unuseful for this demo
  };

  // CORS Proxy to avoid CORS problems
  const corsProxy = "https://cors-anywhere.herokuapp.com/";

  // Foursquare API (limit param: number of maximum places to fetch)
  const endpoint = `https://api.foursquare.com/v3/places/nearby?ll=${position.latitude}%2C${position.longitude}&limit=5`;

  return fetch(endpoint, {
    headers: {
      Authorization: "fsq3l5u9HnRW1irR3fry1Bgx66K88F3DftGcXf19Bf/t3jQ=",
      Accept: "application/json",
    },
  })
    .then((res) => {
      return res.json().then((resp) => {
        console.log(resp.response);
        return resp.response.results;
      });
    })
    .catch((err) => {
      console.error("Error with places API", err);
    });
}

window.onload = () => {
  const scene = document.querySelector("a-scene");

  // first get current user location
  return navigator.geolocation.getCurrentPosition(
    function (position) {
      // than use it to load from remote APIs some places nearby
      loadPlaces(position.coords).then((places) => {
        places.forEach((place) => {
          const latitude = place.geocodes.main.lat;
          const longitude = place.geocodes.main.lng;

          // add place name
          const placeText = document.createElement("a-link");
          placeText.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude};`
          );
          placeText.setAttribute("title", place.name);
          placeText.setAttribute("scale", "15 15 15");

          placeText.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          scene.appendChild(placeText);
        });
      });
    },
    (err) => console.error("Error in retrieving position", err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 27000,
    }
  );
};
