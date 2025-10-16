function Header() {
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
                    <input type="text" id="username" name="username" />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="password">Password:</label><br />
                    <input type="password" id="password" name="password" />
                </div>
                <button type="submit">Login</button>
            </form>

            {/*Create an account*/}
            <div style={{ marginTop: "15px" }}>
                <a href ="#">New Here? Create an Account</a>
            </div>
            
            <hr></hr>
        </header>
    );
}
export default Header;