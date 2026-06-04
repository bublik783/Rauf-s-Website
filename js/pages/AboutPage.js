import { BasePage } from './BasePage.js';
import { HOBBIES } from '../data/hobbies.js';
import { HobbyCard } from '../components/HobbyCard.js';
import { renderList } from '../utils/render.js';

export class AboutPage extends BasePage {
    constructor() {
        super('Обо мне');
    }

    init() {
        super.init();
        this.renderHobbies();
    }

    renderHobbies() {
        const container = document.querySelector('[data-hobbies]');
        if (!container) return;

        renderList(container, HOBBIES, (hobby) => new HobbyCard(hobby).render());
    }
}
