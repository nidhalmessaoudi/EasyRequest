export default interface ApiBody {
  isSuccessful: boolean;
  statusCode?: number;
  requestTime?: number;
  requestSize?: number;
  message?: string;
}
