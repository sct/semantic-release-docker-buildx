const execa = require("execa");

module.exports = async (pluginConfig, { nextRelease: { version }, logger }) => {
  logger.log(`Building and pushing docker image for: ${version}`);

  const buildArgs = [];
  if (pluginConfig.buildArgs) {
    Object.keys(pluginConfig.buildArgs).forEach((buildArgKey) => {
      buildArgs.push(
        "--build-arg",
        `${buildArgKey}=${pluginConfig.buildArgs[buildArgKey]}`
      );
    });
  }

  let platforms = "linux/amd64";

  if (pluginConfig.platforms) {
    platforms = pluginConfig.platforms.join(",");
  }

  let dockerfile = "Dockerfile";

  if (pluginConfig.dockerfile) {
    dockerfile = pluginConfig.dockerfile;
  }

  let context = ".";

  if (pluginConfig.context) {
    context = pluginConfig.context;
  }

  let tags = ["latest", version];

  if (pluginConfig.tags) {
    tags = pluginConfig.tags;
  }

  const imageNames = [];

  pluginConfig.imageNames.forEach((imageName) => {
    const combinedNames = tags.map((tag) => `${imageName}:${tag}`);

    imageNames.push(...combinedNames);
  });

  const finalTags = [];

  imageNames.forEach((imageName) => {
    finalTags.push("--tag", imageName);
  });

  // docker buildx build -t sctx/overseerr --load --build-arg COMMIT_TAG=$GITHUB_SHA --platform linux/amd64,linux/arm64,linux/arm/v7 -f Dockerfile .
  // Build and push latest verion + tagged version
  await execa(
    "docker",
    [
      "buildx",
      "build",
      "--push",
      ...finalTags,
      ...buildArgs,
      "--platform",
      platforms,
      "-f",
      dockerfile,
      context,
    ],
    { stdio: "inherit" }
  );
};
