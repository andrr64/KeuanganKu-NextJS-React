export interface ResponseModel<T = any> {
  message: string;
  data?: T;
}
