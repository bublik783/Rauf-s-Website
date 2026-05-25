'use strict';

// Лабораторная №3: базовый JavaScript для сайта
const siteInfo = {
    author: 'Rauf',
    year: 2026,
    currencyRates: {
        usd: 1.41,
        eur: 1.22,
        cny: 9.6
    }
};

const pages = ['Главная', 'Обо мне', 'Навыки', 'Контакты', 'JavaScript'];
let isModalOpened = false;

function getGreetingByHour(hour) {
    if (hour >= 5 && hour < 12) return 'Доброе утро';
    if (hour >= 12 && hour < 18) return 'Добрый день';
    if (hour >= 18 && hour < 23) return 'Добрый вечер';
    return 'Доброй ночи';
}

const formatMoney = (value) => Number(value).toFixed(2);
const onlyLetters = (text) => text.replace(/[^А-Яа-яЁёA-Za-z\s-]/g, '');

function initThemeSync() {
    const radios = document.querySelectorAll('.theme-radio');
    const savedTheme = localStorage.getItem('siteTheme') || 'light';

    function applyTheme(theme) {
        const radio = document.querySelector(`#theme-${theme}`);
        if (radio) radio.checked = true;
    }

    applyTheme(savedTheme);

    radios.forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const theme = radio.id.replace('theme-', '');
                localStorage.setItem('siteTheme', theme);
            }
        });
    });

    window.addEventListener('storage', (event) => {
        if (event.key === 'siteTheme' && event.newValue) {
            applyTheme(event.newValue);
        }
    });
}

function initGreeting() {
    const greetingBlock = document.querySelector('[data-greeting]');
    if (!greetingBlock) return;

    const name = localStorage.getItem('visitorName') || siteInfo.author;
    const currentHour = new Date().getHours();
    greetingBlock.textContent = `${getGreetingByHour(currentHour)}, ${name}! Рад видеть вас на сайте.`;
}

function initUserDialog() {
    const button = document.querySelector('[data-ask-name]');
    if (!button) return;

    button.addEventListener('click', () => {
        const agreed = confirm('Хотите ввести имя для персонального приветствия?');
        if (agreed) {
            const userName = prompt('Как вас зовут?', localStorage.getItem('visitorName') || 'Гость');
            if (userName && userName.trim().length > 1) {
                localStorage.setItem('visitorName', userName.trim());
                alert(`Приятно познакомиться, ${userName.trim()}!`);
                initThemeSync();
initGreeting();
            } else {
                alert('Имя не изменено.');
            }
        } else {
            alert('Хорошо, оставим стандартное приветствие.');
        }
    });
}

function initCalculator() {
    const calc = document.querySelector('[data-calculator]');
    if (!calc) return;

    const first = calc.querySelector('#calc-first');
    const second = calc.querySelector('#calc-second');
    const operation = calc.querySelector('#calc-operation');
    const result = calc.querySelector('[data-calc-result]');
    const button = calc.querySelector('button');

    function calculate(a, b, op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : null;
            default: return 0;
        }
    }

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

function initCurrencyConverter() {
    const converter = document.querySelector('[data-converter]');
    if (!converter) return;

    const amountInput = converter.querySelector('#rub-amount');
    const currencySelect = converter.querySelector('#currency');
    const result = converter.querySelector('[data-currency-result]');

    const convert = () => {
        const rubles = Number(amountInput.value);
        const currency = currencySelect.value;
        const rateForHundredRubles = siteInfo.currencyRates[currency];
        const message = rubles > 0 ? `${rubles} ₽ ≈ ${formatMoney(rubles / 100 * rateForHundredRubles)} ${currency.toUpperCase()}` : 'Введите сумму больше 0.';
        result.textContent = message;
    };

    amountInput.addEventListener('input', convert);
    currencySelect.addEventListener('change', convert);
    convert();
}

function initMeasureConverter() {
    const converter = document.querySelector('[data-measure-converter]');
    if (!converter) return;

    const amountInput = converter.querySelector('#measure-amount');
    const typeSelect = converter.querySelector('#measure-type');
    const result = converter.querySelector('[data-measure-result]');

    const measureRules = {
        'm-cm': { multiplier: 100, from: 'м', to: 'см' },
        'km-m': { multiplier: 1000, from: 'км', to: 'м' },
        'kg-g': { multiplier: 1000, from: 'кг', to: 'г' }
    };

    const convertMeasure = () => {
        const amount = Number(amountInput.value);
        const rule = measureRules[typeSelect.value];
        if (Number.isNaN(amount) || amount < 0) {
            result.textContent = 'Введите корректное положительное число.';
            return;
        }
        result.textContent = `${amount} ${rule.from} = ${formatMoney(amount * rule.multiplier)} ${rule.to}`;
    };

    amountInput.addEventListener('input', convertMeasure);
    typeSelect.addEventListener('change', convertMeasure);
    convertMeasure();
}

function initVisitStats() {
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
        localStorage.setItem('totalTime', String(totalTime + seconds));
    });
}

function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const fullName = form.querySelector('#fullname');
    const phone = form.querySelector('#phone');
    const date = form.querySelector('#contact-date');
    const photo = form.querySelector('#photo');
    const preview = form.querySelector('[data-photo-preview]');
    const result = document.querySelector('[data-form-result]');
    const dateError = form.querySelector('[data-date-error]');

    fullName.addEventListener('input', () => {
        fullName.value = onlyLetters(fullName.value);
    });

    date.addEventListener('input', () => {
        const selectedDate = new Date(date.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isCorrect = date.value && selectedDate >= today;
        dateError.textContent = isCorrect ? 'Дата подходит.' : 'Дата не может быть раньше сегодняшней.';
        dateError.className = isCorrect ? 'success-text' : 'error-text';
    });

    photo.addEventListener('change', () => {
        const file = photo.files[0];
        if (!file) return;
        preview.src = URL.createObjectURL(file);
        preview.alt = 'Миниатюра загруженной фотографии';
        preview.hidden = false;
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const parts = fullName.value.trim().split(/\s+/);
        const phoneValid = /^\+?[0-9\s()-]{10,18}$/.test(phone.value.trim());
        const requiredFilled = Array.from(form.querySelectorAll('[required]')).every((input) => input.value.trim() !== '');

        if (!requiredFilled || parts.length < 2 || !phoneValid) {
            result.textContent = 'Проверьте поля: ФИО должно содержать минимум имя и фамилию, телефон — корректный номер.';
            result.className = 'form-result error-text';
            return;
        }

        const [surname, name, patronymic = 'не указано'] = parts;
        result.innerHTML = `<strong>Данные формы:</strong><br>Фамилия: ${surname}<br>Имя: ${name}<br>Отчество: ${patronymic}<br>Телефон: ${phone.value}`;
        result.className = 'form-result success-text';
    });
}

function initModal() {
    const openButton = document.querySelector('[data-open-modal]');
    const modal = document.querySelector('[data-modal]');
    if (!openButton || !modal) return;

    const closeButtons = modal.querySelectorAll('[data-close-modal]');

    openButton.addEventListener('click', () => {
        isModalOpened = true;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            isModalOpened = false;
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
        });
    });
}

for (let i = 0; i < pages.length; i += 1) {
    console.log(`Страница сайта: ${pages[i]}`);
}

initThemeSync();
initGreeting();
initUserDialog();
initCalculator();
initCurrencyConverter();
initVisitStats();
initContactForm();
initModal();
