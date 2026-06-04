export const formatMoney = (value) => Number(value).toFixed(2);
export const onlyLetters = (text) => text.replace(/[^А-Яа-яЁёA-Za-z\s-]/g, '');

export function getGreetingByHour(hour) {
    if (hour >= 5 && hour < 12) return 'Доброе утро';
    if (hour >= 12 && hour < 18) return 'Добрый день';
    if (hour >= 18 && hour < 23) return 'Добрый вечер';
    return 'Доброй ночи';
}

export function allowOnlyDigits(input) {
    input.value = input.value.replace(/\D/g, '');
}

export function blockNonDigitKeys(event) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowedKeys.includes(event.key)) return;

    if (!/^\d$/.test(event.key)) {
        event.preventDefault();
    }
}

export function createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
}
