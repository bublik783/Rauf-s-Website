import { ThemeSwitcher } from '../components/ThemeSwitcher.js';

export class BasePage {
    constructor(pageName) {
        this.pageName = pageName;
        this.themeSwitcher = new ThemeSwitcher();
    }

    init() {
        this.themeSwitcher.init();
        console.log(`Открыта страница: ${this.pageName}`);
    }
}
