const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withMonitoringTool(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    manifest["meta-data"] = manifest["meta-data"] || [];

    const alreadyExists = manifest["meta-data"].some(
      (item) => item.$?.["android:name"] === "isMonitoringTool"
    );

    if (!alreadyExists) {
      manifest["meta-data"].push({
        $: {
          "android:name": "isMonitoringTool",
          "android:value": "enterprise_management",
        },
      });
    }

    return config;
  });
};