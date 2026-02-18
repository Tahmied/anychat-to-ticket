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
        // console.log('contact id', contactId);
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

    let currentPage = lastPage;

    while (currentPage > 0 && !targetContact) {

        const pageRes = await fetch(
            `https://api.anychat.one/public/v1/chat?page=${currentPage}`,
            {
                method: 'GET',
                headers: {
                    "x-api-key": "d-MTDlHd8Nw_F73iUmyBMesYD03mPeb5lzEOKgg2OWD2zUSga-B6Q0R4Ef-oqLw3",
                }
            }
        );

        const pageData = await pageRes.json();

        for (const chat of pageData.data) {
            if (chat.contact === contactId) {
                targetContact = chat;
                break;
            }
        }

        currentPage--;
    }


    console.log(targetContact.guid);
    if (!targetContact) {
        throw new ApiError(404, 'No chat found');
    }
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
    let transcriptCurrentPage = chatTranscript.pages;

    // Loop through transcript pages backwards
    while (transcriptCurrentPage > 0) {

        const transcriptPageRes = await fetch(
            `https://api.anychat.one/public/v1/chat/${targetChatId}/message?page=${transcriptCurrentPage}`,
            {
                method: 'GET',
                headers: {
                    "x-api-key": "d-MTDlHd8Nw_F73iUmyBMesYD03mPeb5lzEOKgg2OWD2zUSga-B6Q0R4Ef-oqLw3",
                },
            }
        );

        const transcriptPageData = await transcriptPageRes.json();
        fullChatTranscript.push(...transcriptPageData.data);

        transcriptCurrentPage--;
    }
    fullChatTranscript.sort((a, b) => a.created_at - b.created_at);



    // console.log('chattr-', fullChatTranscript);
    // look through the chat a

    const resData = {
        // contactId :  contactId,
        chats: fullChatTranscript,
        messages: fullChatTranscript.length
    };

    return res.status(200).json(
        new ApiResponse(200, resData, "working")
    )
})