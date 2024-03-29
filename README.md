# click

[![MIT license][license-badge]][license-url]
[![Maintenance status][status-badge]][status-url]
[![Code coverage][coverage-badge]][coverage-url]

[![Chrome Web Store version][store-version-badge]][store-version-url]
[![Chrome Web Store rating][store-rating-badge]][store-rating-url]
[![Chrome Web Store rating][store-stars-badge]][store-stars-url]
[![Chrome Web Store users count][store-users-badge]][store-users-url]

## About

**click** is Google Chrome extension for clicking on anything without clicking!

You can take a look at [list of questions and problems](./QA.md) that I faced during development.

## Motivation

Unfortunately sometimes UX is not brilliant and it's not possible to improve it because it's just some external website. But let's try to improve it a bit via clicking (semi)automation  if we are speaking only about weird and hard to reach UI elements. Only one particular case. But it's relatively frequent and generic.

## Requirements

Developed and tested on `Version 109.0.5414.119 (Official Build) (64-bit)`

## Installation

**Chrome Web Store**

Just go [here][store-version-url] and click "Add to Chrome"

**From sources**

1. Clone repo `git clone https://github.com/vikian050194/click.git`
2. Create and activate Python virtual environment
3. Install dependencies `pip install -r requirements.txt` and run `python mdConverter.py`
4. Open Chrome and navigate [here](chrome://extensions/)
5. Enable `Developer mode` via toggle
6. `Load unpacked` and select `src` directory of the cloned repo

## Usage

1. Activate extension
2. Select required target selector
3. Press `Enter` to perform click

### Configuration

Extension has few options.

You can [setup your own shortcut for activation](chrome://extensions/shortcuts), but default one is `Alt+C` or `Command+C`.

**Execution**

| Name | Description |
| :--- | :--- |
| Automatic execution enabled | Automatic execution on extension activation: if there is only one matched automatic target, then it will be executed |
| Execution logging enabled | Log extension actions to active page Console |

**Appearance**

| Name | Description |
| :--- | :--- |
| Font size | Popup font size in pixels |
| Selected item color | Color of selected item in results list |
| Selected item font weight | Font weight of selected item in results list |
| Arrow pointer | Arrow appears in front of selected item |

**Autoclosing**

| Name | Description |
| :--- | :--- |
| Autoclose enabled | Is popup autoclose enabled |
| Autoclose time | Popup autoclose time in seconds |

**Changelog**

| Name | Description |
| :--- | :--- |
| Show on update | If enabled then changelog page will be shown automatically on extension version update |

## Tests

### Packages

- `mocha` is used for unit testing and `c8` for coverage
- `playwright` is used for e2e testing

### How to run

- `npm test` - run unit tests
- `npm run cover` - run code coverage
- `npm run test:ui` - run e2e tests

[warp-url]: https://github.com/vikian050194/warp
[track-url]: https://github.com/vikian050194/track

[status-url]: https://github.com/vikian050194/click/pulse
[status-badge]: https://img.shields.io/github/last-commit/vikian050194/click.svg

[license-url]: https://github.com/vikian050194/click/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/vikian050194/click.svg

[coverage-url]: https://codecov.io/gh/vikian050194/click
[coverage-badge]: https://img.shields.io/codecov/c/github/vikian050194/click

[store-version-url]: https://chrome.google.com/webstore/detail/click/kcodfghcjchlhlikckbcjohmaihbihdp
[store-version-badge]: https://img.shields.io/chrome-web-store/v/kcodfghcjchlhlikckbcjohmaihbihdp

[store-rating-url]: https://chrome.google.com/webstore/detail/click/kcodfghcjchlhlikckbcjohmaihbihdp
[store-rating-badge]: https://img.shields.io/chrome-web-store/rating/kcodfghcjchlhlikckbcjohmaihbihdp

[store-stars-url]: https://chrome.google.com/webstore/detail/click/kcodfghcjchlhlikckbcjohmaihbihdp
[store-stars-badge]: https://img.shields.io/chrome-web-store/stars/kcodfghcjchlhlikckbcjohmaihbihdp

[store-users-url]: https://chrome.google.com/webstore/detail/click/kcodfghcjchlhlikckbcjohmaihbihdp
[store-users-badge]: https://img.shields.io/chrome-web-store/users/kcodfghcjchlhlikckbcjohmaihbihdp
