import { API_ROUTES } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { TransaksiModel } from "@/models/Transaksi";
import { GetTransaksiParams, PostTransaksiBody, PutTransaksiBody } from "@/types/request/transaksi";
import { Pageable as PageableResponse } from "@/types/response/pageable";
import { handleApiResponse } from "./base";

export const action_v2_PostTransaksi = async (
  params: ActionParams<string>,
  body: PostTransaksiBody
) => {
  const responsePromise = fetcher(API_ROUTES.TRANSAKSI.TAMBAH, {
    method: "POST",
    body: JSON.stringify(body),
  });

  await handleApiResponse<string>(responsePromise, params, {
    success: "Transaksi berhasil ditambahkan.",
    error: "Gagal menambahkan transaksi.",
  });
};

export const action_v2_FetchTransaksi = async (
  params: ActionParams<PageableResponse<TransaksiModel[]>>,
  reqParams: GetTransaksiParams
) => {
  const url = new URL(API_ROUTES.TRANSAKSI.FILTER);

  if (reqParams.startDate) url.searchParams.set("startDate", reqParams.startDate);
  if (reqParams.endDate) url.searchParams.set("endDate", reqParams.endDate);
  if (reqParams.jenis) url.searchParams.set("jenis", String(reqParams.jenis));
  if (reqParams.idAkun) url.searchParams.set("idAkun", reqParams.idAkun);
  if (reqParams.page !== undefined) url.searchParams.set("page", String(reqParams.page));
  if (reqParams.size !== undefined) url.searchParams.set("size", String(reqParams.size));
  if (reqParams.search) url.searchParams.set("keyword", reqParams.search);

  const responsePromise = fetcher<PageableResponse<TransaksiModel[]>>(url.toString(), {
    method: "GET",
  });
  await handleApiResponse<PageableResponse<TransaksiModel[]>>(responsePromise, params, {
    success: "Data transaksi berhasil dimuat.",
    error: "Gagal memuat data transaksi.",
  });
};

export const action_v2_DeleteTransaksi = async(
  params: ActionParams,
  id: string
) => {
  const responsePromise = fetcher(API_ROUTES.TRANSAKSI.DELETE(id), {method: 'DELETE'});
  await handleApiResponse<null>(responsePromise, params, {
    success: 'Transaksi berhasil disimpan',
    error: 'Transaksi gagal dihapus'
  })
}

export const action_v2_PutTransaksi = async (
  params: ActionParams,
  body: PutTransaksiBody
) => {
  const {id, ...x} = body;
  const responsePromise = fetcher(API_ROUTES.TRANSAKSI.PUT(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(x),
  });
  await handleApiResponse<null>(responsePromise, params)
}