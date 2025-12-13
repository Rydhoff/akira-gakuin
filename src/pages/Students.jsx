import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import StudentTable from '../components/StudentTable';

export default function Students() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('load students err', error);
      return;
    }

    setRows(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-(--akira-gray)">
          Students
        </h1>

        <button
          className="px-4 py-2 rounded-xl font-medium text-white bg-(--akira-red)
                     hover:bg-(--akira-red-dark)
                     shadow-sm transition"
          onClick={() => navigate('/students/form')}
        >
          + Tambah
        </button>
      </div>

      {/* TABLE */}
      <StudentTable
        rows={rows}
        refresh={load}
        onEdit={(row) => navigate(`/students/${row.id}/edit`)}
      />
    </div>
  );
}
