declare type DataTableHeader = {
    key: string;
    value?: string;
    title: string;
    colspan?: number;
    rowspan?: number;
    fixed?: boolean;
    align?: 'start' | 'end';
    width?: number;
    minWidth?: string;
    maxWidth?: string;
    sortable?: boolean;
    // sort?: DataTableCompareFunction;
};

export default DataTableHeader;