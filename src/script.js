// TODO: Add hasCache();
// OPTIMIZE: Add sessionDuration();
// TODO: How are those requests authenticated? Check Google Analytics
// OPTIMIZE: Some used properties have really bad browser support, some less bad (fetch). They should get compiled to higher suppor.
// The optional chaining operator '?.' isn't working on older browsers as well

const API_URL = 'http://localhost:4000/api/v1/pageviews';

/**
 * This function has to be fired on pageload, popState, replaceState and pushState
 */
const pageView = async () => {
    const data = {
        p: window.location.href,
        w: window.screen.width,
        
        c: window.navigator.connection?.effectiveType,
    };
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        // Only needed for debugging – not in production
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
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

// Track pushState Events
window.addEventListener('pushState', pageView);

// Track replaceState Events
window.addEventListener('replaceState', pageView);

// Track popstate Events
window.onpopstate = () => pageView();

// Track initial pageView
pageView();

// window.history[ps] = _pushState(ps)

// window['addEventListener'](ps, () => {
//     pageview()
// })
// window['addEventListener']('popstate', () => {
//     pageview()
// })
