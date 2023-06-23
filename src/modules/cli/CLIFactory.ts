import chalk from 'chalk'

abstract class CLI {

  protected readonly baseCLI: CLI;

  constructor(baseCLI?: CLI) {
    if (baseCLI === undefined) {
        this.baseCLI = this
    } else {
        this.baseCLI = baseCLI
    }
  }

  /**
   * Prints the given message to the console
   * @param message Message to print
   */
  public log(message: string): void {
      this.baseCLI.log(message)
  }

  /**
   * Prints an error to the console
   * @param message Message to print
   * @param terminate Whether to terminate the process after printing the message
   */
  public error(message: string, terminate: boolean): void {
      this.baseCLI.error(message, terminate)

      if (terminate) {
          this.terminate(1)
      }
  }

  /**
   * Prints a success message to the console
   * @param message Message to print
   */
  public success(message: string): void {
      this.baseCLI.success(message)
  }

  /**
   * Prints a warning to the console
   * @param message Message to print
   */
  public warn(message: string): void {
      this.baseCLI.warn(message)
  }

  /**
   * Prints a debug message to the console
   * @param message Message to print
   */
  public debug(message: string): void {
      this.baseCLI.debug(message)
  }

  /**
   * Terminates the process with the given exit code
   */
  protected terminate(exitCode: number): void {
      process.exit(exitCode)
  }
}

class EmptyCLI extends CLI {
    constructor() {
        super()
    }
    
    public log(message: string): void {
        // do nothing
    }
    
    public error(message: string, terminate: boolean): void {
        // do nothing
    }
    
    public success(message: string) {
        // do nothing
    }
    
    public warn(message: string): void {
        // do nothing
    }
    
    public debug(message: string): void {
        // do nothing
    }

}

class PlainCLI extends CLI {
  
    constructor() {
        super()
    }

  public log(message: string): void {
      console.log(chalk.blue(message))
  }

  public error(message: string, terminate: boolean): void {
      console.log(chalk.red(message))

      if (terminate) {
          this.terminate(1)
      }
  }
  
  public success(message: string) {
      console.log(chalk.green(message))
  }

  public warn(message: string): void {
      console.log(chalk.yellow(message))
  }

  public debug(message: string): void {
    // do nothing
  }
}

class DebugCLI extends CLI {

  constructor(baseCLI: CLI) {
      super(baseCLI)
  }

  public debug(message: string): void {
      console.log(chalk.gray(message))
  }
}

class QuietCLI extends CLI {

  constructor(baseCLI: CLI) {
      super(baseCLI)
  }

  public log(message: string): void {
      // do nothing
  }

  public warn(message: string): void {
      // do nothing
  }

  public success(message: string): void {
      // do nothing
  }
}

class EmojiCLI extends CLI {
  
      constructor(baseCLI: CLI) {
          super(baseCLI)
      }
  
      public log(message: string): void {
          this.baseCLI.log('ℹ️ ' + message)
      }
  
      public error(message: string, terminate: boolean): void {
          this.baseCLI.error('❌ ' + message, terminate)
      }
      
      public success(message: string) {
          this.baseCLI.success('✅ ' + message)
      }
  
      public warn(message: string): void {
          this.baseCLI.warn('⚠️ ' + message)
      }
  
      public debug(message: string): void {
          this.baseCLI.debug('🐛 ' + message)
      }
}

function buildCLI(quiet: boolean = false, debug: boolean = false, emoji: boolean = true): CLI {
    console.log(quiet, debug, emoji)
    let cli = new PlainCLI()

    if (quiet) {
        cli = new QuietCLI(cli)
    }
    
    if (debug) {
        cli = new DebugCLI(cli)
    }
    
    if (emoji) {
        cli = new EmojiCLI(cli)
    }
    
    return cli
}

export { CLI, EmptyCLI }
export default buildCLI