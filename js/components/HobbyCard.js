export class HobbyCard {
    constructor(hobby) {
        this.hobby = hobby;
    }

    createElement() {
        const article = document.createElement('article');
        article.className = 'hobby-card';

        const image = document.createElement('img');
        image.src = this.hobby.image;
        image.alt = this.hobby.title;

        const overlay = document.createElement('div');
        overlay.className = 'hobby-overlay';

        const title = document.createElement('h3');
        title.textContent = this.hobby.title;

        const description = document.createElement('p');
        description.textContent = this.hobby.description;

        overlay.append(title, description);
        article.append(image, overlay);

        return article;
    }

    render(container = null) {
        const element = this.createElement();

        if (container) {
            container.append(element);
        }

        return element;
    }
}
