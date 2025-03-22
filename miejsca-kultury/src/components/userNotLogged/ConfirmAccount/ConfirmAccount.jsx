import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';

const ConfirmAccount = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const buttonRef = useRef(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    setToken(token ? decodeURIComponent(token.replace(/ /g, '+')) : '');
    setUserId(userId);

    const animation = gsap.to(buttonRef.current, {
      scale: 1.2,
      duration: 0.5,
      yoyo: true,
      onComplete: () => {
        gsap.to(buttonRef.current, { scale: 1, duration: 0.5 });
      }
    });

    return () => {
      animation.kill();
    };
  }, [searchParams]);

  const handleSubmit = async () => {
    setMessage('');

    const dataToSend = {
      token: token,
      userId: userId,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/confirm-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setMessage("Pomyślnie potwierdzono maila.");
      } else {
        setMessage("Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch (error) {
      setMessage("Wystąpił błąd. Spróbuj ponownie.");
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>
        <button ref={buttonRef} type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={handleSubmit}>Potwierdź maila</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ConfirmAccount;