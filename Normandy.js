"use strict";

class Normandy {
    constructor() {
        this._shieldUpgraded = false;
        this._armorUpgraded = false;
        this._cannonUpgraded = false;
    }

    get shieldUpgraded() {
        return this._shieldUpgraded;
    }

    get armorUpgraded() {
        return this._armorUpgraded;
    }

    get cannonUpgraded() {
        return this._cannonUpgraded;
    }

    set shieldUpgraded(sUpgrade) {
        this._shieldUpgraded = sUpgrade;
    }

    set armorUpgraded(aUpgrade) {
        this._armorUpgraded = aUpgrade;
    }

    set cannonUpgraded(cUpgrade) {
        this._cannonUpgraded = cUpgrade;
    }
};

module.exports = Normandy;