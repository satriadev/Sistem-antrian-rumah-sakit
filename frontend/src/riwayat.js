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
    const d = new Date(iso);
    return d.toLocaleString("id-ID", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

// ── Fetch Riwayat ──
async function loadRiwayat(search = "") {
    const infoEl = document.getElementById("searchInfo");
    const listEl = document.getElementById("riwayatList");

    try {
        const url = search ? `${API_URL}/riwayat?search=${encodeURIComponent(search)}` : `${API_URL}/riwayat`;
        const res = await fetch(url);
        const data = await res.json();

        if (search) {
            infoEl.textContent = `Hasil pencarian untuk "${search}" — ${data.length} ditemukan`;
        } else {
            infoEl.textContent = "";
        }

        renderRiwayat(data);
    } catch (err) {
        listEl.innerHTML = '<p class="text-sm text-red-500 text-center py-8">Gagal memuat riwayat.</p>';
    }
}

function renderRiwayat(daftar) {
    const listEl = document.getElementById("riwayatList");
    if (daftar.length === 0) {
        listEl.innerHTML = '<p class="text-sm text-gray-400 italic text-center py-8">Belum ada riwayat penanganan.</p>';
        return;
    }

    listEl.innerHTML = daftar.map(p => `
        <div class="animate-fade-in flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-white hover:shadow-sm transition">
            <div class="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <i class="ti ti-circle-check text-teal-700 text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-gray-900 text-sm">${p.nama}, ${p.umur} th</span>
                    <span class="text-xs px-2 py-0.5 rounded border ${badgeClass(p.kondisi)} font-medium">
                        ${labelKondisi(p.kondisi)}
                    </span>
                </div>
                <p class="text-xs text-gray-600 flex items-center gap-1 mb-1">
                    <i class="ti ti-stethoscope text-xs"></i> ${p.penyakit || "—"}
                </p>
                <p class="text-xs text-gray-500 flex items-center gap-1">
                    <i class="ti ti-map-pin text-xs"></i> ${p.alamat || "—"}
                    <span class="mx-1">·</span>
                    <i class="ti ti-clock text-xs"></i> ${fmtWaktu(p.waktu)}
                </p>
            </div>
            <div class="hidden sm:block w-1 ${triageClass(p.kondisi)} rounded-full self-stretch"></div>
        </div>
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

// ── Inisialisasi ──
loadRiwayat();