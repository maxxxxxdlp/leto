import type { Grammar } from '../grammar/types.js';
import type { IR, RA } from '../utils/types.js';
import { filterArray } from '../utils/types.js';
import type { PureGrammar, PureGrammarLine } from './firstSets.js';
import { lineToString, saturate, toPureGrammar } from './firstSets.js';

/**
 * Compute follow sets for all non-terminals
 */
export const getFollowSets = (
  grammar: Grammar,
  firstSets: IR<ReadonlySet<string>>
): IR<ReadonlySet<string>> =>
  saturate(
    saturateFollowSets.bind(undefined, toPureGrammar(grammar), firstSets),
    Object.fromEntries(Object.keys(grammar).map((key) => [key, new Set()]))
  );

/**
 * An instance of the saturating algorithm for finding follow sets
 */
const saturateFollowSets = (
  grammar: PureGrammar,
  firstSets: IR<ReadonlySet<string>>,
  followSets: IR<ReadonlySet<string>>
): IR<ReadonlySet<string>> =>
  Object.fromEntries(
    Object.keys(followSets).map((key) => {
      const followSet = new Set<string>();

      // Is start non-terminal
      if (Object.keys(grammar)[0] === key) followSet.add('');

      findTerminalEndings(grammar, key).forEach(({ terminalName, ending }) => {
        const rawFirstSet = Array.from(firstSets[lineToString(ending)] ?? []);
        const firstSet = rawFirstSet.filter((part) => part !== '');
        Array.from(
          firstSet.length === 0 || rawFirstSet.includes('')
            ? followSets[terminalName]
            : firstSet,
          (item) => followSet.add(item)
        );
      });

      return [key, followSet];
    })
  );

/**
 * Return all parts of all lines to the right of a given terminal
 */
const findTerminalEndings = (
  grammar: PureGrammar,
  key: string
): RA<{ readonly terminalName: string; readonly ending: PureGrammarLine }> =>
  Object.entries(grammar).flatMap(([terminalName, lines]) =>
    lines.flatMap((line) =>
      findAllIndexesOf(
        line.map(({ name }) => name),
        key
      )
        .map((index) => line.slice(index + 1))
        .map((ending) => ({ terminalName, ending }))
    )
  );

export const findAllIndexesOf = <T>(array: RA<T>, search: T): RA<number> =>
  filterArray(
    array.map((item, index) => (item === search ? index : undefined))
  );

export const exportsForTests = {
  findTerminalEndings,
  saturateFollowSets,
};
