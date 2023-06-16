import { Command } from 'commander';
import pkg from '../package.json';
import chalk from 'chalk'


async function cli() {
  const commander = new Command();
  commander
    .version(pkg.version)
    .option('-i --input', 'Input files', '/')
    .option('-o --output', 'Output files')
    .parse(process.argv);
 
  const options = commander.opts();

  if (!options.output) {
    error('Please provide output directory')
    process.exit(1)
  }
}

function log(message: string) {
  console.log(chalk.blue(message))
}

function error(message: string) {
  console.log(chalk.red(message))
}

function success(message: string) {
  console.log(chalk.green(message))
}

function warn(message: string) {
  console.log(chalk.yellow(message))
}

export default cli;
export { log, error, success, warn };