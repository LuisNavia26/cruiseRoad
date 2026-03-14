import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

const stopTypeOptions = [
    { value: "national-parks", label: "National Parks" },
    { value: "state-parks", label: "State Parks" },
    { value: "historic-sites", label: "Historic Sites" },
    { value: "museums", label: "Museums" },
    { value: "bars", label: "Bars" },
    { value: "restaurants", label: "Restaurants" },
    { value: "attractions", label: "Attractions" },
    { value: "beaches", label: "Beaches" },
    { value: "hiking", label: "Hiking Trails" },
    { value: "campgrounds", label: "Campgrounds" },
    { value: "scenic-lookouts", label: "Scenic Lookouts" },
    { value: "zoos-aquariums", label: "Zoos and Aquariums" },
    { value: "theme-parks", label: "Theme Parks" },
    { value: "shopping", label: "Shopping" },
    { value: "coffee", label: "Coffee Shops" },
    { value: "live-music", label: "Live Music" },
    { value: "art-galleries", label: "Art Galleries" },
    { value: "botanical-gardens", label: "Botanical Gardens" },
];

function Header() {
    const[authView, setAuthView] = useState ("login");
    const[successReg, setsuccessReg] = useState (false);
    const[errorMsg, setErrorMsg] = useState ("");
    const[user, setUser] = useState (null);
    const[formData, setFormData] = useState ({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        preferredStopTypes: ["national-parks", "historic-sites", "restaurants"]
    });
    {/*Handling user registration*/}
    const handleSub = async(e)=>{
        e.preventDefault();
        if (
            formData.firstName.trim() &&
            formData.lastName.trim() &&
            formData.username.trim() &&
            formData.password.trim()
        ){
            if (formData.password.length < 8) {
                setsuccessReg(false);
                setErrorMsg("Password must be at least 8 characters long.");
                return;
            }

            try{
                const res = await fetch ("/api/users/register", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        firstname: formData.firstName,
                        lastname: formData.lastName,
                        username: formData.username,
                        password: formData.password,
                        preferredStopTypes: formData.preferredStopTypes,
                    }),
                });
                const infoData = await res.json();
                if (res.ok){ 
                    setsuccessReg (true);
                    setErrorMsg ("");
                    setAuthView("register");
                }else{
                    setsuccessReg (false);
                    setErrorMsg (infoData.message);

                }
            }catch (error){
                console.error(error);
                setsuccessReg (false);
                setErrorMsg ("An error occurred during registration. Please try again later.");

            }
            
        }else{
            setsuccessReg (false);
            setErrorMsg ("All fields are required. Please fill in all fields." );
        }
    };

    {/*Handling login of registered users*/}
    const handleLog = async(e)=>{
        e.preventDefault();
        if (formData.username.trim() && formData.password.trim()){
            try{
                const res = await fetch ("/api/users/login", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                    }),
                });
                const infoData = await res.json();
                if (res.ok){
                    // store token and user info on successful login
                    setUser ({
                        username: infoData.username || formData.username,
                        token: infoData.token,
                        id: infoData.id,
                        role: infoData.role,
                        firstname: infoData.firstname,
                        lastname: infoData.lastname,
                        preferredStopTypes: infoData.preferredStopTypes ?? []
                    });
                    setErrorMsg ("");
                    setsuccessReg(false);
                }else{
                    setErrorMsg ("Invalid credentials. Please try again.");
                }
            }catch (error){
                console.error(error);
                setErrorMsg ("An error occurred during login. Please try again later.");
            }
        }else{
            setErrorMsg ("Both username and password are required.");
        }
    };

    const handleOut = () => {
        setUser (null);
        setFormData ({
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            preferredStopTypes: ["national-parks", "historic-sites", "restaurants"]
        });
    }
    useEffect (() => {
        if (user){
            document.body.style.backgroundImage = "url('public/pictures/Mountain.jpg')";
            document.body.style.overflow = "auto";
        }else{
            document.body.style.backgroundImage = "none";
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [user]);
    if (user){
        return <Dashboard user={user} isLogOut={handleOut} onUserUpdate={(u) => setUser(u)} />;
    }
    return (
        <div className="loginPage">
            <video className="loginVideo" autoPlay muted loop playsInline>
                <source src="/login.mp4" type="video/mp4" />
            </video>
            <div className="loginVideoOverlay" />
            <header className={`loginCard${authView === "register" ? " loginCardRegister" : ""}`}>
                <h1>Cruise Road</h1>
                <h2>{authView === "login" ? "Your personal road trip planner" : "Create your account"}</h2>
                <nav>
                    <ul>
                        <li style={{fontWeight: "bold"}}>{authView === "login" ? "LOGIN" : "CREATE ACCOUNT"}</li>
                        <li></li>
                    </ul>
                </nav>
                {authView === "login" ? (
                    <>
                        <form style={{ marginTop: "20px", display: "inline-block", textAlign: "left" }} 
                        onSubmit={handleLog}
                        > 
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="username">Username:</label><br />
                                <input type="text" value={formData.username} onChange={(e=>setFormData({...formData, username: e.target.value}))} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="password">Password:</label><br />
                                <input type="password" value={formData.password} onChange={(e=>setFormData({...formData, password: e.target.value}))} />
                            </div>
                        
                            <button type="submit">Login</button>
                        </form>

                        {errorMsg &&(
                            <p style={{ color: "#ffb3b3", fontWeight: "bold", marginTop: "10px" }}>
                                {errorMsg}
                            </p>
                        )}

                        <div style={{ marginTop: "15px" }}>
                            <a
                                href ="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setAuthView("register");
                                    setsuccessReg(false);
                                    setErrorMsg("");
                                }}
                            >
                                New Here? Create an Account
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        <form className="registerForm" onSubmit={handleSub}>
                            <div className="registerFormBody">
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
                                <div style={{ marginBottom: "14px" }}>
                                    <label htmlFor="stop-type-selector">What kinds of stops do you want on your trips?</label><br />
                                    <div className="stopTypePanel" id="stop-type-selector">
                                        {stopTypeOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`stopTypeChip${formData.preferredStopTypes.includes(option.value) ? " isSelected" : ""}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="stopTypeCheckbox"
                                                    checked={formData.preferredStopTypes.includes(option.value)}
                                                    onChange={(e) => {
                                                        setFormData((current) => ({
                                                            ...current,
                                                            preferredStopTypes: e.target.checked
                                                                ? [...current.preferredStopTypes, option.value]
                                                                : current.preferredStopTypes.filter((item) => item !== option.value)
                                                        }));
                                                    }}
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="stopTypeHint">{formData.preferredStopTypes.length} selected</p>
                                </div>
                                <button type="submit">Create Account</button>
                                {successReg && (
                                    <p style={{color: "#9cf5ad", fontWeight : "bold", marginTop: "10px"}}>
                                        Registration successful. You can log in now.
                                    </p>
                                )}
                                {errorMsg &&(
                                    <p style={{ color: "#ffb3b3", fontWeight: "bold", marginTop: "10px" }}>
                                        {errorMsg}
                                    </p>
                                )}
                                <hr className="registerDivider" />
                            </div>
                        </form>
                    </>
                )}
                {authView === "login" && <hr></hr>}
            </header>
            {authView === "register" && (
                <div className="authBackLink">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setAuthView("login");
                            setsuccessReg(false);
                            setErrorMsg("");
                        }}
                    >
                        Back to Login
                    </a>
                </div>
            )}
        </div>
    );
}

export default Header;
