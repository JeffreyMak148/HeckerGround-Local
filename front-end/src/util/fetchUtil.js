function fetchUtil (url, requestBody, requestMethod) {
    const fetchData = {
        headers: {
        "Content-Type": "application/json",
        },
        method: requestMethod,
    };
    
    if(requestBody) {
        fetchData.body = JSON.stringify(requestBody);
    }

    return fetch(url, fetchData).then((response) => {
        if(response.status === 200) {
            const contentType = response.headers.get("content-type");
            if(contentType && contentType.indexOf("application/json") !== -1) {
                return Promise.resolve(response.json().then(data => ({
                    status: response.status,
                    data
                })))
            } else {
                return Promise.resolve(response.text().then(data => ({
                    status: response.status,
                    data
                })))
            }
        }
        if(response.status >= 400 && response.status <= 599) {
            return response.json().then(data => Promise.reject({
                status: response.status,
                data
            }))
        }
        return Promise.resolve(response);
    })
    .catch(error => {
        return Promise.reject(error);
    })
}

export default fetchUtil;