import App from "@src/app";
import { initPool } from "./../config/db.pool";
import { config } from "dotenv";

config();
initPool();

const app = App();
app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on port 3000");
});
