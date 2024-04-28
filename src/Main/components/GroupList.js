import React, { useEffect, useState } from "react";
import '../css/GroupList.css';
import axios from "axios";

//임시데이터
const Friends = [
    {
        name: "이소림"
    },
    {
        name: "이준현"
    },
    {
        name: "이지현"
    },
    {
        name: "임수연"
    },
    {
        name: "이민형"
    },
    {
        name: "이우석"
    },
    {
        name: "유기상"
    },
    {
        name: "오재현"
    }
];



function GroupList() {

    //나의 친구 데이터 통신
    const [myFriends, setMyFriends] = useState([]);

    const getMyFriends = async () => {
        try{
            const respone = await axios
            .get("http://localhost:8080/chat/friend-list");
            setMyFriends(respone.data);
        } catch(err){
            console.log({error: err});
        }
    };

    useEffect(() => {
        getMyFriends();
    }, []);


    const FriendsList = Friends.map(data => {
        return(
            <div className="friends-list">
                <img src={process.env.PUBLIC_URL + '/img/account.png'}
                    className="friends-profile" alt='profile'/>    
                <div className="friends-name">{data.name}</div>
                <img src={process.env.PUBLIC_URL + '/img/invitation.png'}
                    className="friends-invite" alt='profile'/>    
            </div>
        );
    })
    
    return ( 
        <div className="GroupList">
            <div className="FriendsList-title">
                친구목록
            </div>
            <div className="Friends-search">
                <input
                type="serach"
                className="freinds-serach-bar"/>
                <img src={process.env.PUBLIC_URL + '/img/yellow_search.png'}
                        className="search_icon"
                        alt='search'/>
            </div>
            <div className="FriendsList-body">{FriendsList}</div>
            <div className="Group">
                <img src={process.env.PUBLIC_URL + '/img/users-group.png'}
                    className="make-group"
                    alt='group'
                />
                <div className="group-text">그룹만들기</div>
            </div>
            
        </div>
    );
}

export default GroupList;