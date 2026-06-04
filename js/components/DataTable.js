export class DataTable {
    constructor(rootSelector) {
        this.root = document.querySelector(rootSelector);
        this.repos = [];
        this.filteredRepos = [];
        this.sortField = 'updated_at';
    }

    async init() {
        if (!this.root) return;

        this.root.innerHTML = `
            <section class="interactive-card">
                <h3>GitHub-репозитории</h3>
                <p>Введите ник пользователя GitHub, чтобы загрузить таблицу его открытых репозиториев через <code>fetch</code>.</p>
                <form class="github-form" data-github-form>
                    <label for="github-login">Ник GitHub</label>
                    <div class="github-form-row">
                        <input type="text" id="github-login" data-github-login placeholder="Например, bublik783">
                        <button type="submit">Загрузить</button>
                    </div>
                    <p class="field-error" data-github-error></p>
                </form>
                <div class="table-controls">
                    <input type="search" data-table-search placeholder="Поиск по названию, описанию или языку" disabled>
                    <select data-table-sort disabled>
                        <option value="updated_at">Сортировка по дате обновления</option>
                        <option value="name">Сортировка по названию</option>
                        <option value="language">Сортировка по языку</option>
                        <option value="stargazers_count">Сортировка по звёздам</option>
                    </select>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Язык</th>
                                <th>Звёзды</th>
                                <th>Последнее обновление</th>
                            </tr>
                        </thead>
                        <tbody data-table-body>
                            <tr><td colspan="5">Введите ник GitHub и нажмите «Загрузить».</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        `;
        this.bindEvents();
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
            this.render();
        });

        sort.addEventListener('change', (event) => {
            this.sortField = event.target.value;
            this.render();
        });
    }

    async loadRepos(login) {
        const tbody = this.root.querySelector('[data-table-body]');
        const search = this.root.querySelector('[data-table-search]');
        const sort = this.root.querySelector('[data-table-sort]');
        const normalizedLogin = login.trim().replace(/^@/, '');
        const encodedLogin = encodeURIComponent(normalizedLogin);

        this.showError('');
        tbody.innerHTML = '<tr><td colspan="5">Загрузка репозиториев...</td></tr>';

        try {
            const response = await fetch(`https://api.github.com/users/${encodedLogin}/repos?per_page=100&sort=updated`, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            if (!response.ok) {
                let message = 'GitHub API временно недоступен.';
                if (response.status === 404) {
                throw new Error('Пользователь GitHub не найден.');
            }

            if (response.status === 403) {
                throw new Error('Error 403. Доступ к запрошенному ресурсу запрещён.');
            }

            if (response.status === 429) {
                throw new Error('Error 429. Слишком много запросов. Попробуйте позже.');
            }

            throw new Error('Произошла ошибка при загрузке данных GitHub.');
            }

            this.repos = await response.json();

            if (!Array.isArray(this.repos) || this.repos.length === 0) {
                throw new Error('У пользователя нет открытых репозиториев.');
            }

            this.filteredRepos = [...this.repos];
            search.disabled = false;
            sort.disabled = false;
            this.render();
        } catch (error) {
            this.repos = [];
            this.filteredRepos = [];
            search.disabled = true;
            sort.disabled = true;
            tbody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
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

    render() {
        const tbody = this.root.querySelector('[data-table-body]');

        const sorted = [...this.filteredRepos].sort((a, b) => {
            if (this.sortField === 'stargazers_count') return b.stargazers_count - a.stargazers_count;
            if (this.sortField === 'updated_at') return new Date(b.updated_at) - new Date(a.updated_at);
            return String(a[this.sortField] || '').localeCompare(String(b[this.sortField] || ''), 'ru');
        });

        const totalStars = sorted.reduce((sum, repo) => sum + repo.stargazers_count, 0);

        tbody.innerHTML = sorted.map((repo) => `
            <tr>
                <td><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></td>
                <td>${repo.description || 'Без описания'}</td>
                <td>${repo.language || 'Не указан'}</td>
                <td>${repo.stargazers_count}</td>
                <td>${this.formatDate(repo.updated_at)}</td>
            </tr>
        `).join('') || '<tr><td colspan="5">Репозитории не найдены.</td></tr>';

        if (sorted.length) {
            tbody.innerHTML += `
                <tr class="table-summary">
                    <td colspan="3"><strong>Итого</strong></td>
                    <td><strong>${totalStars}</strong></td>
                    <td><strong>${sorted.length} реп.</strong></td>
                </tr>
            `;
        }
    }

    showError(message) {
        const error = this.root.querySelector('[data-github-error]');
        if (error) error.textContent = message;
    }
}
