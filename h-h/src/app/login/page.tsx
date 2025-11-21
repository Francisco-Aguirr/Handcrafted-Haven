"use client";
import { useState } from "react";
import "./login.css"; // We will create this file

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Login clicked!");
    };

    return (
        <div className="login-container">
            <div className="login-box">

                <h1 className="login-title">Login</h1>

                <form onSubmit={handleSubmit} className="login-form">

                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="login-btn">Login</button>
                </form>

                <p className="register-text">
                    If you don’t have a login account,
                    <a href="/register"> click here to register</a>
                </p>

            </div>
        </div>
    );
}
