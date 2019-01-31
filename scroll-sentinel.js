export default class ScrollSentinel {
	constructor( options ) {
		const defaults = {
			container: window,
			items: [],
			forceRun: false
		};
		if ( options ) {
			for ( const key in defaults ) {
				this[key] = options[key] || defaults[key];
			}
		}

		// initial load
		this.init();
	}

	init() {
		let is_ready = true;
		const runItemCallbacks = ( dy_changed = true ) => {
			for ( let i = 0; i < this.items.length; i++ ) {
				const item = this.items[i];
				if ( dy_changed || item.dxReliant ) {
					item.fx( item.element );
				}
			}
			return true;
		};

		const fps = 60;
		const _this = this;
		let y0 = getScrollY();
		let t0 = getTime();

		requestAnimationFrame( update );
		if ( this.container === window ) {
			window.addEventListener( 'resize', runItemCallbacks );
		}

		function update() {
			requestAnimationFrame( update );
			const t1 = getTime();
			if ( !is_ready || ( t1 - t0 ) < fps ) {
				return;
			}

			const y1 = getScrollY();
			const y_changed = ( y1 !== y0 );
			// return early if no elements have DY throttling disabled
			if ( !y_changed && !_this.forceRun ) {
				return;
			}
			is_ready = false;

			y0 = y1;
			t0 = t1;
			is_ready = runItemCallbacks( y_changed );
		}
		function getScrollY() {
			if ( _this.container === window ) {
				return ( window.scrollY || document.documentElement.scrollTop );
			}
			return _this.container.scrollTop;
		}
		function getTime() {
			return performance.now();
		}
	}

	add( item ) {
		// FORMAT: { element: el, dyThrottle: false, fx: () => {} }
		if ( !item.element || !item.fx ) {
			return;
		}
		item.dyThrottle = item.dyThrottle || true;
		this.items.push( item );
		if ( !item.dyThrottle ) {
			this.forceRun = true;
		}
	}

	clearItems() {
		this.items = [];
	}

	// stop() {
	// 	this.clearItems();
	// 	cancelAnimationFrame( update );
	// 	if ( this.container === window ) {
	// 		window.removeEventListener( 'resize', runItemCallbacks );
	// 	}
	// }
}
