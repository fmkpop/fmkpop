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