export async function fetchCourses() {
    const response = await fetch('./js/data/courses.json');

    if (!response.ok) {
        throw new Error('Не удалось загрузить данные таблицы.');
    }

    return response.json();
}
