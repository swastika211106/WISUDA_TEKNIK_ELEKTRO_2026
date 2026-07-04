// api/delete.js — Vercel Serverless Function
// Endpoint: DELETE /api/delete?id=XXX
// Menghapus data dari Supabase

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'ID tidak diberikan' });
    }

    const { error } = await supabase
        .from('wisuda_elektro')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Supabase delete error:', error.message);
        return res.status(500).json({ error: 'Gagal menghapus data' });
    }

    return res.status(200).json({ success: true, message: 'Data berhasil dihapus' });
}
