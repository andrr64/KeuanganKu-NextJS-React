type ActionParams<T = any> = {
  whenSuccess?: (data: T) => void;
  whenFailed?: (data: string) => void;
  toaster?: any;
};