export type Visiblity = "public"|"protected"|"private"|undefined;

export interface ClassNode {
    name: string;
    attributes: ClassAttribute[];
    methods: ClassMethod[];
    package: string[];
    specialType?: "interface" | "enum";
    abstract: boolean;
}

export interface ClassAttribute {
    name: string;
    visiblity: Visiblity;
    static: boolean;
    type?: string;
}

export interface ClassMethod {
    name: string;
    visiblity: Visiblity;
    static: boolean;
    parameters: MethodParameter[];
    returnType?: string;
}

export interface MethodParameter {
    name: string;
    type?: string;
}