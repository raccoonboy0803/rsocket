import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    userId: '',
    password: '',
  });
  const { userId, password } = inputValue;
  const inputChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const submitSignup = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8080/members/signup', inputValue);
    navigate('/login');
  };
  return (
    <div>
      <h1>SignUp</h1>
      <form onSubmit={submitSignup}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="userId"
            value={userId}
            onChange={inputChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={inputChange}
          />
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
