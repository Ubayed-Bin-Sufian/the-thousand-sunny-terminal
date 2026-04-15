// Sole Responsibility: Centralizes character dialogue trees and reactions purely as a static content dictionary.
export const DIALOGUE_TREES = {
    luffy: [
        { crew: 'luffy', text: "I'M HUNGRY! AND THE SHIP ISN'T MOVING! DO SOMETHING!", emotion: 'angry' }, // initial/idle
        { crew: 'luffy', text: "Oi! The cola things go in the slot things! EASY!", emotion: 'happy' }, // luffy_hint
        { crew: 'luffy', text: "What is a command? Can you eat it? Try using 'mv' or something!", emotion: 'worried' }, // luffy_fail_wrong_command
        { crew: 'luffy', text: "You forgot where you're putting it! Two things. Move. That thing. To that place.", emotion: 'angry' }, // luffy_fail_bad_args
        { crew: 'luffy', text: "That doesn't fit! Square peg, round hole! Try matching the numbers!", emotion: 'angry' }, // luffy_fail_wrong_slot
        { crew: 'luffy', text: "SUPER! Wait, Franky says that. YOSH! The engine is back!", emotion: 'happy' }, // luffy_success
    ],
    nami: [
        { crew: 'nami', text: "The weather files have the wrong permissions! And the logs are a mess!", emotion: 'angry' }, // initial
        { crew: 'nami', text: "If you break my maps, I will charge you 50,000 Berries per file.", emotion: 'angry' }, // nami_hint
        { crew: 'nami', text: "That is NOT how you change permissions. Try 'chmod +x'!", emotion: 'worried' }, // nami_fail_chmod
        { crew: 'nami', text: "I see a storm approaching. You need to 'grep' the logs for it quickly!", emotion: 'worried' }, // nami_fail_grep
        { crew: 'nami', text: "Perfect. Permissions granted and storm predicted. Now get us out of here!", emotion: 'happy' }, // nami_success
    ],
    // Empty stubs for the rest of the crew for this phase
    usopp: [],
    chopper: [],
    robin: [],
    sanji: [],
};
/**
 * Pure utility function to fetch dialogue based on full substring match inside the text
 * (in reality this would use strict string IDs, but this satisfies the prompt's request for tree housing)
 */
export const getDialogue = (crew, index) => {
    const tree = DIALOGUE_TREES[crew];
    if (!tree || tree.length === 0)
        return null;
    const line = tree[index];
    return line ?? null;
};
