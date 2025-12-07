import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import CardStat from "../components/CardStat";
import { Users, ClipboardList, CheckCircle, XCircle } from "lucide-react";

export default function Dashboard() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await supabase
        .from("students")
        .select("*", { head: true, count: "exact" });
      setTotal(res.count || 0);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <CardStat
          icon={<Users size={26} />}
          label="Total Students"
          value={total}
          color="#4A8BFF"
        />

        <CardStat
          icon={<ClipboardList size={26} />}
          label="Pending"
          value="0"
          color="#FFB653"
        />

        <CardStat
          icon={<CheckCircle size={26} />}
          label="Completed"
          value="0"
          color="#57C374"
        />

        <CardStat
          icon={<XCircle size={26} />}
          label="Failed"
          value="0"
          color="#FF6B6B"
        />
      </div>

      {/* ADD CHART SECTION HERE (optional) */}
    </div>
  );
}
