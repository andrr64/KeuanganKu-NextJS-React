type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
};

export type ActionParams<T = any> = {
  whenSuccess?: (data: T) => void;
  whenFailed?: (message: string) => void;
  toaster?: {
    success?: (msg: string) => void;
    error?: (msg: string) => void;
  };
};

export async function handleApiResponse<T>(
  responsePromise: Promise<ApiResponse<T>>,
  params: ActionParams<T> = {},
  defaultMessages?: { success?: string; error?: string }
) {
  const { success = "Sukses", error = "Terjadi kesalahan" } = defaultMessages || {};

  try {
    const response = await responsePromise;

    if (response.success && response.data !== undefined) {
      params.whenSuccess?.(response.data);
      params.toaster?.success?.(response.message || success);
    } else {
      const errorMsg = response.message || error;
      params.toaster?.error?.(errorMsg);
      params.whenFailed?.(errorMsg);
    }
  } catch (err: any) {
    const errorMsg = err.message || error;
    params.toaster?.error?.(errorMsg);
    params.whenFailed?.(errorMsg);
  }
}
