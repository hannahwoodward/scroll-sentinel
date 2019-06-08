# ScrollSentinel
- Animation frame based scrolling event handler
- Push elements & callbacks to run on container scroll (defaults as window)
- < 1KB minified

### Settings

All settings are optional, defaults are listed below:

```
new ScrollSentinel( {
  container: window,  // the container to monitor the scroll position of
  items: [],    // an array of ScrollSentinel items - see below
  forceRun: false
} );
```

NB: Item callbacks are only run on vertical scroll change by default. `forceRun` will be automatically set to true if any un-throttled items are added.

### Items

When triggered, ScrollSentinel loops through its items and runs the function fx which takes the element as the argument. An item can be pushed to the ScrollSentinel instance either at creation or by using the add() method:
```
const item = {
  element: SOME_EL,   // REQUIRED could be a DOM node, array, object, etc,
  fx: ( el ) => {},  // REQUIRED the callback to run on the element
  dyThrottle: true   // DEFAULT: true - set to false if you would like the callback to be run on every frame
};
const sm = new ScrollSentinel({
  items: [ item ]
});

// Equivalently, you can add a single item:
const sm = new ScrollSentinel();
sm.add( item );
```

### Example

```
import ScrollSentinel from 'path/to/scroll-sentinel.js';

const sm = new ScrollSentinel();
const uncloak = new Uncloak();
const some_node = document.querySelector( '.some-node' );

sm.add( {
  element: uncloak,
  fx: ( obj ) => {
    obj.processItems(); // uncloak function
  },
  dyThrottle: false // run on every frame
} );

// The below function will still only run on DY change as dyThrottle is set per item (and defaults to true)
sm.add( {
  element: some_node,
  fx: ( node ) => {
    console.log( 'DY changed' );
  }
} );
```
