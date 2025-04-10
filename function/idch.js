const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const { id } = req.query;

  if (!id || !id.includes('https://whatsapp.com/channel/')) {
    return res.status(400).json({ error: 'Link channel tidak valid.' });
  }

  // Simulasi extract ID dari link
  const channelId = id.split('https://whatsapp.com/channel/')[1];

  // Dummy data untuk simulasi response
  const dummyData = {
    owner : RiiCODE,
    id: channelId,
    name: 'Contoh Channel',
    subscribers: 1234,
    state: 'ACTIVE',
    verification: 'VERIFIED'
  };

  return res.json(dummyData);
});

module.exports = router;