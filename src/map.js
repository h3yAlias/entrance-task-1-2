import { loadList, loadDetails } from './api';
import { getDetailsContentLayout } from './details';
import { createFilterControl } from './filter';

function initMap(ymaps, containerId) {
  const myMap = new ymaps.Map(containerId, {
    center: [55.76, 37.64],
    controls: [],
    zoom: 10
  });

  var objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: 'default#pieChart',
    clusterDisableClickZoom: false,
    geoObjectOpenBalloonOnClick: true,
    geoObjectHideIconOnBalloonOpen: false,
    clusterIconPieChartStrokeWidth: 2,
    geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps)
  });
  loadList().then(data => {
    objectManager.add(data);
    myMap.geoObjects.add(objectManager);

  });


  // details
  objectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = objectManager.objects.getById(objectId);
    if (!obj.properties.details) {
      loadDetails(objectId).then(data => {
        console.log(data)
        obj.properties.details = data;
        //objectManager.objects.balloon.setData(obj);
        objectManager.objects.balloon.setData(obj);
        objectManager.objects.balloon.open(objectId);
      });
    } else {
      objectManager.objects.balloon.open(objectId);
      console.log(data);
    }
  });

  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add('filters', filters => {
    objectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective']
    );
  });
}
export { initMap, };
