export interface Girl {
  id: number,
  name: string,
  group: string
}

export interface Card {
  rows: number,
  cols: number,
  title: string,
  url: string
}

export interface RedditUrl {
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