export class SkillCard {
    constructor(skill) {
        this.skill = skill;
    }

    render() {
        const article = document.createElement('article');
        article.className = `skill-card ${this.skill.title === 'Python' ? 'skill-card-wide' : ''}`;

        article.innerHTML = `
            <img class="skill-icon" src="${this.skill.image}" alt="${this.skill.title}">
            <div class="skill-info">
                <h3>${this.skill.title}</h3>
                <p><strong>Уровень:</strong> ${this.skill.level}</p>
                <p>${this.skill.description}</p>
                <p class="skill-tags">${this.skill.tags.map((tag) => `<span>${tag}</span>`).join('')}</p>
            </div>
        `;

        return article;
    }
}
