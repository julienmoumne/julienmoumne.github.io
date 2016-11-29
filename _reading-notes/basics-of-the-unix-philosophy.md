---
wip:                false
short-title:        Basics of the Unix Philosophy
title:              "The Art of Unix Programming - Basics of the Unix Philosophy - Eric S. Raymond"
link:               http://www.catb.org/esr/writings/taoup/html/ch01s06.html
notes:
    - teaser:       Experience driven
      quotes:
        - text:     The Unix philosophy... is bottom-up, not top-down. It is pragmatic and grounded in experience.
          position: Introductory paragraph
          
    - teaser:       Short cycles
      quotes:
        - text:     Design and build software, even operating systems, to be tried early, ideally within weeks. Don't hesitate to throw away the clumsy parts and rebuild them. [Doug McIlroy]
          position: Introductory paragraph
        - text:     Make it run, then make it right, then make it fast [Kent Beck]
          position: Rule of Optimization          
          
    - teaser:       Fight complexity
      quotes:
        - text:     Controlling complexity is the essence of computer programming [Kernighan-Plauger].
          position: Rule of Modularity
        - text:     The only way to write complex software that won't fall on its face is to hold its global complexity down...
          position: Rule of Modularity
          
    - teaser:       Code for humans       
      quotes:
        - text:     Because maintenance is so important and so expensive, write programs as if the most important communication they do is not to the computer that executes them but to the human beings who will read and maintain the source code...
          position: Rule of Clarity
          
    - teaser:       Fail early and loudly       
      quotes:
        - text:     ... the worst kinds of bugs are those in which the repair doesn't succeed and the problem quietly causes corruption that doesn't show up until much later.     
          position: Rule of Repair
          
    - teaser:       Simplicity over optimization
      quotes:
        - text:     Programmer time is expensive; conserve it in preference to machine time
          position: Rule of Economy
        - text:     Premature optimization is the root of all evil [Donald Knuth]
          position: Rule of Optimization
        - text:     You can't tell where a program is going to spend its time. Bottlenecks occur in surprising places... [Rob Pike]
          position: Introductory paragraph
        - text:     Measure. Don't tune for speed until you've measured... [Rob Pike]
          position: Introductory paragraph
        - text:     Fancy algorithms are buggier than simple ones [Rob Pike]
          position: Introductory paragraph
        - text:     When in doubt, use brute force. [Ken Thompson]
          position: Introductory paragraph
        - text:     Buying a small increase in performance with a large increase in the complexity and obscurity of your technique is a bad trade 
          position: Rule of Clarity
        - text:     A prematurely optimized portion of a design frequently interferes with changes that would have much higher payoffs across the whole design, so you end up with both inferior performance and excessively complex code. 
          position: Rule of Optimization
---