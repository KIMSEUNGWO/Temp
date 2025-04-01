export function fetchPost(url, json, callback) {
    fetch(url , { method : 'post'
					, headers : {'Content-Type' : 'application/json'}
					, body : JSON.stringify(json)
				})
    .then(res => res.json())
    .then(map => callback(map));
}

export function fetchGet(url, callback) {
    callback({
        'result' : 'OK',
        'data' : {
            'totalElements' : 30,
            'totalPages' : 50,
            'pageNumber' : 0,
            'content' : [
                1,2,3
            ]
        }
    });
    // fetch(url)
    // .then(res => res.json())
    // .then(map => callback(map));
}