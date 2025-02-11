import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../Store/State';
import { useNavigate } from 'react-router-dom';
import "../Auth.css"

const Signup = () => {
    const [auth, setAuth] = useRecoilState(authState);
    const [details, setDetails] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.user) navigate('/');
    }, [])

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    // console.log(auth)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);   // Start loading
        setError(null);     // Clear any previous error

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details),
        });
        const data = await response.json();
        if (!response.ok) setError(data.message);
        if (data.token) {
            setAuth({ name: data.name, user: data.user, token: data.token });
            // console.log(data)
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2><br />
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <p style={{fontSize:'12px'}}>→ No email verification is required</p>
                <div><input name="name" type="name" placeholder="Name" onChange={handleChange} required /></div>
                <div>
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required />

                </div>
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />


                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign up'}
                </button>

            </form>
            <p>
                Already have an account? <a onClick={() => navigate('/login')}>Login</a>
            </p>
        </div>
    );
};

export default Signup;
