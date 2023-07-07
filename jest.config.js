const path = require("path");
const glob = require("glob");

const projects = glob
  .sync(path.join(__dirname, "./packages/*/jest.config.js"))
  .flatMap((configPath) => {
    const rootDir = path.dirname(configPath);
    const config = require(configPath);

    return (config.projects ?? [config]).map(({ displayName, ...rest }) => ({
      displayName: `${path.basename(rootDir)}-${displayName ?? "main"}`,
      rootDir,
      ...rest,
    }));
  });

module.exports = { projects };
