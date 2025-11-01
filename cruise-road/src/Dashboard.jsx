import React, {useState} from "react";

function Dashboard({user, isLogOut}) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        destination: "",
        start: "",
    });
    /*Handling trip planning submission*/
    const handleSub = async(e)=>{
        e.preventDefault();
        if (!formData.destination || !formData.start){
            setErrorMsg("Please fill out all the fields.");
            return;
        }
        setErrorMsg(""); //Not actual error handling yet, just for show, for now
        setShowPopUp(false);
    };
    
    return (
        <>
        <div className= "dashboard">
            <h1 style={{
                display: "inline-block",
                backgroundColor: "rgba(255,255,255,0.88)",
                color: "black",
                padding: "10px 15px",
                borderRadius: "6px"}}
                >
                Welcome, {user.username}!</h1>
            <div>
                <button onClick={isLogOut}>Log Out</button>

            </div>
            <div style={{marginTop:"40px", textAlign:"center", display: "inline-block",backgroundColor: "rgba(255, 255, 255, 0.88)",color: "black",padding: "10px 15px",borderRadius: "6px",}}>
                <h2>Plan your next road trip!</h2>
            </div>
        {/*Start Your Trip*/}
            <div style={{ marginTop: "15px" }}
            >
            <button
            type="button"
            onClick={()=>{setShowPopUp(true);
                setErrorMsg("");
            }}
            style={{marginTop:"490px",
                 right:"43.5%",
                 textAlign:"center", 
                 display: "inline-block",
                 backgroundColor: "rgba(8, 114, 41, 0.88)",
                 borderRadius: "6px",}}
            >
                Start Planning Here!
            </button>
            </div>   
            </div>
            {/* Pop up for Planning Trip */}
            {showPopUp && (
                <div className={"popupOverlay"}>
                    <div className={"popupBox"}
                    style={{position: "relative",
                        backgroundImage: "url('public/pictures/road.jpg')",
                        backgroundSize: "cover",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                    }}>
                        {/*Close Button*/}
                        <button type= "button"
                            className="closeButton"
                            onClick={()=> {setShowPopUp(false); setErrorMsg("");}}
                            style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                border: "none",
                                background: "red",
                                fontSize: "10px",
                                cursor: "pointer",
                            }}
                            >
                            X
                        </button>
                        <h3>LET THE ROADTRIPPING START HERE</h3>
                        <form onSubmit={handleSub}>
                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="destination"style={{backgroundColor:"rgba(0,0,0,0.4)",color:"white"}}>Where are we going?:</label><br />
                                <input 
                                    type="text" 
                                    id="destination"
                                    placeholder="e.g., Mount Rushmore, SD"
                                    value={formData.destination} 
                                    onChange={(e) => setFormData((s) => ({ ...s, destination: e.target.value }))} 
                                />
                            </div>

                            <div style={{ marginBottom: "10px" }}>
                                <label htmlFor="start"style={{backgroundColor:"rgba(0,0,0,0.4)",color:"white"}}>Where are leaving from? :</label><br />
                                <input 
                                    type="text" 
                                    id="start"
                                    placeholder="e.g., Gainesville, Fl"
                                    value={formData.start} 
                                    onChange={(e) => 
                                        setFormData((s)=>({ ...s, start: e.target.value }))}                            
                                />
                            </div>
                        {errorMsg &&(
                            <p style={{ backgroundColor:"rgba(245, 236, 195, 1)",color: "red", fontWeight: "bold", marginTop: "10px" }}>
                                {errorMsg}
                            </p>
                        )}
            <div style={{marginTop:"30px", textAlign:"Center", display: "inline-block",color: "black",padding: "10px 15px",borderRadius: "6px",}}>
                            <button type="submit">Lets Plan!</button>
                         </div>
                    </form>
                </div>
            </div>
        )}
     </>
    );
}
export default Dashboard;