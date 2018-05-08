/**
 * fetch polyfill
 */
fetch = (url, data = null, method = null, headers = {}) => {
  let m = null;
  if (data && method === null) {
    m = "POST";
  } else if (method === null) {
    m = "GET";
  } else {
    m = method.toUpperCase();
  }

  const h = { "Content-Type": "application/json" , ...headers };

  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(m, url);
    Object.keys(h).forEach(key => {
      xhr.setRequestHeader(key, h[key]);
    });
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.response); 
        resolve({ data, status: xhr.status });
      } else {
        reject(Error(xhr.statusText));
      }
    },
    xhr.onerror = () => reject(xhr.statusText);
    const json = data ? JSON.stringify(data) : null;
    xhr.send(json);
  });
}