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
        safeVentSpecialist.includes(ventSpecialist.name) &&
        ventSpecialist.isLoyal &&
        (safeFireteamLead.includes(fireteamLead.name) && fireteamLead.isLoyal)
    ) {
        return `${ventSpecialist} survives`;
    } else {
        // Otherwise, kill the vent specialist
        killSquadmate(ventSpecialist);
        return `${ventSpecialist} dies`;
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
        return "No escort - remaining crew dies including Dr. Chakwas";
    }
};

const endgameFinalFight = (squadmate1, squadmate2) => {
    if (squadmate1.isLoyal) {
        let sm1Survival = "survives";
    } else {
        killSquadmate(squadmate1);
        let sm1Survival = "dies";
    }

    if (squadmate2.isLoyal) {
        let sm2Survival = "survives";
    } else {
        killSquadmate(squadmate2);
        let sm2Survival = "dies";
    }

    return `${squadmate1} ${sm1Survival}. ${squadmate2} ${sm2Survival}.`;
};

const holdTheLine = (x, y) => {
    // Need to deal with (somewhere) if you have Samara vs. Morinth
    let teamGroup1 = ["Grunt", "Zaeed", "Garrus"];
    let teamGroup2 = ["Thane", "Legion", "Samara", "Jacob", "Miranda"];
    let teamGroup3 = ["Jack", "Kasumi", "Tali", "Mordin"];
};

const crewRequirementsCheck = squad => {
    // 8 squadmates are required to start the Suicide Mission
    // Of those 8, you are forced to have recruited AND active: Jacob, Miranda, Mordin, Garrus, and Jack
    if (squad.length < 8) {
        console.error("Error: Must have 8 squad members at a minimum");
        return process.exit(1);
    }

    // Either this, or an if with 4 'or's to check if required members are in squad
    let requiredCount = 0;
    squad.forEach(s => {
        if (s.isRequired) {
            requiredCount++;
        }
    });

    if (requiredCount < 5) {
        console.error("Error: Squad does not contain required members");
        return process.exit(1);
    }

    return "Crew requirements check passed";
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
// Minimum squad required to recruit: Jacob, Miranda, Mordin, Garrus, Jack
// name, shieldCheckPriority, weaponCheckPriority, longWalkPriority, holdTheLinePriority, isRequired
let Kasumi = new Squadmates("Kasumi", 1, undefined, 10, 3, false);
let Grunt = new Squadmates("Grunt", 7, 4, 5, 12, false);
let Thane = new Squadmates("Thane", 4, 1, 1, 10, false);
let Jack = new Squadmates("Jack", undefined, 5, 2, 4, true);
let Miranda = new Squadmates(
    "Miranda",
    undefined,
    undefined,
    undefined,
    5,
    true
);
let Legion = new Squadmates("Legion", 2, undefined, 4, 9, false);
let Zaeed = new Squadmates("Zaeed", 6, 3, 11, 11, false);
let Tali = new Squadmates("Tali", 3, undefined, 9, 2, false);
let Samara = new Squadmates("Samara", 8, 6, 6, 8, false);
let Mordin = new Squadmates("Mordin", undefined, undefined, 8, 1, true);
let Jacob = new Squadmates("Jacob", undefined, undefined, 7, 6, true);
let Garrus = new Squadmates("Garrus", 5, 2, 3, 7, true);
let Morinth = new Squadmates("Morinth", 8, 6, 12, 8, false);

// User selected bits
// Who did you recruit AND is active?
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
// Who in your active squad is loyal?
// Probably make this something that can be set when creating a new squadmate
Grunt.isLoyal = false;
Thane.isLoyal = false;
Jack.isLoyal = false;
Miranda.isLoyal = false;
Legion.isLoyal = false;
Zaeed.isLoyal = false;
Tali.isLoyal = false;
Samara.isLoyal = false;
Mordin.isLoyal = false;
Jacob.isLoyal = false;
Garrus.isLoyal = false;

// User selected bits
// Did you upgrade the Normandy?
NormandySR2.isArmorUpgraded = true;
NormandySR2.isShieldUpgrade = false;
NormandySR2.isCannonUpgraded = true;

// BEGIN THE APPROACH
console.log(crewDeathMissionTimer(0));
console.log(theApproachArmorCheck(NormandySR2));
console.log(theApproachShieldCheck(NormandySR2, activeSquad, [Tali, Kasumi]));
console.log(theApproachWeaponsCheck(NormandySR2, activeSquad));

// ENTER THE COLLECTOR BASE
// TODO

// THE ENDGAME
// Determine each squad member's strength value for Hold The Line
calculateHoldTheLineStrength(activeSquad);
console.log(activeSquad);
console.log(crewRequirementsCheck(activeSquad));
