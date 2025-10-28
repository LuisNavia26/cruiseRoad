import{ useState } from "react";
import Dashboard from "./Dashboard";

function Header() {
    const[showPopUp, setShowPopUp] = useState (false);
    const[successReg, setsuccessReg] = useState (false);
    const[errorMsg, setErrorMsg] = useState ("");
    const[user, setUser] = useState (null);
    const[formData, setFormData] = useState ({
        firstName: "",
        lastName: "",
        username: "",
        password: ""
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
            try{
                const res = await fetch ("http://localhost:5000/api/users/register", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(formData),
                });
                const infoData = await res.json();
                if (res.ok){ 
                    setsuccessReg (true);
                    setErrorMsg ("");
                }else{
                    setsuccessReg (false);
                    setErrorMsg (infoData.message);

                }
            }catch (error){
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
                const res = await fetch ("http://localhost:5000/api/users/login", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                    }),
                });
                const infoData = await res.json();
                if (res.ok){
                    setUser ({username: infoData.user|| formData.username});
                    setErrorMsg ("");
                }else{
                    setErrorMsg ("Invalid credentials. Please try again.");
                }
            }catch (error){
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
            password: ""
        });
    }

    if (user){
        return <Dashboard user={user} isLogOut={handleOut} />;
    }
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

            {/*Login*/}

            <form style={{ marginTop: "20px", display: "inline-block", textAlign: "left" }} onSubmit={handleLog}> 
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="username">Username:</label><br />
                    <input type="text" value={formData.username} onChange={(e=>setFormData({...formData, username: e.target.value}))} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="password">Password:</label><br />
                    <input type="password" value={formData.password} onChange={(e=>setFormData({...formData, password: e.target.value}))} />
                </div>
            )}

            {errorMsg &&(
                <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
                    {errorMsg}
                </p>
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
                            (<p style={{color: "green", fontWeight : "bold", marginTop: "10px"}}>
                                Registration successful!
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