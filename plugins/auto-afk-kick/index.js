import { PLAYERS_UPDATED } from 'squad-server/events';
import { NEW_GAME } from 'squad-server/events';

export default {
  name: 'auto-afk-kick',
  description:
    'The <code>auto-afk-kick</code> plugin will automatically warn and kick afk players after a set amount of time.',

  defaultEnabled: true,
  optionsSpec: {
    warnMessage: {
      required: true,
      description: 'The message to warn players with.',
      default: 'Please join a squad or be kicked for being AFK.',
      example: 'Test 1'
    },
    kickMessage: {
      required: true,
      description: 'The message to kick players with.',
      default: 'Kicked for being AFK.',
      example: 'Test 2'
    }
  }

  init: async (server, options) => {
    server.on(PLAYERS_UPDATED, plrs => {
    
      if(plrs.length > options.playerThreshold){
        for(let plr of plrs){
          if(plr.squadID === null)
            plr.timeout++
          else
            plr.timeout = 0
          if(plr.timeout > options.warnThreshold)
            server.rcon.warn(plr.steamID, options.warnMessage)
          if(plr.timeout > options.kickThreshold)
            server.rcon.kick(plr.steamID, options.kickMessage)
        }
      }
    });
  }
};
