const express = require("express");
const router = express.Router();

const {
  postURL,
  getURL,
  getDetails,
  deleteURL,
  paginateURL,
} = require("./urls.controller");

const authenticateMiddleware = require("./../../middleware/auth.middleware");

//Use this route to post url and get a short code for the url
router.post("/url", authenticateMiddleware, postURL);
//Paginate URL /url?limit=3&page=1&search=facebook
router.get("/url", authenticateMiddleware, paginateURL);
//Get information about a short code url
router.get("/url/:shortcode", authenticateMiddleware, getDetails);
//Use the short code and be redirected to the original url
router.get("/:shortcode", authenticateMiddleware, getURL);
//Delete a URL
router.delete("/url/:shortcode", authenticateMiddleware, deleteURL);

module.exports = router;
