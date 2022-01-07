# Tunneler Remake
A javascript remake of the original [Tunneler DOS game](https://tunneler.org/) written by Geoffrey Silverton in 1990. No source code for the original game [is avaiable](https://tunneler.org/faq/), so the game was created from scratch.

The game is rendered to canvas by directly rendering an array of pixels which I manipulate directly. 

## Live Version
**:link: [Click here to play Tunneler](https://kancur.github.io/tunneler/)**

## More Info
🔗 Here's a link to the [backend repo for the server](https://github.com/kancur/tunneler-server)

:bangbang: **Work in progress - not all original features yet implemented (95% completed)**:bangbang:  

:x: **Missing Features:**
- The logic of tunneling slower through dirt / fast when shooting at the same time
- Random boulders near the edges of the game area
- Big explosion spread logic visually a bit different than original in current version

## Online Multiplayer
While the original game was played on one computer in a split-screen mode, the remake features an online multiplayer.

## How to play
- Move the tank with **arrow keys** :arrow_up::arrow_down::arrow_left::arrow_right:
- Shoot with **space**, **x**, or **Numpad0**

## Screenshot
<kbd>![tunnelersmall](https://user-images.githubusercontent.com/49352605/148550389-b8d8abfe-9bc8-4a3c-9f94-a9e6dbf52d9f.png)
</kbd>

## Lessons learned
- I would separate concerns much more aggresively
- Instead of game logic taking place in the gamemap array, each object should only handle what it was supposed to do
- Spend more time planning

## Get in Touch With me
🔗 Check out my [portfolio](https://petersmid.com)  
💬 [Contact me](https://petersmid.com/#contact)
