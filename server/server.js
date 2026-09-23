import "dotenv/config";
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT;

connectDB();

app.set("trust proxy", 1);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});