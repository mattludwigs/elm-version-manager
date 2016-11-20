# Elm Version Manager (EVM)

A package that helps manage the local version Elm.

Now that Elm is being used in production and is having more releases, many people will run into supporting older Elm projects, while at the same time wanting to use the newest version for a new project, at least until they are able to upgrade the older ones. Also, if you have a production project and an open source Elm package that are using an older version, you will need to manually do the path switching to different elm platform executables, or have a script to do it for you, if you want to upgrade your Elm package while supporting the production project. Neither is quite shareable or easy, so this cli is trying to make switching elm versions locally a breeze.


### To install

```
$ npm install -g elm-version-manager
```

### Example Installing

![alt text](https://github.com/mattludwigs/elm-version-manager/raw/master/assets/evm-install.gif "evm install example")

### Example Switching

![alt text](https://github.com/mattludwigs/elm-version-manager/raw/master/assets/switch-versions.gif "evm use example")


## System Requirements

Node 4.0+

## What about elmenv?

[elmenv](https://github.com/sonnym/elmenv) should be just fine. However, it looks like from the issues, that new versions of Elm are not automatically included and the maintainer has to go and add those, which can be a blocker for people wanting to switch versions as they come out. With evm everything should stay synced up with the latest versions, so as new releases are cut but the Elm core team you can install them via evm.

## Install a version of Elm

```
$ evm install 0.18.0
```

## Use a version of Elm

```
$ evm use 0.18.0
```

## List versions of Elm installed

```
$ evm ls

- 0.18.0
- 0.17.1
```

```
$ evm list

- 0.18.0
- 0.17.1
```

## List Remote

List out the remote versions

```
$ evm list-remote

- 0.15.1
- 0.16.0
- 0.16
- 0.17.0
- 0.17.1
- 0.18.0
- master
```

```
$ evm lsrm

- 0.15.1
- 0.16.0
- 0.16
- 0.17.0
- 0.17.1
- 0.18.0
- master
```

## Remove a version of Elm

```
$ evm remove 0.18.0
```

## Remove All

This is mainly help in development

```
$ evm remove-all
```

## Help

```
$ evm -h
```

```
$ evm --help
```

## Version

```
$ evm -v
```

```
$ evm --version
```


## Contributing

[a Contributing](CONTRIBUTING.md)
