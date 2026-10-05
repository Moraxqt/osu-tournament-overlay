const db = require('../config/db');

exports.getMatch = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM matches WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Match tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateScore = async (req, res, io) => {
  const { id } = req.params;
  const { red_score, blue_score } = req.body;
  try {
    await db.query('UPDATE matches SET red_score = ?, blue_score = ? WHERE id = ?', [red_score, blue_score, id]);
    
    // Broadcast data ke semua client OBS Overlay secara real-time
    io.emit('score_updated', { id, red_score, blue_score });

    res.json({ message: 'Skor berhasil diperbarui', red_score, blue_score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};