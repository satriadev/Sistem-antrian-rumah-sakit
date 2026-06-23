const API_URL = "http://localhost:8000";

document.getElementById("form-pasien").addEventListener("submit", tambahPasien);
document.getElementById("btn-panggil").addEventListener("click", panggilPasien);

setInterval(loadAntrian, 2000);
window.onload = loadAntrian;

// Label untuk kondisi
function labelKondisi(kondisi) {
    const labels = {
        1: 'Kritis',
        2: 'Darurat',
        3: 'Mendesak',
        4: 'Ringan',
        5: 'Non-darurat'
    };
    return labels[kondisi] || 'Tidak Diketahui';
}

// Warna border sesuai kondisi
function getKondisiColor(kondisi) {
    const colors = {
        1: '#e74c3c',
        2: '#e67e22',
        3: '#f1c40f',
        4: '#2ecc71',
        5: '#95a5a6'
    };
    return colors[kondisi] || '#95a5a6';
}

async function loadAntrian() {
    try {
        const res = await fetch(`${API_URL}/antrian`);
        const data = await res.json();
        renderAntrian(data);
    } catch (err) {
        console.error("Gagal memuat antrian:", err);
    }
}

function renderAntrian(daftar) {
    const listEl = document.getElementById("antrian-list");
    const jumlahEl = document.getElementById("jumlah-antrian");
    jumlahEl.textContent = daftar.length;

    if (daftar.length === 0) {
        listEl.innerHTML = '<p class="text-gray-400 italic text-center py-6">Belum ada pasien. Tambahkan melalui form.</p>';
        return;
    }

    listEl.innerHTML = daftar.map(p => `
        <div class="animate-fade-in p-3 border-l-4 rounded-md mb-2 bg-white shadow-sm" style="border-left-color: ${getKondisiColor(p.kondisi)}">
            <div class="font-bold text-gray-800">${p.nama} (${p.umur} th) — ${labelKondisi(p.kondisi)}</div>
            <div class="text-sm text-gray-600">${p.penyakit}</div>
            <div class="text-xs text-gray-500 mt-1">Alamat: ${p.alamat}</div>
        </div>
    `).join("");
}

async function tambahPasien(e) {
    e.preventDefault();

    const payload = {
        nama: document.getElementById("nama").value,
        umur: document.getElementById("umur").value,
        alamat: document.getElementById("alamat").value,
        penyakit: document.getElementById("penyakit").value,
        kondisi: parseInt(document.getElementById("kondisi").value),
        waktu: new Date()
    };

    try {
        const res = await fetch(`${API_URL}/pasien`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            document.getElementById("form-pasien").reset();
            loadAntrian();
        } else {
            alert("Gagal mendaftarkan pasien. Cek input.");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Terjadi kesalahan.");
    }
}

async function panggilPasien() {
    const pesanEl = document.getElementById("pesan-panggil");
    const ditanganiEl = document.getElementById("sedang-ditangani");

    try {
        const res = await fetch(`${API_URL}/panggil`, { method: "POST" });

        if (res.status === 404) {
            const errData = await res.json();
            pesanEl.textContent = errData.detail || "Antrian kosong.";
            ditanganiEl.innerHTML = '<p class="text-gray-500 italic">-- Tidak ada pasien --</p>';
            return;
        }

        if (!res.ok) {
            pesanEl.textContent = "Gagal memanggil.";
            return;
        }

        const data = await res.json();
        const p = data.dipanggil;
        ditanganiEl.innerHTML = `
            <div class="text-green-800">
                <span class="text-lg">🧑‍⚕️</span> <strong>${p.nama}</strong> (${p.umur} th) — ${labelKondisi(p.kondisi)}<br>
                <span class="text-sm">${p.penyakit}</span>
            </div>
        `;
        pesanEl.textContent = `✅ Pasien ${p.nama} sedang ditangani.`;
        loadAntrian();
    } catch (err) {
        console.error("Error:", err);
        pesanEl.textContent = "Terjadi kesalahan.";
    }
}