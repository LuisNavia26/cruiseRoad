import{ useState } from "react";
function Header() {
    const[showPopUp, setShowPopUp] = useState (false);
    const[successReg, setsuccessReg] = useState (false);
    const[errorMsg, setErrorMsg] = useState ("");
    const[formData, setFormData] = useState ({
        firstName: "",
        lastName: "",
        username: "",
        password: ""
    });
    const handleSub =(e)=>{
        e.preventDefault();
        if(
            formData.firstName.trim() &&
            formData.lastName.trim() &&
            formData.username.trim() &&
            formData.password.trim()
        ){
            setsuccessReg (true);
            setErrorMsg ("");
        }else{
            setsuccessReg (false);
            setErrorMsg ("All fields are required. Please fill in all fields." );
        }
    };
    return (
        <header>    
            <h1>Cruise Road</h1>
            <h2>Your personal road trip planner</h2>
            <nav>
                <ul>
                    <li style={{fontWeight: "bold"}}>LOGIN</li>
                    <li></li>
                </ul>
            </nav>

            {/*Login*/}

            <form style={{ marginTop: "20px", display: "inline-block", textAlign: "left" }}> 
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
                        <form onSubmit={handleSub}>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="new-first-name">First Name:</label><br />
                                <input type="text" value={formData.firstName} onChange={(e) =>setFormData({ ...formData, firstName: e.target.value })  } />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="new-last-name">Last Name:</label><br />
                                <input type="text" value={formData.lastName} onChange={(e) =>setFormData({ ...formData, lastName: e.target.value })  } />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="new-username">Username:</label><br />
                                <input type="text" value={formData.username} onChange={(e) =>setFormData({ ...formData, username: e.target.value })  } />
                            </div>
                            <div style={{ marginBottom: "10px" }}> 
                                <label htmlFor="new-password">Password:</label><br />
                                <input type="password" value={formData.password} onChange={(e) =>setFormData({ ...formData, password: e.target.value })  } />
                            </div>
                            <button type="Submit">Create Account</button>
                            
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