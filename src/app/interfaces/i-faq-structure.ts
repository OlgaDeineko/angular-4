export interface IFaqStructure {
    customer: IFaqStructureCustomer[];
    target: IFaqStructureTarget[];
    default_values: IFaqStructureDefaultValues[];
}

export interface IFaqStructureCustomer {
    key?: string;
    title?: string;
}

export interface IFaqStructureTarget {
    key?: string;
    title?: string;
    type?: string;
    length?: number;
}

export interface IFaqStructureDefaultValues {
    key?: string;
    title?: string;
    type?: string;
    enum?: string[];
    length?: number;
}
