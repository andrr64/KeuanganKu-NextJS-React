export type HandlerParams<T = undefined> = {
    setLoading?: (val: boolean) => void;
    toaster?: any;
    whenSuccess?: (data: T) => void;
    whenFailed?: (msg: string) => void;
}
