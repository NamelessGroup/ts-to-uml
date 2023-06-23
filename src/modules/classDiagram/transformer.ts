import { Project, ts } from "ts-morph";
import { ClassNode, Visiblity } from "./diagramTypes";
import { MermaidExporter } from "./mermaidExporter";

interface TransformerOptions {
    inputGlob: string;
    outputFile: string;
}

export function transformCode(options: TransformerOptions) {

    const mmd = new MermaidExporter();

    const project = new Project({});
    project.addSourceFilesAtPaths(options.inputGlob);

    const allFiles = project.getSourceFiles();
    allFiles.forEach(sf => {

        // Classes
        sf.getClasses().forEach(c => {
            const parsedClass = {
                name: c.getName(),
                methods: [],
                attributes: []
            } as ClassNode;

            c.getMethods().forEach(m => {
                let visiblity = undefined as Visiblity;
                const isStatic = m.hasModifier("static");
                if (m.hasModifier("private")) visiblity = "private";
                if (m.hasModifier("public")) visiblity = "public";
                if (m.hasModifier("protected")) visiblity = "protected";

                parsedClass.methods.push({
                    name: m.getName(),
                    visiblity,
                    static: isStatic
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
                    static: isStatic
                });
            });

            mmd.addClass(parsedClass);
        });

    });

    return mmd;
}