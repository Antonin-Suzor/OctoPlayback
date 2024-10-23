import type {Config, Grid} from "./octoTypes";

export function getGridFromXY(config: Config, x: number, y: number): Grid {
    return getGridFromName(config, config.map.gridNameMatrix[x][y])
}
export function getGridFromName(config: Config, name: string): Grid {
    return config.grids.find((grid) => grid.name === name) as Grid;
}
