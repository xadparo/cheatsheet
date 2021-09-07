import * as fs from 'fs/promises'

type TemplateGenerateOption = {
  source: string
  destination: string
  /** get replace key expression or string */
  search?(key: string): string | RegExp
  /** { [replace key]: replace value }*/
  data: Record<string, string>
}

/**
 * 1. Source template read
 * 1. Resolved template string
 * 1. Write to destination path
 * @param {TemplateGenerateOption} option
 */
export async function TemplateGenerate(option: TemplateGenerateOption) {
  const {
    source,
    destination,
    search = (key) => new RegExp(`\\\$\\\{${key}\\\}`, 'gm'),
    data,
  } = option

  const template = await fs.readFile(source, {
    encoding: 'utf8',
    flag: 'r',
  })

  const templateResolved = Object.keys(data).reduce((template, key) => {
    return template.replace(search(key), data[key])
  }, template)

  await fs.writeFile(destination, templateResolved, {
    encoding: 'utf8',
    flag: 'w',
  })
}
