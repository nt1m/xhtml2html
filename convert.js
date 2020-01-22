fs = require("fs")
convert = require("xml-js")
util = require("util")

path = process.argv[2]

if (!path) {
  return "Specify a path"
}

fs.readFile(path, (err, data) => {
  if (err) {
    return console.error(err)
  }
  result = convert.xml2js(data)
  stripXmlns(result)
  stripXmlDeclaration(result)
  xml = convert.js2xml(result, {
    spaces: 2,
    fullTagEmptyElement: true,
  })
  console.log(xml)
})

function stripXmlns(input) {
  for (element of input.elements) {
    if (element.name == "html") {
      if (element.attributes.xmlns) {
        delete element.attributes.xmlns
      }
    }
  }
}

function stripXmlDeclaration(input) {
  if (input.declaration) {
    delete input.declaration;
  }
}
