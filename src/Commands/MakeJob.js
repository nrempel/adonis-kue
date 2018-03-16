'user strict'

const { Command } = require('@adonisjs/ace')
const { join, basename } = require('path')
const _ = require('lodash')
const boxen = require('boxen')

class MakeJob extends Command {
  static get signature () {
    return `make:job { name: Name of Job (Queue) }`
  }

  static get description () {
    return 'Make a new Job (Queue)'
  }

  async handle ({ name }) {
    try {
      name = _.upperFirst(_.camelCase(name))
      const templatePath = join(__dirname, '../../templates/Job.mustache')
      const templateContent = await this.readFile(templatePath, 'utf-8')
      const filePath = join('app/Jobs', name) + '.js'

      await this.generateFile(filePath, templateContent, { name })

      const namespace = this.getNamespace(filePath)
      console.log(`${this.icon('success')} ${this.chalk.green('create')}  ${filePath}`)

      this.printInstructions(namespace)
    } catch ({ message }) {
      this.error(message)
    }
  }

  /**
   * Returns namespace for a given resource
   */
  getNamespace (filePath) {
    return `App/Jobs/${basename(filePath).replace('.js', '')}`
  }

  /**
   * Print instructions to the console
   */
  printInstructions (namespace) {
    const lines = [
      'Register job/queue as follows',
      '',
      `1. Open ${this.chalk.cyan('start/app.js')}`,
      `2. Add ${this.chalk.cyan(namespace)} to jobs array`
    ]

    console.log(boxen(lines.join('\n'), {
      dimBorder: true,
      align: 'left',
      padding: {
        left: 8,
        right: 8
      },
      borderColor: 'yellow'
    }))
  }
}

module.exports = MakeJob
