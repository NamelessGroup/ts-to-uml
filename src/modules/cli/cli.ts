import { Command } from 'commander';
import pkg from '../../../package.json';
import chalk from 'chalk'

let isQuiet = false;

async function cli() {
  const commander = new Command();
  commander
    .version(pkg.version)
    .option('-i --input <path>', 'Input files', './**/*.ts')
    .option('-o --output <path>', 'Output files')
    .option('-q --quiet', 'Quiet mode')
    /*.option('-C --class-only', 'Only include classes', false)
    .option('-I --interface-only', 'Only include interfaces', false)
    // should come with a tag to give something a desired cardinality e.g. // uml-cardinality-1-* or // uml-cardinality-10-20
    .option('-c --cardinality', 'Include cardinalities', true)*/
    .parse(process.argv);
 
  const options = commander.opts();

  if (!options.output) {
    error('Please provide output file')
    process.exit(1)
  }

  isQuiet = options.quiet;
}

function log(message: string) {
  if (!isQuiet) {
    console.log(chalk.blue(message))
  }
}

function error(message: string) {
  console.log(chalk.red(message))
}

function success(message: string) {
  console.log(chalk.green(message))
}

function warn(message: string) {
  if (!isQuiet) {
    console.log(chalk.yellow(message))
  }
}

export default cli;
export { log, error, success, warn };