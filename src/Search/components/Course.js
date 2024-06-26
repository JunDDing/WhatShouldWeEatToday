import React, {useEffect, useState} from "react";
import "../css/Course.css";

const { Tmapv2  } = window;

function Course(){
	const [courseData, setCourseData] = useState(null);
	const [totalDistance, setTotalDistance] = useState();
	const [totalTime, setTotalTime] = useState();
	const [steps, setSteps] = useState();
	const [restaurantName, setRestaurantName] = useState('');

     // 로컬 스토리지에서 데이터 가져오기
	 useEffect(() => {
        const storedCourseData = localStorage.getItem('courseData');
        if (storedCourseData) {
            const parsedData = JSON.parse(storedCourseData);
            console.log("parsedData", parsedData);
            setCourseData(parsedData);
        }

        // URL의 쿼리 파라미터에서 restaurantName 값을 읽어옵니다.
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('restaurantName');
        if (name) {
            setRestaurantName(decodeURIComponent(name));
        }
    }, []);

    // courseData 변경 시 로그 찍기
    useEffect(() => {
        if (courseData) {
            console.log("courseData가 업데이트되었습니다:", courseData);
        }
    }, [courseData]);

    useEffect(() => {
        if (courseData) {
            if ('features' in courseData) {
                console.log("받은 도보 데이터", courseData);
                setTotalDistance(parseFloat((courseData.features[0].properties.totalDistance / 1000).toFixed(1)));
                setTotalTime(Math.round(courseData.features[0].properties.totalTime / 60));
                onlyWalkmap();
            } else if ('plan' in courseData.metaData) {
                console.log(courseData.metaData);
                console.log("데이터: ", courseData.metaData.plan);
                console.log("bus: ", courseData.metaData.plan.itineraries[0].legs[1].passShape);
                console.log(" 스텝: ", courseData.metaData.plan.itineraries[0].legs[0].steps);
                setSteps(courseData.metaData.plan.itineraries[0].legs[1].steps);
                setTotalDistance(parseFloat((courseData.metaData.plan.itineraries[0].totalDistance / 1000).toFixed(1)));
                setTotalTime(Math.round(courseData.metaData.plan.itineraries[0].totalTime / 60));
                initTmap();
            }
        }
    }, [courseData, steps]);

	var map;
	var marker_s, marker_e, marker_p;
	var drawInfoArr = [];
	var resultdrawArr = [];
		
	function onlyWalkmap() {
		const mapDiv = document.getElementById('map_div');

		/* 도보 데이터 예시 출발지 : 경북 구미시 상림로 81-1 */
		// 1. 지도 띄우기
		if(!mapDiv.firstChild){
			map = new Tmapv2.Map("map_div", {
				center : new Tmapv2.LatLng(courseData.features[0].geometry.coordinates[1], courseData.features[0].geometry.coordinates[0]),
				width : "50%",
				height : "400px",
				zoom : 17,
				zoomControl : true,
				scrollwheel : true
			});
		}

		// 2. 시작, 도착 심볼찍기
		marker_s = new Tmapv2.Marker(
			{
				position : new Tmapv2.LatLng(courseData.features[0].geometry.coordinates[1], courseData.features[0].geometry.coordinates[0]),
				icon : "https://tmapapi.tmapmobility.com/upload/tmap/marker/pin_r_b_s.png",
				iconSize : new Tmapv2.Size(24, 38),
				map : map
			});

		marker_e = new Tmapv2.Marker(
			{
				position : new Tmapv2.LatLng(courseData.features[courseData.features.length - 1].geometry.coordinates[1], courseData.features[courseData.features.length - 1].geometry.coordinates[0]),
				icon : "https://tmapapi.tmapmobility.com/upload/tmap/marker/pin_b_m_e.png",
				iconSize : new Tmapv2.Size(24, 38),
				map : map
			});

		//기존 그려진 라인 & 마커가 있다면 초기화
		if (resultdrawArr.length > 0) {
			for ( var i in resultdrawArr) {
				resultdrawArr[i]
						.setMap(null);
			}
			resultdrawArr = [];
		}
		
		drawInfoArr = [];
		
		// 4. 경로그리기
		for (var i in courseData.features) {
			const coordinates = courseData.features[i].geometry.coordinates;
	
			// coordinates가 배열의 배열인지 확인
			if (Array.isArray(coordinates[0])) {
				for (var j in coordinates) {
					const [lon, lat] = coordinates[j];
					drawInfoArr.push(new Tmapv2.LatLng(lat, lon));
				}
			} else {
				const [lon, lat] = coordinates;
				drawInfoArr.push(new Tmapv2.LatLng(lat, lon));
			}
		}

		 
		const polyline = new Tmapv2.Polyline({
			path: drawInfoArr,
			strokeColor: "#4169E1",
			strokeWeight: 6,
			map: map
		});

		resultdrawArr.push(polyline);
	}


	/* 도보 + 버스 경로 데이터 */
	function initTmap() {
		let map;
		let marker_s, marker_e, marker_p;
		let drawInfoArr = [];
		let resultdrawArr = [];

    // 1. 지도 띄우기
    const mapDiv = document.getElementById('map_div');

    if (!mapDiv.firstChild) {
        map = new Tmapv2.Map("map_div", {
            center: new Tmapv2.LatLng(courseData.metaData.requestParameters.startY, courseData.metaData.requestParameters.startX),
            width: "50%",
            height: "400px",
            zoom: 17,
            zoomControl: true,
            scrollwheel: true
        });
    }

    // 2. 시작, 도착 심볼찍기
    marker_s = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(courseData.metaData.requestParameters.startY, courseData.metaData.requestParameters.startX),
        icon: "https://tmapapi.tmapmobility.com/upload/tmap/marker/pin_r_b_s.png",
        iconSize: new Tmapv2.Size(24, 38),
        map: map
    });

    marker_e = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(courseData.metaData.requestParameters.endY, courseData.metaData.requestParameters.endX),
        icon: "https://tmapapi.tmapmobility.com/upload/tmap/marker/pin_b_m_e.png",
        iconSize: new Tmapv2.Size(24, 38),
        map: map
    });

    // 3. 기존 그려진 라인 & 마커가 있다면 초기화
    if (resultdrawArr.length > 0) {
        for (let i in resultdrawArr) {
            resultdrawArr[i].setMap(null);
        }
        resultdrawArr = [];
    }

    // 4. 경로그리기
    courseData.metaData.plan.itineraries[0].legs.forEach(leg => {
        if (leg.mode === "WALK") {
            if (leg.steps) {  // steps가 정의되었는지 확인
                drawPath(leg.steps, "#4169E1");
            } else {
                console.error("steps가 정의되지 않았습니다.");
            }
        } else if (leg.mode === "BUS") {
            if (leg.passShape && leg.passShape.linestring) {  // passShape와 linestring이 정의되었는지 확인
                drawPath([leg.passShape], leg.passShape.routeColor);
            } else {
                console.error("passShape 또는 linestring이 정의되지 않았습니다.");
            }
        }
    });

    function drawPath(steps, color) {
        const drawInfoArr = [];
        steps.forEach(step => {
            if (step.linestring) {
                const lineString = step.linestring.split(' ');
                lineString.forEach(coord => {
                    const [lon, lat] = coord.split(',');
                    drawInfoArr.push(new Tmapv2.LatLng(parseFloat(lat), parseFloat(lon)));
					console.log("drawInfoArr", drawInfoArr);
                });
            } else {
                console.error("linestring이 정의되지 않았습니다.");
            }
        });

        const polyline = new Tmapv2.Polyline({
            path: drawInfoArr,
            strokeColor: color,
            strokeWeight: 6,
            map: map
        });

        resultdrawArr.push(polyline);
    }
}

    return(
        <div className="CourseSession">
			<div className="Course">
				<div className="course-menu">{restaurantName}</div>
				<div id="map_div"></div>
				<div className="totalTime-result">총 거리: {totalDistance}km, 총 시간: {totalTime}분</div>
			</div>
        </div>
    )
    
}

export default Course;