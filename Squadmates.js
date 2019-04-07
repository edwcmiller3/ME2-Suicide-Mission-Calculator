"use strict";

class Squadmates {
    constructor(
        name,
        shieldCheckPriority = 20,
        weaponCheckPriority = 20,
        longWalkPriority = 20,
        holdTheLinePriority = 20
    ) {
        this._name = name;
        this._loyalty = false;
        this._alive = true;
        this._strength = 0;
        this._shieldCheckPriority = shieldCheckPriority;
        this._weaponCheckPriority = weaponCheckPriority;
        this._longWalkPriority = longWalkPriority;
        this._holdTheLinePriority = holdTheLinePriority;
    }

    get loyalty() {
        return this._loyalty;
    }

    get name() {
        return this._name;
    }

    get alive() {
        return this._alive;
    }

    get strength() {
        return this._strength;
    }

    get shieldCheckPriority() {
        return this._shieldCheckPriority;
    }

    get weaponCheckPriority() {
        return this._weaponCheckPriority;
    }

    get longWalkPriority() {
        return this._longWalkPriority;
    }

    get holdTheLinePriority() {
        return this._holdTheLinePriority;
    }

    set loyalty(loyal) {
        this._loyalty = loyal;
    }

    set alive(state) {
        this._alive = state;
    }

    set strength(val) {
        this._strength = val;
    }
}

module.exports = Squadmates;
