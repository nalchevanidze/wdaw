const projects = [
  {
    testEnvironment: "node",
    preset: "ts-jest/presets/js-with-ts",
    coveragePathIgnorePatterns: ["/node_modules/"],
    displayName: "unit",
    testMatch: ["<rootDir>/**/src/**/__tests__/*.ts"],
  },
];

module.exports = { projects };

