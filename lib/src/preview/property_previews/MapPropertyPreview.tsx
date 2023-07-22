import React from "react";
import clsx from "clsx";

import { ResolvedMapProperty } from "../../types";
import { ErrorBoundary } from "../../core";
import { PropertyPreviewProps } from "../PropertyPreviewProps";
import { PropertyPreview } from "../PropertyPreview";
import { Typography } from "../../components";
import { defaultBorderMixin } from "../../styles";

/**
 * @category Preview components
 */
export function MapPropertyPreview<T extends Record<string, any> = Record<string, any>>({
                                                                                            propertyKey,
                                                                                            value,
                                                                                            property,
                                                                                            entity,
                                                                                            size
                                                                                        }: PropertyPreviewProps<T>) {

    if (property.dataType !== "map") {
        throw Error("Picked wrong preview component MapPropertyPreview");
    }

    const mapProperty = property as ResolvedMapProperty;
    if (!mapProperty.properties) {
        return (
            <KeyValuePreview value={value}/>
        );
    }

    if (!value) return null;

    let mapPropertyKeys: string[];
    if (size === "medium") {
        mapPropertyKeys = Object.keys(mapProperty.properties);
    } else {
        mapPropertyKeys = (mapProperty.previewProperties || Object.keys(mapProperty.properties)) as string[];
        if (size === "small")
            mapPropertyKeys = mapPropertyKeys.slice(0, 3);
        else if (size === "tiny")
            mapPropertyKeys = mapPropertyKeys.slice(0, 1);
    }

    if (size !== "medium")
        return (
            <div className="w-full flex flex-col space-y-1 md:space-y-2">
                {mapPropertyKeys.map((key, index) => (
                    <div key={`map_${key}`}>
                        <ErrorBoundary
                            key={"map_preview_" + mapProperty.name + key + index}>
                            <PropertyPreview propertyKey={key}
                                             value={(value)[key]}
                                             property={mapProperty.properties![key]}
                                             entity={entity}
                                             size={size}/>
                        </ErrorBoundary>
                    </div>
                ))}
            </div>
        );

    return (
        <div
            className="flex flex-col w-full">
            {mapPropertyKeys &&
                mapPropertyKeys.map((key, index) => {
                    return (
                        <div
                            key={`map_preview_table_${key}}`}
                            className={clsx(defaultBorderMixin, "flex flex-row pt-0.5 last:border-b-0 border-b border-opacity-gray-100 pb-0.5")}>
                            <div
                                key={`table-cell-title-${key}-${key}`}
                                className="w-1/4 align-top pr-1">
                                <Typography variant={"caption"}
                                            className={"font-mono"}
                                            color={"secondary"}>
                                    {mapProperty.properties![key].name}
                                </Typography>
                            </div>
                            <div
                                className="flex-grow">
                                <ErrorBoundary>
                                    <PropertyPreview
                                        propertyKey={key}
                                        value={(value)[key]}
                                        property={mapProperty.properties![key]}
                                        entity={entity}
                                        size={"small"}/>
                                </ErrorBoundary>
                            </div>
                        </div>
                    );
                })}
        </div>
    );

}

export function KeyValuePreview({ value }: { value: any }) {
    if (typeof value !== "object") return null;
    return <div
        className="flex flex-col w-full">
        {
            Object.entries(value).map(([key, childValue]) => (
                <div
                    key={`map_preview_table_${key}}`}
                    className={clsx(defaultBorderMixin, "flex flex-row pt-0.5 border-b border-opacity-100 last:border-0 last:pb-0 pb-0.5")}>
                    <div
                        key={`table-cell-title-${key}-${key}`}
                        className="w-1/4 align-top pr-1">
                        <Typography variant={"caption"}
                                    className={"font-mono"}
                                    color={"secondary"}>
                            {key}
                        </Typography>
                    </div>
                    <div
                        className="flex-grow">
                        <Typography
                            variant={"caption"}
                            className={"font-mono"}>
                            <ErrorBoundary>
                                {JSON.stringify(childValue)}
                            </ErrorBoundary>
                        </Typography>
                    </div>
                </div>
            ))
        }
    </div>;
}
