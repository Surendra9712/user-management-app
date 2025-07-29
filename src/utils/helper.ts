export const isNullOrUndefined = (value: unknown) => {
    return value === null || value === undefined;
}

export const isNullOrUndefinedOrEmpty = (value: unknown) => {
    return value === null || value === undefined || value?.toString().trim() === "";
}