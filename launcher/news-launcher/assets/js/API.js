class API {
    APIconnect(User, Password) {
        let API = fetch('assets/php/auth.php', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: [
                `user=${User}`,
                `&password=${Password}`,
            ].join(''),
        }).then(res => res.json())
        return API;
    }
    
    ApiGetNews() {
        let API = fetch('assets/php/news/GetNews.php').then(res => res.json())
        return API;
    }

    ApiAddNews(data, User, Password) {
        let API = fetch('assets/php/news/AddNews.php', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': User + Password
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        return API;
    }

    ApiEditeNews(data, User, Password) {
        let API = fetch('assets/php/news/EditNews.php', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': User + Password
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        return API;
    }

    ApiDeleteNews(data, User, Password) {
        let API = fetch('assets/php/news/RemoveNews.php', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': User + Password
            },
            body: JSON.stringify({id: data})
        }).then(res => res.json())
        return API;
    }
}