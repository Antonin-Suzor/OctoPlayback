export type Track = {
    name: string
    filepathTwins: string[]
    nameTwins: string[]
    loopStart: number
    loopEnd: number
}

export type Playlist = {
    name: string
    trackNameList: string[]
}

export type Grid = {
    name: string
    playlistNameMatrix: string[][]
}

export type Map = {
    startX: number
    startY: number
    gridNameMatrix: string[][]
}

export type Config = {
    version: number
    maxTwinCount: number
    map: Map
    grids: Grid[]
    playlists: Playlist[]
    tracks: Track[]
}
