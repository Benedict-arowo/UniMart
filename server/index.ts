import CONFIG from "./utils/config";
import Routes from "./routes";
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
Routes(app);

app.listen(CONFIG.env.PORT, () => {
	console.log(`Listening on ${CONFIG.env.PORT}`);
});
