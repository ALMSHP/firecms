import { Entity } from "../types";

// Define a unique prefix for entity keys in localStorage to avoid key collisions
const LOCAL_STORAGE_PREFIX = "entity_cache::";

// In-memory cache to store entities for quick access
const entityCache: Map<string, object> = new Map();

// Check `localStorage` availability once during initialization
const isLocalStorageAvailable = typeof localStorage !== "undefined";

// Initialize the in-memory cache by loading entities from `localStorage`
if (isLocalStorageAvailable) {
    try {
        // Iterate over all keys in localStorage to find those with the specified prefix
        for (let i = 0; i < localStorage.length; i++) {
            const fullKey = localStorage.key(i);
            if (fullKey && fullKey.startsWith(LOCAL_STORAGE_PREFIX)) {
                const path = fullKey.substring(LOCAL_STORAGE_PREFIX.length);
                const entityString = localStorage.getItem(fullKey);
                if (entityString) {
                    try {
                        const entity: Entity = JSON.parse(entityString);
                        entityCache.set(path, entity);
                    } catch (parseError) {
                        console.error(
                            `Failed to parse entity for path "${path}" from localStorage:`,
                            parseError
                        );
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error accessing localStorage during initialization:", error);
    }
}

/**
 * Saves data to the in-memory cache and persists it individually in `localStorage`.
 * @param path - The unique path/key for the data.
 * @param data - The data to cache and persist.
 */
export function saveEntityToCache(path: string, data: object): void {
    // Update the in-memory cache
    entityCache.set(path, data);

    console.log(`Saving entity for path "${path}" to localStorage`);
    console.log(entityCache);

    // Persist the data individually in localStorage
    if (isLocalStorageAvailable) {
        try {
            const key = LOCAL_STORAGE_PREFIX + path;
            const entityString = JSON.stringify(data);
            localStorage.setItem(key, entityString);
        } catch (error) {
            console.error(
                `Failed to save entity for path "${path}" to localStorage:`,
                error
            );
        }
    }
}

/**
 * Retrieves an entity from the in-memory cache or `localStorage`.
 * If the entity is not in the cache but exists in `localStorage`, it loads it into the cache.
 * @param path - The unique path/key for the entity.
 * @returns The cached entity or `undefined` if not found.
 */
export function getEntityFromCache(path: string): object | undefined {

    console.log(`Getting entity for path "${path}" from localStorage`);

    // Attempt to retrieve the entity from the in-memory cache
    if (entityCache.has(path)) {
        console.log("Entity found in cache", entityCache.get(path));
        return entityCache.get(path);
    }

    // If not in the cache, attempt to load it from localStorage
    if (isLocalStorageAvailable) {
        try {
            const key = LOCAL_STORAGE_PREFIX + path;
            const entityString = localStorage.getItem(key);
            if (entityString) {
                const entity: Entity = JSON.parse(entityString);
                entityCache.set(path, entity); // Update the cache
                return entity;
            }
        } catch (error) {
            console.error(
                `Failed to load entity for path "${path}" from localStorage:`,
                error
            );
        }
    }

    // Entity not found
    return undefined;
}

/**
 * Removes an entity from both the in-memory cache and `localStorage`.
 * @param path - The unique path/key for the entity to remove.
 */
export function removeEntityFromCache(path: string): void {

    console.log(`Removing entity for path "${path}" from localStorage`);

    // Remove from the in-memory cache
    entityCache.delete(path);

    // Remove from localStorage
    if (isLocalStorageAvailable) {
        try {
            const key = LOCAL_STORAGE_PREFIX + path;
            localStorage.removeItem(key);
        } catch (error) {
            console.error(
                `Failed to remove entity for path "${path}" from localStorage:`,
                error
            );
        }
    }
}

/**
 * Clears the entire in-memory cache and removes all related entities from `localStorage`.
 */
export function clearEntityCache(): void {
    // Clear the in-memory cache
    entityCache.clear();

    // Remove all entities with the specified prefix from localStorage
    if (isLocalStorageAvailable) {
        try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const fullKey = localStorage.key(i);
                if (fullKey && fullKey.startsWith(LOCAL_STORAGE_PREFIX)) {
                    keysToRemove.push(fullKey);
                }
            }

            // Remove the keys after collecting them to avoid issues while iterating
            keysToRemove.forEach((key) => localStorage.removeItem(key));
        } catch (error) {
            console.error("Failed to clear entity cache from localStorage:", error);
        }
    }
}
