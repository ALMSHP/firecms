import React from "react";
import clsx from "clsx";

import { CollectionSize } from "../../../../types";
import { SearchBar } from "./SearchBar";
import { CircularProgress, IconButton, Select, SelectItem, Tooltip } from "../../../../components";
import { useLargeLayout } from "../../../../hooks/useLargeLayout";
import { defaultBorderMixin } from "../../../../styles";
import { FilterListOffIcon } from "../../../../icons";

interface CollectionTableToolbarProps {
    size: CollectionSize;
    filterIsSet: boolean;
    loading: boolean;
    forceFilter: boolean;
    actionsStart?: React.ReactNode;
    actions?: React.ReactNode;
    title?: React.ReactNode,
    onTextSearch?: (searchString?: string) => void;
    onSizeChanged: (size: CollectionSize) => void;
    clearFilter: () => void;
}

export function CollectionTableToolbar<M extends Record<string, any>>(props: CollectionTableToolbarProps) {

    const largeLayout = useLargeLayout();

    const filterView = !props.forceFilter && props.filterIsSet &&
        <Tooltip title="Clear filter">
            <IconButton
                className="h-fit-content"
                aria-label="filter clear"
                onClick={props.clearFilter}
                size="medium">
                <FilterListOffIcon/>
            </IconButton>
        </Tooltip>;

    const sizeSelect = (
        <Select
            value={props.size as string}
            className="w-16 h-10"
            size={"small"}
            onValueChange={(v) => props.onSizeChanged(v as CollectionSize)}
            renderValue={(v) => <div className={"font-medium"}>{v.toUpperCase()}</div>}
        >
            {["xs", "s", "m", "l", "xl"].map((size) => (
                <SelectItem key={size} value={size}>
                    {size.toUpperCase()}
                </SelectItem>
            ))}
        </Select>
    );

    return (
        <div
            className={clsx(defaultBorderMixin, "no-scrollbar min-h-[56px] overflow-x-auto px-4 bg-gray-50 dark:bg-gray-900 border-b flex flex-row justify-between items-center w-full")}
        >

            <div className="flex items-center gap-8 md:gap-4 ">

                {props.title && <div className={"hidden lg:block"}>
                    {props.title}
                </div>}

                {sizeSelect}

                {props.actionsStart}

                {filterView}

            </div>

            <div className="flex items-center gap-4 md:gap-2">

                {largeLayout && <div className="w-[22px]">
                    {props.loading &&
                        <CircularProgress size={"small"}/>}
                </div>}

                {props.onTextSearch &&
                    <SearchBar
                        key={"search-bar"}
                        onTextSearch={props.onTextSearch}
                        expandable={true}/>
                }

                {props.actions}

            </div>

        </div>
    );
}
