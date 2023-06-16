export type Visiblity = "public"|"protected"|"private"|undefined;

export interface ClassNode {
    name: string;
    attributes: ClassAttribute[];
    methods: ClassMethod[];
}

export interface ClassAttribute {
    name: string;
    visiblity: Visiblity;
    static: boolean;
}

export interface ClassMethod {
    name: string;
    visiblity: Visiblity;
    static: boolean;
}