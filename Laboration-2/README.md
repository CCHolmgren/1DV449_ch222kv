These are the speed optimizations. Everything isn't that documented, but generally they follow the High Performance Web Sites instructions. As such it removes requests first and then works it's way down. I also used YSlow and PageSpeed to look at the speed optimizations that can be made. The only thing that could be done would be to optimize the image that get's loaded, but that would a tiny change.

| Changes | Requests        | Transfered           | Loadtime  | Observations |
| ------- | --------------- |----------------------| --------- | ------------ |
|Baseline | 11              | 714kb                |   0.974   |The messages does not load|
|Removed unused requests| 9 | 650kb      | 0.887 ||
|More removal | 6 | 612kb      | 0.775 |Scripts.js takes 0.938 seconds to load off cache. Minify maybe?|
|Some minifing| 7| 343kb | 0.651 ||
|Moved scripts to the end of the page| 6| 612kb | 0.654 |Loads the content faster because the scripts are added to the end of the html |
|Minified| 6| 296kb | 0.476 ||
|CDN| 8| 122kb | 0.483 ||
|GZip enabled| 8| 122kb | 0.304 ||
|Changed to google CDN for the jQuery| 7| 116kb | 0.416 |Way better times now with google cdn instead of maxcdn for the jquery.min.js file|
|Using some hints from google page speed| 8| 113kb | 0.457 |Longer loading time but the site seems more responsive because the bootstrap css file is loaded asynchronusly which means that it doesn't block the load time.|
