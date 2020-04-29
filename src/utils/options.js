// Utilities for working with options list

export function getTextForValue(options, value) {
    for (let option of options) {
        if (option.value === value) {
            return option.text
        }
    }
    return ''
}
