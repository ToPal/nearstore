var map;

function createMap() {
    ymaps.ready(init);
}

var getCoordinates = function () { };

function init () {
    console.log('init');
    map = new ymaps.Map('map', {
            center: [59.946334, 30.33494],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });
    var
        markerElement = jQuery('#marker'),
        dragger = new ymaps.util.Dragger({
            // Драггер будет автоматически запускаться при нажатии на элемент 'marker'.
            autoStartElement: markerElement[0]
        }),
        // Смещение маркера относительно курсора.
        markerOffset,
        markerPosition;

    dragger.events
        .add('start', onDraggerStart)
        .add('move', onDraggerMove)
        .add('stop', onDraggerEnd);

    function onDraggerStart(event) {
        var offset = markerElement.offset(),
            position = event.get('position');
        // Сохраняем смещение маркера относительно точки начала драга.
        markerOffset = [
            position[0] - offset.left,
            position[1] - offset.top
        ];
        markerPosition = [
            position[0] - markerOffset[0],
            position[1] - markerOffset[1]
        ];

        applyMarkerPosition();
    }

    function onDraggerMove(event) {
        applyDelta(event);
    }

    getCoordinates = function() {
        // Переводим координаты страницы в глобальные пиксельные координаты.
        var markerGlobalPosition = map.converter.pageToGlobal(markerPosition),
            // Получаем центр карты в глобальных пиксельных координатах.
            mapGlobalPixelCenter = map.getGlobalPixelCenter(),
            // Получением размер контейнера карты на странице.
            mapContainerSize = map.container.getSize(),
            mapContainerHalfSize = [mapContainerSize[0] / 2, mapContainerSize[1] / 2],
            // Вычисляем границы карты в глобальных пиксельных координатах.
            mapGlobalPixelBounds = [
                [mapGlobalPixelCenter[0] - mapContainerHalfSize[0], mapGlobalPixelCenter[1] - mapContainerHalfSize[1]],
                [mapGlobalPixelCenter[0] + mapContainerHalfSize[0], mapGlobalPixelCenter[1] + mapContainerHalfSize[1]]
            ];
        // Проверяем, что завершение работы драггера произошло в видимой области карты.
        if (containsPoint(mapGlobalPixelBounds, markerGlobalPosition)) {
            // Теперь переводим глобальные пиксельные координаты в геокоординаты с учетом текущего уровня масштабирования карты.
            var geoPosition = map.options.get('projection').fromGlobalPixels(markerGlobalPosition, map.getZoom());
            if (!geoPosition || geoPosition.length!=2) return;
            return {long: geoPosition[1], lat: geoPosition[0]};
        }
    };

    function onDraggerEnd(event) {
        applyDelta(event);
        markerPosition[0] += markerOffset[0];
        markerPosition[1] += markerOffset[1];
        // Переводим координаты страницы в глобальные пиксельные координаты.
        var markerGlobalPosition = map.converter.pageToGlobal(markerPosition),
            // Получаем центр карты в глобальных пиксельных координатах.
            mapGlobalPixelCenter = map.getGlobalPixelCenter(),
            // Получением размер контейнера карты на странице.
            mapContainerSize = map.container.getSize(),
            mapContainerHalfSize = [mapContainerSize[0] / 2, mapContainerSize[1] / 2],
            // Вычисляем границы карты в глобальных пиксельных координатах.
            mapGlobalPixelBounds = [
                [mapGlobalPixelCenter[0] - mapContainerHalfSize[0], mapGlobalPixelCenter[1] - mapContainerHalfSize[1]],
                [mapGlobalPixelCenter[0] + mapContainerHalfSize[0], mapGlobalPixelCenter[1] + mapContainerHalfSize[1]]
            ];
        // Проверяем, что завершение работы драггера произошло в видимой области карты.
        if (containsPoint(mapGlobalPixelBounds, markerGlobalPosition)) {
            // Теперь переводим глобальные пиксельные координаты в геокоординаты с учетом текущего уровня масштабирования карты.
            var geoPosition = map.options.get('projection').fromGlobalPixels(markerGlobalPosition, map.getZoom());
        }
    }

    function applyDelta (event) {
        // Поле 'delta' содержит разницу между положениями текущего и предыдущего события драггера.
        var delta = event.get('delta');
        markerPosition[0] += delta[0];
        markerPosition[1] += delta[1];
        applyMarkerPosition();
    }

    function applyMarkerPosition () {
        markerElement.css({
            left: markerPosition[0],
            top: markerPosition[1]
        });
    }

    function containsPoint (bounds, point) {
        return point[0] >= bounds[0][0] && point[0] <= bounds[1][0] &&
            point[1] >= bounds[0][1] && point[1] <= bounds[1][1];
    }
}