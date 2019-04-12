"use strict";

const Squadmates = require("./Squadmates.js");
const Normandy = require("./Normandy.js");

const theApproachArmorCheck = newNormandy => {
    // Heavy Ship Armor is from Jacob who is always an active squad member,
    // no need to check if active
    if (newNormandy.isArmorUpgraded) {
        return "Normandy armor check passed - Safe";
    } else {
        killSquadmate(Jack);
        return "Normandy armor check failed - Jack dies";
    }
};

const theApproachShieldCheck = (newNormandy, squad, oculusSquad) => {
    // Multicore Shielding is from Tali whose recruitment can be skipped,
    // check that she is recruited (does not need to be loyal)
    if (squad.includes(Tali) && newNormandy.isShieldUpgraded) {
        return "Normandy shield check passed - Safe";
    } else {
        // Kill one non-party member in order:
        // Kasumi, Legion, Tali, Thane, Garrus, Zaeed, Grunt, Samara/Morinth
        // Thanks to Stobor for this super nifty ES6 way of sorting
        // https://stackoverflow.com/a/979289
        let shieldCheckSortedSquad = squad.sort((squadmate1, squadmate2) => {
            return (
                parseInt(squadmate1.shieldCheckPriority) -
                parseInt(squadmate2.shieldCheckPriority)
            );
        });

        // Squad brought with Shepard to fight Oculus can't be killed, so remove from list
        shieldCheckSortedSquad = shieldCheckSortedSquad.filter(squadmate => {
            return squadmate !== oculusSquad[0] && squadmate !== oculusSquad[1];
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
    if (newNormandy.isCannonUpgraded) {
        return "Normandy weapons check passed - Safe";
    } else {
        // Kill one party member in order:
        // Thane, Garrus, Zaeed, Grunt, Jack, Samara/Morinth
        // Thanks to Stobor for this super nifty ES6 way of sorting
        // https://stackoverflow.com/a/979289
        let weaponsCheckSortedSquad = squad.sort((squadmate1, squadmate2) => {
            return (
                parseInt(squadmate1.weaponCheckPriority) -
                parseInt(squadmate2.weaponCheckPriority)
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
        ventSpecialist.isLoyal &&
        (safeFireteamLead.includes(fireteamLead) && fireteamLead.isLoyal)
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

const theEscortCheck = (escort = null) => {
    // Did you send a squadmate to escort the surviving crew?
    if (escort) {
        // Is the squadmate you sent loyal?
        if (escort.isLoyal) {
            return `${escort.name} and remaining crew survive`;
        } else {
            killSquadmate(escort);
            return `${escort.name} dies but remaining crew survive`;
        }
    } else {
        // No squadmate sent to escort the crew
        return "No escort - crew dies";
    }
};

const endgameFinalFight = (squadmate1, squadmate2) => {
    // Much as I like this, need to change it to _actually_ kill the squadmate(s),
    // not just say they die (debateable, but let's do it for consistency)
    let sm1Survival = squadmate1.isLoyal ? "survives" : "dies";
    let sm2Survival = squadmate2.isLoyal ? "survives" : "dies";
    return `${squadmate1} ${sm1Survival}. ${squadmate2} ${sm2Survival}.`;
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
            if (element.isLoyal) {
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
            if (element.isLoyal) {
                element.strength = 2;
            } else {
                element.strength = 1;
            }
        } else {
            if (element.isLoyal) {
                element.strength = 1;
            }
        }
    });
};

// How many missions you complete between completing Reaper IFF and going through Omega-4 relay
// determines how many of the kidnapped crew die
// 0 missions = crew lives
// 1-3 missions = half crew dies (minus Dr. Chakwas)
// >3 missions = all crew dies (minus Dr. Chakwas)
const crewDeathMissionTimer = missions => {
    if (missions === 0) {
        return "All of captured crew survives";
    } else if (missions >= 1 && missions <= 3) {
        return "Half of captured crew dies except for Dr. Chakwas";
    } else if (missions > 3) {
        return "All of captured crew dies except for Dr. Chakwas";
    } else {
        return `Missions must be greater than or equal to 0 - received ${missions}`;
    }
};

const killSquadmate = squadmate => {
    if (squadmate.isAlive) {
        squadmate.isAlive = false;
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
Grunt.isLoyal = true;
Thane.isLoyal = true;
Jack.isLoyal = true;
Miranda.isLoyal = true;
Legion.isLoyal = true;
Zaeed.isLoyal = true;
Tali.isLoyal = true;
Samara.isLoyal = true;
Mordin.isLoyal = true;
Jacob.isLoyal = true;
Garrus.isLoyal = true;

// Determine each squad member's strength value for Hold The Line
calculateHoldTheLineStrength(activeSquad);

// User selected bits
// Did you upgrade the Normandy?
NormandySR2.isArmorUpgraded = true;
NormandySR2.isShieldUpgrade = false; // troubleshooting theApproachShieldCheck
NormandySR2.isCannonUpgraded = true;

// BEGIN THE APPROACH
console.log(theApproachArmorCheck(NormandySR2));
// console.log("POST ARMOR CHECK SQUAD");
// activeSquad.forEach(item => console.log(item));

console.log(theApproachShieldCheck(NormandySR2, activeSquad, [Tali, Kasumi]));
// console.log("POST SHIELD CHECK SQUAD");
// activeSquad.forEach(item => console.log(item));

console.log(theApproachWeaponsCheck(NormandySR2, activeSquad));
// console.log("POST WEAPON CHECK SQUAD");
// activeSquad.forEach(item => console.log(item));
