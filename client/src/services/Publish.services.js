import axios from "axios";

export const PublishServices = {
    createBook,
    // signUp
}

function createBook(formData, config = {}) {
    // send request to create a book which will contain the first issue
    const jwtToken = localStorage.getItem('jwtToken');
    
     config.headers = {
        Authorization: `Bearer ${jwtToken}`
    };

    return axios.post('/api/v1/publish', formData, config);
}
