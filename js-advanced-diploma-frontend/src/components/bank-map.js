import ymaps from 'ymaps';

export async function createMap(containerClass, bankCoords, parent) {
  const maps = await ymaps.load('https://api-maps.yandex.ru/2.1/?lang=ru_RU');
  const mapContainer = document.createElement('div');
  mapContainer.classList.add(containerClass);
  parent.appendChild(mapContainer);
  const myMap = new maps.Map(mapContainer, {
    center: [53.73333067427256, 58.54006175000002],
    zoom: 5,
  });

  bankCoords.forEach((element) => {
    const myPlacemark = new maps.Placemark([element.lat, element.lon], {
      hintContent: 'Coin',
    });

    myMap.geoObjects.add(myPlacemark);
  });
}
