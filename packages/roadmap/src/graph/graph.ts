/**
 * Generic directed-graph helpers for prerequisite and "learn before" relations.
 *
 * Convention: an edge `{ from, to }` means "`from` must come before `to`".
 * - technique prerequisites: `{ from: requiredTechnique, to: technique }`
 * - category links (learn_before): `{ from: fromCategory, to: toCategory }`
 *
 * All functions are pure and deterministic: same input → same output.
 */

export interface Edge<T> {
  from: T;
  to: T;
}

export class CycleError<T> extends Error {
  /** Closed path, first node repeated at the end: [a, b, c, a]. */
  readonly cycle: readonly T[];

  constructor(cycle: readonly T[]) {
    super(`Graph contains a cycle: ${cycle.map(String).join(" -> ")}`);
    this.name = "CycleError";
    this.cycle = cycle;
  }
}

export class UnknownNodeError<T> extends Error {
  readonly node: T;

  constructor(node: T) {
    super(`Edge references unknown node: ${String(node)}`);
    this.name = "UnknownNodeError";
    this.node = node;
  }
}

interface Adjacency<T> {
  /** Unique nodes in first-seen input order. */
  nodes: T[];
  /** Outgoing neighbours per node, in edge input order. */
  out: Map<T, T[]>;
}

function buildAdjacency<T>(nodes: Iterable<T>, edges: Iterable<Edge<T>>): Adjacency<T> {
  const out = new Map<T, T[]>();
  for (const node of nodes) {
    if (!out.has(node)) out.set(node, []);
  }
  for (const { from, to } of edges) {
    const targets = out.get(from);
    if (!targets) throw new UnknownNodeError(from);
    if (!out.has(to)) throw new UnknownNodeError(to);
    targets.push(to);
  }
  return { nodes: [...out.keys()], out };
}

/**
 * Returns one cycle as a closed path ([a, b, a]) or `null` if the graph is acyclic.
 * Iterative DFS, so deep graphs do not overflow the stack.
 */
export function findCycle<T>(nodes: Iterable<T>, edges: Iterable<Edge<T>>): T[] | null {
  const { nodes: allNodes, out } = buildAdjacency(nodes, edges);

  const VISITING = 1;
  const DONE = 2;
  const state = new Map<T, number>();

  for (const start of allNodes) {
    if (state.has(start)) continue;

    // Stack of [node, index of next neighbour to visit]; doubles as the current path.
    const stack: [T, number][] = [[start, 0]];
    state.set(start, VISITING);

    while (stack.length > 0) {
      const frame = stack[stack.length - 1]!;
      const [node, nextIndex] = frame;
      const neighbours = out.get(node)!;

      if (nextIndex >= neighbours.length) {
        state.set(node, DONE);
        stack.pop();
        continue;
      }

      frame[1] = nextIndex + 1;
      const next = neighbours[nextIndex]!;
      const nextState = state.get(next);

      if (nextState === VISITING) {
        const pathStart = stack.findIndex(([n]) => n === next);
        return [...stack.slice(pathStart).map(([n]) => n), next];
      }
      if (nextState === undefined) {
        state.set(next, VISITING);
        stack.push([next, 0]);
      }
    }
  }

  return null;
}

/** Throws `CycleError` if the graph has a cycle. */
export function assertAcyclic<T>(nodes: Iterable<T>, edges: Iterable<Edge<T>>): void {
  const cycle = findCycle(nodes, edges);
  if (cycle) throw new CycleError(cycle);
}

export interface TopologicalSortOptions<T> {
  /**
   * Priority among nodes whose predecessors are all placed:
   * negative → `a` first. Ties keep input order. Default: input order.
   */
  compare?: (a: T, b: T) => number;
}

/**
 * Orders nodes so every edge's `from` comes before its `to` (Kahn's algorithm).
 * Among available nodes the one preferred by `compare` is taken first,
 * so high-scoring items surface as early as their dependencies allow.
 * Throws `CycleError` if no order exists.
 */
export function topologicalSort<T>(
  nodes: Iterable<T>,
  edges: Iterable<Edge<T>>,
  options: TopologicalSortOptions<T> = {},
): T[] {
  const { nodes: allNodes, out } = buildAdjacency(nodes, edges);
  const inputIndex = new Map(allNodes.map((node, index) => [node, index]));
  const compare = options.compare ?? (() => 0);
  const prefer = (a: T, b: T) => compare(a, b) || inputIndex.get(a)! - inputIndex.get(b)!;

  const inDegree = new Map<T, number>(allNodes.map((node) => [node, 0]));
  for (const targets of out.values()) {
    for (const to of targets) inDegree.set(to, inDegree.get(to)! + 1);
  }

  const ready = allNodes.filter((node) => inDegree.get(node) === 0);
  const result: T[] = [];

  // Graphs here are small (hundreds of nodes), so a linear scan beats a heap in clarity.
  while (ready.length > 0) {
    let best = 0;
    for (let i = 1; i < ready.length; i++) {
      if (prefer(ready[i]!, ready[best]!) < 0) best = i;
    }
    const [node] = ready.splice(best, 1) as [T];
    result.push(node);

    for (const to of out.get(node)!) {
      const remaining = inDegree.get(to)! - 1;
      inDegree.set(to, remaining);
      if (remaining === 0) ready.push(to);
    }
  }

  if (result.length < allNodes.length) {
    const placed = new Set(result);
    const rest = allNodes.filter((node) => !placed.has(node));
    const restSet = new Set(rest);
    const restEdges = [...out].flatMap(([from, targets]) =>
      restSet.has(from) ? targets.filter((to) => restSet.has(to)).map((to) => ({ from, to })) : [],
    );
    throw new CycleError(findCycle(rest, restEdges) ?? rest);
  }

  return result;
}

/**
 * All nodes that must come before any of `targets`, transitively, in breadth-first order.
 * A target appears in the result only if another target depends on it.
 * Used to pull in unknown prerequisites of selected techniques.
 */
export function collectPredecessors<T>(targets: Iterable<T>, edges: Iterable<Edge<T>>): T[] {
  const incoming = new Map<T, T[]>();
  for (const { from, to } of edges) {
    const sources = incoming.get(to);
    if (sources) sources.push(from);
    else incoming.set(to, [from]);
  }

  const queue = [...targets];
  const seen = new Set<T>();
  const result: T[] = [];

  for (let i = 0; i < queue.length; i++) {
    for (const from of incoming.get(queue[i]!) ?? []) {
      if (seen.has(from)) continue;
      seen.add(from);
      queue.push(from);
      result.push(from);
    }
  }

  return result;
}
