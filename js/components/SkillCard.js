export class SkillCard {
    constructor(skill) {
        this.skill = skill;
    }

    createElement() {
        const article = document.createElement('article');
        article.className = `skill-card ${this.skill.title === 'Python' ? 'skill-card-wide' : ''}`;

        const image = document.createElement('img');
        image.className = 'skill-icon';
        image.src = this.skill.image;
        image.alt = this.skill.title;

        const info = document.createElement('div');
        info.className = 'skill-info';

        const title = document.createElement('h3');
        title.textContent = this.skill.title;

        const level = document.createElement('p');
        const levelTitle = document.createElement('strong');
        levelTitle.textContent = 'Уровень:';
        level.append(levelTitle, ` ${this.skill.level}`);

        const description = document.createElement('p');
        description.textContent = this.skill.description;

        const tags = document.createElement('p');
        tags.className = 'skill-tags';

        this.skill.tags.forEach((tag) => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            tags.append(tagElement);
        });

        info.append(title, level, description, tags);
        article.append(image, info);

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
