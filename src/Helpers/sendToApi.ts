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
      body.requestTime = reqInfo.Time;
      body.requestSize = reqInfo.Size;
    }

    if (message) {
      body.message = message;
    }

    const reqOptions: ReqOptions = {
      method: "POST",
      body: JSON.stringify(body),
    };

    const request = AJAX.main(new URL(`${CONFIG.api}/requests`), reqOptions);
    await request.asyncRequest();
  } catch (err) {
    return;
  }
}
