/**
 * The InputSystem class handles keyboard and mouse input events for a given canvas element.
 * It provides methods to register callback functions for key and mouse events, and manages the state of keys and mouse buttons.
 */
export class InputSystem {

    /**
     * Mouse button constants.
     * @type {number}
     * @constant
     */
    static MOUSE_LEFT_BUTTON = 0;
    static MOUSE_MIDDLE_BUTTON = 1;
    static MOUSE_RIGHT_BUTTON = 2;
    static MOUSE_MACRO_BUTTON1 = 3;
    static MOUSE_MACRO_BUTTON2 = 4;

    /**
     * Creates an instance of InputSystem.
     * @param {HTMLCanvasElement} canvas - The canvas element to attach input event listeners to.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = {};
        this.lastTime = 0;
        this.mouse = {
            x: 0,
            y: 0,
            deltaX: 0,
            deltaY: 0,
            isDown: {},
            events: {
                up: [],
                down: [],
                move: [],
                wheel: []
            }
        };
        this.initEventListeners();
    }

    isKeyDown(keyCode) {
        return this.keys[keyCode] && this.keys[keyCode].isDown;
    }

    /**
     * Creates and initializes the InputSystem instance.
     * @param {HTMLCanvasElement} canvas - The canvas element to attach input event listeners to.
     * @returns {InputSystem} The initialized InputSystem instance.
     * @throws {Error} If the InputSystem is already initialized.
     */
    static create(canvas) {
        if (InputSystem.instance) {
            throw new Error('InputSystem already initialized');
        } else {
            InputSystem.instance = new InputSystem(canvas);
        }
        return InputSystem.instance;
    }

    /**
     * Gets the initialized InputSystem instance.
     * @returns {InputSystem} The initialized InputSystem instance.
     * @throws {Error} If the InputSystem is not initialized.
     */
    static get() {
        if (!InputSystem.instance) {
            throw new Error('InputSystem not initialized');
        }
        return InputSystem.instance;
    }

    /**
     * Initializes event listeners for keyboard and mouse events.
     * @private
     */
    initEventListeners() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
        this.canvas.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        this.canvas.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.canvas.addEventListener('wheel', (event) => this.handleMouseWheel(event));
    }

    /**
     * Handles the mouse wheel event.
     * 
     * @param {WheelEvent} event - The mouse wheel event object.
     */
    handleMouseWheel(event) {
        event.preventDefault();
        if (this.mouse.events.wheel) {
            this.mouse.events.wheel.forEach(element => {
                element(event.deltaY);
            });
        }
    }

    /**
     * Handles the mouse down event.
     * @param {MouseEvent} event - The mouse event.
     */
    handleMouseDown(event) {
        this.mouse.deltaX = event.movementX;
        this.mouse.deltaY = event.movementY;
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
        this.mouse.isDown[event.button] = true;
        if (this.mouse.events.down) {
            this.mouse.events.down.forEach(element => {
                element(this.mouse.x, this.mouse.y, this.mouse.isDown);
            });
        }
    }

    /**
     * Handles the mouse up event.
     * @param {MouseEvent} event - The mouse event.
     */
    handleMouseUp(event) {
        this.mouse.deltaX = event.movementX;
        this.mouse.deltaY = event.movementY;
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
        this.mouse.isDown[event.button] = false;
        if (this.mouse.events.up) {
            this.mouse.events.up.forEach(element => {
                element(this.mouse.x, this.mouse.y, this.mouse.isDown);
            });
        }
    }

    /**
     * Handles the mouse move event.
     * @param {MouseEvent} event - The mouse event.
     */
    handleMouseMove(event) {
        this.mouse.deltaX = event.movementX;
        this.mouse.deltaY = event.movementY;
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
        if (this.mouse.events.move) {
            this.mouse.events.move.forEach(element => {
                element(this.mouse.x, this.mouse.y);
            });
        }
    }

    /**
     * Handles the key down event.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    handleKeyDown(event) {
        if (this.keys[event.code] && !event.repeat) {
            this.keys[event.code].isDown = true;
            if (this.keys[event.code].down) {
                this.keys[event.code].down.forEach(element => {
                    event.preventDefault();
                    element(event.code);
                });
            }
        }
    }

    /**
     * Handles the key up event.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    handleKeyUp(event) {
        if (this.keys[event.code]) {
            this.keys[event.code].isDown = false;
            this.keys[event.code].isHold = false;
            if (this.keys[event.code].up) {
                this.keys[event.code].up.forEach(element => {
                    event.preventDefault();
                    element(event.code);
                });
            }
        }
    }

    /**
     * Registers a callback function to be executed when a mouse move event occurs.
     *
     * @param {(x: number, y: number)=>void} callback - The function to be called when the mouse is moved.
     */
    addMouseMoveBinding(callback) {
        this.mouse.events.move.push(callback);
    }

    /**
     * Registers a callback function to be executed when a mouse down event occurs.
     * 
     * @param {(x: number, y: number, isDown: boolean)} callback - The function to be called when the mouse is pressed down.
     */
    addMouseDownBinding(callback) {
        this.mouse.events.down.push(callback);
    }

    /**
     * Registers a callback function to be executed when a mouse up event occurs.
     * 
     * @param {(x: number, y: number, isDown: boolean)} callback - The function to be called when the mouse is released.
     */
    addMouseUpBinding(callback) {
        this.mouse.events.up.push(callback);
    }

    /**
     * Registers a callback function to be executed when a mouse wheel event occurs.
     * 
     * @param {(deltaY: number)=>void} callback - The function to be called when the mouse wheel is scrolled.
     */
    addMouseWheelBinding(callback) {
        this.mouse.events.wheel.push(callback);
    }

    /**
     * Registers a callback function to be called when the specified key is pressed down.
     * @param {string} keyCode - The code of the key to listen for.
     * @param {(keyCode: string) => void} callback - The function to call when the key is pressed down.
     */
    addKeyDownBinding(keyCode, callback) {
        if (!this.keys[keyCode]) {
            this.keys[keyCode] = { isDown: false, isHold: false, down: [callback], up: [], hold: [] };
        } else {
            this.keys[keyCode].down.push(callback);
        }
    }

    /**
     * Registers a callback function to be called when the specified key is released.
     * @param {string} keyCode - The code of the key to listen for.
     * @param {(keyCode: string) => void} callback - The function to call when the key is released.
     */
    addKeyUpBinding(keyCode, callback) {
        if (!this.keys[keyCode]) {
            this.keys[keyCode] = { isDown: false, isHold: false, down: [], up: [callback], hold: [] };
        } else {
            this.keys[keyCode].up.push(callback);
        }
    }

    /**
     * Registers a callback function to be called when the specified key is held down.
     * @param {string} keyCode - The code of the key to listen for.
     * @param {(deltaTime: number) => void} callback - The function to call when the key is held down.
     */
    addKeyHoldEvent(keyCode, callback) {
        if (!this.keys[keyCode]) {
            this.keys[keyCode] = { isDown: false, isHold: false, down: [], up: [], hold: [callback] };
        } else {
            this.keys[keyCode].hold.push(callback);
        }
    }

    /**
     * Updates the state of held keys and calls their hold callbacks.
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    tick(deltaTime) {
        for (const keyCode in this.keys) {
            if (this.keys[keyCode].isDown) {
                if (!this.keys[keyCode].isHold) {
                    this.keys[keyCode].isHold = true;
                }
                if (this.keys[keyCode].hold) {
                    this.keys[keyCode].hold.forEach(e => e(deltaTime));
                }
            }
        }
    }
}
