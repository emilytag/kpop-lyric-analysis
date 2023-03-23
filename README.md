An interactive visualization for lyrics across the four generations of kpop.

## Getting Started
To run the viz locally:
```bash
npm run dev
```

## Work So Far
- [x] Compile a list of Kpop groups across the four generations of the industry
  - [List of Girl Groups](https://en.wikipedia.org/wiki/List_of_South_Korean_girl_groups) and [List of Boy Groups](https://en.wikipedia.org/wiki/List_of_South_Korean_boy_bands) sourced from Wikipedia
- [x] Scrape charting tracks from Wikipedia, for example [Hyuna's Discography](https://en.wikipedia.org/wiki/Hyuna_discography#Singles)
- [x] Scrape lyrics from Genius, [final data here](https://github.com/emilytag/kpop-lyric-analysis/blob/main/data/all_songs.json)
- [x] Segment lyrics into English and Korean, ignoring words like `ayo` and `la la la` etc that are neither language
- [x] Calculate simple ratios to determine English to Korean usage per song
- [x] Create an interactive scatterplot to visualize the whole of the industry
![WIP Scatterplot](https://github.com/emilytag/kpop-lyric-analysis/blob/main/screenshots/Scatterplot%20WIP.png)
- [x] Clickthrough scatterplot entries to view artist information. This modal includes a scatterplot of that artist's songs, and the lyrics of the song that was clicked
![WIP Artist Spotlight](https://github.com/emilytag/kpop-lyric-analysis/blob/main/screenshots/Clickthrough%20WIP.png)

## To Dos
- [ ] Show highlights for English and non-English phrases in the lyrics when clicking on other songs in the artist spotlight
- [ ] Determine structural phrasing profiles for English and non-English and detail some of those on the main page
- [ ] Run stats to highlight highest correlations over time
- [ ] More longform writeup on the main page explaining the project and the findings, potentially in a scrollytelling format
- [ ] Site hosting probably through Vercel
- [ ] Make overall design more aesthetic
