import toast from 'react-hot-toast';

export interface ApiActionOptions<T> {
  action: () => Promise<{ success: boolean; message?: string; data?: T }>;
  onSuccess?: (data: T) => void;
  onFinally?: () => void;
  successMessage?: string;
}

export async function handleApiAction<T>({
  action,
  onSuccess,
  onFinally,
  successMessage,
}: ApiActionOptions<T>): Promise<T | null> {
  try {
    const response = await action();

    if (!response.success) throw new Error(response.message);

    if (successMessage) {
      toast.success(successMessage);
    }

    if (response.data !== undefined) {
      onSuccess?.(response.data);
      return response.data;
    } else {
      onSuccess?.(undefined as T); // fallback kalo data undefined
      return null;
    }
  } catch (e: any) {
    toast.error(`Error: ${e.message}`);
    return null;
  } finally {
    onFinally?.();
  }
}
