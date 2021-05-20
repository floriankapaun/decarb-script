/**
 * Eco Web Client Script
 * 
 * @author Florian Kapaun <hello@florian-kapaun.de>
 */

// OPTIMIZE: Add session duration recording

// Config values
const API_URL = 'https://ew-stage.kapaun.uber.space/api/v1/pageviews';
const KEY = '_EcoWeb';

// Minimal Versions of often used Variables
const w = window;
const h = w.history;
const a = w.addEventListener;
const ps = 'pushState';
const rs = 'replaceState';


/**
 * Sends data about current pageView to given API_URL and sets a localStorage item
 * to identify repeated views.
 * 
 * Has to be fired on pageload, popState, replaceState and pushState
 */
const recordPageView = () => {
    const data = {
        // Page URL
        p: w.location.href,
        // Window width
        w: w.screen.width,
        // Window height
        h: w.screen.height,
        // Effective connection Type
        c: w.navigator.connection?.effectiveType,
        // First-Time visit?
        f: !(localStorage[KEY])
    };
    // Send the Data to the API
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    // Store something in localStorage to identify repeated views
    localStorage[KEY] = true
};


/**
 * Create Custom Events
 * Utilized to listen for 'pushState' and 'replaceState'
 * 
 * Reference: https://stackoverflow.com/a/25673911
 * Reference: https://stackoverflow.com/a/4585031
 * 
 * @param {String} name - Event Name
 * @returns {Function}
 */
const createCustomEvent = (name) => {
    const origin = h[name];
    return function()  {
        const r = origin.apply(this, arguments);
        // Create Event
        let e;
        e = new Event(name);
        e.arguments = arguments;
        w.dispatchEvent(e);
        return r;
    };
};

// Add 'pushState' and 'replaceState' Events to window.history
h[ps] = createCustomEvent(ps);
h[rs] = createCustomEvent(rs);

// Setup EventListeners to record 'pushState' and 'replaceState' Events
a(ps, recordPageView);
a(rs, recordPageView);

// Record popstate Events
w.onpopstate = () => recordPageView();

// Record initial pageView
recordPageView();
