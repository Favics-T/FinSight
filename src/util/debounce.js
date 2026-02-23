export function debounce(func, wait = 300, options = {}) {
  let timerId;
  let lastArgs;
  let lastThis;
  let lastCallTime;
  let lastInvokeTime = 0;

  const leading = Boolean(options.leading);
  const trailing = options.trailing !== false;
  const maxWait = Number.isFinite(options.maxWait) ? options.maxWait : null;

  const invokeFunc = (time) => {
    lastInvokeTime = time;
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = undefined;
    lastThis = undefined;
    return func.apply(thisArg, args);
  };

  const shouldInvoke = (time) => {
    if (lastCallTime === undefined) return true;
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== null && timeSinceLastInvoke >= maxWait)
    );
  };

  const trailingEdge = (time) => {
    timerId = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    lastThis = undefined;
    return undefined;
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    const timeSinceLastCall = time - lastCallTime;
    const timeWaiting = wait - timeSinceLastCall;
    timerId = setTimeout(timerExpired, timeWaiting);
    return undefined;
  };

  const debounced = function (...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
        if (leading) {
          return invokeFunc(time);
        }
      } else if (maxWait !== null) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(time);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    return undefined;
  };

  debounced.cancel = () => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = undefined;
    lastArgs = undefined;
    lastThis = undefined;
    lastCallTime = undefined;
  };

  debounced.flush = () => {
    if (timerId === undefined) return undefined;
    return trailingEdge(Date.now());
  };

  return debounced;
}


