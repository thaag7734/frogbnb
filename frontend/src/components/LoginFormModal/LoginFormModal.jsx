import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal.jsx';
import './LoginForm.css';
import { useEffect } from 'react';
import ErrorSpan from '../ErrorSpan/ErrorSpan.jsx';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [loginEnabled, setLoginEnabled] = useState(false);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if (credential.length < 4 || password.length < 6) {
      setLoginEnabled(false);
    } else {
      setLoginEnabled(true);
    }
  }, [credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login(credential, password))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();

        const errors = Object.fromEntries(Object.entries(data.errors).map(([err, msg]) => {
          return [err, <ErrorSpan msg={msg} />];
        }));

        if (errors) setErrors(errors);
      });
  };

  const demoLogin = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login('larry.lilypad@frogmail.toad', 'password'))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  }

  return (
    <div className="login-modal modal-content">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            data-testid="credential-input"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            data-testid="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential}
        <button
          type="submit"
          data-testid="login-button"
          disabled={!loginEnabled}
        >Log In</button>
        <a href="#" onClick={demoLogin}>Demo User Login</a>
      </form>
    </div>
  );
}

export default LoginFormModal;
