---
title: Introducing Rx Training Games
---

*Rx Training Games* is a coding playground that can be used to 
learn and practice [Reactive Extensions](http://reactivex.io/) coding [grid-based](https://github.com/JulienMoumne/rx-training-games/blob/master/API.md) games.

See it in action [here](http://julienmoumne.github.io/rx-training-games).

The project ambitions are to :

 * offer a way to learn new technology while having fun - with as little hardware and software requirements as possible
 * demonstrate how leveraging current technology makes it easy to build such training platforms

The idea came out of several sources of inspiration :
 
 * [A Playful Introduction to Rx by Erik Meijer](https://youtu.be/WKore-AkisY) 
 * Online coding playgrounds such as [JS Bin](https://jsbin.com) and [CodingGame](https://www.codingame.com)


## Why Reactive Extensions

If you have developed software that deals with asynchronous data streams such as user inputs,
web service requests and I/O, you have probably faced issues related to :

 * thread safety
 * synchronization
 * exception management

Reactive Extensions offer a way of looking at asynchronous data streams as objects
that can be queried and composed while abstracting low-level constructs such as threads.

They can be useful in a wide range of applications :

 * Composing microservices : [NetflixOSS Meetup - Season 2 Episode 2 - Reactive / Async ](https://youtu.be/aEuNBk1b5OE?t=3m24s)
 * Developing games : [A Playful Introduction to Rx by Erik Meijer](https://youtu.be/WKore-AkisY) 
 * GUI components such as an Autocomplete feature : [RxJS-DOM Autocomplete Tutorial](https://github.com/Reactive-Extensions/RxJS-DOM#getting-started-with-the-html-dom-bindings)

For a complete introduction to Rx I suggest
[The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754).

*Rx Training Games* follows the footsteps of [A Playful Introduction to Rx by Erik Meijer](https://youtu.be/WKore-AkisY)
and takes a close look at how Reactive Extensions can be used to build games.


## Meteorites

Games published on *Rx Training Games* can be embedded in an iframe such as the one bellow.

Press start, then use the Left and Right arrows of your keyboard to aim and the Space bar to fire.

Feel free to experiment with the code by editing it.

<iframe
        width="100%"
        height="600px"
        frameborder="0"
        src="http://julienmoumne.github.io/rx-training-games/#?title=meteorites&amp;preventstart=true">
</iframe>

A few snippets have also been published to take a closer look at specific parts of the game.

Find below one approach of generating the falling meteorites :

<iframe
        width="100%"
        height="600px"
        frameborder="0"
        src="http://julienmoumne.github.io/rx-training-games/#?title=rain-using-state&amp;preventstart=true">
</iframe>

More games and snippets are available in the [app](http://julienmoumne.github.io/rx-training-games).


## API

*Rx Training Games* provides a basic API for building games.

Squares of different colors are switched on and off in a graphical square grid :

![Grid Example](https://raw.githubusercontent.com/JulienMoumne/rx-training-games/master/misc/grid-example.png)

The grid is first instantiated with the size of the activable squares : `api.initGrid({squareSize: 15});`

Multiple layers with different colors can be added with `var layer = api.addLayer({color: '#337ab7'});`

A layer exposes the following methods :

 * `layer.fill({x: 42, y: 42})` : activate a square
 * `layer.clear({x: 42, y: 42})` : clear a square
 * `layer.getActiveSquares()` : retrieve a list of active squares
 
The layer is also implemented as an Observable Collection and provides two [Observables](http://reactivex.io/documentation/observable.html) :
 
{% highlight js %}
// square activations
layer.activations.subscribe(coord =>
    console.log(coord.x + ',' + coord.y + ' has been activated')
);

// square removals
layer.removals.subscribe(coord =>
    console.log(coord.x + ',' + coord.y + ' has been cleared')
);
{% endhighlight %}

Keyboard events are accessible using an Observable : 

{% highlight js %}
// keyboard events
api.keyboard.subscribe(keyCode =>
    console.log(keyCode)
);
{% endhighlight %}

Please consult the [complete documentation](https://github.com/JulienMoumne/rx-training-games/blob/master/API.md) for more details.


## Contributing

Do you think you can invent games with these simple elements? See [how to contribute](https://github.com/JulienMoumne/rx-training-games/#how-to-contribute).

Please comment on this page if you think the project or the blog can be improved.