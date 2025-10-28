import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.js";
import {connectDB} from "./config/db.js";
import User from './models/user.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();


app.get('/api/health', (_req, res) => res.json({ ok: true })); // check for connection with api
app.get("/", (req, res) => {
    res.send("testing");
});

app.use(express.json());

app.use("/api/users", authRoutes);
app.use((err, _req, res, _next) => { // This is to so we can see the real error messages
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});
(async () => {
  try {
    await connectDB(); // make sure connectDB throws on failure
    await User.init(); // ensure indexes are created before starting the server
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
    console.log(`Server started at port ${PORT}`);
  }
})();

