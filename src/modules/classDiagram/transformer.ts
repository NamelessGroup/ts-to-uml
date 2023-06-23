import { Project } from "ts-morph";
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
                        type: par.getTypeNode()?.getText()
                    });
                });

                parsedClass.methods.push({
                    name: m.getName(),
                    visiblity: undefined,
                    static: false,
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
            if (a.type && a.type !== c.name && validClassNames.includes(a.type)) {
                associations[c.name].add(a.type);
            }
        });

        c.methods.forEach(m => {
            if (m.returnType && m.returnType !== c.name && validClassNames.includes(m.returnType)) {
                associations[c.name].add(m.returnType);
            }

            m.parameters.forEach(p => {
                if (p.type && p.type !== c.name && validClassNames.includes(p.type)) {
                    associations[c.name].add(p.type);
                }
            })
        });
    });

    return {classes, associations};
}