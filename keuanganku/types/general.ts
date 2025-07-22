export interface GeneralResponse<T = any> {
  message: string;
  data?: T;
}
