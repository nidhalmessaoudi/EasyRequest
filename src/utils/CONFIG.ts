export default {
  root: document.getElementById("root")! as HTMLDivElement,
  client: "https://easyrequest.netlify.app",
  api: "https://easyrequest.herokuapp.com/api/v1",
  headers: {
    "User-Agent": "EasyRequest-Runtime/0.1.10",
    Accept: "*/*",
  },
};
