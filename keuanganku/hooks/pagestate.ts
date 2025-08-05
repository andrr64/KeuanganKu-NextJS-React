import { useState } from "react";

type UsePageStateReturn = {
    loadingStatus: boolean;
    error: string | null;
    setError: (err: string) => void;
    loading: () => void;
    finished: () => void;
    resetError: () => void;
    isError: boolean;
};

export const usePageState = (
    initialLoading = false,
    initialError: string | null = null
): UsePageStateReturn => {
    const [loadingStatus, setLoading] = useState<boolean>(initialLoading);
    const [error, setErrorState] = useState<string | null>(initialError);

    return {
        loadingStatus,
        error,
        setError: (err: string) => {
            setErrorState(err);
        },
        loading: () => {
            setLoading(true)
        },
        finished: () => {
            setLoading(false);
        },
        resetError: () => {
            setErrorState(null)
        },
        isError: error !== null,
    };
};
