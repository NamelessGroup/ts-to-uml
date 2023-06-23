import cli from './modules/cli/cli';
import {transformGitCommitHistory} from "./modules/gantt/commitparser";
import {parseGanttDatesToMermaid} from "./modules/gantt/ganttparser";


void cli();