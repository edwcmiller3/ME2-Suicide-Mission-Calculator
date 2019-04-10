"use strict";

class Normandy {
    constructor() {
        this._isShieldUpgraded = false;
        this._isArmorUpgraded = false;
        this._isCannonUpgraded = false;
    }

    get isShieldUpgraded() {
        return this._isShieldUpgraded;
    }

    get isArmorUpgraded() {
        return this._isArmorUpgraded;
    }

    get isCannonUpgraded() {
        return this._isCannonUpgraded;
    }

    set isShieldUpgraded(sUpgrade) {
        this._isShieldUpgraded = sUpgrade;
    }

    set isArmorUpgraded(aUpgrade) {
        this._isArmorUpgraded = aUpgrade;
    }

    set isCannonUpgraded(cUpgrade) {
        this._isCannonUpgraded = cUpgrade;
    }
};

module.exports = Normandy;