export interface Feedback {
    id: number,
    rating: number,
    comment: string,
    prestation: {
        name: string
    },
    submittedBy: {
        username: string
    }
    createdAt: string
}

export interface UpdateFeedback {
    rating: number,
    comment: string
}
