import heapq
import time
import uuid

class Paisen:
    def __init__(self, id, nama, umur, alamat, penyakit, kondisi, waktu):
        self.id = id
        self.nama = nama
        self.umur = umur
        self.alamat = alamat
        self.penyakit = penyakit
        self.kondisi = kondisi
        self.waktu = waktu

    def __lt__(self, other):
        if self.kondisi == other.kondisi:
            return self.waktu < other.waktu
        return self.kondisi < other.kondisi
    
    def to_dict(self):
        return {
            "id": self.id,
            "nama": self.nama,
            "umur": self.umur,
            "alamat": self.alamat,
            "penyakit": self.penyakit,
            "kondisi": self.kondisi,
            "waktu": self.waktu,
        }
    
