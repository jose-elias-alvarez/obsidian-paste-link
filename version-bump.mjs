import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import prettier from "prettier";

const targetVersion = process.env.npm_package_version;

(async () => {
    const prettierConfig = await prettier.resolveConfig();

    // read minAppVersion from manifest.json and bump version to target version
    const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
    const { minAppVersion } = manifest;
    manifest.version = targetVersion;
    writeFileSync(
        "manifest.json",
        await prettier.format(JSON.stringify(manifest), {
            parser: "json",
            ...prettierConfig,
        }),
    );

    // update versions.json with target version and minAppVersion from manifest.json
    const versions = JSON.parse(readFileSync("versions.json", "utf8"));
    versions[targetVersion] = minAppVersion;
    writeFileSync(
        "versions.json",
        await prettier.format(JSON.stringify(versions), {
            parser: "json",
            ...prettierConfig,
        }),
    );

    execSync("npm install && npm run build");
    const hasChanges = execSync("git status --porcelain").toString().length > 0;
    if (!hasChanges) {
        throw new Error("no changes");
    }
    execSync(
        `git add package.json package-lock.json manifest.json versions.json && git commit -m 'chore: ${targetVersion}'`,
    );
    execSync(`git tag -a ${targetVersion} -m ${targetVersion}`);
})();
