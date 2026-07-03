// api/submit.js — Vercel Serverless Function
// Endpoint: POST /api/submit
// Menerima data form kuesioner dan menyimpan ke Supabase

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const data = req.body;

    // Validasi data wajib
    if (!data || !data.reference_code || !data.nama || !data.email) {
        return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    // Proses hiburan dari array ke string
    const hiburanStr = Array.isArray(data.hiburan)
        ? data.hiburan.join(', ')
        : data.hiburan;

    // Simpan ke tabel Supabase
    const { data: inserted, error } = await supabase
        .from('wisuda_elektro')
        .insert([{
            reference_code: data.reference_code,
            nama:           data.nama,
            email:          data.email,
            kelas:          data.kelas,
            nim:            data.nim,
            lokasi:         data.lokasi,
            pakaian:        data.pakaian,
            hiburan:        hiburanStr,
            saran:          data.saran,
            pesan:          data.pesan || '',
        }])
        .select()
        .single();

    if (error) {
        console.error('Supabase insert error:', error.message);
        return res.status(500).json({ error: 'Gagal menyimpan data. Silakan coba lagi.' });
    }

    console.log('Data berhasil disimpan:', inserted.reference_code);
    return res.status(200).json({
        message: 'Data berhasil disimpan',
        reference_code: inserted.reference_code,
    });
}
