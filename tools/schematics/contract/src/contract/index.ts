import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  template,
  apply,
  url,
  move,
  mergeWith,
  chain
} from '@angular-devkit/schematics';
import { Schema, ABIDefinition, ABIArg } from './schema';
import { strings } from '@angular-devkit/core';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';

const solc = require('solc');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function contract(options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!options.sol) {
      throw new SchematicsException(
        'Please link to a solidity file or directory with solidity files'
      );
    }
    if (!options.dist) {
      throw new SchematicsException(
        'Please add a dist directory for the output'
      );
    }

    // If folder
    if (!options.sol.endsWith('.sol')) {
      const input: any = {};
      const dir = tree.getDir(options.sol);
      dir.subfiles
        .filter(name => {
          return name.endsWith('.sol') && dir.file(name)!.content !== null;
        })
        .forEach(name => {
          input[name] = dir.file(name)!.content!.toString('utf-8');
        });
      const rules = getAbifromSol(input).map(source =>
        createContract(source[1], source[0])
      );
      return chain(rules)(tree, _context);
    } else {
      // If file
      if (!options.name) {
        throw new SchematicsException('Please give a name to your contract');
      }
      const sol = tree.read(options.sol);
      if (sol === null) {
        throw new SchematicsException(`File ${options.sol} not found`);
      }
      const rule = createContract(
        getAbifromSol(sol.toString('utf-8'))[0][1],
        options.name
      );
      return rule(tree, _context);
    }

    function createContract(jsonInterface: any, name: string) {
      const abi: ABIDefinition[] = JSON.parse(jsonInterface);
      const interfaces = createAllInterface(options.name, abi);
      const sends: string[] = [], calls: string[] = [], events: string[] = [];
      abi.forEach(def => {
        if (def.type === 'function' && def.constant) {
          calls.push(callMethod(def));
        } else if (def.type === 'function' && !def.constant) {
          sends.push(sendMethod(def));
        } else if (def.type === 'event') {
          events.push(eventMethod(def));
        }
      });
      const dec = {
        calls: calls.join('\n  '),
        sends: sends.join('\n  '),
        events: events.join('\n  '),
      }

      const templateSource = apply(url('./files'), [
        template({
          name,
          dec,
          jsonInterface,
          interfaces,
          ...strings
        }),
        move(`./${options.dist}/${dasherize(name)}`)
      ]);
      return mergeWith(templateSource);
    }
  };
}

/** Return a ABI from a solidity code or object of solidity code */
function getAbifromSol(input: string | Object): [string, string][] {
  const sources = typeof input === 'object' ? { sources: input } : input;
  const contracts = solc.compile(sources, 1).contracts;
  return Object.keys(contracts)
    .filter(name => contracts[name].assembly !== null) // Remove solidity interfaces
    .map((name: string) =>{
      return [name.split(':').pop(), contracts[name].interface] as [string, string];
    });
}

/** Create a send method line */
function sendMethod(def: ABIDefinition): string {
  const { inputs, name } = def;
  if (empty(inputs)) {
    return `${name}: (${getInputs(inputs)}) => PromiEvent;`;
  } else {
    return `${name}: () => PromiEvent;`;
  }
}

/** Create a call method line */
function callMethod(def: ABIDefinition): string {
  const { outputs, inputs, name } = def;
  if (empty(outputs) && empty(inputs)) {
    return `${name}: () => void;`;
  }
  if (empty(inputs) && outputs) {
    return `${name}: () => Observable<${getOutput(outputs)}>;`;
  } else if (empty(outputs) && inputs) {
    return `${name}: (${getInputs(inputs)}) => void;`;
  } else if (inputs && outputs) {
    return `${name}: (${getInputs(inputs)}) => Observable<${getOutput(
      outputs
    )}>;`;
  } else {
    return '';
  }
}

/** Create an event method line */
function eventMethod(def: ABIDefinition): string {
  const { outputs, name } = def;
  if (empty(outputs)) {
    return `${name}: () => Observable<void>`;
  } else {
    return `${name}: () => Observable<${getOutput(outputs)}>;`;
  }
}

/** Check if an input/output is undefined or empty */
function empty(data: any[] | undefined): boolean {
  return !data || data.length === 0;
}

/** Get the outputs as a string of types separated by comas */
function getOutput(output: ABIArg[]): string {
  return output.map(out => getType(out)).join(', ');
}

/** Get the inputs as a string of (name: type) separated by comas */
function getInputs(args: ABIArg[]): string {
  return args
    .map(arg => [arg.name, getType(arg)])
    .map(arg => arg.join(': '))
    .join(', ');
}

/** Transform solidity types into javascript one */
function getType(arg: ABIArg) {
  const { type, name } = arg;
  if (type === 'bool') {
    return 'boolean';
  }
  if (type.includes('int')) {
    return 'number';
  }
  if (type.includes('byte') || type === 'address') {
    return 'string';
  }
  if (type === 'tuple') {
    return classify(name);
  }
  if (type === 'tuple[]') {
    return `${classify(name)}[]`;
  }
  return type;
}

/** Create interfaces based on Structs */
function createAllInterface(name: string, abi: ABIDefinition[]): string {
  const interfaces: ABIArg[][][] = [];
  abi.forEach(def => {
    const { inputs = [], outputs = [] } = def;
    const data = [...inputs, ...outputs];
    if (empty(data)) {
      return;
    }
    const structs = data.filter(input => input.type.includes('tuple'));
    if (empty(structs)) {
      return;
    }
    const components = structs.map(struct => struct.components);
    if (empty(components)) {
      return;
    }
    interfaces.push(removeDuplicate(components));
  });

  return removeDuplicate(interfaces)
    .map(components => {
      return components.map(args => createOneInterface(args as ABIArg[]));
    })
    .map(args => `export interface ${classify(name)} {\n  ${args}\n}`)
    .join('\n\n');
}

/** Create the args of one interface */
function createOneInterface(component: ABIArg[]): string {
  return component.map(arg => `${arg.name}: ${getType(arg)};`).join('\n  ');
}

/** Remove duplicate object of an array of object */
function removeDuplicate<T>(arr: Array<T>): T[] {
  return arr
    .map<string>(el => JSON.stringify(el))
    .filter((el, i, a) => i === a.indexOf(el))
    .map<T>(el => JSON.parse(el));
}
