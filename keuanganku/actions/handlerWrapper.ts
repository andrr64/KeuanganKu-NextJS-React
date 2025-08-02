export const runHandler = async (fn: any, setVal?: any) => {
    setVal?.(true);
    await fn();
    setVal?.(false);
}