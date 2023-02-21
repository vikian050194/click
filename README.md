# click

[![MIT license][license-badge]][license-url]
[![Maintenance status][status-badge]][status-url]
[![Code coverage][coverage-badge]][coverage-url]

<!-- [![Chrome Web Store version][store-version-badge]][store-version-url] -->
<!-- [![Chrome Web Store rating][store-rating-badge]][store-rating-url] -->
<!-- [![Chrome Web Store rating][store-stars-badge]][store-stars-url] -->
<!-- [![Chrome Web Store users count][store-users-badge]][store-users-url] -->

## About

**click** is Google Chrome extension for clicking on anything without clicking!

## Motivation

It's my third Chrome extension. And it would not be nice to mix responsibilities and add such functionality into [warp][warp-url] and [track][track-url].

## Requirements

Developed and tested on `Version 109.0.5414.119 (Official Build) (64-bit)`

## Installation

<!-- **Chrome Web Store** -->

<!-- Just go [here][store-version-url] and click "Add to Chrome" -->

**From sources**

1. Clone repo
2. Open Chrome and navigate [here](chrome://extensions/)
3. Enable `Developer mode` via toggle
4. `Load unpacked` and select `src` directory of the cloned repo
5. Reboot Chrome - probably is not required step

## Usage

1. Activate extension
2. Select required target selector
3. Press `Enter` to perform click

### Configuration

Extension has few options.

You can [setup your own shortcut for activation](chrome://extensions/shortcuts), but default one is `Alt+C` or `Command+C`.

**Popup autoclose**

| Name | Description |
| :--- | :--- |
| Autoclose enabled | Is popup autoclose enabled |
| Autoclose time | Popup autoclose time in seconds |

## Tests

`mocha` is used for unit testing and `c8` for coverage
`playwright` is used for e2e testing

`npm test` - run unit tests
`npm run cover` - run code coverage
`npm run test:ui` - run e2e tests

[warp-url]: https://github.com/vikian050194/warp
[track-url]: https://github.com/vikian050194/track

[status-url]: https://github.com/vikian050194/click/pulse
[status-badge]: https://img.shields.io/github/last-commit/vikian050194/click.svg

[license-url]: https://github.com/vikian050194/click/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/vikian050194/click.svg

[coverage-url]: https://codecov.io/gh/vikian050194/click
[coverage-badge]: https://img.shields.io/codecov/c/github/vikian050194/click

[store-version-url]: https://chrome.google.com/webstore/detail/click/
[store-version-badge]: https://img.shields.io/chrome-web-store/v/

[store-rating-url]: https://chrome.google.com/webstore/detail/click/
[store-rating-badge]: https://img.shields.io/chrome-web-store/rating/

[store-stars-url]: https://chrome.google.com/webstore/detail/click/
[store-stars-badge]: https://img.shields.io/chrome-web-store/stars/

[store-users-url]: https://chrome.google.com/webstore/detail/click/
[store-users-badge]: https://img.shields.io/chrome-web-store/users/
