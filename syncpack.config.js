
module.exports = {

  "source": ["package.json", "packages/*/package.json", "apps/*/package.json"],
  "versionGroups": [
    {
      "label": "React",
      "dependencies": ["react-dom"],
      packages: ["**"],
      pinVersion: "18.2.0"
    },
    {
      "label": "React",
      "dependencies": ["react"],
      packages: ["**"],
      pinVersion: "18.1.0"
    },
    {
      "label": "Typescript",
      "dependencies": ["typescript"],
      packages: ["**"],
      pinVersion: "5.0.4"
    },
    {
      "label": "React native",
      "dependencies": ["react-native"],
      packages: ["**"],
      pinVersion: "0.76.1"

    },
    {
      dependencies: ["@types/react"],
      packages: ["**"],
      pinVersion: "18.0.35"
    },

    {
      dependencies: ["@types/react-dom"],
      packages: ["**"],
      pinVersion: "18.0.11"
    },
  ]
}

