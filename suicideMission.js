"use strict";

const Squadmates = require("./Squadmates.js");
const Normandy = require("./Normandy.js");

const theApproachArmorCheck = newNormandy => {
    // Heavy Ship Armor is from Jacob who is always an active squad member,
    // no need to check if active
    if (newNormandy.armorUpgraded) {
        return "Normandy armor check passed - Safe";
    } else {
        killSquadmate(Jack);
        return "Normandy armor check failed - Jack dies";
    }
};

const theApproachShieldCheck = (newNormandy, squad) => {
    // Multicore Shielding is from Tali whose recruitment can be skipped,
    // check that she is recruited (does not need to be loyal)
    if (squad.includes(Tali) && newNormandy.shieldUpgraded) {
        return "Normandy shield check passed - Safe";
    } else {
        // Kill one non-party member in order:
        // Kasumi, Legion, Tali, Thane, Garrus, Zaeed, Grunt, Samara/Morinth
        // Thanks to Stobor for this super nifty ES6 way of sorting
        // https://stackoverflow.com/a/979289
        let shieldCheckSortedSquad = squad.sort((squadMate1, squadMate2) => {
            return (
                parseInt(squadMate1.shieldCheckPriority) -
                parseInt(squadMate2.shieldCheckPriority)
            );
        });
        // Kill the squadmate
        killSquadmate(shieldCheckSortedSquad[0]);
        // And now return the first squadmate (i.e. squadmate with lowest shieldCheckPriority value)
        return `Normandy shield check failed - ${
            shieldCheckSortedSquad[0].name
        } dies`;
    }
};

const theApproachWeaponsCheck = (newNormandy, squad) => {
    // Thanix Cannon is from Garrus who is always an active squad member,
    // no need to check if active
    if (newNormandy.cannonUpgraded) {
        return "Normandy weapons check passed - Safe";
    } else {
        // Kill one party member in order:
        // Thane, Garrus, Zaeed, Grunt, Jack, Samara/Morinth
        // Thanks to Stobor for this super nifty ES6 way of sorting
        // https://stackoverflow.com/a/979289
        let weaponsCheckSortedSquad = squad.sort((squadMate1, squadMate2) => {
            return (
                parseInt(squadMate1.weaponCheckPriority) -
                parseInt(squadMate2.weaponCheckPriority)
            );
        });
        // Kill the squadmate
        killSquadmate(weaponsCheckSortedSquad[0]);
        // And now return the first squadmate (i.e. squadmate with lowest weaponCheckPriority)
        return `Normandy weapons check failed - ${
            weaponsCheckSortedSquad[0].name
        } dies`;
    }
};

const theBaseVentCheck = (ventSpecialist, fireteamLead) => {
    // Squadmates that are safe to send into vents
    const safeVentSpecialist = ["Tali", "Legion", "Kasumi"];
    // Squadmates that are safe to lead first fireteam
    const safeFireteamLead = ["Miranda", "Jacob", "Garrus"];

    // Vent specialist must be in list and loyal AND fireteam lead must be in list and loyal
    if (
        safeVentSpecialist.includes(ventSpecialist) &&
        ventSpecialist.loyalty &&
        (safeFireteamLead.includes(fireteamLead) && fireteamLead.loyalty)
    ) {
        return `${ventSpecialist} survives`;
    } else {
        // Else, kill the vent specialist
        killSquadmate(ventSpecialist);
        return `${ventSpecialist} dies`;
    }
};

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
            return "Escort dies, remaining crew survives";
        }
    }
};

const endgameFinalFight = (squadMate1, squadMate2) => {
    // Much as I like this, need to change it to _actually_ kill the squadmate(s),
    // not just say they die (debateable, but let's do it for consistency)
    let sm1Survival = squadMate1.loyalty ? "survives" : "dies";
    let sm2Survival = squadMate2.loyalty ? "survives" : "dies";
    return `${squadMate1} ${sm1Survival}. ${squadMate2} ${sm2Survival}.`;
};

const holdTheLine = (x, y) => {
    // Need to deal with (somewhere) if you do not have all squadmates
    // Need to deal with (somewhere) if you have Samara vs. Morinth
    let teamGroup1 = ["Grunt", "Zaeed", "Garrus"];
    let teamGroup2 = ["Thane", "Legion", "Samara", "Jacob", "Miranda"];
    let teamGroup3 = ["Jack", "Kasumi", "Tali", "Mordin"];
};

const crewRequirementsCheck = reqSquad => {
    // 8 squadmates are required to start the Suicide Mission
    // Of those 8, you are forced to have recruited AND active: Jacob, Miranda, Mordin, Garrus, and Jack
    if (reqSquad.length < 8) {
        console.log("Error: Must have 8 squad members at a minimum");
        return process.exit(1);
    }

    // TODO: Do you have the required recruited + active squad members?
};

const calculateHoldTheLineStrength = squad => {
    squad.forEach(element => {
        if (["Grunt", "Zaeed", "Garrus"].includes(element.name)) {
            if (element.loyalty) {
                element.strength = 4;
            } else {
                element.strength = 3;
            }
        } else if (
            [
                "Thane",
                "Legion",
                "Samara",
                "Morinth",
                "Jacob",
                "Miranda"
            ].includes(element.name)
        ) {
            if (element.loyalty) {
                element.strength = 2;
            } else {
                element.strength = 1;
            }
        } else {
            if (element.loyalty) {
                element.strength = 1;
            }
        }
    });
};

const killSquadmate = squadmate => {
    if (squadmate.alive) {
        squadmate.alive = false;
    } else {
        // Squadmate was already dead
        console.log(`Error: Squadmate ${squadmate.name} already dead`);
    }
};

// Build a Normandy
let NormandySR2 = new Normandy();

// Create all the Squadmates
// Actually...do we _need_ to create all the squadmates, or just those that are active?
// Minimum squad required to recruit: Jacob, Miranda, Mordin, Garrus, Jack, Grunt*
let Kasumi = new Squadmates("Kasumi", 1, undefined, 10);
let Grunt = new Squadmates("Grunt", 7, 4, 5);
let Thane = new Squadmates("Thane", 4, 1, 1);
let Jack = new Squadmates("Jack", undefined, 5, 2);
let Miranda = new Squadmates("Miranda", undefined, undefined);
let Legion = new Squadmates("Legion", 2, undefined, 4);
let Zaeed = new Squadmates("Zaeed", 6, 3, 11);
let Tali = new Squadmates("Tali", 3, undefined, 9);
let Samara = new Squadmates("Samara", 8, 6, 6);
let Mordin = new Squadmates("Mordin", undefined, undefined, 8);
let Jacob = new Squadmates("Jacob", undefined, undefined, 7);
let Garrus = new Squadmates("Garrus", 5, 2, 3);
let Morinth = new Squadmates("Morinth", 8, 6, 12);

// User selected bits
// Who did you recruit AND is active?
// e.g. Grunt can be recruited, but not active if pod never opened
// Need at least 8 active squad members
// Active squad must include Jacob, Miranda, Mordin, Garrus, and Jack
let activeSquad = [
    //Kasumi, troubleshooting theApproachShieldCheck
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
// Who in your active squad is loyal?
// Probably make this something that can be set when creating a new squadmate
Grunt.loyalty = true;
Thane.loyalty = true;
Jack.loyalty = true;
Miranda.loyalty = true;
Legion.loyalty = true;
Zaeed.loyalty = true;
Tali.loyalty = true;
Samara.loyalty = true;
Mordin.loyalty = true;
Jacob.loyalty = true;
Garrus.loyalty = true;

// Determine each squad member's strength value for Hold The Line
calculateHoldTheLineStrength(activeSquad);

// User selected bits
// Did you upgrade the Normandy?
NormandySR2.armorUpgraded = true;
NormandySR2.shieldUpgraded = false; // troubleshooting theApproachShieldCheck
NormandySR2.cannonUpgraded = true;

// BEGIN THE APPROACH
console.log(theApproachArmorCheck(NormandySR2));
// console.log("POST ARMOR CHECK SQUAD");
// activeSquad.forEach(item => console.log(item));

console.log(theApproachShieldCheck(NormandySR2, activeSquad));
// console.log("POST SHIELD CHECK SQUAD");
// activeSquad.forEach(item => console.log(item));

console.log(theApproachWeaponsCheck(NormandySR2, activeSquad));
// console.log("POST WEAPON CHECK SQUAD");
// activeSquad.forEach(item => console.log(item));
