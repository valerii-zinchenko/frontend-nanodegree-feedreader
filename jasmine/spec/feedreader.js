/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
	/* This is our first test suite - a test suite just contains
	 * a related set of tests. This suite is all about the RSS
	 * feeds definitions, the allFeeds variable in our application.
	 */
	describe('RSS Feeds', function() {
		/* This is our first test - it tests to make sure that the
		 * allFeeds variable has been defined and that it is not
		 * empty. Experiment with this before you get started on
		 * the rest of this project. What happens when you change
		 * allFeeds in app.js to be an empty array and refresh the
		 * page?
		 */
		it('are defined', function() {
			expect(allFeeds).toBeDefined();
			expect(allFeeds.length).not.toBe(0);
		});


		/* TODO: Write a test that loops through each feed
		 * in the allFeeds object and ensures it has a URL defined
		 * and that the URL is not empty.
		 */
		it('should have difined URLs', function() {
			allFeeds.forEach(function(feed) {
				expect(feed.url).toBeDefined();
				expect(typeof feed.url).toBe('string');
				expect(feed.url).not.toBe('');
			});
		});


		/* TODO: Write a test that loops through each feed
		 * in the allFeeds object and ensures it has a name defined
		 * and that the name is not empty.
		 */
		it('should have difined names', function() {
			allFeeds.forEach(function(feed) {
				expect(feed.name).toBeDefined();
				expect(typeof feed.name).toBe('string');
				expect(feed.name).not.toBe('');
			});
		});
	});


	/* TODO: Write a new test suite named "The menu" */
	describe('The menu', function() {
		var body = $(body);
		var menu = $('.slide-menu');
		var menuWidth = menu.width();

		/* TODO: Write a test that ensures the menu element is
		 * hidden by default. You'll have to analyze the HTML and
		 * the CSS to determine how we're performing the
		 * hiding/showing of the menu element.
		 */
		it('should be hidden initially', function(){
			expect(menu.position().left <= -menuWidth).toBeTruthy();
		});

		/* TODO: Write a test that ensures the menu changes
		 * visibility when the menu icon is clicked. This test
		 * should have two expectations: does the menu display when
		 * clicked and does it hide when clicked again.
		 */
		it('should be visible by clicking on the menu icon and hidden by the second click', function(done){
			var menuIcon = $('.menu-icon-link');

			// open menu
			menuIcon.click();
			// x * 1000 converts seconds into miliseconds
			// 1.5 factor is added to increase a bit a waiting time to be sure, that the animation will be finished
			var transitionDuration = parseFloat(menu.css('transition-duration')) * 1000 * 1.5;
			setTimeout(function() {
				expect(menu.position().left).toBe(0);

				// close menu
				menuIcon.click();
				// it is parsed second time because the duration can be different with a new class
				// x * 1000 converts seconds into miliseconds
				// 1.5 factor is added to increase a bit a waiting time to be sure, that the animation will be finished
				transitionDuration = parseFloat(menu.css('transition-duration')) * 1000 * 1.5;
				setTimeout(function() {
					expect(menu.position().left <= -menuWidth).toBeTruthy();

					done();
				}, transitionDuration);
			}, transitionDuration);
		});
	});

	/* TODO: Write a new test suite named "Initial Entries" */
	describe('Initial Entries', function() {
		/* TODO: Write a test that ensures when the loadFeed
		 * function is called and completes its work, there is at least
		 * a single .entry element within the .feed container.
		 * Remember, loadFeed() is asynchronous so this test will require
		 * the use of Jasmine's beforeEach and asynchronous done() function.
		 */

		var fakeRS = {
			feed: {
				entries: [{
					link: '',
					title: '',
					contentSnippet: ''
				}]
			}
		};

		beforeEach(function(done){
			// stub ajax call in order to not call real service
			var spy = spyOn($, 'ajax').and.stub();
			// spy the jQuery's append method
			spyOn($.prototype, 'append');

			loadFeed(0, done);

			// simulate successful AJAX response with a fake response
			spy.calls.mostRecent().args[0].success(fakeRS);
		});

		it('should add one entry into the feed container', function(done){
			// in the current implementation only the container of feeds calls 'append'
			expect($.prototype.append.calls.count()).toBeGreaterThan(0);

			done();
		});
	});

	/* TODO: Write a new test suite named "New Feed Selection" */
	describe('New Feed Selection', function() {
		/* TODO: Write a test that ensures when a new feed is loaded
		 * by the loadFeed function that the content actually changes.
		 * Remember, loadFeed() is asynchronous.
		 */

		var contentBefore;
		beforeEach(function(done){
			loadFeed(1, function(){
				contentBefore = $('.feed').html();

				done();
			});
		});

		it('should change the content', function(done) {
			loadFeed(0, function() {
				expect($('.feed').html()).not.toBe(contentBefore);

				done();
			});
		});

		it('should properly call "loadFeed" function', function(){
			spyOn(window, 'loadFeed').and.stub();

			$('a[data-id=1]').click();

			expect(loadFeed.calls.mostRecent().args[0]).toBe(1);
		});

		it('should hide menu if it was opened', function(done) {
			var menu = $('.slide-menu');
			var menuWidth = menu.width();
			var menuIcon = $('.menu-icon-link');

			// open menu
			menuIcon.click();
			var transitionDuration = parseFloat(menu.css('transition-duration')) * 1000 * 1.5;
			setTimeout(function() {
				expect(menu.position().left).toBe(0);

				// select other feed
				$('a[data-id=0]').click();
				transitionDuration = parseFloat(menu.css('transition-duration')) * 1000 * 1.5;
				setTimeout(function() {
					expect(menu.position().left <= -menuWidth).toBeTruthy();

					done();
				}, transitionDuration);
			}, transitionDuration);
		});

		it('should not throw any exceptions and should not do an AJAX request for an unexisting ID', function() {
			var spy = spyOn($, 'ajax').and.stub();

			expect(loadFeed.bind(null, 'some not existing ID')).not.toThrow();
			expect(spy.calls.count()).toBe(0);
		});
	});
}());
