import { useCallback } from "react";
import {
    DataSource,
    DataSourceDelegate, DeleteEntityProps,
    Entity,
    EntityCollection,
    EntityReference,
    EntityValues,
    FetchCollectionProps,
    FetchEntityProps,
    FilterValues,
    GeoPoint,
    ListenCollectionProps,
    ListenEntityProps,
    PropertyConfig,
    ResolvedProperties,
    SaveEntityProps
} from "../types";
import { resolveCollection, updateDateAutoValues } from "../core";

/**
 * Use this hook to build a {@link DataSource} based on Firestore
 * @param firebaseApp
 * @param textSearchController
 * @param collectionRegistry
 * @category Firebase
 */
export function useBuildDataSource({
                                       delegate,
                                       customFields
                                   }: {
    delegate: DataSourceDelegate,
    customFields: Record<string, PropertyConfig>;
}): DataSource {

    return {

        /**
         * Fetch entities in a Firestore path
         * @param path
         * @param collection
         * @param filter
         * @param limit
         * @param startAfter
         * @param searchString
         * @param orderBy
         * @param order
         * @return Function to cancel subscription
         * @see useCollectionFetch if you need this functionality implemented as a hook
         * @category Firestore
         */
        fetchCollection: useCallback(<M extends Record<string, any>>({
                                                                         path,
                                                                         collection,
                                                                         filter,
                                                                         limit,
                                                                         startAfter,
                                                                         searchString,
                                                                         orderBy,
                                                                         order
                                                                     }: FetchCollectionProps<M>
        ): Promise<Entity<M>[]> => {

            return delegate.fetchCollection<M>({
                path,
                filter,
                limit,
                startAfter,
                searchString,
                orderBy,
                order
            });
        }, [delegate]),

        /**
         * Listen to a entities in a given path
         * @param path
         * @param collection
         * @param onError
         * @param filter
         * @param limit
         * @param startAfter
         * @param searchString
         * @param orderBy
         * @param order
         * @param onUpdate
         * @return Function to cancel subscription
         * @see useCollectionFetch if you need this functionality implemented as a hook
         * @category Firestore
         */
        listenCollection: delegate.listenCollection
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useCallback(<M extends Record<string, any>>(
                {
                    path,
                    collection,
                    filter,
                    limit,
                    startAfter,
                    searchString,
                    orderBy,
                    order,
                    onUpdate,
                    onError
                }: ListenCollectionProps<M>
            ): () => void => {

                const isCollectionGroup = Boolean(collection.collectionGroup) ?? false;
                if (!delegate.listenCollection)
                    throw Error("useBuildDataSource delegate not initialised");

                return delegate.listenCollection<M>({
                    path,
                    filter,
                    limit,
                    startAfter,
                    searchString,
                    orderBy,
                    order,
                    onUpdate,
                    onError,
                    isCollectionGroup
                });
            }, [delegate])
            : undefined,

        /**
         * Retrieve an entity given a path and a collection
         * @param path
         * @param entityId
         * @param collection
         * @category Firestore
         */
        fetchEntity: useCallback(<M extends Record<string, any>>({
                                                                     path,
                                                                     entityId
                                                                 }: FetchEntityProps<M>
        ): Promise<Entity<M> | undefined> => delegate.fetchEntity({
            path,
            entityId
        }), [delegate]),

        /**
         *
         * @param path
         * @param entityId
         * @param collection
         * @param onUpdate
         * @param onError
         * @return Function to cancel subscription
         * @category Firestore
         */
        listenEntity: delegate.listenEntity
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ? useCallback(<M extends Record<string, any>>(
                {
                    path,
                    entityId,
                    collection,
                    onUpdate,
                    onError
                }: ListenEntityProps<M>): () => void => {
                if (!delegate.listenEntity)
                    throw Error("useBuildDataSource delegate not initialised");

                return delegate.listenEntity<M>({
                    path,
                    entityId,
                    onUpdate,
                    onError
                })
            }, [delegate.listenEntity]) : undefined,

        /**
         * Save entity to the specified path. Note that Firestore does not allow
         * undefined values.
         * @param path
         * @param entityId
         * @param values
         * @param schemaId
         * @param collection
         * @param status
         * @category Firestore
         */
        saveEntity: useCallback(<M extends Record<string, any>>(
            {
                path,
                entityId,
                values,
                collection,
                status
            }: SaveEntityProps<M>): Promise<Entity<M>> => {

            const resolvedCollection = resolveCollection<M>({
                collection,
                path,
                entityId,
                fields: customFields
            });

            const properties: ResolvedProperties<M> = resolvedCollection.properties;

            const firestoreValues = cmsToDelegateModel(
                values,
                delegate.buildReference,
                delegate.buildGeoPoint,
                delegate.buildDate,
                delegate.buildDeleteFieldValue
            );
            const updatedFirestoreValues: EntityValues<M> = updateDateAutoValues(
                {
                    inputValues: firestoreValues,
                    properties,
                    status,
                    timestampNowValue: delegate.currentTime(),
                    setDateToMidnight: delegate.setDateToMidnight
                });

            console.debug("Saving entity", path, entityId, updatedFirestoreValues);

            return delegate.saveEntity({
                path,
                entityId,
                values: updatedFirestoreValues,
                status
            }).then((res) => {
                return {
                    id: res.id,
                    path: res.path,
                    values: delegate.delegateToCMSModel(updatedFirestoreValues)
                } as Entity<M>;
            });
        }, [delegate.saveEntity]),

        /**
         * Delete an entity
         * @param entity
         * @param collection
         * @category Firestore
         */
        deleteEntity: useCallback(<M extends Record<string, any>>(
            {
                entity
            }: DeleteEntityProps<M>
        ): Promise<void> => {
            return delegate.deleteEntity({entity});
        }, [delegate.deleteEntity]),

        /**
         * Check if the given property is unique in the given collection
         * @param path Collection path
         * @param name of the property
         * @param value
         * @param property
         * @param entityId
         * @return `true` if there are no other fields besides the given entity
         * @category Firestore
         */
        checkUniqueField: useCallback((
            path: string,
            name: string,
            value: any,
            entityId?: string
        ): Promise<boolean> => {
            return delegate.checkUniqueField(path, name, value, entityId);
        }, [delegate.checkUniqueField]),

        generateEntityId: useCallback((path: string): string => {
            return delegate.generateEntityId(path, );
        }, [delegate.generateEntityId]),

        countEntities: useCallback(async ({
                                              path,
                                              collection,
                                              filter,
                                              order,
                                              orderBy
                                          }: {
            path: string,
            collection: EntityCollection<any>,
            filter?: FilterValues<Extract<keyof any, string>>,
            orderBy?: string,
            order?: "desc" | "asc",
        }): Promise<number> => {
            return delegate.countEntities({
                path,
                filter,
                orderBy,
                order,
                isCollectionGroup: Boolean(collection.collectionGroup) ?? false
            });
        }, [delegate.countEntities]),

        isFilterCombinationValid: useCallback(({
                                                   path,
                                                   filterValues,
                                                   sortBy
                                               }: {
            path: string,
            filterValues: FilterValues<any>,
            sortBy?: [string, "asc" | "desc"]
        }): boolean => {
            if (!delegate.isFilterCombinationValid)
                return true;
            return delegate.isFilterCombinationValid(
                {
                    path,
                    filterValues,
                    sortBy
                }
            )
        }, [delegate.isFilterCombinationValid])

    };

}

/**
 * Recursive function that converts Firestore data types into CMS or plain
 * JS types.
 * FireCMS uses Javascript dates internally instead of Firestore timestamps.
 * This makes it easier to interact with the rest of the libraries and
 * bindings.
 * Also, Firestore references are replaced with {@link EntityReference}
 * @param data
 * @category Firestore
 */
export function cmsToDelegateModel(data: any,
                                   buildReference: (reference: EntityReference) => any,
                                   buildGeoPoint: (geoPoint: GeoPoint) => any,
                                   buildDate: (date: Date) => any,
                                   buildDelete: () => any
): any {
    if (data === undefined) {
        return buildDelete();
    } else if (Array.isArray(data)) {
        return data.map(v => cmsToDelegateModel(v, buildReference, buildGeoPoint, buildDate, buildDelete));
    } else if (data instanceof EntityReference) {
        return buildReference(data);
    } else if (data instanceof GeoPoint) {
        return buildGeoPoint(data);
    } else if (data instanceof Date) {
        return buildDate(data);
    } else if (data && typeof data === "object") {
        return Object.entries(data)
            .map(([key, v]) => ({ [key]: cmsToDelegateModel(v, buildReference, buildGeoPoint, buildDate, buildDelete) }))
            .reduce((a, b) => ({ ...a, ...b }), {});
    }
    return data;
}

