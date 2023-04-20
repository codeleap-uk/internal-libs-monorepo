
module.exports = {
   
  "source": ["package.json", "packages/*/package.json","apps/*/package.json"],
  "versionGroups": [
    {
      "label": "React",
      "dependencies": ["react", "react-dom"],
      packages: ["**"],
      pinVersion: "18.1.0"
    },
    {
      "label": "Typescript",
      "dependencies": ["typescript"],
      packages: ["**"],
      pinVersion: "4.5.4"
    },
    {
      "label": "React native",
      "dependencies": ["react-native"],
      packages: ["**"],
      pinVersion: "0.70.6"

    },
    {
      dependencies: ["@types/react"],
      packages: ["**"],
      pinVersion: "18.0.35"
    },
    {
      dependencies: ["@types/react-native"],
      packages: ["**"],
      pinVersion: "0.70.13"
    },
    {
      dependencies: ["@types/react-dom"],
      packages: ["**"],
      pinVersion: "18.0.11"
    },
  ]
}

