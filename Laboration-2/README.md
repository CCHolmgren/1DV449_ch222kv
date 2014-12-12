Laboration 2
============

Security
--------
1. SQL Injections
	Changed to prepared statements in the post.php file. As such, no SQL injections can slip through there.
2. Has code that doesn't work, catching PDOEceptions for example, this will allow faulty things to slip through since PHP runs till it segfaults.
	Changed to catching the exceptions the way it should be, no error messages printed to the used and such.
3. XSS. The use of unescaped username and message means that an XSS is as easy as just printing the script tag in the message or the username. 
	Avoided by using htmlspecialchars.
4. Session.cookie_lifetime should be set to 0, and the sec_session_start is bad. If the session lifetime is not set to the session time then the cookie allows someone else to use the persons account since it doesn't get removed.
	Set them to better defaults. We do not want to save the cookie for more than the session length since that would mean that someone can come and steal it easily.
5. Uses the username to validate that the user is correct and not the password, and as such allows you to login with just a username.
	Changed to use the password and username and check it against the database.
6. You shouldn't really use sha512 for passwords, bcrypt or similar algorithms is way better. Uswe password_hash instead of hash("sha512") and hash passwords.
	Uses password_has and password_verify.
7. It uses addition instead of string concatenation, which means that just "123456" is hashed every time. This makes it so you can always login with any username.
	Changed to correct salting, but password_hash does the hashing, which means that this isn't used at all.
8. Uses session_end(), which isn't a function, to log the user out. Use session_destroy() and setcookie(session_name(), "", time() - 3600), to destroy and log out the user, or something equivalent.
	Defined the session_end function to do it correctly.
9. The passwords are stored as plaintext.
	Now they are hashed with password_hash.
10. No CSRF protection what so ever.
	Now mess.php does the csrf_token doing by setting a cookie and setting a hidden filed in the form.
11. Adding messages is as easy as doing a get to an url with the parameters name and message. The username is not verified in anyway and it should be a post since it posts data to be added to the db. Get is allowed to be cached, which means that sending the same message twice would maybe not get sent based on the browser.
	Changed it to a post instead of a get. THis breaks one of the requirements, but fuck it. You should never submit data in a get request that gets stored. Get requests are cacheable.


Speed
-----
These are the load speed optimizations. Everything isn't that documented, but generally they follow the High Performance Web Sites instructions. As such it removes requests first and then works it's way down. I also used YSlow and PageSpeed to look at the speed optimizations that can be made. The only thing that could be done would be to optimize the image that get's loaded, but that would a tiny change.
Go see that documentation to see what I have been doing. 
In general I have: moved the javascript to an external file, and minified it, moved the CSS to an external file and minified it, removed unused requests, placed the javascript and css in the correct place in the page and loading the bootstrap css with an async load, using CDN and caching and gzip.

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


Long polling
------------
The way the long polling is implemented is very simple. The client starts an ajax request with a long timeout and provides the last seen message id. The server checks the database and sees if there is any new messages with an id larger than the last seens message. If there is, return those, otherwise sleep for some time and check again. This goes on until there are new messages or the ajax times out.
WHen the ajax timesout, or gets new data, it begins a new request to see if there are new messages.

This implementation is really inefficient since it polls the databse a very large amount of times for each user that connects. It might work for 1 or 2 users, or maybe 10, but when there is 100 or 1000 or more users that connect the database will get flooded with polls. It should instead use a in-memory-cache such as redis or memcached. This is a lot cheaper and a lot faster which means that more users can connect and still get near instant updates. 