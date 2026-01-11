import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import dayjs from "dayjs";

export default function ActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // FETCH LOGS (STABLE)
    // =========================
    const fetchLogs = useCallback(async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("activity_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(200);

        if (error) {
            console.error("fetch activity logs error:", error);
        } else {
            setLogs(data || []);
        }

        setLoading(false);
    }, []);

    // =========================
    // LOAD ON MOUNT
    // =========================
    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    /* =========================
       BADGE AKSI
    ========================= */
    const actionBadge = (action) => {
        const map = {
            create: "bg-green-100 text-green-700",
            update: "bg-blue-100 text-blue-700",
            delete: "bg-red-100 text-red-700",
        };

        return (
            <span
                className={`px-2 py-1 rounded-md text-xs font-semibold ${map[action] || "bg-gray-100 text-gray-600"
                    }`}
            >
                {action?.toUpperCase()}
            </span>
        );
    };

    /* =========================
       DIFF UPDATE
    ========================= */
    const getUpdatedFields = (before = {}, after = {}) => {
        const changes = [];

        Object.keys(after || {}).forEach((key) => {
            if (before?.[key] !== after?.[key]) {
                changes.push({
                    field: key,
                    before: before?.[key],
                    after: after?.[key],
                });
            }
        });

        return changes;
    };

    /* =========================
       CLEAN NULL VALUES
    ========================= */
    const cleanObject = (obj = {}) =>
        Object.fromEntries(
            Object.entries(obj).filter(
                ([, value]) =>
                    value !== null &&
                    value !== undefined &&
                    value !== ""
            )
        );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>

            <div className="card shadow-sm rounded-2xl p-6 bg-white overflow-x-auto">
                {loading ? (
                    <div className="text-gray-500">Loading...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="p-2 text-red-900">Waktu</th>
                                <th className="p-2 text-red-900">User</th>
                                <th className="p-2 text-red-900">Aksi</th>
                                <th className="p-2 text-red-900">Tabel</th>
                                <th className="p-2 text-red-900">Row ID</th>
                                <th className="p-2 text-red-900">Detail</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-4 text-center text-gray-500"
                                    >
                                        Tidak ada activity
                                    </td>
                                </tr>
                            ) : (
                                logs.map((r) => (
                                    <tr key={r.id} className="odd:bg-slate-50">
                                        <td className="p-2 text-red-900">
                                            {dayjs(r.created_at).format(
                                                "DD-MM-YYYY HH:mm"
                                            )}
                                        </td>

                                        <td className="p-2 text-red-900">
                                            {r.user_email || "-"}
                                        </td>

                                        <td className="p-2">
                                            {actionBadge(r.action)}
                                        </td>

                                        <td className="p-2 text-red-900">
                                            {r.table_name}
                                        </td>

                                        <td className="p-2 text-xs text-red-900">
                                            {r.row_id}
                                        </td>

                                        <td className="p-2 text-xs text-red-900 max-w-md">
                                            <pre className="whitespace-pre-wrap break-words">
                                                {r.action === "update" &&
                                                    r.details?.before &&
                                                    r.details?.after ? (
                                                    getUpdatedFields(
                                                        r.details.before,
                                                        r.details.after
                                                    )
                                                        .map(
                                                            (c) =>
                                                                `• ${c.field}: "${c.before ?? "-"}" → "${c.after ?? "-"}"`
                                                        )
                                                        .join("\n")
                                                ) : (
                                                    JSON.stringify(
                                                        cleanObject(r.details),
                                                        null,
                                                        2
                                                    )
                                                )}
                                            </pre>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
