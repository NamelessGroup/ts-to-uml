import { Command } from 'commander';
import pkg from '../../../package.json';
import buildCLI, { CLI, EmptyCLI } from './CLIFactory';

let cli: CLI = new EmptyCLI()

async function main() {
    const commander = new Command()
    commander
        .version(pkg.version)
        .option('-o --output <path>', 'Output files')
        .option('-q --quiet', 'Quiet mode', false)
        .option('-d --debug', 'Debug mode', false)
        .option('--no-emoji', 'Emoji mode', false)

    commander
        .command('class')
        .description('Generate a class diagram from typescript files')
        .option('-i --input <path>', 'Input files', './**/*.ts')
        /*.option('-C --class-only', 'Only include classes', false)
        .option('-I --interface-only', 'Only include interfaces', false)
        // should come with a tag to give something a desired cardinality e.g. // uml-cardinality-1-* or // uml-cardinality-10-20
        .option('-c --cardinality', 'Include cardinalities', true)*/

    commander
        .command('gantt')
        .description('Generate a gantt diagram from your local git history')

    commander.parse(process.argv);

    const options = commander.opts();
    console.log(options)

    cli = buildCLI(options.quiet, options.debug, options.emoji)

    cli.log('Hello world')
    cli.debug('Debug message')
    cli.warn('Warning message')
    cli.error('Error message', false)
    cli.success('Success message')

    /*if (!options.output) {
        process.exit(1)
    }*/
}



export default cli;
export { main };