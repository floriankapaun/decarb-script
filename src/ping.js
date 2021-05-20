/**
 * Eco Web Client Script
 * 
 * @author Florian Kapaun <hello@florian-kapaun.de>
 */

// OPTIMIZE: Add session duration recording

const API_URL = 'https://ew-stage.kapaun.uber.space/api/v1/pageviews';
const KEY = '_EcoWeb';

/**
 * This function has to be fired on pageload, popState, replaceState and pushState
 */
const recordPageView = () => {
    const data = {
        // Page URL
        p: window.location.href,
        // Window width
        w: window.screen.width,
        // Window height
        h: window.screen.height,
        // Effective connection Type
        c: window.navigator.connection?.effectiveType,
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

// Function to create custom events
// Needed to listen for pushState and replaceState
// Reference: https://stackoverflow.com/a/25673911
// Reference: https://stackoverflow.com/a/4585031
const createCustomEvent = (name) => {
    const origin = window.history[name];
    return function()  {
        const r = origin.apply(this, arguments);
        // Create Event
        let e;
        // Cross Browser Support
        e = new Event(name);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return r;
    };
};

// Create pushState and replaceState Events on window.history
window.history.pushState = createCustomEvent('pushState');
window.history.replaceState = createCustomEvent('replaceState');

// Record pushState Events
window.addEventListener('pushState', recordPageView);

// Record replaceState Events
window.addEventListener('replaceState', recordPageView);

// Record popstate Events
window.onpopstate = () => recordPageView();

// Record initial pageView
recordPageView();

// window.history[ps] = _pushState(ps)

// window['addEventListener'](ps, () => {
//     pageview()
// })
// window['addEventListener']('popstate', () => {
//     pageview()
// })
