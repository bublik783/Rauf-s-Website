export class DataTable {
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

    init() {
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
        const code = this.createTextElement('code', 'fetch');
        description.append('Введите ник пользователя GitHub, чтобы загрузить таблицу его открытых репозиториев через ', code, '.');

        const form = document.createElement('form');
        form.className = 'github-form';
        form.dataset.githubForm = '';

        const label = document.createElement('label');
        label.htmlFor = 'github-login';
        label.textContent = 'Ник GitHub';

        const formRow = document.createElement('div');
        formRow.className = 'github-form-row';

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

        formRow.append(input, button);
        form.append(label, formRow, error);

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
