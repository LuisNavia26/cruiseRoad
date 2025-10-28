import { useState } from "react";
import api from './api';

function Header() {
    const [showPopUp, setShowPopUp] = useState(false);
    const [successReg, setsuccessReg] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: ""
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleRegister = async (e) => {
        e.preventDefault();
        if (
            formData.firstName.trim() &&
            formData.lastName.trim() &&
            formData.username.trim() &&
            formData.password.trim()
        ) {
            try {
                const response = await api.post('/users/register', {
                    firstname: formData.firstName,
                    lastname: formData.lastName,
                    username: formData.username,
                    password: formData.password
                });
                
                localStorage.setItem('token', response.data.token);
                setsuccessReg(true);
                setErrorMsg("");
                setIsLoggedIn(true);
                // Close popup after successful registration
                setTimeout(() => {
                    setShowPopUp(false);
                }, 2000);
            } catch (error) {
                setsuccessReg(false);
                setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
            }
        } else {
            setsuccessReg(false);
            setErrorMsg("All fields are required. Please fill in all fields.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', {
                username: formData.username,
                password: formData.password
            });
            
            localStorage.setItem('token', response.data.token);
            setIsLoggedIn(true);
            setErrorMsg("");
            // Clear the form
            setFormData(prev => ({
                ...prev,
                username: "",
                password: ""
            }));
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };
    return (
        <header>    
            <h1>Cruise Road</h1>
            <h2>Your personal road trip planner</h2>
            <nav>
                <ul>
                    <li style={{fontWeight: "bold"}}>{isLoggedIn ? 'WELCOME!' : 'LOGIN'}</li>
                    <li></li>
                </ul>
            </nav>

            {!isLoggedIn ? (
                <>
                    {/*Login Form*/}
                    <form onSubmit={handleLogin} style={{ marginTop: "20px", display: "inline-block", textAlign: "left" }}> 
                        <div style={{ marginBottom: "10px" }}>
                            <label htmlFor="username">Username:</label><br />
                            <input 
                                type="text" 
                                id="username"
                                value={formData.username} 
                                onChange={(e => setFormData({...formData, username: e.target.value}))}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label htmlFor="password">Password:</label><br />
                            <input 
                                type="password" 
                                id="password"
                                value={formData.password} 
                                onChange={(e => setFormData({...formData, password: e.target.value}))}
                            />
                        </div>
                        <button type="submit">Login</button>
                        {errorMsg && (
                            <p style={{ color: "red", marginTop: "10px" }}>
                                {errorMsg}
                            </p>
                        )}
                    </form>
                </>
            ) : (
                <div>
                    <p>You are logged in!</p>
                    <button onClick={() => {
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                    }}>Logout</button>
                </div>
            )}

            {/*Create an account*/}
            <div style={{ marginTop: "15px" }}>
                <a href ="#" onClick={(e) => {e.preventDefault(); setShowPopUp(true); setsuccessReg(false);setErrorMsg("");}}>
                    New Here? Create an Account

                </a>
            </div>
            {/* Pop up for creating an account */}
            {showPopUp && (
                <div className={"popupOverlay"}>
                    <div className={"popupBox"}>
                        <h3>Create an Account</h3>
                        <form onSubmit={handleRegister}>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="new-first-name">First Name:</label><br />
                                <input 
                                    type="text" 
                                    id="new-first-name"
                                    value={formData.firstName} 
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="new-last-name">Last Name:</label><br />
                                <input 
                                    type="text" 
                                    id="new-last-name"
                                    value={formData.lastName} 
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="new-username">Username:</label><br />
                                <input 
                                    type="text" 
                                    id="new-username"
                                    value={formData.username} 
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}> 
                                <label htmlFor="new-password">Password:</label><br />
                                <input 
                                    type="password" 
                                    id="new-password"
                                    value={formData.password} 
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                />
                            </div>
                            <button type="submit">Create Account</button>
                            
                        </form>
                        {/*registration success*/}
                        {successReg && 
                            (<p style={{color: "green", fontWeight : "bold", marginTop: "10px"}}
                            >Registration successful!
                            </p>
                            )}
                        {errorMsg &&(
                            <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
                                {errorMsg}
                            </p>
                        )}
                        <button className= "closeButton" onClick={()=> {setShowPopUp(false); setsuccessReg(false); setErrorMsg("");}}>
                            Close
                        </button>
                    </div>
                </div>
            )}     
            <hr></hr>
        </header>
    );
}

export default Header;