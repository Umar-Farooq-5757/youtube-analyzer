# YouTube Analyzer

![Screenshot of project](/public/Capture2.PNG)

## What is it?
YouTube Analyzer is a webapp where you can paste the url of any YouTube video, channel or playlist and get insights about it.

## How to use?
1. Copy the URL of a YouTube video, channel or playlist.
2. Paste it in the input box and click "Analyze".
3. Get the insights about it.

## Tech Stack:
- React (vite + tsx)
- TailwindCSS for styling
- react-icons for icons
- moment for calculating relative time

## Layout:

### 1. Video
  * Title
  * Statistics
    * Views
    * Likes
    * Comments
    * Duration
    * Published on
  * Watch time at different speeds
  * Embedded video from YouTube
  * Thumbmail
  * Description
  * Tags
### 2. Channel
  * Picture
  * Title
  * Description
  * Statictics
    * Subscribers
    * Total views
    * Total videos
    * Created on
    * Total playlists
    * Country
  * Listed playlists
### 3. Playlist
  * Total Videos
  * Published on
  * List of all videos
    * For Each video:
      1. Thumbnail
      2. Title
      3. Views
      4. Likes
      5. Position in playlist
      6. Published on
      7. Duration
    * Sort playlist in ascending or descending order by:
      1. Views
      2. Likes
      3. Duration
      4. Title
      5. Published at

## Inspiration:
There is no option on the YouTube playlists to view the sorted data in terms of views, likes, date published, etc. And I really wanted that, so I built it.