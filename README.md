# gitlab-mr-cli
Small personal project to automate my gitlab workflow using [deno](https://deno.land/) and [cliffy](https://github.com/c4spar/deno-cliffy).


## Installation

Use [deno](https://deno.land/) to install gitlab-mr-cli. Make sure that `$HOME/.deno` is in your PATH.

```bash
deno install --name glmr --allow-run --allow-env --allow-net --allow-read --no-check https://raw.githubusercontent.com/1DIce/gitlab-cli/main/main.ts
```

## Usage

Run the `--help` command to explore the available actions.
```bash
glmr --help
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
