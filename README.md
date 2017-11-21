# nvm-reinstall-packages
> reinstall-packages for nvm

## Why
The ``reinstall-packages`` command of [offical nvm](https://github.com/creationix/nvm) consumes lots of inode when some of the global node modules installed as symbolic links.

## Install
```bash
npm install nvm-reinstall-packages -g
```

## Usage
Ensure you have [nvm](https://github.com/creationix/nvm) installed first.

```bash
$ nvm-reinstall-packages --help

  Usage
    $ nvm-reinstall-packages <from-version>

  Options
    --list  Lists packages only, without installation

  Examples
    $ nvm-reinstall-packages 7.10.1
```

## Related
- [nvm](https://github.com/creationix/nvm#migrating-global-packages-while-installing)
- [fix-nvm-update](https://github.com/uid-11222/fix-nvm-update)

## License
The MIT License
