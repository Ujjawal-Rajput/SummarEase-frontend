import React, { useState } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { authState } from '../Store/State';
import { useNavigate } from 'react-router-dom';
import "../Auth.css"

const Login = () => {
    const setAuth = useSetRecoilState(authState);
    const auth = useRecoilValue(authState);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log(auth)
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) setError(data.message);
        if (data.token) {
            setAuth({ user: data.user, token: data.token });
            console.log(data)
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <h2>Login</h2><br />
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                </div>
                <div>
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>

            </form>
            <p>
                Don't have an account? <a onClick={()=>navigate('/signup')}>Sign up</a>
            </p>
        </div>
    );
};

export default Login;
