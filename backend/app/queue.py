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
    
    def __eq__(self, other):
        return self.id == other.id
    
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

class MinHeap():
    def __init__(self):
        self.heap = []

    def parent(self, i):
        return (i-1) // 2
    
    def left(self, i):
        return (2*i) + 1
    
    def right(self, i):
        return (2*i) + 2
    
    def is_empty(self):
        return len(self.heap)
    
    def insert(self, item):
        self.heap.append(item)
        self.heapify_up(len(self.heap) - 1)

    def extract_min(self):
        if self.is_empty():
            return None
        min_item = self.heap[0]
        last_item = self.heap.pop()
        if not self.is_empty():
            self.heap[0] = last_item
            self.heapify_down(0)
        return min_item
    
    def


class Antrian:
    def __init__(self):
        self heap = MinHeap()
