const { exec } = require("child_process");


const main = () => {
    exec("cd ../infrastructure/client/ && terraform output -json", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        const output = JSON.parse(stdout);

        // Write bucket name to package.json file
        const fs = require("fs");
        const packageJson = JSON.parse(fs.readFileSync("package.json"));
        packageJson.scripts["deploy"] = `aws s3 sync build s3://${output.bucket_name.value}`;
        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
    });
}
main();