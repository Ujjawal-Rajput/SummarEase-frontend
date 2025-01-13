import { atom } from "recoil";

// Store message IDs in order
export const messagesIdsAtom = atom({
    key: 'messagesIdsAtom',
    default: [], // Stores the IDs of all chat messages
  });

export const messageResponseAtom = atom({
    key:"messageResponseAtom",
    default:[]
})

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
    key:"chaptersAtom",
    default:[{
        id:"abcd",
        heading:"this is a heading1"
    },{
        id:"abcd",
        heading:"this is a heading2"
    },{
        id:"abcd",
        heading:"this is a heading3"
    }]
})

//true or false
export const sidebarAtom = atom({
    key:"sidebarAtom",
    default : true
})