import React from "react";

function Profile({user, closeWindow}) {
  return (
    <div className="popupProfileOverlay">
      <div className="popupProfileBox">
        {/* Close button */}
        <button
          type="button"
          onClick={closeWindow}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            border: "none",
            background: "red",
            color: "white",
            fontSize: "12px",
            cursor: "pointer",
            borderRadius: "4px",
            padding: "2px 6px",
          }}
        >
          X
        </button>

        <h2>👤 Your Profile</h2>
        <p><b>First Name:</b> {user.firstname}</p>
        <p><b>Last Name:</b> {user.lastname}</p>
        <p><b>Username:</b> {user.username}</p>
        <p><b>Password: </b>******** </p>
        <div style={{display: "flex", gap: "10px"}}>
            <button className = "passwordChangeButton"onClick={() => alert("Change Password clicked")}>Change Password</button>
            <button className = "deleteButton" onClick={() => alert("Delete account clicked")}><b>Delete Account</b></button>
        </div>
        {/* Edit button for password? */}
      </div>
    </div>
  );
}

export default Profile;




  

