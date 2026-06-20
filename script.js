'use strict';


(function () {
    if (window.__pomStarted) return;

    const SITE_INFO = {
        author: 'Rauf',
        year: 2026,
        currencyRates: {
            usd: 1.41,
            eur: 1.22,
            cny: 9.6
        }
    };

    const SKILLS = [
        {
            title: 'HTML',
            level: 'продвинутый',
            description: 'Семантическая структура страниц, списки, формы, изображения и ссылки.',
            image: 'images/skill-html.png',
            tags: ['верстка', 'семантика', 'формы']
        },
        {
            title: 'CSS',
            level: 'начинающий',
            description: 'Стилизация страниц, базовая адаптивность, flex, grid и CSS-переменные.',
            image: 'images/skill-css.png',
            tags: ['стили', 'адаптивность', 'grid', 'flex']
        },
        {
            title: 'JavaScript',
            level: 'начинающий',
            description: 'Переменные, функции, массивы, объекты, условия, циклы и работа с DOM.',
            image: 'images/skill-js.png',
            tags: ['логика', 'dom', 'события']
        },
        {
            title: 'Python',
            level: 'средний',
            description: 'Базовая логика программирования, работа с данными и написание простых скриптов.',
            image: 'images/skill-python.png',
            tags: ['скрипты', 'данные', 'автоматизация']
        }
    ];

    const HOBBIES = [
        {
            title: 'Спорт',
            description: 'Спорт помогает мне поддерживать форму, развивать дисциплину и чувствовать себя энергичнее.',
            image: 'images/hobby-sport.png'
        },
        {
            title: 'Компьютерные игры',
            description: 'Игры для меня — это способ отдохнуть, погрузиться в интересные миры и провести время с друзьями.',
            image: 'images/hobby-games.png'
        },
        {
            title: 'Фильмы и сериалы',
            description: 'Люблю смотреть фильмы и сериалы разных жанров: от фантастики до драм и триллеров.',
            image: 'images/hobby-movies.png'
        }
    ];

    const FALLBACK_COURSES = [
        { name: 'HTML', type: 'Верстка', hours: 32, level: 'Начинающий' },
        { name: 'CSS', type: 'Стилизация', hours: 40, level: 'Начинающий' },
        { name: 'JavaScript', type: 'Программирование', hours: 64, level: 'Начинающий' },
        { name: 'Python', type: 'Программирование', hours: 72, level: 'Средний' },
        { name: 'GitHub Pages', type: 'Публикация', hours: 12, level: 'Начинающий' }
    ];

    const formatMoney = (value) => Number(value).toFixed(2);
    const onlyLetters = (text) => text.replace(/[^А-Яа-яЁёA-Za-z\s-]/g, '');

    function getGreetingByHour(hour) {
        if (hour >= 5 && hour < 12) return 'Доброе утро';
        if (hour >= 12 && hour < 18) return 'Добрый день';
        if (hour >= 18 && hour < 23) return 'Добрый вечер';
        return 'Доброй ночи';
    }

    function allowOnlyDigits(input) {
        input.value = input.value.replace(/\D/g, '');
    }

    function blockNonDigitKeys(event) {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
        if (allowedKeys.includes(event.key)) return;
        if (!/^\d$/.test(event.key)) event.preventDefault();
    }

    function clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    function renderList(container, items, renderItem) {
        clearContainer(container);
        items.forEach((item) => container.append(renderItem(item)));
    }

    class ThemeSwitcher {
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

    class BasePage {
        constructor(pageName) {
            this.pageName = pageName;
            this.themeSwitcher = new ThemeSwitcher();
        }

        init() {
            this.themeSwitcher.init();
            console.log(`Открыта страница: ${this.pageName}`);
        }
    }

    class SkillCard {
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

    class HobbyCard {
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

    class DataTable {
        constructor(rootSelector) {
            this.root = document.querySelector(rootSelector);
            this.repos = [];
            this.filteredRepos = [];
            this.sortField = 'updated_at';
        }

        clear(container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }

        createTextElement(tag, text, className = '') {
            const element = document.createElement(tag);
            element.textContent = text;
            if (className) element.className = className;
            return element;
        }

        renderMessage(container, message) {
            this.clear(container);

            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.colSpan = 5;
            cell.textContent = message;

            row.append(cell);
            container.append(row);
        }

        async init() {
            if (!this.root) return;

            this.render(this.root);
            this.bindEvents();
        }

        render(container = this.root) {
            if (!container) return;

            this.clear(container);

            const section = document.createElement('section');
            section.className = 'interactive-card';

            const title = this.createTextElement('h3', 'GitHub-репозитории');

            const description = document.createElement('p');
            description.append(
                'Введите ник пользователя GitHub, чтобы загрузить таблицу его открытых репозиториев через ',
                this.createTextElement('code', 'fetch'),
                '.'
            );

            const form = document.createElement('form');
            form.className = 'github-form';
            form.dataset.githubForm = '';

            const label = document.createElement('label');
            label.htmlFor = 'github-login';
            label.textContent = 'Ник GitHub';

            const row = document.createElement('div');
            row.className = 'github-form-row';

            const input = document.createElement('input');
            input.type = 'text';
            input.id = 'github-login';
            input.dataset.githubLogin = '';
            input.placeholder = 'Например, bublik783';

            const button = document.createElement('button');
            button.type = 'submit';
            button.textContent = 'Загрузить';

            const error = document.createElement('p');
            error.className = 'field-error';
            error.dataset.githubError = '';

            row.append(input, button);
            form.append(label, row, error);

            const controls = document.createElement('div');
            controls.className = 'table-controls';

            const search = document.createElement('input');
            search.type = 'search';
            search.dataset.tableSearch = '';
            search.placeholder = 'Поиск по названию, описанию или языку';
            search.disabled = true;

            const sort = document.createElement('select');
            sort.dataset.tableSort = '';
            sort.disabled = true;

            [
                ['updated_at', 'Сортировка по дате обновления'],
                ['name', 'Сортировка по названию'],
                ['language', 'Сортировка по языку'],
                ['stargazers_count', 'Сортировка по звёздам']
            ].forEach(([value, text]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;
                sort.append(option);
            });

            controls.append(search, sort);

            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';

            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const headRow = document.createElement('tr');

            ['Название', 'Описание', 'Язык', 'Звёзды', 'Последнее обновление'].forEach((text) => {
                const th = document.createElement('th');
                th.textContent = text;
                headRow.append(th);
            });

            thead.append(headRow);

            const tbody = document.createElement('tbody');
            tbody.dataset.tableBody = '';
            this.renderMessage(tbody, 'Введите ник GitHub и нажмите «Загрузить».');

            table.append(thead, tbody);
            wrapper.append(table);
            section.append(title, description, form, controls, wrapper);
            container.append(section);
        }

        bindEvents() {
            const form = this.root.querySelector('[data-github-form]');
            const search = this.root.querySelector('[data-table-search]');
            const sort = this.root.querySelector('[data-table-sort]');

            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const login = this.root.querySelector('[data-github-login]').value.trim();

                if (!login) {
                    this.showError('Введите ник пользователя GitHub.');
                    return;
                }

                await this.loadRepos(login);
            });

            search.addEventListener('input', () => {
                this.applyFilters();
                this.renderRows();
            });

            sort.addEventListener('change', (event) => {
                this.sortField = event.target.value;
                this.renderRows();
            });
        }

        async loadRepos(login) {
            const tbody = this.root.querySelector('[data-table-body]');
            const search = this.root.querySelector('[data-table-search]');
            const sort = this.root.querySelector('[data-table-sort]');
            const normalizedLogin = login.trim().replace(/^@/, '');
            const encodedLogin = encodeURIComponent(normalizedLogin);

            this.showError('');
            this.renderMessage(tbody, 'Загрузка репозиториев...');

            try {
                const response = await fetch(`https://api.github.com/users/${encodedLogin}/repos?per_page=100&sort=updated`, {
                    headers: {
                        Accept: 'application/vnd.github+json',
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                });

                if (response.status === 404) {
                    throw new Error('Пользователь GitHub не найден.');
                }

                if (response.status === 403) {
                    throw new Error('Error 403. Доступ к запрошенному ресурсу запрещён.');
                }

                if (response.status === 429) {
                    throw new Error('Error 429. Слишком много запросов. Попробуйте позже.');
                }

                if (!response.ok) {
                    throw new Error('Произошла ошибка при загрузке данных GitHub.');
                }

                this.repos = await response.json();

                if (!Array.isArray(this.repos) || this.repos.length === 0) {
                    throw new Error('У пользователя нет открытых репозиториев.');
                }

                this.filteredRepos = [...this.repos];
                search.disabled = false;
                sort.disabled = false;
                this.renderRows();
            } catch (error) {
                this.repos = [];
                this.filteredRepos = [];
                search.disabled = true;
                sort.disabled = true;
                this.renderMessage(tbody, error.message);
            }
        }

        applyFilters() {
            const query = this.root.querySelector('[data-table-search]').value.toLowerCase();

            this.filteredRepos = this.repos.filter((repo) => {
                const name = repo.name.toLowerCase();
                const description = (repo.description || '').toLowerCase();
                const language = (repo.language || '').toLowerCase();

                return name.includes(query) || description.includes(query) || language.includes(query);
            });
        }

        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('ru-RU');
        }

        createRepoRow(repo) {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            const link = document.createElement('a');
            link.href = repo.html_url;
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = repo.name;
            nameCell.append(link);

            row.append(
                nameCell,
                this.createTextElement('td', repo.description || 'Без описания'),
                this.createTextElement('td', repo.language || 'Не указан'),
                this.createTextElement('td', String(repo.stargazers_count)),
                this.createTextElement('td', this.formatDate(repo.updated_at))
            );

            return row;
        }

        createSummaryRow(totalStars, repoCount) {
            const row = document.createElement('tr');
            row.className = 'table-summary';

            const titleCell = document.createElement('td');
            titleCell.colSpan = 3;
            titleCell.append(this.createTextElement('strong', 'Итого'));

            const starsCell = document.createElement('td');
            starsCell.append(this.createTextElement('strong', String(totalStars)));

            const countCell = document.createElement('td');
            countCell.append(this.createTextElement('strong', `${repoCount} реп.`));

            row.append(titleCell, starsCell, countCell);

            return row;
        }

        renderRows(container = this.root.querySelector('[data-table-body]')) {
            if (!container) return;

            const sorted = [...this.filteredRepos].sort((a, b) => {
                if (this.sortField === 'stargazers_count') return b.stargazers_count - a.stargazers_count;
                if (this.sortField === 'updated_at') return new Date(b.updated_at) - new Date(a.updated_at);
                return String(a[this.sortField] || '').localeCompare(String(b[this.sortField] || ''), 'ru');
            });

            this.clear(container);

            if (!sorted.length) {
                this.renderMessage(container, 'Репозитории не найдены.');
                return;
            }

            sorted.forEach((repo) => container.append(this.createRepoRow(repo)));

            const totalStars = sorted.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            container.append(this.createSummaryRow(totalStars, sorted.length));
        }

        showError(message) {
            const error = this.root.querySelector('[data-github-error]');
            if (error) error.textContent = message;
        }
    }

    class HomePage extends BasePage {
        constructor() {
            super('Главная');
        }
    }

    class AboutPage extends BasePage {
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

    class SkillsPage extends BasePage {
        constructor() {
            super('Навыки');
            this.skills = SKILLS;
        }

        init() {
            super.init();
            this.renderSkills();
            this.initSkillFilter();
            new DataTable('[data-skills-table]').init();
        }

        renderSkills(list = this.skills) {
            const container = document.querySelector('[data-skills-list]');
            if (!container) return;
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

                this.renderSkills(filtered);
            });
        }

    }

    class InteractivePage extends BasePage {
        constructor() {
            super('JavaScript');
        }

        init() {
            super.init();
            this.initGreeting();
            this.initNameModal();
            this.initCalculator();
            this.initCurrencyConverter();
            this.initVisitStats();
        }

        initGreeting() {
            const greetingBlock = document.querySelector('[data-greeting]');
            if (!greetingBlock) return;

            const name = localStorage.getItem('visitorName') || SITE_INFO.author;
            const currentHour = new Date().getHours();
            greetingBlock.textContent = `${getGreetingByHour(currentHour)}, ${name}! Рад видеть вас на сайте.`;
        }

        initNameModal() {
            const button = document.querySelector('[data-ask-name]');
            const modal = document.querySelector('[data-name-modal]');
            const input = document.querySelector('#visitor-name-input');
            const saveButton = document.querySelector('[data-save-name]');
            const closeButtons = document.querySelectorAll('[data-close-name-modal]');
            const error = document.querySelector('[data-name-error]');

            if (!button || !modal || !input || !saveButton) return;

            const openModal = () => {
                input.value = localStorage.getItem('visitorName') || '';
                if (error) error.textContent = '';
                modal.classList.add('is-open');
                modal.setAttribute('aria-hidden', 'false');
                input.focus();
            };

            const closeModal = () => {
                modal.classList.remove('is-open');
                modal.setAttribute('aria-hidden', 'true');
            };

            const saveName = () => {
                const name = onlyLetters(input.value).trim();

                if (name.length < 2) {
                    if (error) error.textContent = 'Введите имя минимум из 2 букв.';
                    input.classList.add('is-invalid');
                    return;
                }

                localStorage.setItem('visitorName', name);
                input.classList.remove('is-invalid');
                closeModal();
                this.initGreeting();
            };

            input.addEventListener('input', () => {
                input.value = onlyLetters(input.value);
                if (error) error.textContent = '';
                input.classList.remove('is-invalid');
            });

            button.addEventListener('click', openModal);
            saveButton.addEventListener('click', saveName);

            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    saveName();
                }

                if (event.key === 'Escape') {
                    closeModal();
                }
            });

            closeButtons.forEach((closeButton) => closeButton.addEventListener('click', closeModal));
        }


        initCalculator() {
            const calc = document.querySelector('[data-calculator]');
            if (!calc) return;

            const first = calc.querySelector('#calc-first');
            const second = calc.querySelector('#calc-second');
            const operation = calc.querySelector('#calc-operation');
            const result = calc.querySelector('[data-calc-result]');
            const button = calc.querySelector('button');

            const calculate = (a, b, op) => {
                switch (op) {
                    case '+': return a + b;
                    case '-': return a - b;
                    case '*': return a * b;
                    case '/': return b !== 0 ? a / b : null;
                    default: return 0;
                }
            };

            [first, second].forEach((input) => {
                input.addEventListener('keydown', blockNonDigitKeys);
                input.addEventListener('input', () => allowOnlyDigits(input));
            });

            button.addEventListener('click', () => {
                const a = Number(first.value);
                const b = Number(second.value);

                if (Number.isNaN(a) || Number.isNaN(b)) {
                    result.textContent = 'Введите два числа.';
                    return;
                }

                const answer = calculate(a, b, operation.value);
                result.textContent = answer === null ? 'На ноль делить нельзя.' : `Результат: ${formatMoney(answer)}`;
            });
        }

        initCurrencyConverter() {
            const converter = document.querySelector('[data-converter]');
            if (!converter) return;

            const amountInput = converter.querySelector('#rub-amount');
            const currencySelect = converter.querySelector('#currency');
            const result = converter.querySelector('[data-currency-result]');

            const convert = () => {
                allowOnlyDigits(amountInput);

                const rubles = Number(amountInput.value);
                const currency = currencySelect.value;
                const rateForHundredRubles = SITE_INFO.currencyRates[currency];

                if (!rubles || rubles <= 0) {
                    result.textContent = 'Введите сумму больше 0.';
                    return;
                }

                result.textContent = `${rubles} ₽ ≈ ${formatMoney(rubles / 100 * rateForHundredRubles)} ${currency.toUpperCase()}`;
            };

            amountInput.addEventListener('keydown', blockNonDigitKeys);
            amountInput.addEventListener('input', convert);
            currencySelect.addEventListener('change', convert);
            convert();
        }

        initVisitStats() {
            const block = document.querySelector('[data-stats]');
            if (!block) return;

            const now = Date.now();
            const visits = Number(localStorage.getItem('visitCount') || 0) + 1;
            const totalTime = Number(localStorage.getItem('totalTime') || 0);
            const previousAverage = visits > 1 ? Math.round(totalTime / (visits - 1)) : 0;

            localStorage.setItem('visitCount', String(visits));
            sessionStorage.setItem('sessionStart', String(now));

            block.textContent = `Вы посетили сайт ${visits} раз(а). Среднее время прошлых посещений: ${previousAverage} сек.`;

            window.addEventListener('beforeunload', () => {
                const start = Number(sessionStorage.getItem('sessionStart') || Date.now());
                const seconds = Math.round((Date.now() - start) / 1000);
                const savedTotal = Number(localStorage.getItem('totalTime') || 0);
                localStorage.setItem('totalTime', String(savedTotal + seconds));
            });
        }
    }

    class ContactsPage extends BasePage {
        constructor() {
            super('Контакты');
        }

        init() {
            super.init();
            this.initContactForm();
        }

        initContactForm() {
            const form = document.querySelector('[data-contact-form]');
            if (!form) return;

            const fullName = form.querySelector('#fullname');
            const email = form.querySelector('#email');
            const phone = form.querySelector('#phone');
            const date = form.querySelector('#contact-date');
            const photo = form.querySelector('#photo');
            const message = form.querySelector('#message');
            const preview = form.querySelector('[data-photo-preview]');
            const result = document.querySelector('[data-form-result]');
            const submitButton = form.querySelector('[data-submit-button]');

            const emailError = form.querySelector('[data-email-error]');
            const phoneError = form.querySelector('[data-phone-error]');
            const dateError = form.querySelector('[data-date-error]');
            const photoError = form.querySelector('[data-photo-error]');
            const messageError = form.querySelector('[data-message-error]');

            const modal = document.querySelector('[data-form-modal]');
            const modalContent = document.querySelector('[data-form-modal-content]');
            const closeModalButtons = document.querySelectorAll('[data-close-form-modal]');

            const allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp'];
            const allowedEmailPattern = /^[^\s@]+@(gmail\.com|yandex\.ru|mail\.ru)$/i;

            const setFieldState = (field, isValid, errorBlock, messageText = '') => {
                field.classList.toggle('is-valid', isValid);
                field.classList.toggle('is-invalid', !isValid && field.value.trim() !== '');
                if (errorBlock) errorBlock.textContent = messageText;
            };

            const normalizeFullNameInput = () => {
                fullName.value = onlyLetters(fullName.value);
                const parts = fullName.value.trimStart().split(/\s+/).filter(Boolean);
                if (parts.length > 3) {
                    fullName.value = parts.slice(0, 3).join(' ');
                }
            };

            const validateFullName = () => {
                normalizeFullNameInput();
                const parts = fullName.value.trim().split(/\s+/).filter(Boolean);
                const isValid = parts.length >= 2 && parts.length <= 3;
                setFieldState(fullName, isValid, null);
                return isValid;
            };

            const validateEmail = () => {
                const value = email.value.trim();
                const isValid = allowedEmailPattern.test(value);
                setFieldState(email, isValid, emailError, isValid || value === '' ? '' : 'Неправильный формат почты. После @ допускаются только gmail.com, yandex.ru или mail.ru.');
                return isValid;
            };

            const normalizePhoneInput = () => {
                let value = phone.value.replace(/[^\d+]/g, '');

                if (value.startsWith('+')) {
                    let digits = value.slice(1).replace(/\D/g, '');

                    if (digits.length === 0) {
                        phone.value = '+7';
                        return;
                    }

                    if (!digits.startsWith('7')) {
                        digits = '7' + digits.slice(1);
                    }

                    phone.value = '+' + digits.slice(0, 11);
                    return;
                }

                phone.value = value.replace(/\+/g, '').replace(/\D/g, '').slice(0, 11);
            };

            const validatePhone = () => {
                normalizePhoneInput();

                const value = phone.value.trim();
                const digits = value.replace(/\D/g, '');
                const isValid = (
                    (value.startsWith('+') && /^\+7\d{10}$/.test(value)) ||
                    (!value.startsWith('+') && /^8\d{10}$/.test(value))
                ) && digits.length === 11;

                setFieldState(phone, isValid, phoneError, isValid || value === '' ? '' : 'Введите российский номер: +7XXXXXXXXXX или 8XXXXXXXXXX.');
                return isValid;
            };

            const validateDate = () => {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isValid = date.value && selectedDate >= today;
                setFieldState(date, Boolean(isValid), dateError, isValid ? '' : 'Дата не может быть раньше сегодняшней.');
                dateError.className = isValid ? 'field-error success-text' : 'field-error error-text';
                return Boolean(isValid);
            };

            const validatePhoto = () => {
                const file = photo.files[0];

                if (!file) {
                    photo.classList.remove('is-valid', 'is-invalid');
                    photoError.textContent = '';
                    return true;
                }

                const isValid = allowedPhotoTypes.includes(file.type);
                photo.classList.toggle('is-valid', isValid);
                photo.classList.toggle('is-invalid', !isValid);
                photoError.textContent = isValid ? '' : 'Можно загрузить только JPG, PNG или WEBP.';
                return isValid;
            };

            const validateMessage = () => {
                message.classList.remove('is-invalid');
                message.classList.toggle('is-valid', message.value.trim().length > 0);
                if (messageError) messageError.textContent = '';
                return true;
            };

            const isFormValid = () => validateFullName() && validateEmail() && validatePhone() && validateDate() && validatePhoto() && validateMessage();

            const updateSubmitButton = () => {
                submitButton.disabled = !isFormValid();
            };

            const createResultLine = (label, value) => {
                const paragraph = document.createElement('p');
                const strong = document.createElement('strong');

                strong.textContent = `${label}:`;
                paragraph.append(strong, ` ${value}`);

                return paragraph;
            };

            const openResultModal = (parts, fileName) => {
                if (!modal || !modalContent) return;
                const [surname, name, patronymic = 'не указано'] = parts;
                const messageText = message.value.trim() || 'не указано';

                clearContainer(modalContent);

                const list = document.createElement('div');
                list.className = 'form-modal-list';

                list.append(
                    createResultLine('Фамилия', surname),
                    createResultLine('Имя', name),
                    createResultLine('Отчество', patronymic),
                    createResultLine('Email', email.value.trim()),
                    createResultLine('Телефон', phone.value.trim()),
                    createResultLine('Желаемая дата связи', date.value),
                    createResultLine('Фотография', fileName),
                    createResultLine('Сообщение', messageText)
                );

                modalContent.append(list);
                modal.classList.add('is-open');
                modal.setAttribute('aria-hidden', 'false');
            };

            closeModalButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    modal.classList.remove('is-open');
                    modal.setAttribute('aria-hidden', 'true');
                });
            });

            fullName.addEventListener('input', updateSubmitButton);
            email.addEventListener('input', updateSubmitButton);

            phone.addEventListener('keydown', (event) => {
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
                const isDigit = /^\d$/.test(event.key);
                const isPlus = event.key === '+';

                if (allowedKeys.includes(event.key)) return;

                if (isPlus) {
                    if (phone.selectionStart === 0 && !phone.value.includes('+')) return;
                    event.preventDefault();
                    return;
                }

                if (!isDigit) event.preventDefault();
            });

            phone.addEventListener('input', updateSubmitButton);
            date.addEventListener('input', updateSubmitButton);
            message.addEventListener('input', updateSubmitButton);

            [fullName, email, phone, date, message].forEach((field) => {
                field.addEventListener('blur', updateSubmitButton);
            });

            photo.addEventListener('change', () => {
                const file = photo.files[0];

                if (!file || !allowedPhotoTypes.includes(file.type)) {
                    preview.hidden = true;
                    preview.src = '';
                    photoError.textContent = file ? 'Можно загрузить только JPG, PNG или WEBP.' : '';
                    updateSubmitButton();
                    return;
                }

                preview.src = URL.createObjectURL(file);
                preview.alt = 'Миниатюра загруженной фотографии';
                preview.hidden = false;
                updateSubmitButton();
            });

            form.addEventListener('submit', (event) => {
                event.preventDefault();

                if (!isFormValid()) {
                    if (result) {
                        result.hidden = true;
                        result.textContent = '';
                    }
                    updateSubmitButton();
                    return;
                }

                const parts = fullName.value.trim().split(/\s+/).filter(Boolean);
                const fileName = photo.files[0] ? photo.files[0].name : 'не загружена';

                if (result) {
                    result.hidden = true;
                    result.textContent = '';
                }

                openResultModal(parts, fileName);
            });

            updateSubmitButton();
        }
    }

    const pageMap = {
        'index.html': HomePage,
        '': HomePage,
        'about.html': AboutPage,
        'skills.html': SkillsPage,
        'interactive.html': InteractivePage,
        'contacts.html': ContactsPage
    };

    document.addEventListener('DOMContentLoaded', () => {
        if (window.__pomStarted) return;

        const currentPage = window.location.pathname.split('/').pop();
        const PageClass = pageMap[currentPage] || HomePage;
        const page = new PageClass();

        page.init();
    });
})();
