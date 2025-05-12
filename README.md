# Release Helper

This is a simple script to help with the release process of a project. It will create a new release branch, update the version number in the project files, and create a release of GitHub.

## Installation

This script is intended to be used as a devDependency in a Node.js project.

### Requirements

You will need the following installed on your system to use this script:

- [Node.js](https://nodejs.org/en/) is required to run this script.
- [Git](https://git-scm.com/) is required to create a release branch.
- [GitHub CLI](https://cli.github.com/) is required to create a pull request.

### Install

Install the package

```bash
npm install -D @masatomakino/release-helper
```

and initialize labels and release note template on GitHub.

```
npx @masatomakino/release-helper init
```

add the following to your `package.json`

```json
    "preversion": "npx @masatomakino/release-helper preversion",
    "postversion": "npx @masatomakino/release-helper postversion",
    "release": "npx @masatomakino/release-helper release",
```

## Usage

`npm version <patch|minor|major>` will create a new release branch, update the version number in the project files, and create a pull request of GitHub. If you enable auto merge and status check, `release` command will execute automatically.

`npm run release` will push a tag, and create druft release of GitHub.

## Commands

```console
Usage: CLI [options] [command]

Options:
  -h, --help             display help for command

Commands:
  preversion [options]                 checkout to default branch and pull latest changes, and run test
  postversion [options]                create a pull request on GitHub
  release [options]                    push version tag and create a release on GitHub
  preview                              get release note from GitHub release
  init [options]                       initialize release label and release note template
  generate-release-template [options]  generate release note template to .github directory
  help [command]                       display help for command
```

## License

[MIT licensed](LICENSE).
