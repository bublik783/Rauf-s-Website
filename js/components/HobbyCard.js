export class HobbyCard {
    constructor(hobby) {
        this.hobby = hobby;
    }

    render() {
        const article = document.createElement('article');
        article.className = 'hobby-card';

        article.innerHTML = `
            <img src="${this.hobby.image}" alt="${this.hobby.title}">
            <div class="hobby-overlay">
                <h3>${this.hobby.title}</h3>
                <p>${this.hobby.description}</p>
            </div>
        `;

        return article;
    }
}
