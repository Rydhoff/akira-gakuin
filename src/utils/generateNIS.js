import { supabase } from "../lib/supabaseClient";

/**
 * generateNIS — full client-side
 * Format: YYYYMM + ANGKATAN(2digit) + URUT(3digit)
 */
export async function generateNIS(angkatan = "01") {
  const now = new Date();
  const YYYY = now.getFullYear().toString();
  const MM = String(now.getMonth() + 1).padStart(2, "0");

  const prefix = YYYY + MM + String(angkatan).padStart(2, "0");

  // Ambil NIS terbesar existing
  const { data, error } = await supabase
    .from("students")
    .select("nis")
    .like("nis", `${prefix}%`)
    .order("nis", { ascending: false })
    .limit(1);

  if (error) throw error;

  let next = 1;

  if (data && data.length > 0 && data[0].nis) {
    const lastSeq = parseInt(data[0].nis.slice(-3));
    next = lastSeq + 1;
  }

  const seq = String(next).padStart(3, "0");

  return prefix + seq;
}
