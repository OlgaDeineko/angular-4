export interface IFaqStructureMapping {
    mapping: IFaqStructureMappingData[];
    default_values: IFaqStructureMappingDefaultValues[];
}

export interface IFaqStructureMappingData {
    customer_key?: string;
    target_key?: string;
    pattern?: {
        split_by: string;
    }
}

export interface IFaqStructureMappingDefaultValues {
    author: string;
    visibility: string;
    status: string;
    is_open_comments: number;
    lang: string;
}
