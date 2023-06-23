import { Command, OptionValues } from 'commander';
import pkg from '../../../package.json';
import buildCLI, { AbstractCLI, EmptyCLI } from './CLIFactory';
import { GanttDiagramExecutioner, ClassDiagramExecutioner } from './CLIExecutor';

class CLI extends AbstractCLI {

    constructor() {
        super(new EmptyCLI())
    }

    public async main() {
        const commander = new Command()
    
        commander
            .version(pkg.version)
            .description('A tool for generating diagrams from your codebase')
            .option('-q --quiet', 'Quiet mode', false)
            .option('-d --debug', 'Debug mode', false)
            .option('--no-emoji', 'Emoji mode')
    
    
        commander
            .command('class')
            .description('Generate a class diagram from typescript files')
            .option('-i --input <path>', 'Input files', './**/*.ts')
            .option('-o --output <path>', 'Output files')
            .action((options) => {
                new ClassDiagramExecutioner().execute(options)
            })
            /*.option('-C --class-only', 'Only include classes', false)
            .option('-I --interface-only', 'Only include interfaces', false)
            // should come with a tag to give something a desired cardinality e.g. // uml-cardinality-1-* or // uml-cardinality-10-20
            .option('-c --cardinality', 'Include cardinalities', true)*/
    
        commander
            .command('gantt')
            .description('Generate a gantt diagram from your local git history')
            .option('-o --output <path>', 'Output files')
            .action((options) => {
                new GanttDiagramExecutioner().execute(options)
            })
    
        commander.hook('preAction', (command) => {
            const options = command.opts()
            this.baseCLI = buildCLI(options.quiet, options.debug, options.emoji) 
        })
        
        await commander.parseAsync(process.argv)
    }

}

let cli = new CLI()

export default cli;