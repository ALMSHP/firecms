import React from "react";
import { EntityLinkBuilder } from "./entity_link_builder";
import { FireCMSPlugin } from "./plugins";
import { EntityCustomView } from "./collections";
import { Locale } from "./locales";
import { PropertyConfig } from "./property_config";

export type CustomizationController = {

    /**
     * Builder for generating utility links for entities
     */
    entityLinkBuilder?: EntityLinkBuilder;

    /**
     * Use plugins to modify the behaviour of the CMS.
     */
    plugins?: FireCMSPlugin<any, any, any>[];

    /**
     * List of additional custom views for entities.
     * You can use the key to reference the custom view in
     * the `entityViews` prop of a collection.
     *
     * You can also define an entity view from the UI.
     */
    entityViews?: EntityCustomView[];

    /**
     * Format of the dates in the CMS.
     * Defaults to 'MMMM dd, yyyy, HH:mm:ss'
     */
    dateTimeFormat?: string;

    /**
     * Locale of the CMS, currently only affecting dates
     */
    locale?: Locale;

    /**
     * Record of custom form fields to be used in the CMS.
     * You can use the key to reference the custom field in
     * the `propertyConfig` prop of a property in a collection.
     */
    propertyConfigs: Record<string, PropertyConfig>;

    components?: {

        /**
         * Component to render when a reference is missing
         */
        missingReference?: React.ComponentType<{
            path: string,
        }>;

    };
}
