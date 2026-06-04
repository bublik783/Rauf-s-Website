import { BasePage } from './BasePage.js';
import { onlyLetters } from '../utils/helpers.js';

export class ContactsPage extends BasePage {
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

        const openResultModal = (parts, fileName) => {
            if (!modal || !modalContent) return;
            const [surname, name, patronymic = 'не указано'] = parts;
            const messageText = message.value.trim() || 'не указано';

            modalContent.innerHTML = `
                <div class="form-modal-list">
                    <p><strong>Фамилия:</strong> ${surname}</p>
                    <p><strong>Имя:</strong> ${name}</p>
                    <p><strong>Отчество:</strong> ${patronymic}</p>
                    <p><strong>Email:</strong> ${email.value.trim()}</p>
                    <p><strong>Телефон:</strong> ${phone.value.trim()}</p>
                    <p><strong>Желаемая дата связи:</strong> ${date.value}</p>
                    <p><strong>Фотография:</strong> ${fileName}</p>
                    <p><strong>Сообщение:</strong> ${messageText}</p>
                </div>
            `;
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
