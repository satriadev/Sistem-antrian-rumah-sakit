from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.app.antrianRS import Antrian

app = FastAPI(title="Sistem Antrian IGD")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

antrian = Antrian()

class PasienInput(BaseModel):
    nama: str
    umur: str
    alamat: str
    penyakit: str
    kondisi: int


@app.post("/pasien")
def tambah_pasien(p: PasienInput):
    id = antrian.store(
        nama = p.nama,
        umur = p.umur,
        alamat = p.alamat,
        penyakit=p.penyakit,
        kondisi = p.kondisi,

    )
    return {"status": "sukses", "id": id}

@app.get("/antrian")
def lihat_antrian():
    daftar = antrian.show_all()
    return [p.to_dict() for p in daftar]

@app.post("/proses")
def proses_pasien():
    pasien = antrian.process()
    if pasien is None:
        raise HTTPException(status_code=404, detail="Antrian Kosong")
    return {"dipanggil": pasien.to_dict()}


@app.get("/riwayat")
def lihat_riwayat(search: str = Query("", min_length=0)):
    if search:
        return antrian.search(search)
    else:
        return antrian.riwayat.reverse()

@app.delete("/riwayat/clear")
def clear_cache():
    antrian.clearRiwayat()
    return {"status": "sukses", "pesan": "Riwayat berhasil dibersihkan."}