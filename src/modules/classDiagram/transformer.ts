import { Project, SyntaxKind, TypeNode } from "ts-morph";
import { ClassNode, MethodParameter, Visiblity } from "./diagramTypes";
import cli from "../cli/cli";

interface TransformerOptions {
    inputGlob: string;
}

export interface TransformerOutput {
    classes: ClassNode[];
    associations: Record<string, Set<string>>;
}

export function transformCode(options: TransformerOptions): TransformerOutput {

    const classes: ClassNode[] = [];
    const associations: Record<string, Set<string>> = {};

    const project = new Project({});
    project.addSourceFilesAtPaths(options.inputGlob);

    const allFiles = project.getSourceFiles();

    // Figuring out "project root"
    let possiblePrefixes = allFiles[0].getFilePath().split("/");
    let i = 0;
    while (i < possiblePrefixes.length) {
        const prefix = possiblePrefixes.slice(0, i+1).join("/");
        let prefixWorking = true;
        allFiles.forEach(sf => {
            if (!sf.getFilePath().startsWith(prefix)) {
                prefixWorking = false;
            }
        });
        if (!prefixWorking) break;
        i++;
    }
    let prefix = "";
    if (i !== 0) {
        prefix = possiblePrefixes.slice(0, i).join("/");
    }
    cli.debug("Longest common prefix: " + prefix);


    // Parse sourcefiles
    allFiles.forEach(sf => {
        cli.debug("Exploring " + sf.getBaseName());
        const pkg = sf.getFilePath().substring(prefix.length).split("/").filter(v => { return v !== "" && v !== sf.getBaseName()});

        // Classes
        sf.getClasses().forEach(c => {
            cli.debug("Exploring Class " + c.getName());
            const parsedClass = {
                name: c.getName(),
                methods: [],
                attributes: [],
                package: pkg,
                abstract: c.isAbstract()
            } as ClassNode;

            c.getMethods().forEach(m => {
                let visiblity = undefined as Visiblity;
                const isStatic = m.hasModifier("static");
                if (m.hasModifier("private")) visiblity = "private";
                if (m.hasModifier("public")) visiblity = "public";
                if (m.hasModifier("protected")) visiblity = "protected";

                let parameters: MethodParameter[] = [];
                m.getParameters().forEach(par => {
                    parameters.push({
                        name: par.getName(),
                        type: par.getTypeNode()?.getText()
                    });
                });

                parsedClass.methods.push({
                    name: m.getName(),
                    visiblity,
                    static: isStatic,
                    parameters,
                    returnType: m.getReturnTypeNode()?.getText()
                });
            });

            c.getProperties().forEach(p => {
                let visiblity = undefined as Visiblity;
                const isStatic = p.hasModifier("static");
                if (p.hasModifier("private")) visiblity = "private";
                if (p.hasModifier("public")) visiblity = "public";
                if (p.hasModifier("protected")) visiblity = "protected";

                parsedClass.attributes.push({
                    name: p.getName(),
                    visiblity,
                    static: isStatic,
                    type: p.getTypeNode()?.getText()
                });
            });

            classes.push(parsedClass);
        });

        // Interfaces
        sf.getInterfaces().forEach(c => {
            cli.debug("Exploring Interface " + c.getName());
            const parsedClass = {
                name: c.getName(),
                methods: [],
                attributes: [],
                package: pkg,
                specialType: "interface",
                abstract: false
            } as ClassNode;

            c.getMethods().forEach(m => {
                let parameters: MethodParameter[] = [];
                m.getParameters().forEach(par => {
                    parameters.push({
                        name: par.getName(),
                        type: par.getTypeNode()?.getText(),
                        parsedTypes: unpackType(par.getTypeNode())
                    });
                });

                parsedClass.methods.push({
                    name: m.getName(),
                    visiblity: undefined,
                    static: false,
                    parameters,
                    returnType: m.getReturnTypeNode()?.getText(),
                    parsedReturnTypes: unpackType(m.getReturnTypeNode())
                });
            });

            c.getProperties().forEach(p => {
                let visiblity = undefined as Visiblity;
                const isStatic = p.hasModifier("static");
                if (p.hasModifier("private")) visiblity = "private";
                if (p.hasModifier("public")) visiblity = "public";
                if (p.hasModifier("protected")) visiblity = "protected";

                parsedClass.attributes.push({
                    name: p.getName(),
                    visiblity,
                    static: isStatic,
                    type: p.getTypeNode()?.getText(),
                    parsedTypes: unpackType(p.getTypeNode())
                });
            });

            classes.push(parsedClass);
        });

        // Enums
        sf.getEnums().forEach(e => {
            cli.debug("Exploring Enum " + e.getName());

            const parsedClass = {
                name: e.getName(),
                methods: [],
                attributes: [],
                package: pkg,
                specialType: "enum",
                abstract: false
            } as ClassNode;

            e.getMembers().forEach(m => {
                parsedClass.attributes.push({
                    name: m.getText(),
                    visiblity: undefined,
                    static: false
                })
            });

            classes.push(parsedClass);
        });

    });

    // Build associations
    const validClassNames = classes.map(c => c.name);
    validClassNames.forEach(c => associations[c] = new Set());

    classes.forEach(c => {
        c.attributes.forEach(a => {
            a.parsedTypes?.forEach(type => {
                if (type !== c.name && validClassNames.includes(type)) {
                    associations[c.name].add(type);
                }
            });
        });

        c.methods.forEach(m => {
            m.parsedReturnTypes?.forEach(type => {
                if (type !== c.name && validClassNames.includes(type)) {
                    associations[c.name].add(type);
                }
            });

            m.parameters.forEach(p => {
                p.parsedTypes?.forEach(type => {
                    if (type !== c.name && validClassNames.includes(type)) {
                        associations[c.name].add(type);
                    }
                })
            })
        });
    });

    return {classes, associations};
}

/**
 * Unpacking generics, union types, intersection types & arrays for association building.
 */
function unpackType(type?: TypeNode): Set<string> {
    if (!type) {
        return new Set();
    }

    let returnedTypes = new Set([type.getText()]);

    if (type.isKind(SyntaxKind.TypeReference)) {
        returnedTypes.add(type.getTypeName().getText());
        for (const subType of type.getTypeArguments()) {
            unpackType(subType).forEach(v => returnedTypes.add(v));
        }
    }

    if (type.isKind(SyntaxKind.UnionType) || type.isKind(SyntaxKind.IntersectionType)) {
        for (const subType of type.getTypeNodes()) {
            unpackType(subType).forEach(v => returnedTypes.add(v));
        }
    }

    if (type.isKind(SyntaxKind.ArrayType)) {
        unpackType(type.getElementTypeNode()).forEach(v => returnedTypes.add(v));
    }

    return returnedTypes;
}