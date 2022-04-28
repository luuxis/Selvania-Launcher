let user;
let password;


class panel {
    constructor(API) {
        this.API = API
        this.connect();
        this.addNews();
    }

    connect() {
        document.querySelector('.btn-connect').addEventListener("click", async() => {
            user = SHA1(document.querySelector('.user').value);
            password = SHA1(document.querySelector('.password').value);
            let auth = await this.API.APIconnect(user, password);
            if (auth.status == 'success') {
                document.querySelector('.login-content').classList.toggle('hide');
                document.querySelector('.news-content-tab').classList.toggle('hide');
                this.News();
            } else {
                document.querySelector('.info-login').style.color = 'red';
                document.querySelector('.info-login').innerHTML = 'identifiant ou mot de passe incorrects';
            }
        })
    }

    async News() {
        let Getnews = await this.API.ApiGetNews(user, password).then(res => res);
        let news = document.querySelector('.new-list');
        for (let News of Getnews) {
            let date = this.getdate(News.publish_date)
            let blockNews = document.createElement('div');
            blockNews.classList.add('news-block');
            blockNews.innerHTML = `
                <div class="news-header">
                    <div class="header-text">
                        <div class="title">${News.title}</div>
                    </div>
                    <div class="date">
                        <div class="day">${date.day}</div>
                        <div class="month">${date.month}</div>
                    </div>
                </div>
                <div class="news-content">
                    <div class="bbWrapper">
                        <p>${News.content.replace(/\n/g, '</br>')}</p>
                        <p class="news-author">Auteur,<span> ${News.author}</span></p>
                    </div>
                </div>
                <div class="news-tool">
                    <div class="header-text">
                        <div class="fas fa-edit title edite-news" id="${News.id}">
                    </div>
                    <div class="delete-news-tab">
                        <div class="fa fa-trash-alt delete-news" id="${News.id}">
                    </div>
                </div>
                `
            news.appendChild(blockNews);
        }
        this.deleteNews();
        this.editNews();
    }

    async addNews() {}

    async deleteNews() {
        let deleteNews = document.querySelectorAll('.delete-news');
        for (let deletenews of deleteNews) {
            deletenews.addEventListener('click', async(e) => {
                let id = e.target.id;
                console.log(id);
                let deleteNews = await this.API.ApiDeleteNews(id, user, password).then(res => res);
                console.log(deleteNews);
                if (deleteNews == '1') {
                    document.querySelector('.news-block').remove();
                }
            })
        }
    }

    async editNews() {}

    getdate(e) {
        let date = new Date(e)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let allMonth = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
        return { year: year, month: allMonth[month - 1], day: day }
    }
}
const inputs = document.querySelectorAll(".input");

function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}

inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

new panel(new API());