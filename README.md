
# Neon Bunny Snowflake Theme

## Description

Creates a userscript and style sheets to add a theme to [Snowflake.com](https://www.snowflake.com/) console pages (Chrome supported currently). It's not perfect, but it's at least a dark theme.

There are two ways to use this theme.
### Browser Extension that injects styles
You can use a browser extension like [Stylebot](https://chrome.google.com/webstore/detail/stylebot/oiaejidbmkiecgbjeifoejpgmdaleoha?hl=en-US) or [User CSS](https://chrome.google.com/webstore/detail/user-css/okpjlejfhacmgjkmknjhadmkdbcldfcb?hl=en) to add the styles from the file `dist/neon-bunny-snowflake-theme.css`.

### Userscript
You can use the userscript file using an extension like [TamperMonkey](https://www.tampermonkey.net/) to install the script from `dist/neon-bunny-snowflake-theme.user.js`.

## Instructions

1. Clone repository `git clone git@github.com:webdevnerdstuff/neon-bunny-snowflake-theme.git`
2. Change into the cloned repository directory `cd neon-bunny-snowflake-theme`
3. Install node packages `npm i`
4. If you want to adjust the styles to your own preference, update the CSS variables in the `src/scss/styles.scss` file
5. Run grunt `grunt`
6. Save the `src/js/neon-bunny-snowflake-theme.js` or `src/scss/styles.scss` file to compile the theme
7. Install the userscript or user the the compiled styles from `dist/neon-bunny-snowflake-theme.css` to add to your browser extension styles

## Dependencies

[Grunt](https://gruntjs.com/)  


## License

Copyright (c) 2022 WebDevNerdStuff  
Licensed under the MIT license.

[LICENSE](https://github.com/webdevnerdstuff/neon-bunny-snowflake-theme/blob/master/LICENSE.md)

[![@WebDevNerdStuff](https://img.shields.io/badge/github-webdevnerdstuff-brightgreen.svg)](https://github.com/webdevnerdstuff)
