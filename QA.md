## List of questions and problems that I faced during development

1. **Open popup**

   Q: *Is it possible to open extension via shortcut?*

   A: No, it's not possible for now or I did not find right way.

2. **Approximation to real world testing**

   Q: *Is it possible to use extension with `chrome-extension://` protocol?*

   A: No, it's not possible for now or I did not find right way. Mocking is only one possible option.

3. **How to mock chrome object partially**

   Q: *Is it possible to mock `chrome` object partially?*

   A: Yes, it's possible. Use `page.addInitScript`.

4. **How to pass data from the page back to the test code?**

   Q: *Is it possible to pass data from the page back to the test code?*

   A: Yes, it's possible. Use store data in new `window` property, configure storing in `page.addInitScript` and fetch data via `page.evaluate`.
