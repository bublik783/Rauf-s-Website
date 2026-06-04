import { BasePage } from './BasePage.js';
import { SITE_INFO } from '../data/constants.js';
import { formatMoney, getGreetingByHour, onlyLetters, blockNonDigitKeys, allowOnlyDigits } from '../utils/helpers.js';

export class InteractivePage extends BasePage {
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
