import "../css/Chat.css";
import * as React from 'react';
import { useState } from "react";
import axios from "../../etc/utils/apis";
import dayjs from "dayjs";
import Departure from "../components/Departure.js";
import Notice from "./Notice.js";

function Chat(props) {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const promieTime = dayjs(date).format("YYYYMMDD") + dayjs(time).format('HHmm'); //약속시간
    const [address, setAddress] = useState('');
    const [course, setCourse] = useState();
    
    const sendAddress = async () => {
        if(address){
            try{
                const response = await axios
                .post("http://localhost:8080/restaurant/search/totalPath",
                {
                    departure: address,
                    destination: "경북 구미시 상림로 67",
                    //경북 구미시 산호대로29길 14-16, 경북 구미시 상림로 67
                    searchDttm: promieTime
                });

                console.log("response 파일", response);
                setCourse(response.data);
                sessionStorage.setItem('courseData', JSON.stringify({course})); //경로데이터 로컬스토리지에 저장
                console.log("경로 데이터 파일",course);
                onPopup();

            } catch (err){
                console.log({error: err});
            }
        } else{
            alert("주소를 입력해주세요");
        }

    };

    const onPopup = () => {
        const url = 'restaurant/course';
        window.open(url, "_blank", "noopener, noreferrrer");
    }

    return (
        <div className="ChatSession">
            {/* <div className="chat-header">
                <img src={process.env.PUBLIC_URL + '/img/attention_red.png'}
                    className="chat-notice" alt='notice'/>
                <div className="chat-name">그룹1</div>
                <img src={process.env.PUBLIC_URL + '/img/users-group.png'}
                    className="chat-group" alt='member'/>
            </div> */}

            <div className="chat-area">
                
                {/* 출발지 설정 */}
                {/* <Departure address={address} setAddress={setAddress}/> */}

                {/* 공지 */}
                {/* <Notice/> */}

                {/* 임시 */}
                {/* <button className="course-btn" onClick={sendAddress}>경로조회</button> */}
                
            </div>
        </div>
    );
}

export default Chat;