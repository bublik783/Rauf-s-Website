export class ThemeSwitcher {
    constructor() {
        this.radios = document.querySelectorAll('.theme-radio');
    }

    init() {
        const savedTheme = localStorage.getItem('siteTheme') || 'light';
        this.applyTheme(savedTheme);

        this.radios.forEach((radio) => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    const theme = radio.id.replace('theme-', '');
                    localStorage.setItem('siteTheme', theme);
                }
            });
        });

        window.addEventListener('storage', (event) => {
            if (event.key === 'siteTheme' && event.newValue) {
                this.applyTheme(event.newValue);
            }
        });
    }

    applyTheme(theme) {
        const radio = document.querySelector(`#theme-${theme}`);
        if (radio) radio.checked = true;
    }
}
