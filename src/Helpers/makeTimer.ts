export default function makeTimer(sec: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res("Timer finished!");
    }, sec * 1000);
  });
}
