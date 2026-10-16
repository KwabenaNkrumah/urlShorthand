const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const app = require("./app");
const PORT = 5000;

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
