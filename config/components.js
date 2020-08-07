exports.components = function () {
  const fs = require('fs')
  const path = require('path')

  const components = path.resolve(__dirname, '../src/components')

  let result = {}

  fs.readdirSync(components).forEach(component => {
    const item = {
      [component]: [
        `${components}/${component}/${component}.ts`,
        `${components}/${component}/${component}.scss`
      ]
    }

    Object.assign(result, item)
  })

  return result
}
