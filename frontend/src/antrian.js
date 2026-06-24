const API_URL = "http://127.0.0.1:8000";

// ── Date helper ──
(function setDate() {
    const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const now = new Date();
    document.getElementById("topbar-date").textContent = 
        `${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
})();

// ── Toast ──
function showToast(msg, type = 'default') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-teal-700 border-teal-400 text-white',
        error: 'bg-red-700 border-red-400 text-white',
        default: 'bg-gray-800 border-gray-500 text-white'
    };
    toast.className = `toast-enter ${colors[type] || colors.default} px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm`;
    toast.innerHTML = `<i class="ti ti-${type==='success'?'circle-check':type==='error'?'alert-circle':'info-circle'} text-base"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ── Label & Styling ──
function labelKondisi(k) {
    return {1:"Kritis",2:"Darurat",3:"Mendesak",4:"Ringan",5:"Non-darurat"}[k] || " - ";
}

function triageClass(k) {
    const map = {1:'bg-red-600',2:'bg-orange-500',3:'bg-yellow-500',4:'bg-green-500',5:'bg-blue-500'};
    return map[k] || 'bg-gray-400';
}

function badgeClass(k) {
    const map = {1:'bg-red-50 text-red-700 border-red-200',2:'bg-orange-50 text-orange-700 border-orange-200',3:'bg-yellow-50 text-yellow-700 border-yellow-200',4:'bg-green-50 text-green-700 border-green-200',5:'bg-blue-50 text-blue-700 border-blue-200'};
    return map[k] || 'bg-gray-50 text-gray-600 border-gray-200';
}

// ── Format waktu dari ISO string ──
function fmtWaktu(iso) {
    if (!iso) return "";
    const val = Number(iso);
    const d = !isNaN(val) ? new Date(val * 1000) : new Date(iso);
    return d.toLocaleTimeString("id-ID", {hour:"2-digit", minute:"2-digit"});
}

// ── Load Antrian ──
async function loadAntrian() {
    const tbodyEl = document.getElementById("antrian-tbody");
    try {
        const res = await fetch(`${API_URL}/antrian`);
        const data = await res.json();
        renderAntrian(data);
    } catch (err) {
        console.error("Gagal memuat antrian:", err);
        if (tbodyEl) {
            tbodyEl.innerHTML = `
                <tr>
                    <td colspan="5" class="text-sm text-red-500 text-center py-12">
                        Gagal memuat antrian. Pastikan server backend aktif.
                    </td>
                </tr>`;
        }
    }
}

function renderAntrian(daftar) {
    const tbodyEl = document.getElementById("antrian-tbody");
    if (!tbodyEl) return;

    const jumlahEl = document.getElementById("jumlah-antrian");
    const countEl = document.getElementById("antrian-count");
    const kritisEl = document.getElementById("kritis-count");

    const total = daftar.length;
    const kritis = daftar.filter(p => p.kondisi === 1 || p.kondisi === 2).length;
    
    if (jumlahEl) jumlahEl.textContent = total;
    if (countEl) countEl.textContent = total;
    if (kritisEl) kritisEl.textContent = kritis;

    if (total === 0) {
        tbodyEl.innerHTML = `
            <tr>
                <td colspan="5" class="text-sm text-gray-400 text-center py-12">
                    <i class="ti ti-users-group text-4xl block mb-2 opacity-40 mx-auto"></i>
                    Belum ada pasien<br><span class="text-xs text-gray-400">Tambahkan melalui form</span>
                </td>
            </tr>`;
        return;
    }

    tbodyEl.innerHTML = daftar.map((p, i) => `
        <tr class="animate-fade-in hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-none">
            <td class="px-4 py-3 whitespace-nowrap text-center">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                    ${String(i+1).padStart(2,'0')}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <div class="font-semibold text-gray-900 text-sm">${p.nama}</div>
                <div class="text-xs text-gray-500">${p.umur} th</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${badgeClass(p.kondisi)} font-medium">
                    <span class="w-2 h-2 rounded-full ${triageClass(p.kondisi)}"></span>
                    ${labelKondisi(p.kondisi)}
                </span>
            </td>
            <td class="px-4 py-3">
                <div class="text-sm text-gray-700 flex items-center gap-1.5">
                    <i class="ti ti-stethoscope text-gray-400 text-base"></i>
                    <span class="truncate max-w-[150px]" title="${p.penyakit || ''}">${p.penyakit || "—"}</span>
                </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-xs text-gray-500 flex items-center gap-1">
                    <i class="ti ti-clock text-xs"></i> ${fmtWaktu(p.waktu)}
                </div>
            </td>
        </tr>
    `).join("");
}

// ── Tambah Pasien ──
document.getElementById("form-pasien").addEventListener("submit", async function(e) {
    e.preventDefault();
    const payload = {
        nama: document.getElementById("nama").value.trim(),
        umur: document.getElementById("umur").value,
        alamat: document.getElementById("alamat").value.trim(),
        penyakit: document.getElementById("penyakit").value.trim(),
        kondisi: parseInt(document.getElementById("kondisi").value),
        waktu: new Date()
    };
    try {
        const res = await fetch(`${API_URL}/pasien`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            document.getElementById("form-pasien").reset();
            showToast(`${payload.nama} berhasil didaftarkan.`, "success");
            loadAntrian();
        } else {
            const err = await res.json();
            showToast("Gagal: " + (err.detail ? JSON.stringify(err.detail) : "Cek input."), "error");
        }
    } catch (err) {
        showToast("Tidak dapat terhubung ke server.", "error");
    }
});

// ── Panggil Pasien ──
// const riwayatLokal = []; // menyimpan riwayat sementara untuk tampilan kiri

document.getElementById("btn-panggil").addEventListener("click", async function() {
    const ditanganiEl = document.getElementById("sedang-ditangani");
    const pesanEl = document.getElementById("pesan-panggil");
    try {
        const res = await fetch(`${API_URL}/proses`, { method: "POST" });
        if (res.status === 404) {
            // const err = await res.json();
            // pesanEl.textContent = err.detail || "Antrian kosong.";  
            ditanganiEl.innerHTML = '<p class="text-sm text-gray-500">Antrian kosong</p>';
            return;
        }
        if (!res.ok) {
            pesanEl.textContent = "Gagal memanggil.";
            return;
        }
        const data = await res.json();
        const p = data.dipanggil;

        // Tampilkan di panel "Sedang Ditangani"
        ditanganiEl.innerHTML = `
            <div class="flex items-center gap-2 mr-2">
                <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </span>
                <span class="text-xs font-semibold text-teal-700 bg-white px-2 py-0.5 rounded-full border border-teal-200">Ditangani sekarang</span>
            </div>
            <p class="font-semibold text-teal-900 mr-2">${p.nama}</p>
            <p class="text-sm text-teal-700 flex items-center gap-1 mt-1">
                <i class="ti ti-stethoscope text-base"></i> ${p.penyakit || "—"}
            </p>
        `;
        pesanEl.textContent = "";
        showToast(`${p.nama} dipanggil untuk ditangani.`, "success");
        
        loadAntrian();
    } catch (err) {
        pesanEl.textContent = "Tidak dapat terhubung ke server.";
    }
});

// ── Polling ──
// setInterval(loadAntrian, 1000);  
loadAntrian();