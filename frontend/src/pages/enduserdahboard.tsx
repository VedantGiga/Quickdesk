// import React from 'react';

// const EndUserDashboard = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-800">
//       {/* Top Navigation */}
//       <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
//         <div className="text-2xl font-bold">QuickDesk</div>
//         <div className="space-x-6">
//           <a href="#" className="hover:underline">Tickets</a>
//           <a href="#" className="hover:underline">Reports</a>
//           <a href="#" className="hover:underline">Admin</a>
//         </div>
//         <div className="w-8 h-8 rounded-full bg-white text-blue-900 flex items-center justify-center font-bold">
//           <i className="fa fa-user"></i>
//         </div>
//       </nav>

//       {/* Main Section */}
//       <div className="flex p-6">
//         {/* Sidebar Filters */}
//         <div className="w-1/4 bg-white p-4 shadow-md rounded-md">
//           <input
//             type="text"
//             placeholder="Search tickets"
//             className="w-full border px-3 py-2 rounded mb-4"
//           />
//           <div className="mb-4">
//             <label className="block font-semibold mb-1">Search tickets</label>
//             <select className="w-full border px-3 py-2 rounded">
//               <option>Open</option>
//               <option>Closed</option>
//               <option>In Progress</option>
//               <option>Resolved</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block font-semibold mb-1">Category</label>
//             <select className="w-full border px-3 py-2 rounded">
//               <option>All</option>
//               <option>Network</option>
//               <option>Email</option>
//               <option>Software</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block font-semibold mb-1">Sort by</label>
//             <select className="w-full border px-3 py-2 rounded">
//               <option>Most replied</option>
//               <option>Recently updated</option>
//             </select>
//           </div>
//           <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
//             New Ticket
//           </button>
//         </div>

//         {/* Ticket List */}
//         <div className="w-3/4 ml-6">
//           <div className="bg-white shadow-md rounded-md overflow-hidden">
//             <table className="w-full table-auto">
//               <thead className="bg-gray-200 text-left">
//                 <tr>
//                   <th className="p-3">Subject</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">Agent</th>
//                   <th className="p-3">Updated</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   {
//                     subject: 'Cannot connect to VPN',
//                     status: 'Open',
//                     agent: 'Emily Johnson',
//                     updated: 'Apr 24, 2024',
//                   },
//                   {
//                     subject: 'Issue with email notifications',
//                     status: 'Open',
//                     agent: 'John Smith',
//                     updated: 'Apr 23, 2024',
//                   },
//                   {
//                     subject: 'Software installation help',
//                     status: 'Open',
//                     agent: 'Sarah Brown',
//                     updated: 'Apr 22, 2024',
//                   },
//                   {
//                     subject: 'Error message on login',
//                     status: 'Open',
//                     agent: 'James Wilson',
//                     updated: 'Apr 20, 2024',
//                   },
//                 ].map((ticket, i) => (
//                   <tr key={i} className="hover:bg-gray-100 border-t">
//                     <td className="p-3">{ticket.subject}</td>
//                     <td className="p-3">
//                       <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
//                         {ticket.status}
//                       </span>
//                     </td>
//                     <td className="p-3">{ticket.agent}</td>
//                     <td className="p-3">{ticket.updated}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination (Simple Placeholder) */}
//           <div className="flex justify-end mt-4 space-x-2">
//             <button className="px-3 py-1 border rounded hover:bg-blue-100">Prev</button>
//             <button className="px-3 py-1 border rounded hover:bg-blue-100">1</button>
//             <button className="px-3 py-1 border rounded hover:bg-blue-100">2</button>
//             <button className="px-3 py-1 border rounded hover:bg-blue-100">Next</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EndUserDashboard;


// import React from 'react';
// import { FaUser, FaFolder, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// const EndUserDashboard = () => {
//   const tickets = [
//     {
//       id: 1,
//       title: 'Is it good things to use AI for hackathon?',
//       category: 'Software',
//       status: 'Open',
//       company: 'odoo IV pvt. ltd.',
//       conversationCount: 23,
//     },
//     {
//       id: 2,
//       title: 'Is it good things to use AI for hackathon?',
//       category: 'Software',
//       status: 'Open',
//       company: 'odoo IV pvt. ltd.',
//       conversationCount: 23,
//     },
//     {
//       id: 3,
//       title: 'Is it good things to use AI for hackathon?',
//       category: 'Software',
//       status: 'Open',
//       company: 'odoo IV pvt. ltd.',
//       conversationCount: 23,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white text-gray-800">
//       {/* Navigation */}
//       <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
//         <div className="text-2xl font-bold">QuickDesk</div>
//         <div className="flex space-x-6 text-sm">
//           <a href="#" className="hover:underline">Dashboard</a>
//           <a href="#" className="hover:underline">Tickets</a>
//           <a href="#" className="hover:underline">Reports</a>
//         </div>
//         <div className="w-8 h-8 rounded-full bg-white text-blue-900 flex items-center justify-center">
//           <FaUser />
//         </div>
//       </nav>

//       {/* User Info and Filters */}
//       <div className="p-6">
//         <h2 className="text-xl font-semibold mb-4">Ishaan dua</h2>
//         <div className="flex flex-wrap items-center gap-4 mb-6">
//           <label className="flex items-center gap-2">
//             <input type="checkbox" /> <span>Show open only</span>
//           </label>
//           <select className="border px-3 py-2 rounded">
//             <option>Category</option>
//           </select>
//           <select className="border px-3 py-2 rounded">
//             <option>Status</option>
//           </select>
//           <select className="border px-3 py-2 rounded">
//             <option>Sort by</option>
//             <option>Most recent</option>
//             <option>Most comments</option>
//           </select>
//         </div>

//         {/* Ticket Cards */}
//         {tickets.map(ticket => (
//           <div
//             key={ticket.id}
//             className="flex justify-between items-center bg-white border rounded-lg p-4 mb-4 shadow-sm"
//           >
//             <div className="flex items-start gap-3">
//               <FaFolder className="text-2xl mt-1" />
//               <div>
//                 <h3 className="font-semibold text-lg mb-1">{ticket.title}</h3>
//                 <div className="flex gap-2 mb-1">
//                   <span className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
//                     {ticket.category.length > 6 ? ticket.category.slice(0, 5) + '…' : ticket.category}
//                   </span>
//                   <span className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
//                     {ticket.status}
//                   </span>
//                 </div>
//                 <p className="text-sm text-green-700">Posted by {ticket.company}</p>
//               </div>
//             </div>
//             <div className="flex flex-col items-center">
//               <span className="text-sm text-orange-500 font-medium">● {ticket.status}</span>
//               <div className="mt-2 px-3 py-1 bg-green-200 text-green-800 font-bold rounded-md">
//                 {ticket.conversationCount}
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Pagination */}
//         <div className="flex justify-center items-center space-x-2 mt-6">
//           <button className="text-gray-600 hover:text-blue-600"><FaArrowLeft /></button>
//           <button className="w-8 h-8 rounded-full bg-purple-700 text-white">1</button>
//           <button className="w-8 h-8 rounded-full hover:bg-gray-200">2</button>
//           <button className="w-8 h-8 rounded-full hover:bg-gray-200">3</button>
//           <button className="text-gray-600 hover:text-blue-600"><FaArrowRight /></button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EndUserDashboard;


// import React from 'react';
// import { FaUser, FaFolder, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

// const EndUserDashboard = () => {
//   const tickets = [
//     {
//       title: 'Is it good things to use AI for hackathon?',
//       category: 'Software',
//       status: 'Open',
//       company: 'odoo IV pvt. ltd.',
//       comments: 23,
//     },
//     {
//       title: 'Is it good things to use AI for hackathon?',
//       category: 'Software',
//       status: 'Open',
//       company: 'odoo IV pvt. ltd.',
//       comments: 23,
//     },
//     {
//       title: 'Is it good things to use AI for hackathon?',
//       category: 'Software',
//       status: 'Open',
//       company: 'odoo IV pvt. ltd.',
//       comments: 23,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Top Nav */}
//       <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
//         <div className="text-2xl font-bold">QuickDesk</div>
//         <div className="flex gap-6 text-sm">
//           <a href="#" className="hover:underline">Dashboard</a>
//           <a href="#" className="hover:underline">Tickets</a>
//           <a href="#" className="hover:underline">Reports</a>
//         </div>
//         <div className="w-8 h-8 rounded-full bg-white text-blue-900 flex items-center justify-center">
//           <FaUser />
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="px-6 py-4">
//         <h2 className="text-lg font-semibold mb-4">Ishaan dua</h2>

//         {/* Filter Controls */}
//         <div className="bg-white p-4 rounded-md shadow flex flex-wrap gap-4 items-center mb-6">
//           <label className="flex items-center gap-2">
//             <input type="checkbox" className="form-checkbox" />
//             Show open only
//           </label>
//           <select className="border rounded px-3 py-2">
//             <option>Category</option>
//           </select>
//           <select className="border rounded px-3 py-2">
//             <option>Status</option>
//           </select>
//           <select className="border rounded px-3 py-2 ml-auto">
//             <option>Most recent</option>
//           </select>
//         </div>

//         {/* Ticket List */}
//         <div className="space-y-4">
//           {tickets.map((ticket, index) => (
//             <div
//               key={index}
//               className="bg-white p-4 rounded-md shadow flex justify-between items-center"
//             >
//               <div className="flex gap-4 items-center">
//                 <FaFolder className="text-2xl text-gray-700" />
//                 <div>
//                   <h3 className="font-semibold">{ticket.title}</h3>
//                   <div className="flex gap-2 mt-1 text-sm">
//                     <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
//                       {ticket.category}
//                     </span>
//                     <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
//                       {ticket.status}
//                     </span>
//                     <span className="text-gray-500">
//                       Posted by <span className="text-green-700">{ticket.company}</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <span className="text-sm bg-green-200 px-2 py-1 rounded-md font-semibold text-green-800">
//                   {ticket.comments}
//                 </span>
//                 <div className="flex justify-center mt-1 text-gray-600 gap-2 text-sm">
//                   <FaThumbsUp />
//                   <FaThumbsDown />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button className="px-2 py-1 rounded border hover:bg-gray-200">&lt;</button>
//           <button className="px-3 py-1 bg-purple-700 text-white rounded">1</button>
//           <button className="px-3 py-1 border rounded">2</button>
//           <button className="px-2 py-1 rounded border hover:bg-gray-200">&gt;</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EndUserDashboard;



// import React, { useEffect, useState } from 'react';

// import FaUser from 'react-icons/fa/FaUser';
// import FaFolder from 'react-icons/fa/FaFolder';
// import FaThumbsUp from 'react-icons/fa/FaThumbsUp';
// import FaThumbsDown from 'react-icons/fa/FaThumbsDown';



// import { db } from '../services/firebse'; // adjust path as needed
// import { collection, getDocs } from 'firebase/firestore';

// interface Ticket {
//   title: string;
//   category: string;
//   status: string;
//   company: string;
//   comments: number;
// }

// const EndUserDashboard = () => {
//   const [tickets, setTickets] = useState<Ticket[]>([]);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       const querySnapshot = await getDocs(collection(db, 'tickets'));
//       const fetchedTickets: Ticket[] = [];
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         fetchedTickets.push({
//           title: data.title,
//           category: data.category,
//           status: data.status,
//           company: data.company,
//           comments: data.comments,
//         });
//       });
//       setTickets(fetchedTickets);
//     };

//     fetchTickets();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Top Nav */}
//       <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
//         <div className="text-2xl font-bold">QuickDesk</div>
//         <div className="flex gap-6 text-sm">
//           <a href="#" className="hover:underline">Dashboard</a>
//           <a href="#" className="hover:underline">Tickets</a>
//           <a href="#" className="hover:underline">Reports</a>
//         </div>
//         <div className="w-8 h-8 rounded-full bg-white text-blue-900 flex items-center justify-center">
//           <FaUser />
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="px-6 py-4">
//         <h2 className="text-lg font-semibold mb-4">Ishaan dua</h2>

//         {/* Filter Controls */}
//         <div className="bg-white p-4 rounded-md shadow flex flex-wrap gap-4 items-center mb-6">
//           <label className="flex items-center gap-2">
//             <input type="checkbox" className="form-checkbox" />
//             Show open only
//           </label>
//           <select className="border rounded px-3 py-2">
//             <option>Category</option>
//           </select>
//           <select className="border rounded px-3 py-2">
//             <option>Status</option>
//           </select>
//           <select className="border rounded px-3 py-2 ml-auto">
//             <option>Most recent</option>
//           </select>
//         </div>

//         {/* Ticket List */}
//         <div className="space-y-4">
//           {tickets.map((ticket, index) => (
//             <div
//               key={index}
//               className="bg-white p-4 rounded-md shadow flex justify-between items-center"
//             >
//               <div className="flex gap-4 items-center">
//                 <FaFolder className="text-2xl text-gray-700" />
//                 <div>
//                   <h3 className="font-semibold">{ticket.title}</h3>
//                   <div className="flex gap-2 mt-1 text-sm">
//                     <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
//                       {ticket.category}
//                     </span>
//                     <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
//                       {ticket.status}
//                     </span>
//                     <span className="text-gray-500">
//                       Posted by <span className="text-green-700">{ticket.company}</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <span className="text-sm bg-green-200 px-2 py-1 rounded-md font-semibold text-green-800">
//                   {ticket.comments}
//                 </span>
//                 <div className="flex justify-center mt-1 text-gray-600 gap-2 text-sm">
//                   <FaThumbsUp />
//                   <FaThumbsDown />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button className="px-2 py-1 rounded border hover:bg-gray-200">&lt;</button>
//           <button className="px-3 py-1 bg-purple-700 text-white rounded">1</button>
//           <button className="px-3 py-1 border rounded">2</button>
//           <button className="px-2 py-1 rounded border hover:bg-gray-200">&gt;</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EndUserDashboard;


// import React, { useEffect, useState } from 'react';

// // ✅ Use default imports for icons from subpath to avoid TS2786
// import { FaUser, FaFolder, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';


// import { db } from '../services/firebse'; // adjust path as needed
// import { collection, getDocs } from 'firebase/firestore';

// interface Ticket {
//   title: string;
//   category: string;
//   status: string;
//   company: string;
//   comments: number;
// }

// const EndUserDashboard = () => {
//   const [tickets, setTickets] = useState<Ticket[]>([]);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       const querySnapshot = await getDocs(collection(db, 'tickets'));
//       const fetchedTickets: Ticket[] = [];
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         fetchedTickets.push({
//           title: data.title,
//           category: data.category,
//           status: data.status,
//           company: data.company,
//           comments: data.comments,
//         });
//       });
//       setTickets(fetchedTickets);
//     };

//     fetchTickets();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Top Nav */}
//       <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
//         <div className="text-2xl font-bold">QuickDesk</div>
//         <div className="flex gap-6 text-sm">
//           <a href="#" className="hover:underline">Dashboard</a>
//           <a href="#" className="hover:underline">Tickets</a>
//           <a href="#" className="hover:underline">Reports</a>
//         </div>
//         <div className="w-8 h-8 rounded-full bg-white text-blue-900 flex items-center justify-center">
//           <FaUser />
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="px-6 py-4">
//         <h2 className="text-lg font-semibold mb-4">Ishaan dua</h2>

//         {/* Filter Controls */}
//         <div className="bg-white p-4 rounded-md shadow flex flex-wrap gap-4 items-center mb-6">
//           <label className="flex items-center gap-2">
//             <input type="checkbox" className="form-checkbox" />
//             Show open only
//           </label>
//           <select className="border rounded px-3 py-2">
//             <option>Category</option>
//           </select>
//           <select className="border rounded px-3 py-2">
//             <option>Status</option>
//           </select>
//           <select className="border rounded px-3 py-2 ml-auto">
//             <option>Most recent</option>
//           </select>
//         </div>

//         {/* Ticket List */}
//         <div className="space-y-4">
//           {tickets.map((ticket, index) => (
//             <div
//               key={index}
//               className="bg-white p-4 rounded-md shadow flex justify-between items-center"
//             >
//               <div className="flex gap-4 items-center">
//                 <FaFolder className="text-2xl text-gray-700" />
//                 <div>
//                   <h3 className="font-semibold">{ticket.title}</h3>
//                   <div className="flex gap-2 mt-1 text-sm">
//                     <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
//                       {ticket.category}
//                     </span>
//                     <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
//                       {ticket.status}
//                     </span>
//                     <span className="text-gray-500">
//                       Posted by <span className="text-green-700">{ticket.company}</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <span className="text-sm bg-green-200 px-2 py-1 rounded-md font-semibold text-green-800">
//                   {ticket.comments}
//                 </span>
//                 <div className="flex justify-center mt-1 text-gray-600 gap-2 text-sm">
//                   <FaThumbsUp />
//                   <FaThumbsDown />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button className="px-2 py-1 rounded border hover:bg-gray-200">&lt;</button>
//           <button className="px-3 py-1 bg-purple-700 text-white rounded">1</button>
//           <button className="px-3 py-1 border rounded">2</button>
//           <button className="px-2 py-1 rounded border hover:bg-gray-200">&gt;</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EndUserDashboard;



// import React, { useEffect, useState } from 'react';
// import { FaUser, FaFolder, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
// import { db } from '../services/firebse'; // Adjust path as needed
// import { collection, getDocs } from 'firebase/firestore';

// interface Ticket {
//   id: string;
//   title: string;
//   category: string;
//   status: string;
//   company: string;
//   comments: number;
//   votes: number;
// }

// const TICKETS_PER_PAGE = 5;

// const EndUserDashboard = () => {
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [search, setSearch] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [showOpenOnly, setShowOpenOnly] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Fetch tickets on load
//   useEffect(() => {
//     const fetchTickets = async () => {
//       const snapshot = await getDocs(collection(db, 'tickets'));
//       const fetched: Ticket[] = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })) as Ticket[];
//       setTickets(fetched);
//     };
//     fetchTickets();
//   }, []);

//   // Filtered + searched + paginated tickets
//   const filteredTickets = tickets
//     .filter(t =>
//       (!showOpenOnly || t.status.toLowerCase() === 'open') &&
//       (!categoryFilter || t.category === categoryFilter) &&
//       (!statusFilter || t.status === statusFilter) &&
//       t.title.toLowerCase().includes(search.toLowerCase())
//     );

//   const totalPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);
//   const paginatedTickets = filteredTickets.slice(
//     (currentPage - 1) * TICKETS_PER_PAGE,
//     currentPage * TICKETS_PER_PAGE
//   );

//   // Handle upvote/downvote (local only for now)
//   const handleVote = (id: string, type: 'up' | 'down') => {
//     setTickets(prev =>
//       prev.map(ticket =>
//         ticket.id === id
//           ? {
//               ...ticket,
//               votes: type === 'up' ? ticket.votes + 1 : ticket.votes - 1
//             }
//           : ticket
//       )
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navbar */}
//       <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
//         <div className="text-2xl font-bold">QuickDesk</div>
//         <div className="flex gap-6 text-sm">
//           <a href="#" className="hover:underline">Dashboard</a>
//           <a href="#" className="hover:underline">Tickets</a>
//           <a href="#" className="hover:underline">Reports</a>
//         </div>
//         <div className="w-8 h-8 rounded-full bg-white text-blue-900 flex items-center justify-center">
//           <FaUser />
//         </div>
//       </nav>

//       {/* Filters */}
//       <div className="px-6 py-4">
//         <h2 className="text-lg font-semibold mb-4">Welcome, Ishaan Dua</h2>
//         <div className="bg-white p-4 rounded-md shadow flex flex-wrap gap-4 items-center mb-6">
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               className="form-checkbox"
//               checked={showOpenOnly}
//               onChange={e => setShowOpenOnly(e.target.checked)}
//             />
//             Show open only
//           </label>

//           <select
//             className="border rounded px-3 py-2"
//             onChange={e => setCategoryFilter(e.target.value)}
//             value={categoryFilter}
//           >
//             <option value="">All Categories</option>
//             {[...new Set(tickets.map(t => t.category))].map(cat => (
//               <option key={cat}>{cat}</option>
//             ))}
//           </select>

//           <select
//             className="border rounded px-3 py-2"
//             onChange={e => setStatusFilter(e.target.value)}
//             value={statusFilter}
//           >
//             <option value="">All Statuses</option>
//             {[...new Set(tickets.map(t => t.status))].map(stat => (
//               <option key={stat}>{stat}</option>
//             ))}
//           </select>

//           <input
//             type="text"
//             placeholder="Search title..."
//             className="border px-3 py-2 rounded flex-1"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>

//         {/* Tickets */}
//         <div className="space-y-4">
//           {paginatedTickets.map(ticket => (
//             <div key={ticket.id} className="bg-white p-4 rounded-md shadow flex justify-between items-center">
//               <div className="flex gap-4 items-center">
//                 <FaFolder className="text-2xl text-gray-700" />
//                 <div>
//                   <h3 className="font-semibold">{ticket.title}</h3>
//                   <div className="flex gap-2 mt-1 text-sm">
//                     <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{ticket.category}</span>
//                     <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{ticket.status}</span>
//                     <span className="text-gray-600">Posted by <span className="text-blue-800">{ticket.company}</span></span>
//                   </div>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-sm font-semibold mb-1 text-green-700 bg-green-100 px-2 py-1 rounded">{ticket.comments} replies</div>
//                 <div className="flex justify-center items-center gap-3 text-gray-600 text-sm">
//                   <button onClick={() => handleVote(ticket.id, 'up')}><FaThumbsUp /></button>
//                   <span className="font-semibold">{ticket.votes || 0}</span>
//                   <button onClick={() => handleVote(ticket.id, 'down')}><FaThumbsDown /></button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button
//             className="px-2 py-1 rounded border hover:bg-gray-200"
//             onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
//           >
//             &lt;
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i}
//               className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-purple-700 text-white' : 'border'}`}
//               onClick={() => setCurrentPage(i + 1)}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             className="px-2 py-1 rounded border hover:bg-gray-200"
//             onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
//           >
//             &gt;
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EndUserDashboard;



import React, { useEffect, useState } from 'react';
import { FaUser, FaFolder, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { db } from '../services/firebse'; // ✅ fixed typo here
import { collection, getDocs } from 'firebase/firestore';

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: string;
  company: string;
  comments: number;
  votes: number;
}

const TICKETS_PER_PAGE = 5;

const EndUserDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTickets = async () => {
      const snapshot = await getDocs(collection(db, 'tickets'));
      const fetched: Ticket[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          category: data.category || '',
          status: data.status || '',
          company: data.company || '',
          comments: data.comments || 0,
          votes: data.votes || 0,
        };
      });
      setTickets(fetched);
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t =>
    (!showOpenOnly || t.status.toLowerCase() === 'open') &&
    (!categoryFilter || t.category === categoryFilter) &&
    (!statusFilter || t.status === statusFilter) &&
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * TICKETS_PER_PAGE,
    currentPage * TICKETS_PER_PAGE
  );

  const handleVote = (id: string, type: 'up' | 'down') => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === id
          ? {
              ...ticket,
              votes: type === 'up' ? ticket.votes + 1 : ticket.votes - 1
            }
          : ticket
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">QuickDesk</div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:underline">Dashboard</a>
          <a href="#" className="hover:underline">Tickets</a>
          <a href="#" className="hover:underline">Reports</a>
        </div>
        <div className="w-8 h-8 rounded-full bg-white text-blue-900 flex items-center justify-center">
          <FaUser />
        </div>
      </nav>

      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold mb-4">Welcome, Ishaan Dua</h2>
        <div className="bg-white p-4 rounded-md shadow flex flex-wrap gap-4 items-center mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={showOpenOnly}
              onChange={e => setShowOpenOnly(e.target.checked)}
            />
            Show open only
          </label>

       <select
  className="border rounded px-3 py-2"
  onChange={e => setCategoryFilter(e.target.value)}
  value={categoryFilter}
>
  <option value="">All Categories</option>
  {Array.from(new Set(tickets.map(t => t.category))).map(cat => (
    <option key={cat}>{cat}</option>
  ))}
</select>

 <select
  className="border rounded px-3 py-2"
  onChange={e => setStatusFilter(e.target.value)}
  value={statusFilter}
>
  <option value="">All Statuses</option>
  {Array.from(new Set(tickets.map(t => t.status))).map(stat => (
    <option key={stat}>{stat}</option>
  ))}
</select>


          <input
            type="text"
            placeholder="Search title..."
            className="border px-3 py-2 rounded flex-1"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {paginatedTickets.map(ticket => (
            <div key={ticket.id} className="bg-white p-4 rounded-md shadow flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <FaFolder className="text-2xl text-gray-700" />
                <div>
                  <h3 className="font-semibold">{ticket.title}</h3>
                  <div className="flex gap-2 mt-1 text-sm">
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{ticket.category}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{ticket.status}</span>
                    <span className="text-gray-600">Posted by <span className="text-blue-800">{ticket.company}</span></span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold mb-1 text-green-700 bg-green-100 px-2 py-1 rounded">{ticket.comments} replies</div>
                <div className="flex justify-center items-center gap-3 text-gray-600 text-sm">
                  <button onClick={() => handleVote(ticket.id, 'up')}><FaThumbsUp /></button>
                  <span className="font-semibold">{ticket.votes || 0}</span>
                  <button onClick={() => handleVote(ticket.id, 'down')}><FaThumbsDown /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-2 py-1 rounded border hover:bg-gray-200"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-purple-700 text-white' : 'border'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-2 py-1 rounded border hover:bg-gray-200"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndUserDashboard;
