# Run

Only one step is required to run :)

1. Open `index.html` in your browser
 
## Additional tests

Few additional tests were added. They are not for some new feature, but do more better testing of an existing functionality

* Test proper calling of `loadFeeds` by clicking on some link element
* Test that slide menu should be hidden when it is open and user selects another feed source
* Test that `loadFeed` should not throw any excepxtions and do not do an AJAX request when this function is called with some unexisting ID (test was writted first, then fix was done - TDD :) )
