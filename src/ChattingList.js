import React, { useEffect } from 'react';
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
  // const [visible, setVisible] = useState(false);
  const [recoilId, setRecoilId] = useRecoilState(chattingIdAtom);
  const nicknameAtom = useRecoilValue(nickNameAtom);

  const getListData = async () => {
    const response = await axios.get('');
    return response;
  };
  const idArr = [];
  const { data, isLoading } = useQuery('getListData', getListData);

  useEffect(() => {
    !isLoading && data?.data.map((item) => idArr.push(item.channelId));
  }, [data, isLoading]);

  const intoChatting = async (e) => {
    const chattingId = e.target.id;
    setRecoilId(chattingId);
    await axios.post('', { chattingId });
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
                <ChatComponent chatRoomId={recoilId} nickname={nicknameAtom} />
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
