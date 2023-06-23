import { OptionValues } from "commander";
import cli from "./cli";

abstract class Executioner {

    public abstract checkOptions(options: OptionValues): boolean

    public execute(options: OptionValues): void {
        try {
            if (!this.checkOptions(options)) {
                cli.error('The given options are invalid', true)
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
    }

    protected abstract getMermaidCode(options: OptionValues): string
}

class ClassDiagramExecutioner extends Executioner {
    
    public checkOptions(options: OptionValues): boolean {
        return false;
    }
    
    protected getMermaidCode(options: OptionValues): string {
        cli.error('Not implemented yet', true)
        return ''
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