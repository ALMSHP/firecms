import { useState } from "react";
import { Entity, Property } from "@firecms/core";
import { ImportConfig } from "../types";

export const useImportConfig = (): ImportConfig => {

    const [inUse, setInUse] = useState<boolean>(false);
    const [idColumn, setIdColumn] = useState<string | undefined>();
    const [importData, setImportData] = useState<object[]>([]);
    const [entities, setEntities] = useState<Entity<any>[]>([]);
    const [headersMapping, setHeadersMapping] = useState<Record<string, string | null>>({});
    const [headingsOrder, setHeadingsOrder] = useState<string[]>([]);
    const [originProperties, setOriginProperties] = useState<Record<string, Property>>({});

    return {
        inUse,
        setInUse,
        idColumn,
        setIdColumn,
        entities,
        setEntities,
        importData,
        setImportData,
        headingsOrder: headingsOrder ?? Object.keys(headersMapping),
        setHeadingsOrder,
        headersMapping,
        setHeadersMapping,
        originProperties,
        setOriginProperties,
    };
};
