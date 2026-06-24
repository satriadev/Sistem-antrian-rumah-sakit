const API_URL = "http://127.0.0.1:8000";

// ── Label & Warna ──
function labelKondisi(k) {
    return {1:"Kritis",2:"Darurat",3:"Mendesak",4:"Ringan",5:"Non-darurat"}[k] || "—";
}

function badgeClass(k) {
    const map = {
        1:'bg-red-50 text-red-700 border-red-200',
        2:'bg-orange-50 text-orange-700 border-orange-200',
        3:'bg-yellow-50 text-yellow-700 border-yellow-200',
        4:'bg-green-50 text-green-700 border-green-200',
        5:'bg-blue-50 text-blue-700 border-blue-200'
    };
    return map[k] || 'bg-gray-50 text-gray-600 border-gray-200';
}

function triageClass(k) {
    const map = {1:'bg-red-600',2:'bg-orange-500',3:'bg-yellow-500',4:'bg-green-500',5:'bg-blue-500'};
    return map[k] || 'bg-gray-400';
}

function fmtWaktu(iso) {
    if (!iso) return "";
    const val = Number(iso);
    const d = !isNaN(val) ? new Date(val * 1000) : new Date(iso);
    return d.toLocaleString("id-ID", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

// ── Fetch Riwayat ──
async function loadRiwayat(search = "") {
    const infoEl = document.getElementById("searchInfo");
    const tbodyEl = document.getElementById("riwayatTableBody");

    try {
        const url = search ? `${API_URL}/riwayat?search=${encodeURIComponent(search)}` : `${API_URL}/riwayat`;
        const res = await fetch(url);
        const data = await res.json();

        if (search) {
            infoEl.textContent = `Hasil pencarian untuk "${search}" - ${data.length} ditemukan`;
        } else {
            infoEl.textContent = "";
        }

        renderRiwayat(data);
    } catch (err) {
        tbodyEl.innerHTML = '<tr><td colspan="5" class="text-sm text-red-500 text-center py-8">Gagal memuat riwayat.</td></tr>';
    }
}

function renderRiwayat(daftar) {
    const tbodyEl = document.getElementById("riwayatTableBody");
    if (daftar.length === 0) {
        tbodyEl.innerHTML = '<tr><td colspan="5" class="text-sm text-gray-400 text-center py-8">Belum ada riwayat penanganan.</td></tr>';
        return;
    }

    tbodyEl.innerHTML = daftar.map(p => `
        <tr class="animate-fade-in hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-none">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-700 shrink-0">
                        <i class="ti ti-circle-check text-base"></i>
                    </div>
                    <div>
                        <div class="font-semibold text-gray-900 text-sm">${p.nama}</div>
                        <div class="text-xs text-gray-500">${p.umur} th</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${badgeClass(p.kondisi)} font-medium">
                    <span class="w-2 h-2 rounded-full ${triageClass(p.kondisi)}"></span>
                    ${labelKondisi(p.kondisi)}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-700 flex items-center gap-1.5">
                    <i class="ti ti-stethoscope text-gray-400 text-base"></i>
                    <span class="truncate max-w-[200px]" title="${p.penyakit || ''}">${p.penyakit || "—"}</span>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-500 flex items-center gap-1.5">
                    <i class="ti ti-map-pin text-gray-400 text-base"></i>
                    <span class="truncate max-w-[200px]" title="${p.alamat || ''}">${p.alamat || "—"}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 flex items-center gap-1.5">
                    <i class="ti ti-clock text-gray-400 text-base"></i>
                    <span>${fmtWaktu(p.waktu)}</span>
                </div>
            </td>
        </tr>
    `).join("");
}

// ── Event Listener ──
document.getElementById("btnSearch").addEventListener("click", () => {
    const keyword = document.getElementById("searchInput").value.trim();
    loadRiwayat(keyword);
});

document.getElementById("searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        loadRiwayat(document.getElementById("searchInput").value.trim());
    }
});

document.getElementById("clearBtn").addEventListener("click", () => {
    if(confirm("Anda yakin ingin menghapus semua riwayat?")) {
        fetch(`${API_URL}/riwayat/clear`, {
            method: "DELETE"
        })
        .then(() => loadRiwayat(""))
        .catch(() => alert("Gagal menghapus riwayat."))
    }
});

loadRiwayat();