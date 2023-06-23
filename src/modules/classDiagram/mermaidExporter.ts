import { ClassNode } from "./diagramTypes";

export class MermaidExporter {

    private classes: ClassNode[] = [];
    private mermaidString = "";

    addClass(node: ClassNode) {
        this.classes.push(node);
    }

    buildToString() {
        this.mermaidString = "classDiagram\n";

        this.classes.forEach(c => {
            this.appendLine(`class ${c.name} {`);
            
            c.attributes.forEach(a => {
                let attr = "";
                switch (a.visiblity) {
                    case "public":
                        attr += "+";
                        break;
                    case "protected":
                        attr += "#";
                        break;
                    case "private":
                        attr += "-";
                        break;
                }
                attr += a.name;
                if (a.static) attr += "$";

                this.appendLine(attr, 2)
            });

            c.methods.forEach(m => {
                let method = "";
                switch (m.visiblity) {
                    case "public":
                        method += "+";
                        break;
                    case "protected":
                        method += "#";
                        break;
                    case "private":
                        method += "-";
                        break;
                }
                method += m.name + "()";
                if (m.static) method += "$";
                this.appendLine(method, 2);
            });

            this.appendLine("}");
        });

        return this.mermaidString;
    }

    private appendLine(line: string, indentation: number = 1) {
        this.mermaidString += " ".repeat(indentation*4) + line + "\n";
    }

}