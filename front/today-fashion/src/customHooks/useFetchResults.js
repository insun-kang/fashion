// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// function useFetchResults(path, data, pageNum, dataSize) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [list, setList] = useState([]);

//   const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;

//   axios.defaults.baseURL = SERVER_URL;
//   axios.defaults.headers.common['Authorization'] = AuthStr;

//   const sendQuery = useCallback(async () => {
//     try {
//       await setLoading(true);
//       await setError(false);
//       const res = await axios.post(
//         `https://openlibrary.org/search.json?q=${query}&page=${page}`
//       );
//       await setList((prev) => [
//         ...new Set([...prev, ...res.data.docs.map((d) => d.title)]),
//       ]);
//       setLoading(false);
//     } catch (err) {
//       setError(err);
//     }
//   }, [query, page]);

//   useEffect(() => {
//     sendQuery(query);
//   }, [query, sendQuery, page]);

//   return { loading, error, list };
// }

// export default useFetch;
