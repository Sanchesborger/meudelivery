import nextConfig from "eslint-config-next";

const eslintConfig = {
  extends: ["next/core-web-vitals", "next/typescript"],
  ignorePatterns: [
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ],
};

export default eslintConfig;
