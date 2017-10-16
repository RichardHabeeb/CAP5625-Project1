# Introduction to AI: Project 1

This is the official repository of Richard's and Anwesh's CAP5625 Project1 submission. We use A* to path find through a network of cities using different hueristic algorithms.

## Repository structure

```
CAP5625-Project1/
    - app/                             Front-end application code.
    - app/Main.js                      Application entry point.
    - index.html                       Single Page Application entry.
    - lib/                             Location of the front-end libraries.
    - css/                             Stylesheets.
    - Brocfile.js                      Configuration for the broccoli builder.
```

## Obtaining CAP5625-Project1

```
git clone https://github.com/RichardHabeeb/CAP5625-Project1.git
cd CAP5625-Project1
npm install
```

If you don't have [broccoli](http://broccolijs.com) installed:

```
npm install -g broccoli-cli
```

## Running CAP5625-Project1


```
rm -rf dest && broccoli build dest
```

Then open index.html in your browser (warning: backwards compatibility with older browsers currently not supported).
