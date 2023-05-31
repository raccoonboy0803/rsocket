import React, { useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { nickNameAtom } from './atoms';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [recoilNickname, setRecoilNickname] = useRecoilState(nickNameAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted:', { username, password });

    try {
      const response = await axios.post('http://localhost:8080/members/login', {
        userId: username,
        password: password,
      });
      console.log(response, '나는 응답!');
      // 로그인 성공 시 처리
      const Access_Token = response.headers['access_token'];
      setRecoilNickname(response.data.nickname); // 키 확인해야함
      if (Access_Token) {
        const cookies = new Cookies();
        cookies.set('Access_Token', Access_Token.substring(7), { path: '/' });
        navigate('/'); // 홈 페이지로 리디렉션
        console.log('로그인 성공! o(〃＾▽＾〃)o');
      } else {
        console.log('Access_Token 없음 (ノへ￣、)');
      }
    } catch (error) {
      console.error('Login error:', error);
      // 로그인 실패 시 처리
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Login</button>
          <button type="button" onClick={() => navigate('/signup')}>
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
