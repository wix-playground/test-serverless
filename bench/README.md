# Benchmarking

This folder contains all needed for benchmarking different tools on serverless scopes.

## Plotters

I'm using the tool called [hyperfine](https://github.com/sharkdp/hyperfine) for benchmarking.
It has a possibility to export data to JSON format with all the raw data.

NOTE: _JSON files with the data will be placed under the folder of the scope, because it contains the data that is true only for the specific scope you were benchmarking._

If you want to analyze the data visually, you can use [plotters](./plotters) for this, e.g.

```shell
./bench/plotters/plot_whisker.py ./serverless/typescript-scope/cold_cache_without_node_modules.json
```

It will give you a popup window, where you can configure the plot and export it to the image.

## Scripts

### bench_npm_install.sh

Measures how long it takes to run `npm install` with different `npm` clients, like `npm`, `yarn`, etc.
Also, it measures different flags for those clients and how they reflect overall performance of the clients.

It expects one argument to be provided - path to the serverless scope you want to benchmark:

```shell
./bench/bench_npm_install.sh ./serverless/typescript-scope
```
