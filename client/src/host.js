const api = process.env.VITE_API_URL;

fetch(`${api}/api/products`)
  .then(res => res.json())
  .then(data => console.log(data));
