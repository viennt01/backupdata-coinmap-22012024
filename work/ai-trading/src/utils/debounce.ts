function debounce(callback: (...args: any[]) => void, time: number) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, time);
  };
}
export default debounce;
