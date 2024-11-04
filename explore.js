function initMap() {
    const container = document.getElementById('map');
    const options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 좌표
        level: 5 
    };

    const map = new kakao.maps.Map(container, options);
    const places = new kakao.maps.services.Places();

   
    places.keywordSearch('세차장', (result, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
            displayCarWashMarkers(result, map);
            updateRecommendedList(result);
        } else {
            console.error('세차장 검색에 실패했습니다.');
        }
    }, {
        location: map.getCenter(),
        radius: 5000 // 500km 반경
    });

    function displayCarWashMarkers(carWashList, map) {
        let activeInfoWindow = null;

        carWashList.forEach(carWash => {
            const markerPosition = new kakao.maps.LatLng(carWash.y, carWash.x);
            const marker = new kakao.maps.Marker({
                position: markerPosition,
                map: map,
                clickable: true
            });

            const infoContent = `
                <div style="padding:10px; font-size:14px;">
                    <strong style="font-size:16px; color:#333;">${carWash.place_name}</strong><br/>
                    <span style="color:#666;">위치: ${carWash.road_address_name || carWash.address_name}</span>
                </div>`;
            const infowindow = new kakao.maps.InfoWindow({ content: infoContent });

            kakao.maps.event.addListener(marker, 'click', function () {
                if (activeInfoWindow) {
                    activeInfoWindow.close();
                }
                infowindow.open(map, marker);
                activeInfoWindow = infowindow;
            });

            kakao.maps.event.addListener(map, 'click', function () {
                if (activeInfoWindow) {
                    activeInfoWindow.close();
                    activeInfoWindow = null;
                }
            });
        });
    }

    function updateRecommendedList(carWashList) {
        const recommendedList = document.getElementById("recommended-list");
        recommendedList.innerHTML = '';
        carWashList.forEach(carWash => {
            const carWashCard = document.createElement("div");
            carWashCard.classList.add("recommend-item");
            carWashCard.innerHTML = `
                <div class="item-info">
                    <h3>${carWash.place_name}</h3>
                    <p>위치: ${carWash.road_address_name || carWash.address_name}</p>
                </div>
                <button class="reserve-button">예약 정보</button>
            `;
            recommendedList.appendChild(carWashCard);
        });
    }
}

document.addEventListener("DOMContentLoaded", initMap);
