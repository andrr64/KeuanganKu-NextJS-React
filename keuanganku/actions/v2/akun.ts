import { AkunModel } from "@/types/model/akun";
import { fetcher } from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/api";
import { PostAKunBody, PutAkunBody } from "@/types/request/akun";
import { handleApiResponse } from "./base"; // Pastikan import handleApiResponse
import { ActionParams } from "./base"; // Pastikan ActionParams juga diimpor

export const action_v2_FetchAkun = async (
  params: ActionParams<AkunModel[]> = {}
) => {
  const responsePromise = fetcher<AkunModel[]>(API_ROUTES.AKUN.GET, {
    method: "GET",
  });

  await handleApiResponse<AkunModel[]>(responsePromise, params, {
    success: "Berhasil mengambil data akun.",
    error: "Gagal mengambil data akun.",
  });
};

export const action_v2_PostAkun = async (
  params: ActionParams<string> = {},
  body: PostAKunBody
) => {
  const responsePromise = fetcher(API_ROUTES.AKUN.POST, {
    method: "POST",
    body: JSON.stringify({
      namaAkun: body.nama,
      saldoAwal: body.saldoAwal,
    }),
  });

  await handleApiResponse<string>(responsePromise, params, {
    success: "Berhasil menambahkan akun.",
    error: "Gagal menambahkan akun.",
  });
};

export const action_v2_DeleteAkun = async (
  params: ActionParams<string> = {},
  id: string
) => {
  const responsePromise = fetcher(API_ROUTES.AKUN.HAPUS(id), {
    method: "DELETE",
  });

  await handleApiResponse<string>(responsePromise, params, {
    success: "Akun berhasil dihapus.",
    error: "Gagal menghapus akun.",
  });
};

export const action_v2_PutAkun = async (
  params: ActionParams<string> = {},
  body: PutAkunBody
) => {
  const responsePromise = fetcher(API_ROUTES.AKUN.UPDATE_NAMA(body.id), {
    method: "PUT",
    body: JSON.stringify({ nama: body.nama }),
  });

  await handleApiResponse<string>(responsePromise, params, {
    success: "Berhasil memperbarui akun.",
    error: "Gagal memperbarui akun.",
  });
};
