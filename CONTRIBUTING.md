# Contributing

First off, I would love for contributors! This package works closely we the system, and since everyone's system is different it hard to account for possible systems. More people who try out evm and report back any issue they run into, the better this package can be.

Open source does not succeed because of its maintainers, but through the people who contribute back. However, a maintainer, or maintainers, can kill a project, so I will do my part in trying to keep up with this package.

## Getting set up:

```
$ git clone git@github.com:mattludwigs/elm-version-manager.git
$ cd elm-version-manager
$ npm install
```

Then you should be able to `./index.js -h` and other commands.


## Error Messages

The biggest thing I am going to look for in any PR that tries to handle an error message is this that is clear and tries to provide a helpful fix when there is one. Elm as a language is regarded as having some of the best error messages, and I want this tool to reflect that as well.


## No ES6

I am not using any ES6 or Babel for two reasons. First, having a build for this type of package just to compile to another version of ES did not seem needed and just would add complexity for no gain. Second, since we are not compiling to ES5, this package should be written ES5 and try to support the smallest node version possible from Node 3 and up. I want to say currently it should work with Node 4+, but I would love to get this down to Node 3.


## Avoid Needless Abstractions

I want this code to be simple and nice to work in. We are not building a massive node project, so a lot of the abstractions we might normally use are not really needed. So, before adding an abstraction try to think through if it really need. Clarity over brevity should be the standard for this package.
