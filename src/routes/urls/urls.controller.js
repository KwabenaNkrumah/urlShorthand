const pool = require("./../../db");
const { generateShortcode } = require("./../../utils");

async function postURL(req, res) {
  try {
    const { url } = req.body;
    const { userId } = req.user;

    // Validate url
    const parseURL = new URL(url);
    console.log(parseURL.origin);

    // check if URL exist and return the exist value
    let exist = await pool.query(
      `SELECT short_code,original_url FROM url WHERE original_url = $1 AND user_id = $2`,
      [parseURL.origin, userId],
    );

    exist = exist.rows[0];

    if (exist)
      return res.status(201).json({
        success: true,
        message: "URL received",
        url: exist.original_url,
        userId,
        shortCode: exist.short_code,
      });

    // if URL do not Exist
    const shortCode = await generateShortcode(6);

    let results = await pool.query(
      `INSERT INTO url(original_url, short_code, user_id) VALUES ($1, $2, $3) RETURNING *`,
      [parseURL.origin, shortCode, userId],
    );

    results = results.rows[0];

    return res.status(201).json({
      success: true,
      message: "URL received",
      url: results.original_url,
      userId,
      shortCode: results.short_code,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      success: false,
      message: "Please provide valid URL.",
    });
  }
}

async function getURL(req, res) {
  try {
    const { shortcode } = req.params;
    const { userId } = req.user;
    // Retrive URL using the short code and update click
    let query = await pool.query(
      `UPDATE url SET clicks = clicks + 1 WHERE short_code = $1 AND user_id = $2 RETURNING original_url, expires_at`,
      [shortcode, userId],
    );

    const expiresAt = query.rows[0].expires_at;
    // console.log(new Date(null));

    if (expiresAt && new Date(expiresAt) < new Date())
      return res.status(410).json({
        success: false,
        message: "Short URL expired.",
      });

    let originalURL = query.rows[0].original_url;
    console.log(new Date(expiresAt));

    return res.redirect(originalURL);
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      success: false,
      message: "Shortcut does not exist.",
    });
  }
}

async function getDetails(req, res) {
  try {
    const { shortcode } = req.params;
    const { userId: user_id } = req.user;

    const query = await pool.query(
      `SELECT original_url, short_code, expires_at,clicks,created_at, user_id 
      FROM url
      WHERE short_code = $1 AND user_id = $2`,
      [shortcode, user_id],
    );

    if (!query.rowCount)
      return res.status(400).json({
        message: "Short code does not exist",
        success: false,
      });

    const {
      created_at: createdAt,
      short_code: shortCode,
      expires_at: expiresAt,
      clicks,
      original_url: originalURL,
      user_id: userId,
    } = query.rows[0];

    return res.status(200).json({
      createdAt,
      originalURL,
      clicks,
      expiresAt,
      shortCode,
      userId,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: "Short code does not exist",
      success: false,
    });
  }
}

async function deleteURL(req, res) {
  try {
    const { shortcode } = req.params;
    const { userId } = req.user;

    const query = await pool.query(
      "DELETE FROM url WHERE short_code = $1 AND user_id = $2 RETURNING *",
      [shortcode, userId],
    );

    if (!query.rowCount) {
      return res.status(400).json({
        success: false,
        message: "Short URL not found",
      });
    }

    return res.status(204).json({
      success: true,
      message: "Short URL deleted",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Short URL not found",
    });
  }
}

async function paginateURL(req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const search = req.query.search || "";

    const { userId } = req.user;
    console.log(userId);

    const offset = (+page - 1) * +limit;
    // console.log(search);

    const query = await pool.query(
      "SELECT * FROM url WHERE original_url ILIKE $1 AND user_id = $4 ORDER BY created_at LIMIT $2 OFFSET $3",
      [`%${search}%`, +limit, offset, userId],
    );

    const total = await pool.query(
      "SELECT COUNT(*) FROM url WHERE original_url ILIKE $1 AND user_id = $2",
      [`%${search}%`, userId],
    );

    const data = query.rows;
    const totalData = +total.rows[0].count;
    const totalPages = Math.ceil(totalData / +limit);

    console.log(req.user);
    return res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        totalData,
        totalPages,
        userId,
      },
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      message: "No URL found",
      success: false,
    });
  }
}

module.exports = { postURL, getURL, getDetails, deleteURL, paginateURL };
