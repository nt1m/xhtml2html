fs = require("fs")
convert = require("xml-js")
util = require("util")
exec = require("child_process").exec

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
  xml += "\n"
  console.log(xml)
  if (process.argv.includes("--write-changes")) {
    newpath = path.replace(".xhtml", ".html")
    exec(`hg rename ${path} ${newpath}`, (err, out) => {
      simpleCallback(err, out)
      fs.writeFile(newpath, xml, simpleCallback)
    })
  }
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
    delete input.declaration
  }
}

function simpleCallback(err, out) {
  if (err) {
    console.log("error", err)
  } else {
    console.log("success")
  }
}
