#! /usr/bin/env -S deno run --allow-run --allow-env --allow-net --allow-read --no-check

import { replaceConfig } from "./src/config.ts";
import { ConfigFileReader } from "./src/config-file-reader.ts";
import { FileSystem } from "./src/file-system.ts";
import { Command } from "./dependencies/cliffy.deps.ts";
import {
  pushToMergeRequest,
  stdoutRemoteFileChangeUrl,
  stdoutTargetBranch,
} from "./src/gitlab.ts";
import { environment } from "./environment.ts";

const fs = new FileSystem();

function initializeConfig(): void {
  const configFile = new ConfigFileReader(fs).loadConfigFile();
  if (!configFile) {
    console.error("Error: No configuration file was found!");
    Deno.exit(1);
  }
  replaceConfig(configFile);
}

async function main() {
  await new Command()
    .name(environment.binaryName)
    .version(environment.version)
    .description("Command line interface for gitlab workflows")
    .env(
      "GITLAB_API_TOKEN=<value:string>",
      "Gitlab api token that is used to communicate with the API",
    )
    .option(
      "-f, --force",
      "Use force push",
      { global: true, default: false },
    )
    .command(
      "merge-request <command>",
      new Command<{ force: boolean }>()
        .description("Run commands on merge requests")
        .alias("mr")
        .command(
          "create",
        )
        .alias("c")
        .description(
          `Uploads new changes to merge request.
          A remote branch is created if it does not exist.
          A merge request is created if it does not exist.
          By default the merge request is marked as a draft,
          `,
        )
        .option(
          "-p, --publish",
          "The merge request is marked as ready",
          { default: false },
        )
        .action(
          (params) => {
            initializeConfig();
            pushToMergeRequest({ draft: !params.publish, force: params.force });
          },
        )
        .reset()
        .command(
          "file-change <file_path:string>",
        )
        .description(
          "Get url to change of the provided file in the open merge request",
        )
        .alias("fc")
        .action((_params, file_path) => {
          initializeConfig();
          stdoutRemoteFileChangeUrl(file_path);
        })
        .reset()
        .command(
          "branch",
        )
        .description(
          "Get merge request target branch if merge request for the current branch exists",
        )
        .action((_params) => {
          initializeConfig();
          stdoutTargetBranch();
        }),
    )
    .parse(Deno.args);
}

main();
