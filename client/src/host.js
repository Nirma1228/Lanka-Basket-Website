const api = process.env.REACT_APP_API_URL;

fetch(`${api}/api/products`)
  .then(res => res.json())
  .then(data => console.log(data));
