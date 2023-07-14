import { name } from './package.json'

module.exports = {
  apps: [
    {
      name,
      script: "npm",
      args: "run start"
    }
  ]
}
