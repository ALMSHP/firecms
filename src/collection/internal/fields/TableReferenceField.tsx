import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { ReferencePreview } from "../../../preview";
import { ErrorView } from "../../../core/components";
import {
    ArrayProperty,
    CollectionSize,
    Entity,
    EntityReference,
    ReferenceProperty
} from "../../../models";
import ReferenceDialog from "../../../core/components/ReferenceDialog";

import { getPreviewSizeFrom } from "../../../preview/util";
import { useInputStyles } from "./styles";
import { useSchemasRegistry } from "../../../contexts/SchemaRegistry";
import { getReferenceFrom } from "../../../models/utils";


export function TableReferenceField<M extends { [Key: string]: any }>(props: {
    name: string;
    disabled: boolean;
    internalValue: EntityReference | EntityReference[] | undefined | null;
    updateValue: (newValue: (EntityReference | EntityReference [] | null)) => void;
    property: ReferenceProperty | ArrayProperty<EntityReference[]>;
    size: CollectionSize;
    setPreventOutsideClick: (value: any) => void;
}) {

    const {
        name,
        internalValue,
        setPreventOutsideClick,
        property,
        updateValue,
        size,
        disabled
    } = props;

    let usedProperty: ReferenceProperty;
    let multiselect;
    if (property.dataType === "reference") {
        usedProperty = property;
        multiselect = false;
    } else if (property.dataType === "array" && property.of?.dataType === "reference") {
        usedProperty = property.of;
        multiselect = true;
    } else {
        throw Error("TableReferenceField misconfiguration");
    }

    const classes = useInputStyles();
    const collectionPath = usedProperty.collectionPath;

    const [open, setOpen] = useState<boolean>(false);

    const schemaRegistry = useSchemasRegistry();
    const collectionConfig = schemaRegistry.getCollectionConfig(usedProperty.collectionPath);
    if (!collectionConfig) {
        console.error(`Couldn't find the corresponding collection view for the path: ${usedProperty.collectionPath}`);
    }


    const handleOpen = (event: React.MouseEvent) => {
        if (disabled)
            return;
        if (event.detail <= 1) {
            event.stopPropagation();
            setPreventOutsideClick(true);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setPreventOutsideClick(false);
        setOpen(false);
    };

    const onSingleValueSet = (entity: Entity<any>) => {
        updateValue(entity ? getReferenceFrom(entity) : null);
        setPreventOutsideClick(false);
        setOpen(false);
    };

    const onMultipleEntitiesSelected = (entities: Entity<any>[]) => {
        updateValue(entities.map((e) => getReferenceFrom(e)));
    };

    const selectedIds = internalValue ?
        (Array.isArray(internalValue) ?
            internalValue.map((ref) => ref.id) :
            internalValue.id ? [internalValue.id] : [])
        : [];
    const valueNotSet = !internalValue || (Array.isArray(internalValue) && internalValue.length === 0);

    function buildSingleReferenceField() {
        if (internalValue instanceof EntityReference)
            return <ReferencePreview name={name}
                                     onClick={disabled ? undefined : handleOpen}
                                     value={internalValue as EntityReference}
                                     property={usedProperty}
                                     size={getPreviewSizeFrom(size)}/>;
        else
            return <ErrorView error={"Data is not a reference"}/>;
    }

    function buildMultipleReferenceField() {
        if (Array.isArray(internalValue))
            return <>
                {internalValue.map((v, index) =>
                    <div className={classes.arrayItem}
                         key={`preview_array_ref_${name}_${index}`}>
                        <ReferencePreview
                            name={`${name}[${index}]`}
                            onClick={disabled ? undefined : handleOpen}
                            size={"tiny"}
                            value={v}
                            property={usedProperty}

                        />
                    </div>
                )
                }
            </>;
        else
            return <ErrorView error={"Data is not an array of references"}/>;
    }

    if (!collectionConfig)
        return <ErrorView error={"The specified collection does not exist"}/>;

    return (
        <>

            {internalValue && !multiselect &&
            buildSingleReferenceField()
            }

            {internalValue && multiselect &&
            buildMultipleReferenceField()
            }

            {valueNotSet &&
            <Button
                onClick={handleOpen}
                size={"small"}
                variant="outlined"
                color="primary">
                Edit {property.title}
            </Button>}

            {!disabled
            && open
            && <ReferenceDialog open={open}
                                multiselect={multiselect}
                                collectionPath={collectionPath}
                                collection={collectionConfig}
                                onClose={handleClose}
                                onMultipleEntitiesSelected={onMultipleEntitiesSelected}
                                onSingleEntitySelected={onSingleValueSet}
                                selectedEntityIds={selectedIds}
            />}


        </>
    );
}
