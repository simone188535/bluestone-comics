import axios from "axios";

export const PublishServices = {
    createBook,
    // signUp
}

function createBook(bookTitle, bookCoverPhoto, bookDescription, urlSlug, genres, issueTitle, issueCoverPhoto, issueAssets, workCredits) {
    // send request to create a book which will contain the first issue
    return axios.post('/api/v1/publish', {
        bookTitle,
        bookCoverPhoto,
        bookDescription,
        urlSlug,
        genres,
        issueTitle,
        issueCoverPhoto,
        issueAssets,
        workCredits
    });
}

// function signUp(firstName, lastName, username, email, password, passwordConfirm) {
//     // send request to sign up
//     return axios.post('/api/v1/users/signup', {
//         firstName,
//         lastName,
//         email,
//         username,
//         password,
//         passwordConfirm 
//     });
// }
