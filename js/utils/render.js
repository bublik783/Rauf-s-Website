export function renderList(container, items, renderItem) {
    container.innerHTML = '';
    items.forEach((item) => container.append(renderItem(item)));
}

export function renderOptions(select, items, valueKey, labelKey) {
    select.innerHTML = '';
    items.forEach((item) => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[labelKey];
        select.append(option);
    });
}
