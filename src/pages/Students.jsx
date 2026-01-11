import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import StudentTable from '../components/StudentTable'

/* ================= BANNER IMAGE ================= */
import banner from '../assets/students/banner.jpeg'

export default function Students() {
  const [rows, setRows] = useState([])
  const navigate = useNavigate()

  /* ================= LOAD DATA ================= */
  const loadStudents = useCallback(async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) {
      console.error('load students err', error)
      return
    }

    setRows(data || [])
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  return (
    <div className="space-y-6">

      {/* ================= HERO (STATIS) ================= */}
      <div
        className="relative h-[200px] rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* overlay tipis */}
        <div className="absolute inset-0" />

      </div>

      {/* title */}


      {/* ================= ACTION BAR ================= */}
      <div className="flex justify-between items-center">
        <div className="relative z-10 h-full flex items-end px-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Students
          </h1>
        </div>

        <button
          className="px-4 py-2 rounded-xl font-medium text-white bg-(--akira-red)
                     hover:bg-(--akira-red-dark)
                     shadow-sm transition"
          onClick={() => navigate('/students/form')}
        >
          + Tambah
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <StudentTable
        rows={rows}
        refresh={loadStudents}
        onEdit={(row) => navigate(`/students/${row.id}/edit`)}
      />
    </div>
  )
}
