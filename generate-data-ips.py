from faker import Faker
import random
import xlwt

fake = Faker('id_ID')

def generate_nilai():
    return round(random.uniform(60, 100), 2)

def generate_data_ips(jumlah_data):
    data = []
    for _ in range(jumlah_data):
        data.append({
            "nama": fake.name(),
            "jurusan": "IPS",
            "ekonomi": generate_nilai(),
            "geografi": generate_nilai(),
            "sejarah": generate_nilai(),
            "sosiologi": generate_nilai()
        })
    return data

def simpan_ke_xls(data, nama_file):
    workbook = xlwt.Workbook()
    sheet = workbook.add_sheet("Data Siswa IPS")

    # Tulis header
    headers = list(data[0].keys())
    for col, header in enumerate(headers):
        sheet.write(0, col, header)

    # Tulis data
    for row_idx, row_data in enumerate(data, start=1):
        for col_idx, key in enumerate(headers):
            sheet.write(row_idx, col_idx, row_data[key])

    workbook.save(nama_file)
    print(f"Data berhasil disimpan ke {nama_file}")

# Jalankan
jumlah_data = 100
data_dummy = generate_data_ips(jumlah_data)
simpan_ke_xls(data_dummy, "data_siswa_ips.xls")
