export type Artist = {
    id: number,
    username: string,
    picture: string,
    description?: string,
    prestations?: ArtistPrestation[]
    postPictures?: ArtistPostPicture[]
}

export type ArtistPrestation = {
    name: string
    kind: string
    picture: string
}

export type ArtistPostPicture = {
    picture: string
}
