const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const USER_ID            = 'suyashjha_23112004';   
const EMAIL_ID           = 'sj2808@srmist.edu.in';     
const COLLEGE_ROLL_NUMBER = 'RA2311003010923';         

const VALID_EDGE = /^[A-Z]->[A-Z]$/;

function parseEntry(raw) {
  const s = String(raw).trim();
  if (!VALID_EDGE.test(s)) return null;
  const [parent, child] = s.split('->');
  if (parent === child) return null; // self-loop
  return { edge: s, parent, child };
}

function buildGroups(edges) {
  // Union-Find to collect connected components
  const parent = {};
  const find = n => {
    if (parent[n] === undefined) parent[n] = n;
    if (parent[n] !== n) parent[n] = find(parent[n]);
    return parent[n];
  };
  const union = (a, b) => { parent[find(a)] = find(b); };

  const nodes = new Set();
  edges.forEach(({ parent: p, child: c }) => {
    nodes.add(p); nodes.add(c);
    union(p, c);
  });

  const groups = {};
  nodes.forEach(n => {
    const root = find(n);
    if (!groups[root]) groups[root] = { nodes: new Set(), edges: [] };
    groups[root].nodes.add(n);
  });
  edges.forEach(e => {
    const root = find(e.parent);
    groups[root].edges.push(e);
  });

  return Object.values(groups);
}

function detectCycle(edgeList) {
  // DFS cycle detection
  const adj = {};
  edgeList.forEach(({ parent: p, child: c }) => {
    if (!adj[p]) adj[p] = [];
    adj[p].push(c);
  });
  const visited = {}, stack = {};
  const dfs = n => {
    visited[n] = true; stack[n] = true;
    for (const nb of (adj[n] || [])) {
      if (!visited[nb] && dfs(nb)) return true;
      if (stack[nb]) return true;
    }
    stack[n] = false;
    return false;
  };
  const allNodes = new Set([...edgeList.flatMap(e => [e.parent, e.child])]);
  for (const n of allNodes) if (!visited[n] && dfs(n)) return true;
  return false;
}

function buildTree(root, adj) {
  const tree = {};
  const build = (node, obj) => {
    obj[node] = {};
    for (const child of (adj[node] || [])) build(child, obj[node]);
  };
  build(root, tree);
  return tree;
}

function treeDepth(node, adj) {
  const children = adj[node] || [];
  if (children.length === 0) return 1;
  return 1 + Math.max(...children.map(c => treeDepth(c, adj)));
}

function processGroup(group) {
  const { nodes, edges } = group;

  // Determine root candidates (nodes never appear as child)
  const childSet = new Set(edges.map(e => e.child));
  const roots = [...nodes].filter(n => !childSet.has(n)).sort();

  // Build adjacency respecting diamond rule (first-encountered parent wins)
  const adj = {};
  const childParent = {}; // child -> its first assigned parent
  edges.forEach(({ parent: p, child: c }) => {
    if (childParent[c] === undefined) {
      childParent[c] = p;
      if (!adj[p]) adj[p] = [];
      adj[p].push(c);
    }
    // else: silently discard subsequent parent edges
  });

  const hasCycle = detectCycle(edges);

  if (hasCycle) {
    const root = roots.length > 0 ? roots[0] : [...nodes].sort()[0];
    return { root, tree: {}, has_cycle: true };
  }

  const root = roots.length > 0 ? roots[0] : [...nodes].sort()[0];
  const tree = buildTree(root, adj);
  const depth = treeDepth(root, adj);
  return { root, tree, depth };
}

// ── Main handler ──────────────────────────────────────────────────────────────
app.post('/bfhl', (req, res) => {
  const data = Array.isArray(req.body?.data) ? req.body.data : [];

  const invalid_entries = [];
  const duplicate_edges = [];
  const seenEdges = new Set();
  const validEdges = [];

  data.forEach(raw => {
    const parsed = parseEntry(raw);
    if (!parsed) {
      invalid_entries.push(String(raw).trim());
      return;
    }
    if (seenEdges.has(parsed.edge)) {
      if (!duplicate_edges.includes(parsed.edge)) duplicate_edges.push(parsed.edge);
      return;
    }
    seenEdges.add(parsed.edge);
    validEdges.push(parsed);
  });

  const groups = buildGroups(validEdges);
  const hierarchies = groups.map(processGroup);

  // Sort hierarchies for deterministic output (by root)
  hierarchies.sort((a, b) => a.root.localeCompare(b.root));

  // Summary
  const nonCyclic = hierarchies.filter(h => !h.has_cycle);
  const cyclic    = hierarchies.filter(h =>  h.has_cycle);

  let largest_tree_root = '';
  if (nonCyclic.length > 0) {
    const maxDepth = Math.max(...nonCyclic.map(h => h.depth));
    const candidates = nonCyclic.filter(h => h.depth === maxDepth).map(h => h.root).sort();
    largest_tree_root = candidates[0];
  }

  res.json({
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees: nonCyclic.length,
      total_cycles: cyclic.length,
      largest_tree_root,
    },
  });
});

// ── Serve React build in production ────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Fallback: serve React app for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  app.get('/', (_, res) => res.send('BFHL API running. POST /bfhl'));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'} mode)`));
