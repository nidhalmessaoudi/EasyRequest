import AJAX from "../utils/AJAX";
import ReqInfo from "../Interfaces/ReqInfo";
import CONFIG from "../utils/CONFIG";
import ReqOptions from "../Interfaces/ReqOptions";
import ApiBody from "../Interfaces/ApiBody";

export default async function sendToApi(
  isSuccessful: boolean,
  reqInfo?: ReqInfo,
  message?: string
) {
  try {
    let body: ApiBody = {
      isSuccessful,
    };

    if (reqInfo) {
      body.statusCode = reqInfo.Status;
      body.responseTime = reqInfo.Time;
      body.responseSize = reqInfo.Size;
    }

    if (message) {
      body.message = message;
    }

    const reqOptions: ReqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };

    const request = AJAX.main(`${CONFIG.api}/requests`, reqOptions);
    await request.asyncRequest();
  } catch (err) {
    return;
  }
}
