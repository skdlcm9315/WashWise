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
            updateRecommendedList(result, map);
        } else {
            console.error('세차장 검색에 실패했습니다.');
        }
    }, {
        location: map.getCenter(),
        radius: 5000 
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

            
            const carWashInfo = `
                <div class="info-window">
                    <strong class="info-title">${carWash.place_name}</strong><br/>
                    <span class="info-address">주소: ${carWash.road_address_name || carWash.address_name}</span><br/>
                    <span class="info-phone">전화번호: ${carWash.phone || '없음'}</span><br/>
                    <span class="info-category">카테고리: ${carWash.category_name || '정보 없음'}</span><br/>
                </div>`;
            const infowindow = new kakao.maps.InfoWindow({ content: carWashInfo });

            
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

    function updateRecommendedList(carWashList, map) {
        const recommendedList = document.getElementById("recommended-list");
        recommendedList.innerHTML = '';
        carWashList.forEach((carWash, index) => {
            const carWashCard = document.createElement("div");
            carWashCard.classList.add("recommend-item");
            carWashCard.innerHTML = `
                <div class="item-info">
                    <h3 class="item-title">${carWash.place_name}</h3>
                    <p class="item-address">${carWash.road_address_name || carWash.address_name}</p>
                    <p class="item-phone">전화번호: ${carWash.phone || '없음'}</p>
                </div>
                <button class="reserve-button">자세히 보기</button>
            `;

            
            carWashCard.addEventListener('click', () => {
                const markerPosition = new kakao.maps.LatLng(carWash.y, carWash.x);
                map.setCenter(markerPosition);
                const infoContent = `
                    <div class="info-window">
                        <strong class="info-title">${carWash.place_name}</strong><br/>
                        <span class="info-address">주소: ${carWash.road_address_name || carWash.address_name}</span><br/>
                        <span class="info-phone">전화번호: ${carWash.phone || '없음'}</span><br/>
                        <span class="info-category">카테고리: ${carWash.category_name || '정보 없음'}</span><br/>
                    </div>`;
                const infowindow = new kakao.maps.InfoWindow({ content: infoContent });

                if (activeInfoWindow) {
                    activeInfoWindow.close();
                }
                infowindow.open(map, new kakao.maps.Marker({ position: markerPosition }));
                activeInfoWindow = infowindow;
            });

            recommendedList.appendChild(carWashCard);
        });
    }
}

document.addEventListener("DOMContentLoaded", initMap);
