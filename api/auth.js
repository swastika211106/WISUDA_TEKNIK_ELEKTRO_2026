// api/auth.js — Vercel Serverless Function
// Endpoint: POST /api/auth
// Memverifikasi password admin sebelum mengizinkan akses ke dashboard

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { password } = req.body;

    // Password di-hardcode langsung di kode sesuai permintaan Anda
    // Anda bisa mengganti 'Panitia2026!' dengan password pilihan Anda
    const ADMIN_PASSWORD = 'PANITIAWISUDA2026';

    if (!ADMIN_PASSWORD) {
        return res.status(500).json({ error: 'Admin password belum dikonfigurasi di server.' });
    }

    if (password === ADMIN_PASSWORD) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ success: false, error: 'Password salah.' });
    }
}
