---
layout: page
title: Projects
permalink: /projects/
---

The great hall of projects, big and small, in no particular order.

### [FeudalAI](https://github.com/dmallia17/FeudalAI)
![Feudal](assets/FeudalSetup1.png)
###### A screenshot of an initial setup in Feudal. There are two players, Blue and Yellow, a variety of piece types denoted by two symbol identifiers (e.g. Knight 1 = K1 or Pikemen 4 = P4), a castle for each player (Cyan = the castle green/entrance, Red = heart of the castle) and terrain which makes the game more complex than Chess (green = mountains, white = rough terrain). A basic terminal app sufficed for our AI focus, so it's not quite Call of Duty. 

Do you think Chess or Go are *too easy*? Well boy do I have the game for you.
For the artificial intelligence course final project, I teamed up with my
good friend Artjom to work on creating AI for the board game Feudal, a
Chess-like game (see
[Feudal on Wikipedia](https://en.wikipedia.org/wiki/Feudal_(game))) with a
number of different complications: an initial piece placement phase (unlike
the predetermined setup in Chess), a wide variety of piece types and
movement patterns, terrain which can restrict attack and defense, the
presence of castles which can be captured by the enemy to win the game, as
well as the possibility of moving up to ALL of your pieces in a single turn.
The last component (read as *enormous branching factor*) was certainly going
to complicate our plan to work up from search based agents to reinforcement
learning if there was time. Ultimately we implemented game AI depending on
two major components. First, we employed local search (hill-climbing and
simulated annealing) for finding ideal initial piece placement by using some
attack and defense heuristics; because we didn't know how these heuristics
should be weighted for a score, we created a score optimizer for good measure
so as to determine more suitable weights. Second, we created tree-based
search gameplay agents: a variant of minimax using transposition tables and
alpha-beta pruning, and a variant of Monte Carlo Tree Search making use of
truncated gameplay (for reasonable length simulations) and parallel
simulations (observing how hundreds or even thousands of game simulations
could be conducted in a few seconds was addicting). Both of these approaches
would have benefited from using a language other than Python, but it enabled
fast development and offered handy features like generators for generating the
vast breadth of multi-piece moves before we finally focused on just single
piece moves for our proof of concept. While we didn't have the time to really
get to an RL based approach given the sheer breadth of work - we even wrote a
gameplay viewer so we could play back AI games for review! - the project was a
success and an absolute blast. 


### [Agent-Based Modeling of Controlling Urban Outdoor Cat Populations](https://github.com/dmallia17/SimulationFinalProject)
![Cat Simulation](assets/SimulationScreenshot.png)
###### 

### [Road Surface Disparity Estimation](https://github.com/joshcwinton/RoadSurfaceDisparityEstimation)


### [Synthesis](https://github.com/tanj299/synthesis)


### [Multi-aRmed Bandits](https://github.com/dmallia17/Multi-aRmed_Bandits)


### [Easy21](https://github.com/dmallia17/Easy21)



