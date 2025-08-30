import React from 'react';



const Signup = () => {
    return (
        <div className="mt-4 d-flex justify-content-center align-items-center min-vh-100">
            <div
                className="card shadow border-0 rounded-4 p-4 w-100"
                style={{ maxWidth: '500px', backgroundColor: '#023047', color: 'white' }}
            >
                {/* Illustration */}
                <div className="text-center mb-4">
                    <img
                        src="https://i.ibb.co/KjTVLSrr/Login-rafiki-1.png"
                        alt="Signup Illustration"
                        className="img-fluid"
                        style={{ maxHeight: '200px' }}
                    />
                </div>

                {/* Full Name */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label text-white fw-semibold">Full Name:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control border-primary-subtle"
                            placeholder="Enter your Full Name"
                            id="name"
                        />
                        <span className="input-group-text bg-white">
                            <i className="bi bi-person-lines-fill" style={{ color: '#023047' }}></i>
                        </span>
                    </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label text-white fw-semibold">Email:</label>
                    <div className="input-group">
                        <input
                            type="email"
                            className="form-control border-primary-subtle"
                            placeholder="Enter your Email"
                            id="email"
                        />
                        <span className="input-group-text bg-white">
                            <i className="bi bi-envelope-fill" style={{ color: '#023047' }}></i>
                        </span>
                    </div>
                </div>

                {/* Username */}
                <div className="mb-3">
                    <label htmlFor="username" className="form-label text-white fw-semibold">Username:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control border-primary-subtle"
                            placeholder="Choose a Username"
                            id="username"
                        />
                        <span className="input-group-text bg-white">
                            <i className="bi bi-person-fill" style={{ color: '#023047' }}></i>
                        </span>
                    </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label text-white fw-semibold">Password:</label>
                    <div className="input-group">
                        <input
                            type="password"
                            className="form-control border-primary-subtle"
                            placeholder="Create a password"
                            id="password"
                        />
                        <span className="input-group-text bg-white">
                            <i className="bi bi-lock-fill" style={{ color: '#023047' }}></i>
                        </span>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label text-white fw-semibold">Confirm Password:</label>
                    <div className="input-group">
                        <input
                            type="password"
                            className="form-control border-primary-subtle"
                            placeholder="Re-enter your password"
                            id="confirmPassword"
                        />
                        <span className="input-group-text bg-white">
                            <i className="bi bi-shield-lock-fill" style={{ color: '#023047' }}></i>
                        </span>
                    </div>
                </div>

                {/* Signup Button */}
                <div className="d-grid mb-3">
                    <button
                        className="btn rounded-pill py-2 fs-5 shadow-sm fw-bold"
                        style={{ backgroundColor: 'white', color: '#023047', border: '2px solid #023047', transition: 'all 0.3s ease' }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#FFB803';
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = '#023047';
                        }}
                    >
                        Sign Up
                    </button>

                </div>

                {/* Login Redirect */}
                <div className="text-center">
                    <p className="small text-white">
                        Already have an account?{' '}
                        <a href="/" className="text-decoration-none fw-semibold" style={{ color: '#FFB803' }}>
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
