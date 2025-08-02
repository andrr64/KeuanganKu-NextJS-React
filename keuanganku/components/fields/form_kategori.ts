import { FieldConfig } from "../FormDialog";

// Di dalam komponen induk
export const fieldTambahKategori: FieldConfig[] = [
    {
        name: 'nama',
        label: 'Nama Kategori',
        type: 'text',
        required: true,
        placeholder: 'Contoh: Makanan, Gaji, Transportasi',
    },
    {
        name: 'jenis',
        label: 'Jenis Kategori',
        type: 'select',
        required: true,
        options: [
            { label: 'Pengeluaran', value: 1 },
            { label: 'Pemasukan', value: 2 },
        ],
    },
]

export const fieldUpdateKategori: FieldConfig[] = [
    {
        name: 'nama',
        label: 'Nama Kategori',
        type: 'text' as const,
        required: true,
        placeholder: 'Contoh: Makanan, Transportasi',
    },
]