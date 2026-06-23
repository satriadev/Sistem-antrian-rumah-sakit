import time
import uuid

class Pasien:
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
        return len(self.heap) == 0
    
    def insert(self, item):
        self.heap.append(item)
        self._heapify_up(len(self.heap) - 1)

    def extract_min(self):
        if self.is_empty() > 0:
            return None
        min_item = self.heap[0]
        last_item = self.heap.pop()
        if not self.is_empty():
            self.heap[0] = last_item
            self._heapify_down(0)
        return min_item
    
    def _heapify_up(self, i):
        while i > 0:
            p = self.parent(i)
            if self.heap[i] < self.heap[p]:
                self.heap[i], self.heap[p] = self.heap[p], self.heap[i]
                i = p
            else:
                break
    
    def _heapify_down(self, i):
        n = len(self.heap)
        while 1:
            l = self.left(i)
            r  = self.right(i)
            smallest = i

            if l < n and self.heap[l] < self.heap[smallest]:
                smallest = l
            if r < n and self.heap[r] < self.heap[smallest]:
                smallest = r

            if smallest != i:
                self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
                i = smallest
            else:
                break
    
    def remove(self, item):
        try:
            idx = self.heap.index(item)
        except ValueError:
            return False
        
        last = self.heap.pop()
        if idx < len(self.heap):
            self.heap[idx] = last
            self._heapify_up(idx)
            self._heapify_down(idx)
        return True

    def get_all_sorted(self):
        return sorted(self.heap, key=lambda x: (x.kondisi, x.waktu))

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoubleLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0
    
    def prepend(self, data):
        new = Node(data)
        if not self.head:
            self.head = self.tail = new
        else:
            new.next = self.head
            self.head.prev = new
            self.head = new
        self.size += 1

    def reverse(self):
        result = []
        curr = self.tail
        while curr:
            result.append(curr.data.to_dict())
            curr = curr.prev
        return result

    def linear_search(self, keyword):
        result = []
        curr = self.head
        keyword = keyword.lower()
        while curr:
            if keyword in curr.data.nama.lower():
                result.append(curr.data.to_dict())
            curr = curr.next
        return result

class Antrian:
    def __init__(self):
        self.heap = MinHeap()
        self.data = {}

    def store(self, nama, umur, alamat, penyakit, kondisi):
        id = str(uuid.uuid4())[:8]
        waktu = time.time()
        pasien = Pasien(id, nama, umur, alamat, penyakit, kondisi, waktu)
        self.heap.insert(pasien)
        self.data[id] = pasien
        return id
    
    def process(self):
        pasien = self.heap.extract_min()
        if pasien:
            self.data.pop(pasien.id, None)
        return pasien
    
    def show_all(self):
        return self.heap.get_all_sorted()
    
    def delete(self, id):
        if id in self.data:
            pasien = self.data.pop(id)
            return self.heap.remove(pasien)
        return False
    
    def update_kondisi(self, id, new_kondisi):
        if id in self.data:
            pasien = self.data[id]
            pasien.kondisi = new_kondisi
            
            self.heap.heap = []
            for p in self.data.values():
                self.data.insert(p)
            return True
        return False