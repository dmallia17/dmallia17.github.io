---
layout:		post
title:		"Life and Games and Games Of Life"
date:		2023-12-16 00:25:00 -0500
categories:	personal
---

So I made a thing, my own little
[implementation of Conway's Game of Life](/gol.html).
![GOL Sample](/assets/golsample.gif)

You can tinker with the state, creating glider guns to your heart's delight,
and even *hear* the state of the game by musical notes.
Now I knew I wanted to write a post about having made it, but in all honesty,
the first questions that jumped to my mind were "Why? So what?".
I love Conway's Game of Life in its own right, for what it tells us about real
life and the mesmerizing patterns emerging from simplicity, but that negative
question made me realize I had more to say, and so I'll cover both.
Let's talk about why I made this, and why I love it.

## Let's Get Motivated!
Questioning why I should work on a project is a frequent occurrence for me.
If you're like me, and alternate between nervous feet shuffling because
you can't think of a single project, and then being overwhelmed by the sheer
number of ideas which appear out of thin air the next day, then it probably
feels pretty natural to ask that sort of question.
The added pressure of doing "portfolio" projects - i.e. projects for public,
résumé consumption - can send your mind off the creative track, as every idea
gets reduced down to "what could this do for my career?"

Now, for as much as I would like to routinely put on my TensorFlow spandex
outfit (wait you don't have one?) and channel my inner, deep learning Richard
Simmons for a personal project, I've come to learn a bit about what drives me to
do projects.
The first criteria might sound obvious or cliche, but maybe doesn't get
vocalized enough: I need to *love* the project, *need* to see it come to life
and work.
That is absolutely not to say that deep learning doesn't fall under that
criteria, but whereas I might want to work with GANs and I'm planning on
doing so for my next project, just forcing myself to just go implement a
random paper or go try a different normalization or activation function, for
the heck of it, doesn't get me bouncing out of bed.

![Loss Decreasing](/assets/LossDecreasing.gif)


But that's just one criteria: another aspect I find feeds my inner programming
demons is the satisfaction that comes from building something pretty much
from scratch, as I've done with game and simulation projects.
The "low code" nature of a lot of **basic** ML / deep learning projects can
leave you feeling more like the monkey who knows how to turn the knobs for good
treats, rather than the flannel-clothed craftsman-engineer-lumberjack(?) I
imagine myself to be.
Yet, there is also the serious allure of doing projects which have nothing to
do with your other preoccupations, making programming your staycation.
If I'm working on getting segmentation networks to run on a robot (I am), and
I'm dealing with all sorts of Docker and Conda hell to do so (oh, I am), then
escaping to make a little simulation is a relief.

![Docker Is Great](/assets/DockerIsGreat.gif)

Finally, it is strange to realize this, but I have spent so much of my
programming life making programs which output text, a ML model, or perhaps
processed images or plots, but very little in the way of highly visual,
interactive programs.
My inner curiosity and quest for graphics-driven neuron stimulation has
gotten the better of me, and for fun I would like to here and there make more
graphically driven programs which use AI in the background, as with game AI or
reinforcement learning visualizations.
Ideally, these would be easy to share with others, and the framework I would use
would be simple but robust.
The wonderful videos of
[Daniel Shiffman on YouTube](https://www.youtube.com/@TheCodingTrain) - imagine
the Mr. Rogers of programming - introduced me to the p5.js library, which
checks off all of those criteria, and got me really inspired to make some visual
programs.
And if you're going to start tinkering with graphics, you might as well start
small, and implement a classic...

## Conway's Game of Life
You know what I'm going to say here right?


*Stares excitedly and expectantly...*

*Eyes narrow...*

Really?!

Jokes aside, I do find it funny that more people don't know what Conway's Game
Of Life is...though to be fair I had only ever heard of it in passing and was
never shown it in my computer science studies, when it really should be a
"Hello, World!" for graphics programming.
The [Wikipedia page](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
on it is quite jam-packed with the history and details, which I won't repeat
here, except to make a quick summary and couple of significant points.

To summarize, it is a "zero-player" "game", meaning that it is really more of a
simulation, where the user/player only has any influence in the initial setup of
the environment state.
This simulation is conducted, generally, on a form of grid and this grid
contains either live or dead cells.
Once an initial configuration of which grid cells contain life is provided, a
simulation can proceed according to a few basic rules about where life will
live on, be created, or die out, based on how many live cells are in a small
neighborhood.
There are many derivatives and variations of this, notably the work done by
Stephen Wolfram on the 1-dimensional analog of these cellular automatons, but
the original concept was invented by British mathematician John Conway in 1970.
It is easy to forget in the modern landscape of ever changing software, that
computer science has long, deep historical roots, but this really is a classic,
and my dual loves of computer science and history have left me spending fair
amounts of time absorbing things like this...and arcane info about early
personal computing, such as with the Commodore PET.

So we've got a case of some cool history on our hands, so what?
Well I mentioned it's really a form of simulation, and not only do we all need
a break from the one we're living in, but simulation is a *really* fun,
exciting and under-appreciated field of study with major potential for
real-world planning and optimization.
My last course in my CS Master's focused on simulation, and while the
probability and statistics material can be a steep learning curve, if you've
ever felt the thrill of playing God in Rollercoaster Tycoon or Sim City, you'll
quickly find yourself drawn into the deep end.
In fact a quick Google search will show you that the game is specifically
considered an early form of
agent-based simulation (shameless plug: if you're interested in that kind of
simulation, check out my
[simulation of outdoor cats in an urban area](https://github.com/dmallia17/SimulationFinalProject)).

Admittedly, I have not researched this categorization, but at least 2
characteristics do stand out from other such simulations.
First, all updates to the "agents" (e.g. cells) are performed in parallel,
whereas typically you must apply updates to agents one at a time, and because
these updates will be affected by the presence of other agents, the *order* in
which you apply these updates is important.
Second, the idea of "agency" here is a little weaker than you might expect, as
there is only the application of general rules and no agent decision making
per se, but then again, this bears similarity to how you might conduct a
simulation of disease spread over a geographic area.

Last, but *certainly* not least - in fact, I was really saving the best for
last - Conway's Game of Life, evidences miraculous emergence of patterns, from
the humble stable patterns (like 2x2 blocks), to oscillating patterns, and
beyond.
If you're scratching your head asking, "so what?" consider that, while higher
level patterns are likely to be ephemeral in randomly initialized games, the
existence of these patterns alone tells us two major things, one regarding
computation, and one regarding life.
**The first**, is that, believe it or not, Conway's Game of Life is Turing
complete: in English, that means that given the right setup, the game can
simulate a Turing machine, which is in turn capable of simulating the computer
you are reading this on.
So the next time your Windows OS decides you have no say over updates, and that
your graphics drivers should again be reset to out of date drivers, take
comfort in the idea that it's really more of a natural pattern.

**The second** follows from the fact that you can have such a simple environment
and set of rules yield the ability to perform the same computations your
computer can make.
That is because if we continue to believe that computers can one day simulate
the same reasoning and life we ourselves exhibit, then we are really looking at
the creation of life from two basic ingredients (live/dead cells) under the
right conditions (the rules of the game).
Suddenly the notion that we might find life in the universe, where we have the
right chemical ingredients, such as carbon, under favorable conditions like
temperate liquid water, doesn't seem so far fetched.
Whether you examine this as a wonder of the physical world, or as evidence of
the divine, there is no denying there is great beauty here, and a lot more than
meets the eye.

Now it's time to take the red pill, see how deep the rabbit hole goes, and run
some simulations...

## References
Wikipedia contributors, "Conway's Game of Life," Wikipedia, The Free Encyclopedia, https://en.wikipedia.org/w/index.php?title=Conway%27s_Game_of_Life&oldid=1187705341 (accessed December 15, 2023).

