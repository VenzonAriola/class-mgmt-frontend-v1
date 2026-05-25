export const DEPARTMENTS = [
    'CS',
    'Math',
    'English',
];

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept.toLowerCase(),
    label: dept,
}));