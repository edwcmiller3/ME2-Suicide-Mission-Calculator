"use strict";

class Squadmates {
    constructor(
        name,
        shieldCheckPriority = 20,
        weaponCheckPriority = 20,
        longWalkPriority = 20,
        holdTheLinePriority = 20,
        isRequired
    ) {
        this._name = name;
        this._isLoyal = false;
        this._isAlive = true;
        this._strength = 0;
        this._shieldCheckPriority = shieldCheckPriority;
        this._weaponCheckPriority = weaponCheckPriority;
        this._longWalkPriority = longWalkPriority;
        this._holdTheLinePriority = holdTheLinePriority;
        this._isRequired = isRequired;
    }

    get isLoyal() {
        return this._isLoyal;
    }

    get name() {
        return this._name;
    }

    get isAlive() {
        return this._isAlive;
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

    get isRequired() {
        return this._isRequired;
    }

    set isLoyal(loyal) {
        this._isLoyal = loyal;
    }

    set isAlive(state) {
        this._isAlive = state;
    }

    set strength(val) {
        this._strength = val;
    }
}

module.exports = Squadmates;
