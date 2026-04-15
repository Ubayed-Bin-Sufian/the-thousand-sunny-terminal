// Sole Responsibility: Manages the pure, immutable state machine of the ship's systems, returning fresh snapshots on repair.
import { GAME_CONSTANTS } from '../config/constants';
export const getInitialShipState = () => {
    return {
        activeSystem: 'engine_room',
        crewDialogue: null,
        systems: {
            engine_room: { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'luffy' },
            navigation: { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'nami' },
            weapon_bay: { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'usopp' },
            medical_bay: { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'chopper' },
            library: { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'robin' },
            kitchen: { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'sanji' },
        }
    };
};
/**
 * Pure function: applies a repair to a system by granting it max health and marking it repaired,
 * returning an entirely new immutable state snapshot. Never mutates the input state.
 */
export const applyRepair = (state, systemToRepair) => {
    const currentSystemStatus = state.systems[systemToRepair];
    if (!currentSystemStatus) {
        return state;
    }
    const newSystemStatus = {
        ...currentSystemStatus,
        health: GAME_CONSTANTS.MAX_HEALTH,
        isRepaired: true,
    };
    const newSystems = {
        ...state.systems,
        [systemToRepair]: newSystemStatus,
    };
    return {
        ...state,
        systems: newSystems,
    };
};
