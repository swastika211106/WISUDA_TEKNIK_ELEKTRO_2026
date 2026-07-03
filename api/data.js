// api/data.js — Vercel Serverless Function
// Endpoint: GET /api/data
// Mengambil semua data responden dari Supabase untuk dashboard admin

import { createClient } from '@supabase/supabase-js';

// Admin dashboard menggunakan service_role key → bisa bypass RLS dan baca semua data
// Kunci ini TIDAK BOLEH diekspos ke frontend/publik — aman karena hanya di server
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    // Hanya izinkan metode GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Ambil semua data, urutkan dari yang terbaru
    const { data: rows, error } = await supabase
        .from('wisuda_elektro')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase fetch error:', error.message);
        return res.status(500).json({ error: 'Gagal mengambil data dari database.' });
    }

    return res.status(200).json({
        count: rows.length,
        data: rows,
    });
}
