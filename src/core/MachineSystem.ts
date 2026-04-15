// Sole Responsibility: Manages the pure, immutable state machine of the ship's systems, returning fresh snapshots on repair.

import { ShipState, SystemStatus, SystemName } from '../types';
import { GAME_CONSTANTS } from '../config/constants';

export const getInitialShipState = (): Readonly<ShipState> => {
  return {
    activeSystem: 'engine_room',
    crewDialogue: null,
    systems: {
      engine_room: { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'luffy' },
      navigation:  { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'nami' },
      weapon_bay:  { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'usopp' },
      medical_bay: { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'chopper' },
      library:     { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'robin' },
      kitchen:     { health: GAME_CONSTANTS.CRITICAL_HEALTH_THRESHOLD, isRepaired: false, assignedCrew: 'sanji' },
    }
  };
};

/**
 * Pure function: applies a repair to a system by granting it max health and marking it repaired,
 * returning an entirely new immutable state snapshot. Never mutates the input state.
 */
export const applyRepair = (state: Readonly<ShipState>, systemToRepair: SystemName): Readonly<ShipState> => {
  const currentSystemStatus = state.systems[systemToRepair];
  
  if (!currentSystemStatus) {
    return state;
  }

  const newSystemStatus: SystemStatus = {
    ...currentSystemStatus,
    health: GAME_CONSTANTS.MAX_HEALTH,
    isRepaired: true,
  };

  const newSystems: Record<SystemName, SystemStatus> = {
    ...state.systems,
    [systemToRepair]: newSystemStatus,
  };

  return {
    ...state,
    systems: newSystems,
  };
};
