    import React, { useEffect, useState } from 'react';
    import { supabase } from '../lib/supabaseClient';
    import StudentTable from '../components/StudentTable';
    import StudentForm from '../components/StudentForm';

    export default function Students(){
    const [rows, setRows] = useState([]);
    const [editing, setEditing] = useState(null);

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

    useEffect(()=>{ load(); }, []);

    return (
        <div className="page-container">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-(--akira-gray)">
                Students
            </h1>

            <button
                className="px-4 py-2 rounded-xl font-medium text-white bg-(--akira-red)
                        hover:bg-(--akira-red-dark) active:bg-(--akira-gray)
                        shadow-sm transition"
                onClick={() => setEditing({})}
            >
                + Tambah
            </button>
            </div>

            <StudentTable
                rows={rows}
                onEdit={(r) => setEditing(r)}
                refresh={load}
            />

            {/* FORM MODAL */}
            {editing !== null && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]
                            flex items-center justify-center p-6 z-30 transition">
                <StudentForm
                initial={editing}
                onDone={() => { setEditing(null); load(); }}
                onCancel={() => setEditing(null)}
                />
            </div>
            )}

        </div>
    );
    }
