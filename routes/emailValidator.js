const express = require('express');
const axios = require('axios');
const router = express.Router();

// Replace this with your real Mailboxlayer API key
const MAILBOXLAYER_API_KEY = '185a5a6177bc85d41715af35a0d9fdf3';

router.get('/validate-email', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await axios.get('https://apilayer.net/api/check', {
      params: {
        access_key: MAILBOXLAYER_API_KEY,
        email,
        smtp: 1,
        format: 1
      }
    });

    const data = response.data;

    if (data.format_valid && data.smtp_check) {
      res.json({ valid: true, details: data });
    } else {
      res.json({ valid: false, details: data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error verifying email' });
  }
});

module.exports = router;
