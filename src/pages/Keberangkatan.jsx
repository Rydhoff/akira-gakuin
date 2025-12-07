import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import KeberangkatanTable from '../components/KeberangkatanTable';

export default function Keberangkatan(){
  const [rows, setRows] = useState([]);
  const load = async ()=> {
    const { data, error } = await supabase
      .from('students')
      .select('id, nis, nama, keberangkatan')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('load keberangkatan rows', error);
      return;
    }
    setRows(data || []);
  };

  useEffect(()=>{ load(); },[]);

  return (
    <div className="page-container">
      <h1 className="text-2xl mb-4 text-center bg-red-300 px-5 py-2 text-red-900 rounded-xl w-fit m-auto"><strong>Coming Soon</strong></h1>
      <h1 className="text-xl font-semibold mb-4">Keberangkatan Magang / Kerja</h1>
      <div className="card">
        <KeberangkatanTable rows={rows} />
      </div>
    </div>
  );
}
