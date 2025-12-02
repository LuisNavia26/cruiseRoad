import React, { useEffect } from "react";
import { useState } from "react";

function Profile({user, closeWindow, onLogout, onUserUpdate}) {
  const [showPass, setShowPass] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [emsg, setEMsg] = useState("");

  //upgrade to pro
  const [role, setRole] = useState(user.role ?? "user");
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState("");
  useEffect(() => {
    setRole(user.role);
  }, [user.role]);

  const handleUpgrade = async () => {
    setUpgradeMsg("");
    try {
      setUpgradeLoading(true);
      const response = await fetch("/api/users/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const newRole = data.role ?? 'pro';
        setRole(newRole);
        // inform parent about the new role if callback provided
        if (typeof onUserUpdate === 'function') {
          onUserUpdate({ ...user, role: newRole });
        }
        setUpgradeMsg("User upgraded to pro successfully");
      } else {
        setUpgradeMsg(data.message || "Error upgrading user");
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      setUpgradeMsg("Server error");
    } finally {
      setUpgradeLoading(false);
    }
  };

 
  //changing password
  const handlePassChange = async () => {
    setEMsg("");



   
    try {
      const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const data = await response.json();
      if (response.ok) {
        setEMsg("Password changed successfully");
        setOldPass("");
        setNewPass("");

      } else {
        setEMsg(data.message || "Error changing password");
      }
    } catch (error) {
      console.error('Change password error:', error);
      setEMsg("Server error");
    }
  };
  //deleting account
  const handleDeleteAccount = async () => {
    setEMsg("");
    try {
      const response = await fetch("/api/users/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setEMsg(data.message || "Error deleting account");
        return;
      }
      alert("Account deleted successfully");
      if (typeof onLogout === 'function') {
        onLogout();
      } else {
        closeWindow();
        window.location.reload();
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setEMsg("Server error");
    }
  };
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
        {/* <p><b>First Name:</b> {user.firstname}</p>
        <p><b>Last Name:</b> {user.lastname}</p> */}
        <p style={{ margin: "4px 0"}}><b>Username:</b> {user.username}</p>
        <p style={{ margin: "4px 0"}}><b>Password:</b>******** </p>
        <p style={{ margin: "4px 0"}}><b>Account Type:</b> {" "}{role === 'pro' ? "Pro User" : "Standard User"}</p>
        {role !== "pro" && (
          <div style={{ marginBottom: "10px" }}>
            <button
              className="upgradeButton"
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              style={{
                marginBottom: "6px",
                padding: "6px 10px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#f5b400",
                color: "black",
                fontWeight: "bold",
              }}
            >
              {upgradeLoading ? "Upgrading..." : "Upgrade to Pro"}
            </button>

            {upgradeMsg && (
              <p
                style={{
                  color: upgradeMsg.includes("success")
                    ? "lightgreen"
                    : "red",
                  backgroundColor: "white",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginLeft: "8px",
                }}
              >
                <b>{upgradeMsg}</b>
              </p>
            )}
          </div>
        )}
        <div style={{display: "flex", gap: "10px"}}>
            <button className = "passwordChangeButton"onClick={() =>setShowPass(true)}>Change Password</button>
            <button className = "deleteButton" onClick={() => setShowDelete(true)}><b>Delete Account</b></button>
        </div>

        {/* changing password popup */}
        {showPass && (
            <div className="tripDetails">
                <div className="nestedPass">
                  <button onClick={() => {
                    setShowPass(false);
                    setEMsg("")}}
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
                    }}>
                      X
                    </button>
        
                    <p style={{backgroundColor: "white", padding: "5px", display: "inline-block"}}><b>Change Password</b></p>
                    <input 
                      type="password" 
                      placeholder="Type..." 
                      value={oldPass} 
                      onChange={(e) => setOldPass(e.target.value)} 
                      className="inputs" 
                      style={{
                        width: "100%", 
                        marginBottom: "20px",
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: "8px",
                        border: "none",
                        borderRadius: "4px"
                      }}/>
                    <input 
                      type="password" 
                      placeholder="Type..." 
                      value={newPass} 
                      onChange={(e) => setNewPass(e.target.value)} 
                      className="inputs" 
                      style={{
                        width: "100%", 
                        marginBottom: "20px",
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: "8px",
                        border: "none",
                        borderRadius: "4px"
                      }}/>
                    {emsg && (
                      <p
                        style={{
                        color: emsg.includes("success") ? "lightgreen" : "red",
                        backgroundColor: "white",
                        padding: "5px",
                        borderRadius: "4px",
                        marginBottom: "15px",
                        display: "inline-block",
                      
                        }}
                      >
                        <b>{emsg}</b>
                        
                      </p>
                    )}
                    <br />

                    <button className="submitButton" onClick={handlePassChange}>Submit</button>
                    </div>
            </div>
        )}
        {/* delete account popup */}
        {showDelete && (
          <div className="tripDetails">
            <div className="nestedDeletePopUp">
              <button onClick={() => {
                setShowDelete(false);
                setEMsg("")}}
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
                }}>
                  X
                </button>
             <p style={{marginTop: "2px",backgroundColor: "white", padding: "5px", display: "inline-block"}}><b>Are you sure you want to delete your account?</b></p>
              <button className="deleteConfirm" onClick={handleDeleteAccount}><b>Yes, Delete My Account</b></button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default Profile;




  

