import React, { useState } from 'react';

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogin = async () => {
        if (!isRegistering) {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                localStorage.setItem('isLoggedIn', 'true');
                onLoginSuccess();
            } else {
                alert("Login failed");
            }
        }
    };

    const handleRegister = async () => {
        if (isRegistering) {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                alert("Registration successful. Please log in.");
                setIsRegistering(false); 
            } else {
                alert("Registration failed");
            }
        }
    };

    return (
        <div>
            <h2>{isRegistering ? "Register" : "Login"}</h2>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={isRegistering ? handleRegister : handleLogin}>
                {isRegistering ? "Register" : "Log In"}
            </button>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Back to Login" : "Need to register?"}
            </button>
        </div>
    );
}

export default LoginPage;
