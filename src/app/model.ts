export interface Girl {
  id: number,
  name: string,
  group: string
}

export interface GirlVote {
  id: number,
  name: string,
  group: string
  vote: string
}

export interface VoteData {
  f: number
  m: number
  k: number
  g: string
}

export interface Card {
  rows: number,
  cols: number,
  title: string,
  url: string
}

export interface RedditJson {
  data: {
    children: [
      {
        data: {
          url: string
        }
      }
    ]
  }

}
