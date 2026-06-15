from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.app.PriorQueue import Antrian

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
    waktu: str


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
    pasien = PasienInput()
    if pasien is None:
        raise HTTPException(status_code=404, detail="Antrian Kosong")
    return {"dipanggil": pasien.to_dict()}

@app.delete("/pasien/{id}")
def hapus_pasien(id: str):
    berhasil = antrian.delete(id)
    if not berhasil:
        raise HTTPException(status_code=404, detail="ID Tidak Ditemukan")
    return {"status": "dihapus"}
