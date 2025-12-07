import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProgramTable from '../components/ProgramTable';

export default function Program(){
  const [rows, setRows] = useState([]);
  const load = async ()=> {
    const { data, error } = await supabase
      .from('students')
      .select('id, nis, nama, shiken, ujian, kompetensi')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('load program rows', error);
      return;
    }
    setRows(data || []);
  };

  useEffect(()=>{ load(); },[]);

  return (
    <div className="page-container">
      <h1 className="text-2xl mb-4 text-center bg-red-300 px-5 py-2 text-red-900 rounded-xl w-fit m-auto"><strong>Coming Soon</strong></h1>
      <h1 className="text-xl font-semibold mb-4">Program Pendidikan</h1>
      <div className="card">
        <ProgramTable rows={rows} />
      </div>
    </div>
  );
}
