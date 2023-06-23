import cli from './modules/cli/cli';
import {transformGitCommitHistory} from "./modules/gantt/commitparser";

const test = "1687515266\n" +
    "src/index.ts\n" +
    "src/modules/classDiagram/diagramTypes.ts\n" +
    "src/modules/classDiagram/mermaidExporter.ts\n" +
    "src/modules/classDiagram/transformer.ts\n" +
    "src/modules/cli/cli.ts\n" +
    "src/modules/gantt/.gitkeep\n" +
    "\n" +
    "1686919111\n" +
    "package-lock.json\n" +
    "package.json\n" +
    "src/diagramTypes.ts\n" +
    "\n" +
    "C:\\Workspace\\Webstorm\\uml-tools>git log --pretty=format:\"%at\" --name-only --no-merges\n" +
    "1687515266\n" +
    "src/index.ts\n" +
    "src/modules/classDiagram/diagramTypes.ts\n" +
    "src/modules/classDiagram/mermaidExporter.ts\n" +
    "src/modules/classDiagram/transformer.ts\n" +
    "src/modules/cli/cli.ts\n" +
    "src/modules/gantt/.gitkeep\n" +
    "\n" +
    "1686919111\n" +
    "package-lock.json\n" +
    "package.json\n" +
    "src/diagramTypes.ts\n" +
    "src/mermaidExporter.ts\n" +
    "src/transformer.ts\n" +
    "\n" +
    "1686918963\n" +
    "src/cli.ts\n" +
    "\n" +
    "1686918513\n" +
    "package-lock.json\n" +
    "package.json\n" +
    "tsconfig.json\n" +
    "\n" +
    "1686918072\n" +
    "src/cli.ts\n" +
    "\n" +
    "1686916842\n" +
    "src/cli.ts\n" +
    "src/index.ts\n" +
    "\n" +
    "1686915908\n" +
    "package-lock.json\n" +
    "package.json\n" +
    "src/index.ts\n" +
    "\n" +
    "1686915184\n" +
    ".gitignore\n" +
    "LICENSE\n" +
    "README.md\n"

transformGitCommitHistory(test)
void cli();