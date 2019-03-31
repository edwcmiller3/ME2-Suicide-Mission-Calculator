'use strict';

class Squadmates {
    constructor(name) {
        this._name = name;
        this._loyalty = false;
        this._alive = true;
        this._strength = 0;
    }

    get loyalty() { return this._loyalty; }

    get name() { return this._name; }
    
    get alive() { return this._alive; }

    get strength() { return this._strength; }

    set loyalty(loyal) { this._loyalty = loyal; }

    set alive(state) { this._alive = state; }

    set strength(val) { this._strength = val; }
}

class Normandy {
    constructor() {
        this._shieldUpgraded = false;
        this._armorUpgraded = false;
        this._cannonUpgraded = false; 
    }

    get shieldUpgraded() { return this._shieldUpgraded; }

    get armorUpgraded() { return this._armorUpgraded; }

    get cannonUpgraded() { return this._cannonUpgraded; }

    set shieldUpgraded(sUpgrade) { this._shieldUpgraded = sUpgrade; }

    set armorUpgraded(aUpgrade) { this._armorUpgraded = aUpgrade; }

    set cannonUpgraded(cUpgrade) { this._cannonUpgraded = cUpgrade; }
}

/*
Section Checklist
- The Approach
    [x]  Armor check
    [x]  Shield check
    [x]  Weapons check
- The Base
    [x]  The Vents
    []  The Long Walk
    [x]  The Escort
    [x]  The Crew
- The Endgame
    [x]  The Final Fight
    []  Hold the Line
    []  The Commander
*/

const theApproachArmorCheck = newNormandy => {
    // Heavy Ship Armor is from Jacob who is always an active squad member,
    // no need to check if active
    if (newNormandy.armorUpgraded) {
        return "Normandy armor check passed - Safe";
    } else {
        Jack.alive(false);
        return "Normandy armor check failed - Jack dies";
    }
};

const theApproachShieldCheck = (newNormandy, squad) => {
    // Multicore Shielding is from Tali whose recruitment can be skipped,
    // check that she is recruited
    if (Tali in squad && newNormandy.shieldUpgraded) {
        return "Normandy shield check passed - Safe";
    } else {
        // Kill one non-party member in order: 
        // Kasumi, Legion, Tali, Thane, Garrus, Zaeed, Grunt, Samara/Morinth
        // TODO
        // return "Normandy shield check failed - ${person} dies"
    }
};

const theApproachWeaponsCheck = newNormandy => {
    // Thanix Cannon is from Garrus who is always an active squad member,
    // no need to check if active
    if (newNormandy.cannonUpgraded) {
        return "Normandy weapons check passed - Safe";
    } else {
        // Kill one party member in order:
        // Thane, Garrus, Zaeed, Grunt, Jack, Samara/Morinth
        // TODO
        // return "Normandy weapons check failed - ${person} dies"
    }
};

const theBaseVentCheck = (ventSpecialist, ventSpecialistIsLoyal, fireteamLead, fireteamLeadIsLoyal) => {
    // Squadmates that are safe to send into vents
    const safeVentSpecialist = ["Tali", "Legion", "Kasumi"];
    // Squadmates that are safe to lead first fireteam
    const safeFireteamLead = ["Miranda", "Jacob", "Garrus"];
    
    // Gross but..
    // Vent specialist must be in list and loyal
    // AND
    // Fireteam lead must be in list and loyal
    // ELSE
    // Kill the vent specialist
    if ((safeVentSpecialist.includes(ventSpecialist) && ventSpecialist.loyalty) && 
    (safeFireteamLead.includes(fireteamLead) && fireteamLead.loyalty)) {
        return `${ventSpecialist} survives`;
    } else {
        ventSpecialist.alive(false);
        return `${ventSpecialist} dies`;
    }
}

const theCrewCheck = missions => {
    if (missions === 0) {
        return "All the crew survives";
    } else if (missions <= 3) {
        return "Half the crew dies";
    } else {
        return "All the crew dies except Dr. Chakwas";
    }
};

const theEscortCheck = (escortSent, escort = null) => {
    if (escortSent) {
        if (escort && escort.loyalty) {
            return "Escort and remaining crew survive";
        } else if (escort && !escort.loyalty) {
            return "Escort dies, remaining crew survives"
        }
    }
};

const endgameFinalFight = (squadMate1, squadMate2) => {
    let sm1Survival = squadMate1.loyalty ? 'survives' : 'dies';
    let sm2Survival = squadMate2.loyalty ? 'survives' : 'dies';
    return `${squadMate1} ${sm1Survival}. ${squadMate2} ${sm2Survival}.`;
};

const holdTheLine = (x, y) => {
    // Need to deal with (somewhere) if you do not have all squadmates
    // Need to deal with (somewhere) if you have Samara vs. Morinth
    let teamGroup1 = ['Grunt', 'Zaeed', 'Garrus'];
    let teamGroup2 = ['Thane', 'Legion', 'Samara', 'Jacob', 'Miranda'];
    let teamGroup3 = ['Jack', 'Kasumi', 'Tali', 'Mordin'];
}

// Build a Normandy
let NormandySR2 = new Normandy();

// Create all the Squadmates
// Minimum squad required to recruit: Jacob, Miranda, Mordin, Garrus, Jack, Grunt
let Kasumi = new Squadmates('Kasumi');
let Grunt = new Squadmates('Grunt');
let Thane = new Squadmates('Thane');
let Jack = new Squadmates('Jack');
let Miranda = new Squadmates('Miranda');
let Legion = new Squadmates('Legion');
let Zaeed = new Squadmates('Zaeed');
let Tali = new Squadmates('Tali');
let Samara = new Squadmates('Samara');
let Mordin = new Squadmates('Mordin');
let Jacob = new Squadmates('Jacob');
let Garrus = new Squadmates('Garrus');

// User selected bits
// Who did you recruit AND is active?
// e.g. Grunt can be recruited, but not active if pod never opened
// Need at least 8 active squad members
// Active squad must include Jacob, Miranda, Mordin, Garrus, and Jack
let activeSquad = [
    Kasumi,
    Grunt,
    Thane,
    Jack,
    Miranda,
    Legion,
    Zaeed,
    Tali,
    Samara,
    Mordin,
    Jacob,
    Garrus
];

// User selected bits
// Did you upgrade the Normandy?
let aU = NormandySR2.armorUpgraded(true);
let sU = NormandySR2.shieldUpgraded(true);
let cU = NormandySR2.cannonUpgraded(true);

// Begin The Approach
let aAC = theApproachArmorCheck(NormandySR2);
let aSC = theApproachShieldCheck(NormandySR2, activeSquad);