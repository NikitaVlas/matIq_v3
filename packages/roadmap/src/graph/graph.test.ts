import { describe, expect, it } from "vitest";
import {
  assertAcyclic,
  collectPredecessors,
  CycleError,
  type Edge,
  findCycle,
  topologicalSort,
  UnknownNodeError,
} from "./graph.ts";

const e = (from: string, to: string): Edge<string> => ({ from, to });

/** Every edge's `from` appears before its `to`, and each node exactly once. */
function expectValidOrder(order: string[], nodes: string[], edges: Edge<string>[]) {
  expect([...order].sort()).toEqual([...new Set(nodes)].sort());
  const position = new Map(order.map((node, index) => [node, index]));
  for (const { from, to } of edges) {
    expect(position.get(from)!, `${from} before ${to}`).toBeLessThan(position.get(to)!);
  }
}

/** A returned cycle must be closed and made of real edges. */
function expectRealCycle(cycle: string[] | null, edges: Edge<string>[]) {
  expect(cycle).not.toBeNull();
  const path = cycle!;
  expect(path.length).toBeGreaterThanOrEqual(2);
  expect(path[0]).toBe(path[path.length - 1]);
  for (let i = 0; i < path.length - 1; i++) {
    expect(edges).toContainEqual(e(path[i]!, path[i + 1]!));
  }
}

describe("findCycle", () => {
  it("returns null for an empty graph", () => {
    expect(findCycle([], [])).toBeNull();
  });

  it("returns null for a DAG with shared descendants (diamond)", () => {
    const edges = [e("a", "b"), e("a", "c"), e("b", "d"), e("c", "d")];
    expect(findCycle(["a", "b", "c", "d"], edges)).toBeNull();
  });

  it("detects a self loop", () => {
    expect(findCycle(["a"], [e("a", "a")])).toEqual(["a", "a"]);
  });

  it("detects a three-node cycle as a closed path of real edges", () => {
    const edges = [e("a", "b"), e("b", "c"), e("c", "a")];
    expectRealCycle(findCycle(["a", "b", "c"], edges), edges);
  });

  it("finds a cycle in a later, disconnected component", () => {
    const edges = [e("a", "b"), e("x", "y"), e("y", "x")];
    const cycle = findCycle(["a", "b", "x", "y"], edges);
    expectRealCycle(cycle, edges);
    expect(cycle).not.toContain("a");
  });

  it("reports only the cycle, not the path leading into it", () => {
    const edges = [e("start", "a"), e("a", "b"), e("b", "a")];
    const cycle = findCycle(["start", "a", "b"], edges);
    expectRealCycle(cycle, edges);
    expect(cycle).not.toContain("start");
  });

  it("handles very deep chains without stack overflow", () => {
    const nodes = Array.from({ length: 20_000 }, (_, i) => `n${i}`);
    const edges = nodes.slice(1).map((node, i) => e(nodes[i]!, node));
    expect(findCycle(nodes, edges)).toBeNull();
  });

  it("throws on edges to unknown nodes", () => {
    expect(() => findCycle(["a"], [e("a", "ghost")])).toThrow(UnknownNodeError);
  });
});

describe("assertAcyclic", () => {
  it("passes for a DAG", () => {
    expect(() => assertAcyclic(["a", "b"], [e("a", "b")])).not.toThrow();
  });

  it("throws CycleError carrying the cycle", () => {
    const edges = [e("a", "b"), e("b", "a")];
    try {
      assertAcyclic(["a", "b"], edges);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(CycleError);
      expectRealCycle([...(error as CycleError<string>).cycle], edges);
    }
  });
});

describe("topologicalSort", () => {
  it("returns an empty list for an empty graph", () => {
    expect(topologicalSort([], [])).toEqual([]);
  });

  it("keeps input order when there are no edges and no priority", () => {
    expect(topologicalSort(["c", "a", "b"], [])).toEqual(["c", "a", "b"]);
  });

  it("respects every edge", () => {
    const nodes = ["d", "c", "b", "a", "e"];
    const edges = [e("a", "b"), e("a", "c"), e("b", "d"), e("c", "d"), e("d", "e")];
    expectValidOrder(topologicalSort(nodes, edges), nodes, edges);
  });

  it("puts preferred nodes first when dependencies allow", () => {
    const score: Record<string, number> = { a: 1, b: 5, c: 3 };
    const order = topologicalSort(["a", "b", "c"], [], {
      compare: (x, y) => score[y]! - score[x]!,
    });
    expect(order).toEqual(["b", "c", "a"]);
  });

  it("never lets priority break a dependency", () => {
    // "top" has the highest score but needs "low" first.
    const score: Record<string, number> = { low: 0, mid: 5, top: 10 };
    const edges = [e("low", "top")];
    const order = topologicalSort(["low", "mid", "top"], edges, {
      compare: (x, y) => score[y]! - score[x]!,
    });
    expect(order).toEqual(["mid", "low", "top"]);
  });

  it("breaks priority ties by input order", () => {
    const order = topologicalSort(["x", "y", "z"], [], { compare: () => 0 });
    expect(order).toEqual(["x", "y", "z"]);
  });

  it("is deterministic across runs", () => {
    const nodes = ["a", "b", "c", "d", "e", "f"];
    const edges = [e("a", "d"), e("b", "d"), e("c", "e"), e("d", "f"), e("e", "f")];
    const first = topologicalSort(nodes, edges);
    for (let i = 0; i < 10; i++) expect(topologicalSort(nodes, edges)).toEqual(first);
  });

  it("tolerates duplicate nodes and duplicate edges", () => {
    const edges = [e("a", "b"), e("a", "b")];
    expect(topologicalSort(["a", "b", "a"], edges)).toEqual(["a", "b"]);
  });

  it("throws CycleError with only the cyclic nodes", () => {
    const edges = [e("root", "a"), e("a", "b"), e("b", "a"), e("b", "leaf")];
    try {
      topologicalSort(["root", "a", "b", "leaf"], edges);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(CycleError);
      const cycle = [...(error as CycleError<string>).cycle];
      expectRealCycle(cycle, edges);
      expect(cycle).not.toContain("root");
      expect(cycle).not.toContain("leaf");
    }
  });

  it("throws on edges to unknown nodes", () => {
    expect(() => topologicalSort(["a"], [e("ghost", "a")])).toThrow(UnknownNodeError);
  });

  it("orders a realistic BJJ prerequisite chain", () => {
    // requires → technique
    const edges = [
      e("shrimp", "elbow-knee-escape"),
      e("bridge", "upa-escape"),
      e("closed-guard-posture", "scissor-sweep"),
      e("closed-guard-posture", "armbar-from-guard"),
      e("armbar-from-guard", "triangle-from-guard"),
    ];
    const nodes = [
      "triangle-from-guard",
      "scissor-sweep",
      "armbar-from-guard",
      "upa-escape",
      "elbow-knee-escape",
      "closed-guard-posture",
      "bridge",
      "shrimp",
    ];
    expectValidOrder(topologicalSort(nodes, edges), nodes, edges);
  });
});

describe("collectPredecessors", () => {
  it("returns nothing for a node without prerequisites", () => {
    expect(collectPredecessors(["a"], [e("a", "b")])).toEqual([]);
  });

  it("collects transitive prerequisites breadth-first", () => {
    const edges = [e("c", "b"), e("b", "a"), e("d", "a")];
    expect(collectPredecessors(["a"], edges)).toEqual(["b", "d", "c"]);
  });

  it("returns each node once in a diamond", () => {
    const edges = [e("root", "x"), e("root", "y"), e("x", "t"), e("y", "t")];
    expect(collectPredecessors(["t"], edges)).toEqual(["x", "y", "root"]);
  });

  it("includes a target that another target depends on", () => {
    expect(collectPredecessors(["a", "b"], [e("a", "b")])).toEqual(["a"]);
  });

  it("terminates on cyclic input", () => {
    const result = collectPredecessors(["a"], [e("a", "b"), e("b", "a")]);
    expect(result.sort()).toEqual(["a", "b"]);
  });
});
