import axios from "axios";

export const PublishServices = {
    createBook,
    // signUp
}

function createBook(formData) {
    // send request to create a book which will contain the first issue
    const jwtToken = localStorage.getItem('jwtToken');

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        onUploadProgress: function(progressEvent) {
            const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            console.log('percentCompleted', percentCompleted);

          }
    };

    return axios.post('/api/v1/publish', formData, config);
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
