# Hilkiah

> Then Hilkiah answered and said to Shaphan the scribe, “I have found the Book of the Law in the house of the Lord.”
>
> _2 Chronicles 34:15_

Extracts scripture references in various forms from blobs of arbitrary text.

Thanks to [Harry Plantinga](http://www.calvin.edu/~hplantin/) for giving me an xml file created for [CCEL](http://www.ccel.org/) containing lots of useful data which I converted into `src/books.json` for this project.

### todo
 * [ ] - organize tests
 * [ ] - add flow
 * [ ] - `find()` should handle verses from single-chapter books (eg: `Foobar (Jude 14).`);
 * [ ] - `format()` should handle verses from single-chapter books
 * [ ] - `format()` is super opinionated for our usage, generalize/refactor
 * [ ] - `"short"` book names should be extracted to a different config
 * [ ] - handle refs that span chapters `John x. 14, and xvi. 13`, `Mark xiii. 37;—xiv. 38`
 * [ ] - detect weird ranges `Romans 3:8-3`
 * [ ] - detect invalid chapter `Romans 22:14`
 * [ ] - detect invalid verse `Romans 8:72`
 * [ ] - detect invalid verse/s in range `Romans 6:4-88`
 * [ ] - handle verses in roman numerals `(Titus ii. II, 12.)`, `(Psalm xl. i;)`
