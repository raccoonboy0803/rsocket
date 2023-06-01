import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { nickNameAtom, chattingIdAtom } from './atoms';
import ukeun from './assets/ukeun.png'; //썸네일3
import { useRecoilState, useRecoilValue } from 'recoil';
import ChatComponent from './ChatComponent';

const ChattingList = () => {
  const navigate = useNavigate();
  // const [recoilId, setRecoilId] = useRecoilState(chattingIdAtom);
  const nicknameAtom = useRecoilValue(nickNameAtom);
  const [chattingAddress, setChattingAddress] = useState(null);
  // const [isaddressCheck, setIsaddressCheck] = useState(false);

  const getListData = async () => {
    const response = await axios.get('http://localhost:8080/broadcasts');
    return response;
  };
  const idArr = [];
  const { data, isLoading } = useQuery('getListData', getListData);

  useEffect(() => {
    !isLoading &&
      data?.data.map((item) => {
        idArr.push(item.channelId);
      });
  }, [data, isLoading]);

  // !isLoading &&
  //   data?.data.map((item) => {
  //     idArr.push(item.channelId);
  //   });

  const intoChatting = async (e) => {
    const channelId = e.target.id;
    const response = await axios.get(
      `http://localhost:8080/broadcasts/${channelId}`
    );
    setChattingAddress(response.data.chattingAddress);
    // setRecoilId(response.data.chattingAddress);
    navigate('/chat');
  };

  return (
    <ChattingContainerDiv>
      {!isLoading &&
        idArr.map((item) => {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '30px',
              }}
            >
              <ChattingCardDiv key={item} id={item} onClick={intoChatting}>
                {chattingAddress !== null && (
                  <div style={{ display: 'none' }}>
                    <ChatComponent
                      chatRoomId={item}
                      nickname={nicknameAtom}
                      chattingAddress={chattingAddress}
                    />
                  </div>
                )}
              </ChattingCardDiv>
              <ChattingIdcheck>{item}</ChattingIdcheck>
            </div>
          );
        })}
    </ChattingContainerDiv>
  );
};

export default ChattingList;

const ChattingContainerDiv = styled.div`
  width: 1200px;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
`;
const ChattingCardDiv = styled.div`
  background-image: url(${ukeun}); //썸네일
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 200px;
  height: 200px;
  margin: 20px;
`;
const ChattingIdcheck = styled.p`
  background-color: white;
  margin: 0;
`;
