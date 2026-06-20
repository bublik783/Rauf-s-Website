export function resolveContainer(containerOrSelector) {
    if (typeof containerOrSelector === 'string') {
        return document.querySelector(containerOrSelector) || document.getElementById(containerOrSelector);
    }

    return containerOrSelector;
}

export function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

export function renderList(containerOrSelector, items, renderItem) {
    const container = resolveContainer(containerOrSelector);
    if (!container) return;

    clearContainer(container);
    items.forEach((item) => container.append(renderItem(item)));
}

export function renderOptions(selectOrSelector, items, valueKey, labelKey) {
    const select = resolveContainer(selectOrSelector);
    if (!select) return;

    clearContainer(select);
    items.forEach((item) => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[labelKey];
        select.append(option);
    });
}
