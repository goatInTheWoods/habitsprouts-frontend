// import React, { useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import DispatchContext from '../DispatchContext';
// import { useImmer } from 'use-immer';
// import axios from 'axios';
// import Post from './Post';

// function Search() {
//   const appDispatch = useContext(DispatchContext);
//   const [state, setState] = useImmer({
//     searchTerm: '',
//     results: [],
//     show: 'neither',
//     requestCount: 0,
//   });

//   useEffect(() => {
//     document.addEventListener('keydown', searchKeyPressHandler);
//     return () => {
//       document.removeEventListener('keydown', searchKeyPressHandler);
//     };
//   }, []);

//   useEffect(() => {
//     if (state.searchTerm.trim()) {
//       setState(draft => {
//         draft.show = 'loading';
//       });

//       const delay = setTimeout(() => {
//         setState(draft => {
//           draft.requestCount++;
//         });
//       }, 750);

//       return () => {
//         clearTimeout(delay);
//       };
//     } else {
//       setState(draft => {
//         draft.show = 'neither';
//       });
//     }
//   }, [state.searchTerm]);

//   useEffect(() => {
//     if (state.requestCount) {
//       const ourRequest = axios.CancelToken.source();
//       async function fetchResults() {
//         try {
//           const response = await axios.post(
//             '/search',
//             { searchTerm: state.searchTerm },
//             { cancelToken: ourRequest.token }
//           );
//           setState(draft => {
//             draft.results = response.data;
//             draft.show = 'results';
//           });
//           /*
//          Even though GET is the more conventional solution for querying data,
//          there are plenty of cases where a GET is too limited to perform a /search.
//          The essence of the problem, is that a GET has **no request body**, and for that reason
//          it cannot handle more complex request. In essence a GET can only send data using the URL.
//          A URL can contain path parameters and query parameters, which are just a set of key-value pairs
//          where both key and value are of a string type.
//          By contrast, a POST can in addition also carry an entire JSON document in its body.
//          By restricting ourselves to a GET, we cannot use any of those JSON features,
//          and as a result we cannot send proper objects or arrays to our back-end.

//          **Opposite opinion: Search is not necessarily a Post, you're trying to get some data, not modify or insert.
//          */
//         } catch (e) {
//           console.log(
//             'There was a problem or the request was cancelled.'
//           );
//         }
//       }
//       fetchResults();

//       return () => {
//         ourRequest.cancel();
//       };
//     }
//   }, [state.requestCount]);

//   function searchKeyPressHandler({ keyCode }) {
//     if (keyCode == '27') {
//       //escape
//       appDispatch({ type: 'closeSearch' });
//     }
//   }

//   function handleInput(e) {
//     const value = e.target.value;
//     setState(draft => {
//       draft.searchTerm = value;
//     });
//   }

//   return (
//     <>
//       <div className="search-overlay-top shadow-sm">
//         <div className="container container--narrow">
//           <label
//             htmlFor="live-search-field"
//             className="search-overlay-icon"
//           >
//             <i className="fas fa-search"></i>
//           </label>
//           <input
//             onChange={handleInput}
//             autoFocus
//             type="text"
//             autoComplete="off"
//             id="live-search-field"
//             className="live-search-field"
//             placeholder="What are you interested in?"
//           />
//           <span
//             onClick={() => appDispatch({ type: 'closeSearch' })}
//             className="close-live-search"
//           >
//             <i className="fas fa-times-circle"></i>
//           </span>
//         </div>
//       </div>

//       <div className="search-overlay-bottom">
//         <div className="container container--narrow py-3">
//           <div
//             className={
//               'circle-loader ' +
//               (state.show == 'loading'
//                 ? 'circle-loader--visible'
//                 : '')
//             }
//           ></div>
//           <div
//             className={
//               'live-search-results ' +
//               (state.show == 'results'
//                 ? 'live-search-results--visible'
//                 : '')
//             }
//           >
//             {Boolean(state.results.length) && (
//               <div className="list-group shadow-sm">
//                 <div className="list-group-item active">
//                   <strong>Search Results</strong> (
//                   {state.results.length}{' '}
//                   {state.results.elngth > 1 ? 'items' : 'item'} found)
//                 </div>
//                 {state.results.map(post => {
//                   return (
//                     <Post
//                       post={post}
//                       key={post._id}
//                       onClick={() =>
//                         appDispatch({ type: 'closeSearch' })
//                       }
//                     />
//                   );
//                 })}
//               </div>
//             )}
//             {!Boolean(state.results.length) && (
//               <p className="alert alert-danger text-center shadow-sm">
//                 Sorry, we could not find any results for that search.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Search;
