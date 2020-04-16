// Utilities for working with maps

// Get a key from map or return default
export function getOr(map, key, def) {
    if (map.has(key)) {
        return map.get(key)
    }
    return def
}

// Append value to a map of arrays
export function mapPush(map, key, value) {
    if (map.has(key)) {
        map.get(key).push(value)
    } else {
        map.set(key, [value])
    }
}
