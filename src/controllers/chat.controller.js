import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const getChat = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body

    if (!email, !phone) {
        throw new ApiError(400, 'phone and email are required fields')
    }

    // get contact id
    const hitTime = new Date();
    let contactId;
    let targetContact;
    console.log("API hit at:", hitTime.toISOString());

    try {
        const contactRes = await fetch(`https://api.anychat.one/public/v1/contact/search?email=${email}`, {
            method: 'GET',
            headers: {
                "x-api-key": "d-MTDlHd8Nw_F73iUmyBMesYD03mPeb5lzEOKgg2OWD2zUSga-B6Q0R4Ef-oqLw3",
            },
        })
        const contactDetails = await contactRes.json()
        contactId = contactDetails.data[0].guid;
        console.log('contact id', contactId);
    } catch (error) {
        console.log('api hit error ', error);
    }

    // get recent chats
    let lastPage;
    const chatsRes = await fetch(`https://api.anychat.one/public/v1/chat`, {
        method: 'GET',
        headers: {
            "x-api-key": "d-MTDlHd8Nw_F73iUmyBMesYD03mPeb5lzEOKgg2OWD2zUSga-B6Q0R4Ef-oqLw3",
        }
    })
    const chats = await chatsRes.json()
    lastPage = chats.pages;

    const latestChatsRes = await fetch(`https://api.anychat.one/public/v1/chat?page=${lastPage}`, {
        method: 'GET',
        headers: {
            "x-api-key": "d-MTDlHd8Nw_F73iUmyBMesYD03mPeb5lzEOKgg2OWD2zUSga-B6Q0R4Ef-oqLw3",
        }
    })
    const latestChats = await latestChatsRes.json();

    // now get the contact id, 
    // match the contact variable from all latest chats
    // if not found , go 1 page back and repeat
    latestChats.data.forEach(chat => {
        if (chat.contact === contactId) {
            console.log('match found');
            targetContact = chat;
        }
        if (!chat.contact === contactId) {
            console.log('go to previous page and repeat')
        }
    });
    console.log(targetContact.guid);
    let targetChatId = targetContact.guid;
    // find the target chat transcript
    let chatTranscriptRes = await fetch(`https://api.anychat.one/public/v1/chat/${targetChatId}/message`, {
        method: 'GET',
        headers: {
            "x-api-key": "d-MTDlHd8Nw_F73iUmyBMesYD03mPeb5lzEOKgg2OWD2zUSga-B6Q0R4Ef-oqLw3",
        },
    })
    let chatTranscript = await chatTranscriptRes.json()
    // console.log(chatTranscript);
    // store all chats data in a variable
    let fullChatTranscript = [];
    chatTranscript.data.forEach((chat) => {
        fullChatTranscript.push(chat)
    })

    console.log('chattr-', fullChatTranscript);
    // look through the chat a

    const resData = {
        // contactId :  contactId,
        chats: fullChatTranscript
    };

    return res.status(200).json(
        new ApiResponse(200, resData, "working")
    )
})