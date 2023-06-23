import { OptionValues } from "commander";
import cli from "./cli";
import { transformCode } from "../classDiagram/transformer";
import { buildClassDiagram } from "../classDiagram/mermaidExporter";

abstract class Executioner {

    public abstract checkOptions(options: OptionValues): boolean

    public execute(options: OptionValues): void {
        try {
            if (!this.checkOptions(options)) {
                cli.error('The given options are invalid!', true)
            }
        } catch (e) {
            cli.error('There was an error checking the options.', false)
            cli.error((e as Error).message, true)
        }
        let mermaidCode: string = ''
        try {
            mermaidCode = this.getMermaidCode(options)
        } catch (e) {
            cli.error('There was an error generating the mermaid code.', false)
            cli.error((e as Error).message, true)
        }
        cli.warn('Saving to file not implemented yet')
        cli.debug(mermaidCode);
    }

    protected abstract getMermaidCode(options: OptionValues): string
}

class ClassDiagramExecutioner extends Executioner {
    
    public checkOptions(options: OptionValues): boolean {
        if (options.input === undefined) return false;
        return true;
    }
    
    protected getMermaidCode(options: OptionValues): string {
        const transformerOptions = {
            inputGlob: options.input
        };

        const transformedCode = transformCode(transformerOptions);
        const mermaid = buildClassDiagram(transformedCode);
        return mermaid
    }
}

class GanttDiagramExecutioner extends Executioner {

    public checkOptions(options: OptionValues): boolean {
        return true;
    }

    protected getMermaidCode(options: OptionValues): string {
        cli.error('Not implemented yet', true)
        return ''
    }

}

export { ClassDiagramExecutioner, GanttDiagramExecutioner };