import React, { useContext, useState } from 'react';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import logo from '../Assests/logo1.gif';
import 'aos/dist/aos.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

const SignIn = ({ handleSignupForm }) => {
  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [invalidLoginFocused, setInvalidLoginFocused] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [visibleFocused, setVisibleFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [signInCredentials, setSignInCredentials] = useState({
    username: null,
    email: null,
    password: null,
  });
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);

  const PostData = () => {
    fetch(`${process.env.REACT_APP_API_URI}/admin-signin`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signInCredentials.email,
        password: signInCredentials.password,
      }),
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        if (result.status === 'success') {
          console.log('signed in successfully');
          localStorage.setItem('user', JSON.stringify(result.data.user));
          dispatch({ type: 'USER', payload: result.data.user });
          navigate('/Home');
        } else {
          setLoginError(result.error.message);
          setInvalidLoginFocused(true);
        }
      })
      .catch(err => console.log(err));
  };

  const handleSignup = () => {
    if (userInput === '' || password === '') {
      setLoginError('Please add all the fields.');
      setInvalidLoginFocused(true);
    } else if (
      signInCredentials.username === 'invalid' ||
      signInCredentials.email === 'invalid'
    ) {
      setLoginError('Invalid user credentials.');
      setInvalidLoginFocused(true);
    } else {
      PostData();
    }
  };

  const onChangeUserInput = userInput => {
    setUserInput(userInput);
    if (userInput !== '') {
      if (
        // eslint-disable-next-line
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/.test(
          userInput
        )
      ) {
        setSignInCredentials({
          ...signInCredentials,
          email: userInput,
          username: false,
        });
      } else if (/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/.test(userInput)) {
        setSignInCredentials({
          ...signInCredentials,
          username: userInput,
          email: false,
        });
      } else {
        setSignInCredentials({
          ...signInCredentials,
          username: 'invalid',
          email: 'invalid',
        });
      }
    }
  };

  const onChangePassword = password => {
    setPassword(password);
    setSignInCredentials({ ...signInCredentials, password });
  };

  // password visiblity
  const handleVisible = () => {
    setVisible(false);
  };
  const handleVisible2 = () => {
    setVisible(true);
  };
  let visibility;
  if (visible === false) {
    visibility = <VisibilityIcon onClick={handleVisible2} />;
  } else {
    visibility = <VisibilityOffIcon onClick={handleVisible} />;
  }

  let invalidLogin = <div className='unique'>{loginError}</div>;
  return (
    <div className='main-div'>
      <div className='main-div-1'>
        <div className='navbar'></div>
        <div className='Brand-Name'>
          E-com
          <span className='Brand-Name-Span'>
            <span className='Brand-Name-Span-Line'></span> Admin Portal
          </span>
        </div>
      </div>
      <div className='main-div-2'>
        <div className='loginbox'>
          <div className='loginhead'>
            <span className='sub-brand'>Log-In</span>
          </div>
          <div className='username'>
            <label htmlFor='username-signin'>
              <PersonOutlineIcon />
            </label>
            <input
              type='text'
              className='username-input'
              placeholder='email or username'
              id='username-signin'
              onChange={e => onChangeUserInput(e.target.value)}
              value={userInput}
            />
          </div>
          <div className='username' onFocus={() => setVisibleFocused(true)}>
            <label htmlFor='password-signin'>
              <LockOpenOutlinedIcon />
            </label>
            <input
              type={visible ? 'text' : 'password'}
              className='username-input'
              placeholder='password'
              id='password-signin'
              onChange={e => onChangePassword(e.target.value)}
              value={password}
            />
            {visibleFocused && visibility}
          </div>

          <div className='loginbutton' onClick={handleSignup}>
            Admin Log-in
          </div>

          {invalidLoginFocused && invalidLogin}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
