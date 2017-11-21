const fs = require('fs')
const { join } = require('path')
const flatten = require('lodash.flatten')
const meow = require('meow')
const execa = require('execa')
const chalk = require('chalk')

const NVM_DIR = process.env.NVM_DIR

function main () {
  const cli = meow(`
    Usage
      $ nvm-reinstall-packages <from-version>

    Options
      --list  Lists packages only, without installation

    Examples
      $ nvm-reinstall-packages 7.10.1
  `, {
    flats: {
      list: {
        type: 'boolean',
      },
    },
  })

  const version = cli.input[0]
  if (!version) {
    throw new Error('<from-version> is required.')
  }

  const home = node_modules(version)

  if (!fs.existsSync(home)) {
    throw new Error(`version ${version} not found.`)
  }

  const pkgs = packages(home)

  if (cli.flags.list) {
    console.log(pkgs.join(' '))
    return
  }

  install(pkgs)
}

function isLink (path) {
  return fs.lstatSync(path).isSymbolicLink()
}

function node_modules (version) {
  return `${NVM_DIR}/versions/node/v${version}/lib/node_modules`
}

function packages (node_modules) {
  const dirs = fs.readdirSync(node_modules)

  return flatten([
    flatten(
      dirs
        .filter((dir) => dir.indexOf('@') === 0)
        .map((namespace) => {
          return fs.readdirSync(join(node_modules, namespace))
            .filter((dir) => !isLink(join(node_modules, namespace, dir)))
            .map((dir) => `${namespace}/${dir}`)
        })
    ),
    dirs
      .filter((dir) => dir.indexOf('@') !== 0)
      .filter((dir) => !isLink(join(node_modules, dir))),
  ])
}

function install (packages) {
  console.log([
    '',
    chalk.bgBlue('These packages will be installed by npm:'),
    chalk.gray(packages.join(', ')),
    '',
  ].join('\n'))

  const child = execa('npm', ['install', '--global', ...packages])
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  return child
}

main()
