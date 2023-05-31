import React, { useEffect, useState } from 'react';
import {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer,
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';

const ChatComponent = ({ chatRoomId, nickname }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState(null);

  console.log('chatRoomId::::::', chatRoomId);

  useEffect(() => {
    const client = new RSocketClient({
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer,
      },
      transport: new RSocketWebSocketClient({
        url: 'ws://localhost:6565/rs', // 고정 URL , 주소 확인
      }),
    });

    const setupPayload = {
      data: '',
      metadata: Buffer.from(`CHATROOM:${chatRoomId}:${nickname}`),
      //메타데이터 형식
    };

    client.connect().subscribe({
      onComplete: (socket) => {
        setSocket(socket);

        socket.requestStream(setupPayload).subscribe({
          // 서버로부터 메세지를 받는 로직
          onNext: (payload) => {
            const message = payload.data;
            setMessages((prevMessages) => [...prevMessages, message]);
          },
          onError: (error) => {
            console.error('Error receiving chat message:', error);
          },
        });
      },
      onError: (error) => {
        console.error('Failed to connect to RSocket server:', error);
      },
    });

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [chatRoomId, nickname]);

  const sendMessage = () => {
    const message = inputValue.trim();
    if (message) {
      setMessages((prevMessages) => [...prevMessages, message]);
      setInputValue('');

      if (socket) {
        const metadata = Buffer.from(`CHATROOM:${chatRoomId}:${nickname}`);
        //메타데이터 형식 CHATROOM:${chatRoomId}:${nickname} -> : 으로 구분
        //백엔드 서버의 메타데이터 수용 형식에 맞게끔 변경 가능
        //프론트,백엔드 형식 통일 필요
        //메타데이터는 RSocket 서버에서 해당 클라이언트를 구분하거나 필요한 추가 정보를 전달하기 위해 사용됨
        socket.fireAndForget({
          // 서버로 메세지 내용 전송하는 로직
          data: message,
          metadata: metadata,
        });
      }
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {nickname} : {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatComponent;
