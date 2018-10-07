import { initMap } from "./map";

ymaps.ready(() => {
  console.log('preinit')
  initMap(ymaps, "map");
  console.log("inited");
});
