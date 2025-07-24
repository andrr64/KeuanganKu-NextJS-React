export const runHandler = async (setVal: any, fn: any) => {
    setVal(true);
    await fn();
    setVal(false);
}