import { Navigate } from "react-router-dom";
import { atom, selector, useSetRecoilState } from "recoil";

// Get initial state from localStorage if it exists
const getInitialAuthState = () => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : {
        user: null,
        token: null
    };
};

export const authState = atom({
    key: 'authState', // Unique key for the atom
    default: getInitialAuthState(),
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                localStorage.setItem('auth', JSON.stringify(newValue));
            });
        },
    ],
});



// export const authState = atom({
//     key: 'authState', // Unique key for the atom
//     default: {
//       user: null,      // User details
//       token: null,     // Auth token
//     },
//   });



// Store message IDs in order
// export const messagesIdsAtom = atom({
//     key: 'messagesIdsAtom',
//     default: [], // Stores the IDs of all chat messages
// });


export const currentSessionAtom = atom({
    key: 'currentSessionAtom',
    default: {
        sessionId : null,
        title : null
    }
});

export const messageResponseAtom = atom({
    key: "messageResponseAtom",
    default: []
})


// {
//     id:1234,
//     files:[],
//     message:"what is in the image",
//     response:"this is a pen in the image"
// }

// Store individual messages
// export const chatMessageAtom = atomFamily({
//     key: 'chatMessage',
//     default: (id) => ({
//         id,
//         file:null,
//         content: '',
//         sender: 'user', // or 'AI'
//         timestamp: Date.now(),
//     }),
//   });



//different chat context
export const chaptersAtom = atom({
    key: "chaptersAtom",
    default: []
})

// {
//     id: "232434",
//     title: "this is a heading 1"
// }, {
//     id: "744884",
//     title: "this is a heading 2"
// }, {
//     id: "937739",
//     title: "this is a heading 3"
// }


// const handleLogout = () => {
//     //automatically redirect to login page
//     localStorage.removeItem('auth');
//     // Navigate('/login');
//   };


// export const fetchUserSessions = selector({
//     key: 'fetchUserSessions',
//     get: async ({ get }) => {
//         const token = JSON.parse(localStorage.getItem('auth')).token; //{user: {email: "a@a.a", name: "a"}, token: "jwt-token"}
//         // console.log(token)
//         if (!token) {
//             throw new Error('Unauthorized');
//         }

//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-sessions`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': token,
//                 },
//             });


//             if (!response.ok) {
//                 throw new Error('Failed to fetch sessions');
//             }

//             const data = await response.json();

//             if (data.message == "Token has expired or invalid token") handleLogout();
//             console.log(data)
//             return data.sessions;
//         } catch (error) {
//             console.error(error);
//             return []; // Return an empty array in case of error
//         }
//     },
// });


//true or false
export const sidebarAtom = atom({
    key: "sidebarAtom",
    default: true
})