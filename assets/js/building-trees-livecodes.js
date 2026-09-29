import { createPlayground } from 'https://cdn.jsdelivr.net/npm/livecodes@0.14.1/livecodes.js';

const APP_URL = 'https://v49.livecodes.io/';
const D3_URL = 'https://cdn.jsdelivr.net/npm/d3@3.5.17/d3.min.js';

const MARKUP = `<pre id="tree"></pre>`;

const STYLE = `
.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 1.5px;
}

.node {
  font: 10px sans-serif;
}

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 1.5px;
}
`;

const HIDDEN_SCRIPT = `
Array.prototype.peek = function () {
      return this[this.length - 1];
  }

  // Tree visualization code found at https://bl.ocks.org/mbostock/4339184
  function display(data) {

      var data = JSON.parse(JSON.stringify(data), function (prop, value) {
          switch (prop) {
              case "forest":
                  this.children = value;
                  return;
              case "value":
                  this.name = value;
                  return;
              default:
                  return value;
          }
      });

      var width = 350,
          height = 250;

      var tree = d3.layout.tree()
          .size([height, width - 150]);

      var diagonal = d3.svg.diagonal()
          .projection(function (d) {
              return [d.y, d.x];
          });

      var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(75,0)");

      var nodes = tree.nodes(data),
          links = tree.links(nodes);

      var link = svg.selectAll("path.link")
          .data(links)
          .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);

      var node = svg.selectAll("g.node")
          .data(nodes)
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", function (d) {
              return "translate(" + d.y + "," + d.x + ")";
          })

      node.append("circle")
          .attr("r", 4.5);

      node.append("text")
          .attr("dx", function (d) {
              return d.children ? -8 : 8;
          })
          .attr("dy", 3)
          .attr("text-anchor", function (d) {
              return d.children ? "end" : "start";
          })
          .text(function (d) {
              return d.name;
          });

      d3.select("body").style("height", height + "px");
  }
`;

const EXAMPLES = {
  hisumi: `
// literally
let tree = {
  value: "A",
  forest: [{
      value: "E",
      forest: []
  }]
}

// programmatically
let b = {value: "B", forest: []}
let c = {value: "C", forest: []}
let d = {value: "D", forest: []}
b.forest.push(c)
b.forest.push(d)
tree.forest.unshift(b)

display(tree)
`,
  zecovuw: `
let ctx = {forest: []}

tree('A', () => {      
  tree('B', () => {    
    tree('C', () => {      
      tree('D')      
      tree('E')      
    })    
    tree('F')    
  })  
  tree('G')
})

display(ctx) 
  
function tree(value, closure = () => {}) {
  let newTree = {value: value, forest: []}  
  // 'ctx' always refers to the same node
  ctx.forest.push(newTree)
  closure()
}
`,
  nuvoga: `
let ctx = {forest: []}

tree(ctx, 'A', ctx => {      
  // parent node 'ctx' is defined
  // in the closure's signature and
  // forwarded to each 'tree()' call
  tree(ctx, 'B', ctx => {    
    tree(ctx, 'C', ctx => {      
      tree(ctx, 'D')      
      tree(ctx, 'E')      
    })    
    tree(ctx, 'F')    
  })  
  tree(ctx, 'G')
})

display(ctx.forest[0]) 

function tree(ctx, value, closure = () => {}) {
  let newTree = {value: value, forest: []}  
  ctx.forest.push(newTree) 
  
  // 'closure()' is called with 'newTree'
  // and becomes the new parent node 
  closure(newTree)
}
`,
  yibupaf: `
let tree = {forest: [], add: add}

tree.add('A', tree => {      
  tree.add('B', tree => {    
    tree.add('C', tree => {      
      tree.add('D')      
      tree.add('E')      
    })    
    tree.add('F')    
  })  
  tree.add('G')
})

display(tree.forest[0]) 

function add(value, closure = () => {}) {
  let newTree = {
    value: value,
    forest: [],
    add: add
  }
  // 'this' refers to the parent node
  this.forest.push(newTree) 
  
  // 'closure()' is called with 
  // the new parent node 'newTree'
  closure(newTree)
}
`,
  wemuqi: `
var forest = []

tree('A', tree => {      
  tree('B', tree => {    
    tree('C', tree => {      
      tree('D')      
      tree('E')      
    })    
    tree('F')    
  })  
  tree('G')
})

display(forest[0]) 

function tree(value, closure = () => {}) {
  let newTree = {value: value, forest: []}
  // 'this' refers to the parent node
  this.forest.push(newTree) 
  
  // 'bind' creates a new bound function from 'tree'
  // with the new parent node 'newTree' bound to 'this'
  closure(tree.bind(newTree))
}
`,
  rededo: `
let ctx = {forest: []}

tree(ctx, 'A', function () {  
  tree(this, 'B', function () {    
    tree(this, 'C', function () {      
      tree(this, 'D')      
      tree(this, 'E')      
    })    
    tree(this, 'F')    
  })  
  tree(this, 'G')
})

display(ctx.forest[0])
   
function tree(ctx, value, closure = () => {}) {
  let newTree = {value: value, forest: []}
  ctx.forest.push(newTree)  
  
  // call 'closure()' and assign
  // the new parent node 'newTree' to 'this'
  closure.apply(newTree)
}
`,
  zupiwoh: `
var forest = []

tree('A', function () {      
  this.tree('B', function () {    
    this.tree('C', function () {      
      this.tree('D')      
      this.tree('E')      
    })    
    this.tree('F')    
  })  
  this.tree('G')
})

display(forest[0])
   
function tree(value, closure = () => {}) {
  let newTree = {
    value: value,
    forest: [],
    // tree as a shared instance method
    tree: tree
  }          
  // 'this' refers to the parent node
  this.forest.push(newTree)
  
  // call the closure and assign
  // the new parent node 'newTree' to 'this'
  closure.apply(newTree)
}
`,
  dujonuk: `
var forest = []

tree('A', () => {      
  tree('B', () => {    
    tree('C', () => {      
      tree('D')      
      tree('E')      
    })    
    tree('F')    
  })  
  tree('G')
})

display(forest[0])
   
function tree(value, closure = () => {}) {
  let newTree = {
    value: value,
    forest: [],
    tree: tree
  }        
  this.forest.push(newTree)  
  
  // this hack brings 'newTree' into the
  // lexical scope of 'closure' using 'eval'
  // and provides a shortcut to its properties
  // using 'with'
  eval('with(newTree){(' + closure + ')()}');
}
`,
  zorire: `
let stack = [{forest: []}]

tree('A', () => {      
  tree('B', () => {    
    tree('C', () => {      
      tree('D')      
      tree('E')      
    })    
    tree('F')    
  })  
  tree('G')
})

display(stack.peek().forest[0]) 

function tree(value, closure = () => {}) {
  let newTree = {value: value, forest: []}
  stack.peek().forest.push(newTree)
  stack.push(newTree)
  closure()
  stack.pop()
}
`,
  rukuka: `
let peak = {forest: []}  

tree('A', () => {      
  tree('B', () => {    
    tree('C', () => {      
      tree('D')      
      tree('E')      
    })    
    tree('F')    
  })  
  tree('G')
})

display(peak.forest[0]) 

function tree(value, closure = () => {}) {
  let newTree = {value: value, forest: []}
  peak.forest.push(newTree)
  
  // keep a reference of the current parent node
  // in the local variable section of the stack
  let prev = peak
  
  // update/push new parent node on top of stack
  peak = newTree
  
  closure()    
  // restore/pop parent node so subsequent
  // 'tree()' calls operate on the right node
  peak = prev
}
`,
  yicudo: `
let tree = seed()

tree('A', () => {      
  tree('B', () => {    
    tree('C', () => {      
      tree('D')      
      tree('E')      
    })    
    tree('F')    
  })  
  tree('G')
})

display(tree.peek()) 

function seed() {
  let peak = {forest: []}
  function tree(value, closure = () => {}) {
    let newTree = {value: value, forest: []}
    peak.forest.push(newTree)
    let prev = peak
    peak = newTree
    closure()    
    peak = prev
  }   
  tree.peek = () => peak.forest[0]
  return tree
}
`,
};

for (const container of document.querySelectorAll('[data-livecodes-example]')) {
  const id = container.dataset.livecodesExample;
  const source = EXAMPLES[id];

  if (!source) {
    console.error(`Unknown LiveCodes example: ${id}`);
    continue;
  }

  createPlayground(container, {
    appUrl: APP_URL,
    loading: 'lazy',
    config: {
      mode: 'simple',
      view: 'split',
      layout: 'horizontal',
      activeEditor: 'script',
      editor: 'codemirror',
      theme: 'light',
      allowLangChange: false,
      autoupdate: true,
      autosave: false,
      autotest: false,
      recoverUnsaved: false,
      markup: {
        language: 'html',
        content: MARKUP,
      },
      style: {
        language: 'css',
        content: STYLE,
      },
      script: {
        language: 'javascript',
        title: 'JavaScript',
        content: source,
        hiddenContent: HIDDEN_SCRIPT,
      },
      scripts: [D3_URL],
    },
  }).catch((error) => {
    console.error(`Failed to load LiveCodes example: ${id}`, error);
  });
}
