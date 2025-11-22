"use client";

import { useState } from "react";
import "./register.css";

export default function RegisterPage() {
    const [role, setRole] = useState("user");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Register clicked!");
    };

    return (
        <div className="register-container">
            <div className="register-box">

                <h1 className="register-title">Register</h1>

                <form onSubmit={handleSubmit} className="register-form">

                    <label>First Name</label>
                    <input type="text" required />

                    <label>Last Name</label>
                    <input type="text" required />

                    <label>Email</label>
                    <input type="email" required />

                    <label>Password</label>
                    <input type="password" required />

                    <label>Confirm Password</label>
                    <input type="password" required />

                    <label>Phone Number</label>
                    <input type="tel" required />

                    <div className="role-section">
                        <p>Select your role:</p>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="role"
                                value="user"
                                checked={role === "user"}
                                onChange={() => setRole("user")}
                            />
                            Simple User
                        </label>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="role"
                                value="artisan"
                                checked={role === "artisan"}
                                onChange={() => setRole("artisan")}
                            />
                            Artisan
                        </label>
                    </div>

                    <button type="submit" className="register-btn">
                        Register
                    </button>
                    <p className="login-link">
                        Already have an account?
                        <a href="/login"> Login here</a>
                    </p>
                </form>

            </div>
        </div>
    );
}
