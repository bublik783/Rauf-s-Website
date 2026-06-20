import { BasePage } from './BasePage.js';
import { SKILLS } from '../data/skills.js';
import { SkillCard } from '../components/SkillCard.js';
import { DataTable } from '../components/DataTable.js';
import { renderList } from '../utils/render.js';

export class SkillsPage extends BasePage {
    constructor() {
        super('Навыки');
        this.skills = SKILLS;
    }

    init() {
        super.init();
        this.renderSkills('[data-skills-list]');
        this.initSkillFilter();
        new DataTable('[data-skills-table]').init();
    }

    renderSkills(container, list = this.skills) {
        renderList(container, list, (skill) => new SkillCard(skill).render());
    }

    initSkillFilter() {
        const input = document.querySelector('[data-skill-search]');
        if (!input) return;

        input.addEventListener('input', () => {
            const query = input.value.toLowerCase();

            const filtered = this.skills.filter((skill) => {
                return skill.title.toLowerCase().includes(query)
                    || skill.level.toLowerCase().includes(query)
                    || skill.tags.some((tag) => tag.toLowerCase().includes(query));
            });

            this.renderSkills('[data-skills-list]', filtered);
        });
    }
}
