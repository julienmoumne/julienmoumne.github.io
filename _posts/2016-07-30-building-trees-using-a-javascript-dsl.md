---
title: Building Trees using a JavaScript DSL
keywords: DSL, Domain Specific Language, JavaScript, Tree, Builder, Hotshell
description: An instructional sequence to a hack-free internal DSL for building trees in JavaScript
---

In vanilla JavaScript, this is how you build a tree[^1][^2]:
 

<a class="jsbin-embed" href="https://jsbin.com/hisumi/embed?js,output&height=400px">JS Bin on jsbin.com</a>


The article describes a way to build trees using an internal [DSL](http://martinfowler.com/bliki/InternalDslStyle.html):

~~~ javascript
tree('A', () => {      
  tree('B', () => {    
    tree('C')    
    tree('D')    
  })  
  tree('E')
  // add nodes from a dynamically created array
  moreNodes.forEach(e => tree(e))
})
~~~

This syntax mirrors the recursive structure of trees,
reduces the noise and provides the ability
to mixin arbitrary code.

This makes it convenient to:

 - specify hierarchical configuration data as in [Mocha][mocha-getting-started] or 
 [Hotshell][hotshell-website],
 - provide test data for algorithms on tree-like structures

Concepts found in this article are neither new nor restrained to JavaScript[^3].

This article aims to provide an instructional sequence to a hack-free solution in JavaScript.

Readers can jump to the [final solution](#package-the-solution-in-a-javascript-module)
or step through this sequence: 

 - [Naive solution](#naive-solution)
 - [Forwarding a bare variable](#forwarding-bare-variable)
 - [Coupling data and operations OOP style](#coupling-data-and-operations-oop-style)
 - [Implicit context using `this`](#implicit-context-using-this)
    - [Forwarding a bare variable using `this`](#forwarding-bare-variable-using-this)
    - [Coupling data and operations OOP style using `this`](#coupling-data-and-operations-oop-style-using-this)
    - [Hacking a way through the forest](#hacking-a-way-through-the-forest)
 - [Forgo traditional calling convention](#forgo-traditional-calling-convention)
    - [Reuse the existing stack](#reuse-the-existing-stack)
    - [Package the solution in a JavaScript module](#package-the-solution-in-a-javascript-module)

## Naive Solution {#naive-solution}

In this solution nodes are all children of the same parent node.

<a class="jsbin-embed" href="http://jsbin.com/zecovuw/embed?js,output&height=440px">JS Bin on jsbin.com</a>

This helps us understand the key challenge, keeping track of the node under construction so children are inserted at the right location.

## Forwarding a bare variable {#forwarding-bare-variable}

The most straightforward solution is to explicitly pass along the parent node.

<a class="jsbin-embed" href="http://jsbin.com/nuvoga/embed?js,output&height=530px">JS Bin on jsbin.com</a>

## Coupling data and operations OOP style {#coupling-data-and-operations-oop-style}

An alternative solution in par with OOP promotes the global `tree()` function to an instance method.

<a class="jsbin-embed" href="http://jsbin.com/yibupaf/embed?js,output&height=560px">JS Bin on jsbin.com</a>

This approach is used by [jbuilder](https://github.com/behrendtio/jbuilder). See
[jbuilder.js](https://github.com/behrendtio/jbuilder/blob/0.0.4/lib/jbuilder.js#L9).

Because we have only one operation available on the tree
we can remove the need to prefix calls to `add()`.

This is done by programmatically binding `this` using
[bind()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind).

<a class="jsbin-embed" href="http://jsbin.com/wemuqi/embed?js,output&height=510px">JS Bin on jsbin.com</a>

This is closer to the DSL we are looking for but
we still have to pass around a parameter in each closure signature.

## Implicit context using `this` {#implicit-context-using-this}

One approach to achieve parameterless closures is
to use the implicit formal parameter [this](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/this).

### Forwarding a bare variable using `this` {#forwarding-bare-variable-using-this}

Solution ['Forwarding a bare variable'](#forwarding-bare-variable) can be
adapted by programmatically binding `this` using
[apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
and forwarding it the same way `ctx` was being forwarded.

<a class="jsbin-embed" href="http://jsbin.com/rededo/embed?js,output&height=490px">JS Bin on jsbin.com</a>

In this case and the one that follows,
setting `this` dynamically does not work with 
[arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/this#Arrow_functions).
We must revert to standard function definitions `function () { body }`.

### Coupling data and operations OOP style using `this` {#coupling-data-and-operations-oop-style-using-this}

Solution ['Coupling data and operations OOP style'](#coupling-data-and-operations-oop-style)
can be rewritten the same way.

<a class="jsbin-embed" href="http://jsbin.com/zupiwoh/embed?js,output&height=580px">JS Bin on jsbin.com</a>

Coming from other OOP languages one could hope to directly call
`tree()` without prefixing it with `this` thus achieving our target DSL.

In JavaScript, without hacks, it is mandatory to explicitly reference instance members using `this`.

### Hacking a way through the forest {#hacking-a-way-through-the-forest}

Solution ['Coupling data and operations OOP style using `this`'](#coupling-data-and-operations-oop-style-using-this)
can be hacked to remove the need to prefix calls to `tree()` with `this`.

The scope chain must be altered using
[with()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with).

Usage of this method is usually not recommended.
Whether it is to be considered bad practice or not,
we will see that this solution presents serious limitations.

Ideally, we would apply `with()` this way:

~~~ javascript
function tree(value, closure = () => {}) {
  let newTree = {
    value: value,
    forest: [],
    tree: tree
  }      
  this.forest.push(newTree)   
           
  // in this block of code every property is first looked-up in 'newTree'
  with(newTree){
    // an example of a directly accessed property
    console.log(value)
    // call the closure wishing calls to function 'tree()' will resolve to 'newTree.tree()'
    closure()
  };
}
~~~

Calling the closure will not work as expected, properties will not be resolved
on `newTree`.
This is because JavaScript's closures are [lexically scoped](https://developer.mozilla.org/en/docs/Web/JavaScript/Closures)
and `newTree` was not lexically present when the closure was defined.

We must reset the lexical scope by re-interpreting the closure using
[eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval).

<a class="jsbin-embed" href="http://jsbin.com/dujonuk/embed?js,output&height=570px">JS Bin on jsbin.com</a>

The DSL finally looks like what we had in mind.

However, there are two issues:

 - functions called in the closure do not benefit from this hack, directly calling `tree()` within these functions will not work
 
~~~ javascript 
tree('A', () => {  
  twoNodesFail()
  twoNodes(newTree)
})

// does not work, nodes are added at the top of the tree as 'tree()' refers to the global function
function twoNodesFail() {
  tree('1')    
  tree('2')
}

// works, but obscure, 'newTree' comes from 'with(newTree){...}'
function twoNodes(newTree) {
  newTree.tree('1')    
  newTree.tree('2')
}
~~~
 
 - the original lexical scope is lost, this breaks the 
[principle of least astonishment](https://en.wikipedia.org/wiki/Principle_of_least_astonishment)

~~~ javascript
tree('A', () => {  
  var commonChild = 'D'
  tree('B', () => {
    tree(commonChild) // ReferenceError: commonChild is not defined
  })
  tree('C', () => {
    tree(commonChild) // ReferenceError: commonChild is not defined
  })
})
~~~ 

This is how Hotshell was [initially coded](https://github.com/julienmoumne/hotshell/blob/v0.1.0/interpreter/dslrunner.js#L27).

## Forgo traditional calling convention {#forgo-traditional-calling-convention}

The trick to a hack-free solution lies in understanding how parameters
are handled during a function call.

In [stack-oriented programming languages](https://en.wikipedia.org/wiki/Stack-oriented_programming_language),
parameters are stored in the [call stack](http://www.csee.umbc.edu/~chang/cs313.s02/stack.shtml)
and their life cycle is regulated by a [calling convention](https://en.wikipedia.org/wiki/Calling_convention).

We use solution ['Forwarding a bare variable'](#forwarding-bare-variable)
to illustrate the standard three step protocol.

~~~ javascript
function tree(ctx, value, closure = () => {}) {
  let newTree = {value: value, forest: []}  
  ctx.forest.push(newTree) 
  
  // 1. Push step
  //    Before calling 'closure()', a new call frame is pushed onto the stack and
  //    a reference of the local variable 'newTree' is copied in the parameter section of the call frame
  closure(newTree) // 2. Peek step
                   //    Every reference to 'newTree' in the body of 'closure()' is resolved
                   //    by accessing the parameter section of the top of the call stack
  // 3. Pop step
  //    When 'closure()' returns, the parameter section of the call stack is discarded
  //    by removing the call frame created at step 1
}
~~~

{::comment}
use a symbolic approach to better illustrate? :
when looking at the values taken by a parameter in a recursive function 
we notice that the stack symbolically operates a backup and then a restore
{:/comment}

We can achieve the same result by using an explicit parameter stack and our own calling convention.

~~~ javascript
let stack = [{forest: []}]

function tree(ctx, value, closure = () => {}) {
  let newTree = {value: value, forest: []}
  
  // peak of stack holds the parent node
  stack.peek().forest.push(newTree)
  
  // simulates pushing the value to the argument section of the stack
  stack.push(newTree)
  
  // 'tree()' calls performed in 'closure()' will access the parent node
  // at the peak of the stack
  closure()
  
  // simulates popping the value from the argument section of the stack
  // to restore the argument to its previous value
  stack.pop()
}
~~~


<a class="jsbin-embed" href="http://jsbin.com/zorire/embed?js,output&height=470px">JS Bin on jsbin.com</a>

This approach is used in Mocha BDD interface to allow nested `describe()` calls.
See [bdd.js](https://github.com/mochajs/mocha/blob/v2.5.3/lib/interfaces/bdd.js#L43).

### Reuse the existing stack {#reuse-the-existing-stack}

In a final simplification step we avoid allocating an explicit stack by
using the local variable section of the existing stack.

<a class="jsbin-embed" href="http://jsbin.com/rukuka/embed?js,output&height=610px">JS Bin on jsbin.com</a>

This approach is used in [Groovy NodeBuilder](http://groovy-lang.org/dsls.html#_nodebuilder)
and in [Hotshell][hotshell-website].
See [BuilderSupport.java](https://github.com/apache/groovy/blob/305131ff1b3e1350d4a2567c47e8ff41d74f51e9/src/main/groovy/util/BuilderSupport.java#L141)
and
[dslrunner.js](https://github.com/julienmoumne/hotshell/blob/7e7bb60/interpreter/dslrunner.js#L4).

### Package the solution in a JavaScript module {#package-the-solution-in-a-javascript-module}

The same solution can be coded as a module
to provide namespace control and isolation of state.

<a class="jsbin-embed" href="http://jsbin.com/yicudo/embed?js,output&height=590px">JS Bin on jsbin.com</a>

# Thoughts on internal DSLs

I find internal DSLs convenient to interact with tools I need on a daily basis.

They provide legibility as well as flexibility by being able to mixin arbitrary code.

Here are some examples to illustrate the versatility of this approach: 

 - Project builders ([Gradle](https://docs.gradle.org/current/userguide/tutorial_java_projects.html#N14F70), 
 [Sbt](http://www.scala-sbt.org/0.13/docs/Basic-Def.html))
 - Testing frameworks ([RSpec](http://rspec.info/), [Mocha][mocha-getting-started])
 - Virtual environment tools ([Vagrant](https://github.com/patrickdlee/vagrant-examples/blob/master/example1/Vagrantfile))
 - Package Managers ([Homebrew](https://github.com/Homebrew/brew/blob/master/share/doc/homebrew/Formula-Cookbook.md))
   
With the availability of embeddable interpreters I believe this approach can be 
generalized further.

This is the approach used in [Hotshell][hotshell-website] by using
[Otto](https://github.com/robertkrimen/otto), an embeddable JavaScript interpreter for Go.

---

[^1]:
    Property `forest` could have been named `trees`, `subtrees` or `children`.
    `Forest` is used in this article to echoe the mutually recursive definition found in
    [Mutual recursion - Wikipedia](https://en.wikipedia.org/wiki/Mutual_recursion#Data_types).
    
[^2]:
    Tree visualization code found at [https://bl.ocks.org/mbostock/4339184](https://bl.ocks.org/mbostock/4339184)
    
[^3]:
    [NodeBuilder](http://groovy-lang.org/dsls.html#_nodebuilder) is one implementation in Groovy.
    [Mocha][mocha-getting-started] is one in JavaScript.
    
*[DSL]: Domain Specific Language
*[OOP]: Object-oriented programming
*[BDD]: Behavior-driven development

[mocha-getting-started]: https://mochajs.org/#getting-started
[hotshell-website]: http://julienmoumne.github.io/hotshell

<script src="https://static.jsbin.com/js/embed.min.js?4.1.8"></script>
