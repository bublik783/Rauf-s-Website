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
        this.renderHobbies('[data-hobbies]');
    }

    renderHobbies(container) {
        renderList(container, HOBBIES, (hobby) => new HobbyCard(hobby).render());
    }
}
