import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    setToken(token ? decodeURIComponent(token.replace(/ /g, '+')) : '');
    setUserId(userId);
  }, [searchParams]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(formRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1 })
      .to(formRef.current, { scale: 1.02, duration: 0.5, yoyo: true, repeat: 1 })
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Hasła nie są zgodne.');
      return;
    }

    const dataToSend = {
      token: token,
      userId: userId,
      password: password,
      confirmedPassword: confirmPassword
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setMessage("Hasło zostało zmienione.");
      } else {
        setMessage("Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch (error) {
      setMessage("Wystąpił błąd. Spróbuj ponownie.");
    }
  }

  const handleInvalid = (event) => {
    event.target.setCustomValidity('Proszę wprowadzić poprawne hasło.');
  };

  const handleInput = (event) => {
    event.target.setCustomValidity('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>Zmiana hasła</h2>
        <label htmlFor="password">Nowe hasło:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onInvalid={handleInvalid}
          onInput={handleInput}
          required
          style={{ padding: '10px', marginBottom: '10px' }}
          placeholder="Wprowadź nowe hasło"
        />
        <label htmlFor="confirmPassword">Powtórz hasło:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onInvalid={handleInvalid}
          onInput={handleInput}
          required
          style={{ padding: '10px', marginBottom: '10px' }}
          placeholder="Powtórz nowe hasło"
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Zmień hasło
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
