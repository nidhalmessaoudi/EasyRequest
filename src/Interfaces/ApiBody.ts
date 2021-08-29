export default interface ApiBody {
  isSuccessful: boolean;
  statusCode?: number;
  responseTime?: number;
  responseSize?: number;
  message?: string;
}
