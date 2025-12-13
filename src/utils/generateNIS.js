import { supabase } from "../lib/supabaseClient";

export async function generateNIS(angkatan = "1", tahun = null) {
  const now = new Date();
  const YYYY = String(tahun || now.getFullYear());

  const angk = String(angkatan || "0").replace(/^0+/, "") || "0";
  const angkPad = String(angk).padStart(3, "0");

  const prefix = YYYY + angkPad;

  // Ambil NIS terbesar existing untuk prefix ini
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
