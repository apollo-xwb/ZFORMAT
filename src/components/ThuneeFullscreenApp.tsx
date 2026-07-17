import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ThuneeFullscreenAppProps {
  isThuneePlaying: boolean;
  setIsThuneePlaying: (val: boolean) => void;
  currentPlayerName: string;
  setCurrentPlayerName: (val: string) => void;
  thuneeGameMode: "AI" | "MULTIPLAYER" | null;
  setThuneeGameMode: (val: "AI" | "MULTIPLAYER" | null) => void;
  thuneeStage: "DEAL" | "TRUMP_SELECTION" | "PLAY" | "ROUND_OVER" | "GAME_OVER";
  setThuneeStage: (val: any) => void;
  thuneeSeats: (string | null)[];
  thuneeHostName: string;
  thuneeTrumpSuit: "HEARTS" | "DIAMONDS" | "CLUBS" | "SPADES" | null;
  setThuneeTrumpSuit: (val: any) => void;
  thuneeHand: any[];
  setThuneeHand: (val: any[]) => void;
  thuneeCurrentTurnIndex: number | null;
  thuneePlayedCardsNew: { playerIndex: number; name: string; card: any }[];
  thuneeRoundScores: { ourTeam: number; enemyTeam: number };
  thuneeGameScores: { ourTeam: number; enemyTeam: number };
  thuneeTricksWon: { ourTeam: number; enemyTeam: number };
  thuneeCallThunee: boolean;
  thuneeThuneeCaller: string | null;
  thuneeGameStatusText: string;
  thuneeAllCardsNew: Record<string, any[]>;
  thuneeLeadPlayerIndex: number;
  currentTableId: string;
  updateThuneeGame: (partialState: any) => void;
  handleUserPlayThuneeCard: (card: any) => void;
  collectThuneeTrick: () => void;
  resolveThuneeRound: () => void;
  triggerLobbyReset: () => void;
  triggerLobbyBackfill: () => void;
  startThuneeRound: () => void;
  playBeep: (freq: number, type: string, duration: number) => void;
  triggerToast: (msg: string, type: string) => void;
  handleNicknameChange: (name: string) => void;
  // Custom suggestion helpers
  thuneeShowHelpSheet: boolean;
  setThuneeShowHelpSheet: (val: boolean) => void;
  thuneeAdviceText: string | null;
  setThuneeAdviceText: (val: string | null) => void;
  thuneeSuggestedCardId: string | null;
  setThuneeSuggestedCardId: (val: string | null) => void;
  getThuneeCoachAdviceMessage: () => { text: string; recoCard: any };
}

export function ThuneeFullscreenApp({
  isThuneePlaying,
  setIsThuneePlaying,
  currentPlayerName,
  setCurrentPlayerName,
  thuneeGameMode,
  setThuneeGameMode,
  thuneeStage,
  setThuneeStage,
  thuneeSeats,
  thuneeHostName,
  thuneeTrumpSuit,
  setThuneeTrumpSuit,
  thuneeHand,
  setThuneeHand,
  thuneeCurrentTurnIndex,
  thuneePlayedCardsNew,
  thuneeRoundScores,
  thuneeGameScores,
  thuneeTricksWon,
  thuneeCallThunee,
  thuneeThuneeCaller,
  thuneeGameStatusText,
  thuneeAllCardsNew,
  thuneeLeadPlayerIndex,
  currentTableId,
  updateThuneeGame,
  handleUserPlayThuneeCard,
  collectThuneeTrick,
  resolveThuneeRound,
  triggerLobbyReset,
  triggerLobbyBackfill,
  startThuneeRound,
  playBeep,
  triggerToast,
  handleNicknameChange,
  thuneeShowHelpSheet,
  setThuneeShowHelpSheet,
  thuneeAdviceText,
  setThuneeAdviceText,
  thuneeSuggestedCardId,
  setThuneeSuggestedCardId,
  getThuneeCoachAdviceMessage,
}: ThuneeFullscreenAppProps) {
  const THUNEE_RANK_ORDER = ["J", "9", "A", "10", "K", "Q"];
  const [mobileActiveTab, setMobileActiveTab] = useState<"ARENA" | "COACH">("ARENA");
  const [manualTab, setManualTab] = useState<"basics" | "pointvals" | "trumps" | "calls">("basics");

  useEffect(() => {
    if (isThuneePlaying) {
      document.body.classList.add("overflow-hidden");
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.classList.remove("overflow-hidden");
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isThuneePlaying]);

  // Helper inside to retrieve adjacent indexed seats relative to current client
  const myIdx = thuneeSeats.indexOf(currentPlayerName) >= 0 ? thuneeSeats.indexOf(currentPlayerName) : 0;
  const leftIdx = (myIdx + 1) % 4;
  const partnerIdx = (myIdx + 2) % 4;
  const rightIdx = (myIdx + 3) % 4;

  const getSeatNameWithIcon = (idx: number, prefix: string) => {
    const name = thuneeSeats[idx];
    if (!name) return `🪑 ${prefix} Seat Empty`;
    return name;
  };

  const getLeadercardSuitSymbol = () => {
    if (thuneePlayedCardsNew.length === 0) return null;
    return thuneePlayedCardsNew[0].card.suit;
  };

  const currentLeaderSuit = getLeadercardSuitSymbol();

  return (
    <div className="fixed inset-0 bg-[#060a07] z-[99995] flex flex-col font-sans select-none w-screen h-screen text-zinc-100 overflow-hidden">
      
      {/* HEADER BANNER DESIGN */}
      <header className="bg-black/95 px-3 py-2.5 sm:p-4 border-b border-zinc-900 flex flex-row justify-between items-center shrink-0 relative z-25">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl animate-pulse shrink-0">🃏</span>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h4 className="font-display font-black text-[10px] xs:text-xs sm:text-sm tracking-widest text-[#3E5E93] uppercase leading-none">
                DURBAN THUNEE
              </h4>
              <span className="text-[7px] sm:text-[8px] bg-[#0c1810] text-emerald-400 font-mono px-1 sm:px-1.5 py-0.5 rounded uppercase border border-emerald-900/50 shrink-0">
                LIVE
              </span>
            </div>
            <p className="text-[8px] sm:text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider mt-1 flex items-center gap-1.5">
              <span className="hidden sm:inline">Lounge table: {currentTableId}</span>
              <span className="sm:hidden">Table: {currentTableId}</span>
              <span>•</span>
              <span className="text-zinc-400">{thuneeGameMode || "LOBBY"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 xs:gap-2">
           {/* Dynamic player nickname sync - hidden on mobile header, available in lobby */}
           <div className="hidden sm:flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-lg">
             <span className="text-[8.5px] font-mono text-zinc-500 uppercase px-1">Moniker:</span>
             <input 
               type="text"
               value={currentPlayerName}
               onChange={(e) => {
                 const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9_\s]/g, "").substring(0, 11);
                 handleNicknameChange(formatted);
               }}
               className="bg-black text-white text-[9px] font-mono border-none focus:ring-0 rounded px-1.5 py-0.5 uppercase tracking-wider w-[85px] text-center"
             />
           </div>

           {/* Strategy advice - hidden on mobile, Coach tab is one tap away */}
           <button
             onClick={() => {
               playBeep(450, "sine", 0.05);
               const advice = getThuneeCoachAdviceMessage();
               setThuneeAdviceText(advice.text);
               setMobileActiveTab("COACH");
               if (advice.recoCard) {
                 setThuneeSuggestedCardId(advice.recoCard.id);
                 triggerToast(`💡 Hint generated! Play the ${advice.recoCard.rank} of ${advice.recoCard.suit}!`, "stamp");
               } else {
                 setThuneeSuggestedCardId(null);
               }
             }}
             className="hidden sm:flex px-2 sm:px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all cursor-pointer font-sans text-[10px] font-black uppercase tracking-wide items-center gap-1 shadow-md shadow-emerald-500/15"
           >
             💡 Hint
           </button>

           {/* Help / cheat sheet - hidden on mobile */}
           <button
             onClick={() => {
               playBeep(450, "sine", 0.05);
               setThuneeShowHelpSheet(true);
               setMobileActiveTab("COACH");
             }}
             className="hidden md:flex px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-805 border border-zinc-800 text-zinc-300 rounded-lg transition-all cursor-pointer font-sans text-[10px] uppercase font-bold"
           >
             📋 Rules
           </button>

           {thuneeGameMode !== null && (
             <button
               onClick={() => {
                 playBeep(450, "sine", 0.05);
                 if (window.confirm("Change/Reset Game Mode? This will reset the current table session.")) {
                   localStorage.removeItem("lutho_thunee_room_" + currentTableId);
                   updateThuneeGame({
                     mode: null,
                     seats: [null, null, null, null],
                     stage: "DEAL",
                     playedCards: [],
                     trumpSuit: null,
                     gameScores: { ourTeam: 0, enemyTeam: 0 },
                     roundScores: { ourTeam: 0, enemyTeam: 0 },
                     tricksWon: { ourTeam: 0, enemyTeam: 0 }
                   });
                 }
               }}
               className="px-2 py-1.5 bg-amber-950/45 hover:bg-amber-900 border border-amber-900/40 text-amber-200 rounded-lg transition-all cursor-pointer font-sans text-[9px] sm:text-[10px] uppercase font-bold"
             >
               🔄 <span className="hidden xs:inline">Reset Mode</span><span className="xs:hidden">Reset</span>
             </button>
           )}

           <button
             onClick={() => {
               playBeep(320, "sine", 0.05);
               setIsThuneePlaying(false);
             }}
             className="px-2 sm:px-2.5 py-1.5 bg-red-950 hover:bg-red-900 border border-red-900/40 text-red-200 rounded-lg transition-all cursor-pointer font-sans text-[9px] sm:text-[10px] uppercase tracking-wider font-bold"
           >
             ✖ <span className="hidden xs:inline">Return to Table</span><span className="xs:hidden">Return</span>
           </button>
        </div>
      </header>

      {/* BODY SEGMENT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* Mobile View Tab Selector */}
        <div className="lg:hidden flex p-1.5 bg-black/95 border-b border-zinc-900 justify-center gap-1.5 shrink-0 z-20">
          <button
            onClick={() => {
              playBeep(450, "sine", 0.05);
              setMobileActiveTab("ARENA");
            }}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
              mobileActiveTab === "ARENA"
                ? "bg-emerald-500 text-black shadow-md font-black"
                : "bg-zinc-900/60 text-zinc-400 font-bold hover:bg-zinc-800"
            }`}
          >
            🎰 Play Arena Felt
          </button>
          <button
            onClick={() => {
              playBeep(450, "sine", 0.05);
              setMobileActiveTab("COACH");
            }}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
              mobileActiveTab === "COACH"
                ? "bg-emerald-500 text-black shadow-md font-black"
                : "bg-zinc-900/60 text-zinc-400 font-bold hover:bg-zinc-800"
            }`}
          >
            🧑‍🍳 Coach & Cheat Sheet
          </button>
        </div>

        {/* LEFT COMPONENT: FELT TABLE ARENA */}
        <div className={`flex-1 p-2 xs:p-3 sm:p-6 overflow-y-auto flex flex-col justify-start space-y-3 sm:space-y-4 ${mobileActiveTab === "ARENA" ? "flex" : "hidden lg:flex"}`}>
          
          {/* 1. LOBBY LEVEL STAGE : GAME MODE SELECTOR */}
          {thuneeGameMode === null ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto my-auto p-5 xs:p-8 bg-gradient-to-br from-[#0c1810] to-[#040905] rounded-3xl border border-emerald-900/40 text-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center p-4 bg-emerald-950/40 border border-emerald-500/10 rounded-full text-4xl animate-pulse text-emerald-400">
                  ♠️ 👑 ♣️
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-widest uppercase">
                  DURBAN CLASSIC THUNEE CLUB
                </h3>
                <p className="text-[10px] sm:text-xs text-emerald-500/80 uppercase font-mono tracking-widest">
                  South African Fast-Paced Card Sensation
                </p>
                <p className="text-zinc-400 text-xs max-w-md mx-auto leading-relaxed pt-2">
                  Partner with the bot crew or bring fellow table participants into a full live multiplayer congregation. Fast actions, trumps cuts and grand Durban sweeps active!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                
                {/* AI PRACTICE CARD */}
                <button
                  onClick={() => {
                    playBeep(440, "sine", 0.08);
                    updateThuneeGame({
                      mode: "AI",
                      host: currentPlayerName,
                      seats: [
                        currentPlayerName,
                        "🧑‍🍳 Grill Boss Bot",
                        "⚔️ Supa Smash Bot",
                        "🍗 Wing Ranger Bot"
                      ],
                      stage: "DEAL",
                      gameScores: { ourTeam: 0, enemyTeam: 0 },
                      roundScores: { ourTeam: 0, enemyTeam: 0 },
                      tricksWon: { ourTeam: 0, enemyTeam: 0 },
                      playedCards: [],
                      trumpSuit: null,
                      statusText: "Nominated Southern team seat. Practice with bots is loaded!"
                    });
                    triggerToast("AI Practice Table Ready! 🧑‍🍳", "stamp");
                  }}
                  className="p-5 bg-black/55 hover:bg-[#09150e]/50 border border-emerald-900/40 hover:border-emerald-500/40 rounded-2xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40 uppercase font-bold">SOLO CHATTER</span>
                    <h4 className="font-sans font-black text-white text-xs sm:text-sm uppercase tracking-wide group-hover:text-emerald-400 duration-150">
                      🤖 Practice Vs Bots
                    </h4>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Train offline under Coach Grill Boss advice. Instant dealing and rapid simulated opponent actions.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 uppercase flex items-center gap-1 font-bold pt-1.5 border-t border-zinc-900/60">
                    Play Solo Training Mode ▶
                  </div>
                </button>

                {/* MULTIPLAYER CONGREGATION CARD */}
                <button
                  onClick={() => {
                    playBeep(880, "sine", 0.08);
                    const nextSeats = [currentPlayerName, null, null, null];
                    updateThuneeGame({
                      mode: "MULTIPLAYER",
                      host: currentPlayerName,
                      seats: nextSeats,
                      stage: "DEAL",
                      gameScores: { ourTeam: 0, enemyTeam: 0 },
                      roundScores: { ourTeam: 0, enemyTeam: 0 },
                      tricksWon: { ourTeam: 0, enemyTeam: 0 },
                      playedCards: [],
                      trumpSuit: null,
                      statusText: "Multiplayer Lobby initialized! Sit at an open chair and invite other participants on this table."
                    });
                    
                    const stateObj = {
                      mode: "MULTIPLAYER",
                      seats: nextSeats,
                      stage: "DEAL",
                      trumpSuit: null,
                      currentTurn: null,
                      playedCards: [],
                      gameScores: { ourTeam: 0, enemyTeam: 0 },
                      roundScores: { ourTeam: 0, enemyTeam: 0 },
                      tricksWon: { ourTeam: 0, enemyTeam: 0 },
                      allCards: {},
                      statusText: `${currentPlayerName} opened a multiplayer lobby! Join a seat!`,
                      caller: null,
                      callThuneeFlag: false,
                      host: currentPlayerName,
                      lastUpdated: Date.now()
                    };
                    localStorage.setItem("lutho_thunee_room_" + currentTableId, JSON.stringify(stateObj));
                    triggerToast("Live Table Congregation Lounge Active! 👥", "success");
                  }}
                  className="p-5 bg-black/55 hover:bg-[#1a1208]/30 border border-amber-900/40 hover:border-amber-500/30 rounded-2xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono text-amber-500 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/40 uppercase font-bold">MULTIPLAYER</span>
                    <h4 className="font-sans font-black text-white text-xs sm:text-sm uppercase tracking-wide group-hover:text-amber-400 duration-150">
                      👥 Live Table Congregate
                    </h4>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Share your current table ID with other participants sitting at Lutho to play together live.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-amber-550 uppercase flex items-center gap-1 font-bold pt-1.5 border-t border-zinc-900/60">
                    Open Table Lounge Lobby ▶
                  </div>
                </button>

              </div>
            </div>
          ) : (thuneeGameMode === "MULTIPLAYER" && thuneeStage === "DEAL") ? (
            
            /* MULTIPLAYER LOBBY CONGREGATIONAL LOUNGE */
            <div className="flex-1 flex flex-col items-center justify-center p-4 xs:p-8 bg-black/40 rounded-3xl border border-zinc-900 max-w-4xl mx-auto w-full">
              <div className="text-center space-y-1.5 mb-8">
                <span className="text-4xl">🥘</span>
                <h4 className="font-display font-black text-sm sm:text-base text-zinc-200 uppercase tracking-widest">
                  LUTHO TABLE #{currentTableId} RECEPTION ZONE
                </h4>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">
                  Settle yourselves into open chairs around the griddle felt to play
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center w-full">
                
                {/* REPRESENTATION FELT BOARD CHAIR SELECTOR */}
                <div className="flex-1 bg-zinc-950/90 rounded-2xl border border-zinc-900 p-6 flex flex-col items-center justify-center relative min-h-[300px]">
                  
                  {/* Outer wood bumper table wrapper */}
                  <div className="w-[280px] h-[180px] rounded-[100px] border-8 border-amber-950 bg-gradient-to-br from-[#0e2716] to-[#041209] relative shadow-2xl flex items-center justify-center p-3">
                    <span className="text-[9px] font-mono font-black text-emerald-950 select-none uppercase tracking-widest opacity-25">
                      FELT GRIDDLE
                    </span>

                    {/* SEAT 0 (Bottom - South) */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 w-[120px]">
                      {thuneeSeats[0] ? (
                        <div className="bg-zinc-900 border border-emerald-500/40 rounded-lg px-2 py-1 text-center shadow-md text-[10px] text-white">
                          <p className="font-black text-[9px] uppercase truncate max-w-[100px] flex items-center justify-center gap-1">
                            <span>👇 {thuneeSeats[0]}</span>
                          </p>
                          <p className="text-[7.5px] text-emerald-400 font-mono font-bold uppercase">South Seat</p>
                          {thuneeSeats[0] === currentPlayerName && (
                            <button
                              onClick={() => {
                                playBeep(250, "sine", 0.05);
                                const next = [...thuneeSeats];
                                next[0] = null;
                                updateThuneeGame({ seats: next });
                              }}
                              className="text-[7.5px] font-mono text-red-400 uppercase mt-1 cursor-pointer hover:underline block w-full"
                            >
                              [Vacate]
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const next = thuneeSeats.map(s => s === currentPlayerName ? null : s);
                            next[0] = currentPlayerName;
                            updateThuneeGame({ seats: next, statusText: `${currentPlayerName} sit at South Seat` });
                          }}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-emerald-950 hover:border-emerald-500 border border-zinc-805 text-emerald-400 hover:text-white rounded-lg text-[9px] font-mono uppercase font-bold tracking-tight cursor-pointer duration-200 transition-all text-center"
                        >
                          🪑 South (Your) Chair
                        </button>
                      )}
                    </div>

                    {/* SEAT 1 (Left - West) */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10 w-[110px]">
                      {thuneeSeats[1] ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-center shadow-md text-[10px] text-white">
                          <p className="font-black text-[9px] uppercase truncate max-w-[90px]">
                            👤 {thuneeSeats[1]}
                          </p>
                          <p className="text-[7.5px] text-zinc-550 font-mono uppercase">West Seat</p>
                          {thuneeSeats[1] === currentPlayerName && (
                            <button
                              onClick={() => {
                                playBeep(250, "sine", 0.05);
                                const next = [...thuneeSeats];
                                next[1] = null;
                                updateThuneeGame({ seats: next });
                              }}
                              className="text-[7.5px] font-mono text-red-400 uppercase mt-1 cursor-pointer hover:underline block w-full"
                            >
                              [Vacate]
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const next = thuneeSeats.map(s => s === currentPlayerName ? null : s);
                            next[1] = currentPlayerName;
                            updateThuneeGame({ seats: next, statusText: `${currentPlayerName} sit at West Seat` });
                          }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-emerald-950 hover:border-emerald-500 border border-zinc-805 text-emerald-400 hover:text-white rounded-lg text-[8.5px] font-mono uppercase font-bold cursor-pointer text-center"
                        >
                          🪑 West Chair
                        </button>
                      )}
                    </div>

                    {/* SEAT 2 (Top - Partner North) */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 w-[120px]">
                      {thuneeSeats[2] ? (
                        <div className="bg-zinc-900 border border-emerald-500/30 rounded-lg px-2 py-1 text-center shadow-md text-[10px] text-white">
                          <p className="font-black text-[9px] uppercase truncate max-w-[100px]">
                            🤝 {thuneeSeats[2]}
                          </p>
                          <p className="text-[7.5px] text-emerald-400 font-mono uppercase">North Partner</p>
                          {thuneeSeats[2] === currentPlayerName && (
                            <button
                              onClick={() => {
                                playBeep(250, "sine", 0.05);
                                const next = [...thuneeSeats];
                                next[2] = null;
                                updateThuneeGame({ seats: next });
                              }}
                              className="text-[7.5px] font-mono text-red-400 uppercase mt-1 cursor-pointer hover:underline block w-full"
                            >
                              [Vacate]
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const next = thuneeSeats.map(s => s === currentPlayerName ? null : s);
                            next[2] = currentPlayerName;
                            updateThuneeGame({ seats: next, statusText: `${currentPlayerName} sit at North Seat` });
                          }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-emerald-950 hover:border-emerald-500 border border-zinc-805 text-emerald-400 hover:text-white rounded-lg text-[8.5px] font-mono uppercase font-bold cursor-pointer text-center"
                        >
                          🪑 North Chair
                        </button>
                      )}
                    </div>

                    {/* SEAT 3 (Right - East) */}
                    <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10 w-[110px]">
                      {thuneeSeats[3] ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-center shadow-md text-[10px] text-white">
                          <p className="font-black text-[9px] uppercase truncate max-w-[90px]">
                            👤 {thuneeSeats[3]}
                          </p>
                          <p className="text-[7.5px] text-zinc-550 font-mono uppercase">East Seat</p>
                          {thuneeSeats[3] === currentPlayerName && (
                            <button
                              onClick={() => {
                                playBeep(250, "sine", 0.05);
                                const next = [...thuneeSeats];
                                next[3] = null;
                                updateThuneeGame({ seats: next });
                              }}
                              className="text-[7.5px] font-mono text-red-400 uppercase mt-1 cursor-pointer hover:underline block w-full"
                            >
                              [Vacate]
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const next = thuneeSeats.map(s => s === currentPlayerName ? null : s);
                            next[3] = currentPlayerName;
                            updateThuneeGame({ seats: next, statusText: `${currentPlayerName} sit at East Seat` });
                          }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-emerald-950 hover:border-emerald-500 border border-zinc-805 text-emerald-400 hover:text-white rounded-lg text-[8.5px] font-mono uppercase font-bold cursor-pointer text-center"
                        >
                          🪑 East Chair
                        </button>
                      )}
                    </div>

                  </div>
                </div>

                {/* CONTROL PANEL LOBBY */}
                <div className="w-full md:w-80 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="border-b border-zinc-800 pb-3">
                      <span className="text-[9px] font-mono text-[#3E5E93] font-bold uppercase">LOBBY ACTIVE</span>
                      <h5 className="font-sans font-black text-white text-xs uppercase mt-0.5">Control Terminal</h5>
                      <p className="text-[9px] text-zinc-500 font-mono mt-1">Host Admin: {thuneeHostName || "GUEST"}</p>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-950 font-mono text-[9px] leading-relaxed text-zinc-400 h-[100px] overflow-y-auto space-y-1">
                      <p className="text-[#3E5E93]">📋 Status log feed:</p>
                      <p>{thuneeGameStatusText}</p>
                      {thuneeSeats.filter(Boolean).map((s, i) => (
                        <p key={i} className="text-zinc-600">• Participant '{s}' connected.</p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentPlayerName === thuneeHostName ? (
                      <>
                        <button
                          onClick={triggerLobbyBackfill}
                          className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg text-[9.5px] font-mono uppercase tracking-wide cursor-pointer transition-all"
                        >
                          🤖 Fill vacancy seats with Bots
                        </button>

                        <button
                          onClick={() => {
                            if (!thuneeSeats.includes(currentPlayerName)) {
                              triggerToast("You must click a chair and sit down to register!", "info");
                              return;
                            }
                            if (thuneeSeats.filter(Boolean).length < 4) {
                              triggerToast("Lobby table requires 4 active participants! Backfill with bots to test practice.", "info");
                              return;
                            }
                            startThuneeRound();
                          }}
                          className="w-full py-3 bg-[#3E5E93] hover:bg-orange-400 text-black font-sans font-black text-xs uppercase rounded-xl tracking-wider cursor-pointer duration-150 transition-all text-center block shadow-[0_4px_12px_rgba(62, 94, 147,0.2)]"
                        >
                          ⚡ COMMENCE CHICKEN CLASH!
                        </button>
                      </>
                    ) : (
                      <div className="bg-amber-950/20 py-3 border border-amber-900/40 rounded-lg text-center px-1">
                        <span className="text-[10px] text-amber-500 font-mono font-bold uppercase animate-pulse">⏳ Waiting for host {thuneeHostName} to click Start...</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        playBeep(450, "sine", 0.05);
                        triggerLobbyReset();
                      }}
                      className="w-full py-1.5 text-center text-[8.5px] uppercase font-mono text-zinc-500 hover:text-red-400 hover:underline cursor-pointer"
                    >
                      [Reset Lobby]
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            
            /* --- THE ACTIVE CLASSIFIED TABLE FELT GAMEBOARD --- */
            <div className="flex-1 flex flex-col justify-start space-y-3 sm:space-y-4">
              
              {/* STATUS ACTION BAR */}
              <div className="bg-black/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-zinc-900/60 flex flex-col sm:flex-row gap-2 justify-between items-center text-center sm:text-left shrink-0">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-[#3E5E93] uppercase tracking-widest font-bold">LIVE MATCH ANNOUNCEMENT:</span>
                  <p className="text-[11px] font-mono font-bold text-zinc-300">
                    📢 {thuneeGameStatusText}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="bg-[#121814] border border-emerald-900/45 rounded-xl p-2 font-mono text-[9px] flex gap-3 text-center">
                    <div>
                      <p className="text-zinc-500 text-[7px] uppercase leading-none font-bold">South/North Team</p>
                      <p className="text-emerald-400 font-black mt-1 text-xs">{thuneeGameScores.ourTeam} MATCH WINS</p>
                    </div>
                    <div className="border-l border-zinc-800 pl-3">
                      <p className="text-zinc-500 text-[7px] uppercase leading-none font-bold">Opposition Team</p>
                      <p className="text-zinc-450 font-black mt-1 text-xs">{thuneeGameScores.enemyTeam} MATCH WINS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVE CARDS BOARD STAGE CHROME */}
              <div className="flex-1 min-h-[260px] xs:min-h-[310px] sm:min-h-[350px] md:min-h-[370px] max-h-[460px] bg-gradient-to-br from-[#0c1c11] to-[#040e07] rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#1c120a] shadow-inner relative flex flex-col items-center justify-between p-2.5 xs:p-4 overflow-hidden">
                
                {/* Visual wood felt edge */}
                <span className="absolute top-2 left-6 text-[8px] font-mono font-bold text-zinc-700/60 tracking-widest pointer-events-none uppercase">
                  DURBAN CARD CHAMPIONSHIP TABLE FELT
                </span>

                {thuneeTrumpSuit && (
                  <div className="absolute top-2.5 right-6 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-xl flex items-center gap-1.5 z-10">
                    <span className="text-[8px] font-mono text-amber-500 uppercase tracking-wider leading-none">ACTIVE TRUMP:</span>
                    <span className={`text-[12px] font-black leading-none ${["HEARTS", "DIAMONDS"].includes(thuneeTrumpSuit) ? "text-red-500" : "text-zinc-200"}`}>
                      {thuneeTrumpSuit === "HEARTS" ? "HEARTS ♥️" : thuneeTrumpSuit === "DIAMONDS" ? "DIAMONDS ♦️" : thuneeTrumpSuit === "CLUBS" ? "CLUBS ♣️" : "SPADES ♠️"}
                    </span>
                  </div>
                )}

                {/* NORTH PLAYER SEAT */}
                <div className="text-center z-10">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[9.5px] font-mono uppercase font-black tracking-tight ${
                    thuneeCurrentTurnIndex === partnerIdx ? "bg-emerald-500 text-black border border-emerald-400 shadow-md scale-105" : "bg-black/70 text-zinc-400"
                  }`}>
                    🤝 North Partner ({getSeatNameWithIcon(partnerIdx, "North")})
                  </span>
                  {thuneeAllCardsNew[partnerIdx.toString()] && (
                    <p className="text-[7.5px] text-zinc-500 font-mono mt-0.5">{thuneeAllCardsNew[partnerIdx.toString()].length} cards</p>
                  )}
                </div>

                {/* CRITICAL GAME INTERACTIVE SECTION ENGINES */}
                <div className="w-full flex-1 relative flex items-center justify-center py-2 sm:py-4 min-h-[120px] xs:min-h-[150px] sm:min-h-[190px]">
                  
                  {/* WEST PLAYER SEAT - Absolutely floated on left edge */}
                  <div className="absolute left-1 xs:left-3 top-1/2 -translate-y-1/2 w-[70px] xs:w-[90px] sm:w-[110px] text-center bg-black/80 backdrop-blur-md rounded-xl p-1.5 border border-zinc-900 shadow-md z-10">
                    <span className={`block px-1 py-0.5 rounded text-[7.5px] xs:text-[8.5px] font-mono uppercase font-black truncate max-w-full ${
                      thuneeCurrentTurnIndex === leftIdx ? "bg-emerald-500 text-black border border-emerald-400 font-bold" : "text-zinc-400"
                    }`}>
                      👤 West ({getSeatNameWithIcon(leftIdx, "West").split(" ")[0]})
                    </span>
                    {thuneeAllCardsNew[leftIdx.toString()] && (
                      <p className="text-[6.5px] xs:text-[7px] text-zinc-500 font-mono uppercase mt-0.5">{thuneeAllCardsNew[leftIdx.toString()].length} cards</p>
                    )}
                  </div>

                  {/* CENTER DEALT / TRICK PILE PLAYFIELD - Perfectly centered */}
                  <div className="flex flex-col items-center justify-center relative z-5">
                    
                    {/* A. NOT DEALT STAGE */}
                    {thuneeStage === "DEAL" && (
                      <div className="flex flex-col items-center gap-2 xs:gap-3">
                        <span className="text-2xl xs:text-3xl animate-bounce">🎴</span>
                        <p className="text-[8px] xs:text-[9.5px] font-mono text-zinc-400 uppercase tracking-widest text-center">No cards dealt yet</p>
                        
                        {(thuneeGameMode === "AI" || currentPlayerName === thuneeHostName) && (
                          <button
                            onClick={() => {
                              playBeep(600, "sine", 0.08);
                              startThuneeRound();
                            }}
                            className="px-3 py-1.5 xs:px-4 xs:py-2 bg-[#3E5E93] hover:bg-orange-400 text-black font-sans font-black text-[9.5px] xs:text-xs uppercase rounded-xl tracking-wider cursor-pointer font-bold duration-150 active:scale-95 shadow-md text-nowrap"
                          >
                            🎴 DEAL CARDS
                          </button>
                        )}
                      </div>
                    )}

                    {/* B. TRUMP NOMINATION STAGE */}
                    {thuneeStage === "TRUMP_SELECTION" && (
                      <div className="flex flex-col items-center gap-1.5 xs:gap-3 bg-black/90 p-3 xs:p-4 rounded-2xl border border-amber-500/20 max-w-[170px] xs:max-w-xs sm:max-w-md w-full relative z-15">
                        {thuneeLeadPlayerIndex === myIdx ? (
                          <>
                            <div className="text-center">
                              <span className="text-emerald-400 font-black text-[7px] xs:text-[9px] uppercase font-mono tracking-wider">★ YOUR LEAD ★</span>
                              <h5 className="font-display font-black text-[8.5px] xs:text-[11px] text-zinc-200 mt-0.5 uppercase">SELECT TRUMP SUIT:</h5>
                            </div>

                            <div className="grid grid-cols-2 gap-1 xs:gap-2 w-full pt-1">
                              {/* HEARTS */}
                              <button
                                onClick={() => {
                                  playBeep(480, "sine", 0.05);
                                  updateThuneeGame({
                                    trumpSuit: "HEARTS",
                                    stage: "PLAY",
                                    currentTurn: thuneeLeadPlayerIndex,
                                    currentTurnIndex: thuneeLeadPlayerIndex,
                                    statusText: `${currentPlayerName} nominated HEART ♥️ as Trump! Game commences!`
                                  });
                                }}
                                className="py-1 xs:py-2 bg-red-950/20 hover:bg-red-900 border border-red-900/30 text-red-500 text-[8.5px] xs:text-xs font-mono rounded-lg font-bold text-center cursor-pointer transition-all uppercase"
                              >
                                ♥️ H
                              </button>
                              {/* DIAMONDS */}
                              <button
                                onClick={() => {
                                  playBeep(480, "sine", 0.05);
                                  updateThuneeGame({
                                    trumpSuit: "DIAMONDS",
                                    stage: "PLAY",
                                    currentTurn: thuneeLeadPlayerIndex,
                                    currentTurnIndex: thuneeLeadPlayerIndex,
                                    statusText: `${currentPlayerName} nominated DIAMOND ♦️ as Trump! Game commences!`
                                  });
                                }}
                                className="py-1 xs:py-2 bg-red-950/20 hover:bg-red-900 border border-red-900/30 text-red-500 text-[8.5px] xs:text-xs font-mono rounded-lg font-bold text-center cursor-pointer transition-all uppercase"
                              >
                                ♦️ D
                              </button>
                              {/* CLUBS */}
                              <button
                                onClick={() => {
                                  playBeep(480, "sine", 0.05);
                                  updateThuneeGame({
                                    trumpSuit: "CLUBS",
                                    stage: "PLAY",
                                    currentTurn: thuneeLeadPlayerIndex,
                                    currentTurnIndex: thuneeLeadPlayerIndex,
                                    statusText: `${currentPlayerName} nominated CLUB ♣️ as Trump! Game commences!`
                                  });
                                }}
                                className="py-1 xs:py-2 bg-zinc-950/50 hover:bg-zinc-805 border border-zinc-800 text-zinc-355 text-[8.5px] xs:text-xs font-mono rounded-lg font-bold text-center cursor-pointer transition-all uppercase"
                              >
                                ♣️ C
                              </button>
                              {/* SPADES */}
                              <button
                                onClick={() => {
                                  playBeep(480, "sine", 0.05);
                                  updateThuneeGame({
                                    trumpSuit: "SPADES",
                                    stage: "PLAY",
                                    currentTurn: thuneeLeadPlayerIndex,
                                    currentTurnIndex: thuneeLeadPlayerIndex,
                                    statusText: `${currentPlayerName} nominated SPADE ♠️ as Trump! Game commences!`
                                  });
                                }}
                                className="py-1 xs:py-2 bg-zinc-950/50 hover:bg-[#1a1a1a] border border-zinc-800 text-zinc-355 text-[8.5px] xs:text-xs font-mono rounded-lg font-bold text-center cursor-pointer transition-all uppercase"
                              >
                                ♠️ S
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-2 space-y-1.5">
                            <span className="text-xl animate-spin inline-block">⏳</span>
                            <p className="text-[7.5px] xs:text-[9.5px] font-mono text-zinc-400 uppercase tracking-wider font-black">OPPONENTS PICKING TRUMPS...</p>
                            <p className="text-[7px] xs:text-[8px] text-zinc-500 uppercase font-mono">Caller: {thuneeSeats[thuneeLeadPlayerIndex]?.split(" ")[0] || "Seat"}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* C. ACTIVE LIVE PLAY GRAPHICSFELT */}
                    {thuneeStage === "PLAY" && (
                      <div className="w-[125px] xs:w-[170px] sm:w-[180px] h-[105px] xs:h-[130px] sm:h-[140px] border border-dashed border-emerald-900/40 bg-zinc-950/80 rounded-2xl relative shadow-inner flex items-center justify-center p-2">
                        {thuneePlayedCardsNew.length === 0 ? (
                          <span className="text-[7px] xs:text-[8.5px] font-mono text-zinc-650 uppercase font-black tracking-widest text-center select-none leading-relaxed">
                            No Cards Placed.<br />Throw lead Card
                          </span>
                        ) : (
                          <div className="w-full h-full relative font-mono">
                            {thuneePlayedCardsNew.map((played, idx) => {
                              const isRuby = played.card.suit === "HEARTS" || played.card.suit === "DIAMONDS";
                              const suitSymbol = played.card.suit === "HEARTS" ? "♥️" : played.card.suit === "DIAMONDS" ? "♦️" : played.card.suit === "CLUBS" ? "♣️" : "♠️";
                              
                              // Absolute orientation positioning calculations inside the mini playground felt card
                              let pos = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
                              if (played.playerIndex === myIdx) pos = "bottom-1 xs:bottom-1.5 left-1/2 -translate-x-1/2";
                              else if (played.playerIndex === leftIdx) pos = "left-1 xs:left-1.5 top-1/2 -translate-y-1/2";
                              else if (played.playerIndex === partnerIdx) pos = "top-1 xs:top-1.5 left-1/2 -translate-x-1/2";
                              else if (played.playerIndex === rightIdx) pos = "right-1 xs:right-1.5 top-1/2 -translate-y-1/2";

                              return (
                                <div
                                  key={idx}
                                  className={`absolute ${pos} bg-white text-zinc-950 font-mono font-black text-[8px] xs:text-[10px] px-1.5 py-1 xs:px-2.5 xs:py-1.5 rounded-lg border border-zinc-200 shadow-lg flex flex-col items-center leading-none`}
                                >
                                  <span className={isRuby ? "text-red-500" : "text-zinc-950"}>{played.card.rank}{suitSymbol}</span>
                                  <span className="text-[4.5px] xs:text-[5.5px] font-sans text-zinc-500 font-bold block mt-0.5 xs:mt-1 uppercase truncate max-w-[32px] xs:max-w-[45px]">
                                    {thuneeSeats[played.playerIndex]?.split(" ")[0]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {currentLeaderSuit && (
                          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[6.5px] xs:text-[7.5px] text-zinc-500 font-mono uppercase tracking-widest leading-none font-bold text-nowrap">
                            Lead Suit: <span className="text-white bg-zinc-900 border border-zinc-800 rounded px-1">{currentLeaderSuit}</span>
                          </span>
                        )}
                      </div>
                    )}

                  </div>

                  {/* EAST PLAYER SEAT - Absolutely floated on right edge */}
                  <div className="absolute right-1 xs:right-3 top-1/2 -translate-y-1/2 w-[70px] xs:w-[90px] sm:w-[110px] text-center bg-black/80 backdrop-blur-md rounded-xl p-1.5 border border-zinc-900 shadow-md z-10">
                    <span className={`block px-1 py-0.5 rounded text-[7.5px] xs:text-[8.5px] font-mono uppercase font-black truncate max-w-full ${
                      thuneeCurrentTurnIndex === rightIdx ? "bg-emerald-500 text-black border border-emerald-400 font-bold" : "text-zinc-400"
                    }`}>
                      👤 East ({getSeatNameWithIcon(rightIdx, "East").split(" ")[0]})
                    </span>
                    {thuneeAllCardsNew[rightIdx.toString()] && (
                      <p className="text-[6.5px] xs:text-[7px] text-zinc-500 font-mono uppercase mt-0.5">{thuneeAllCardsNew[rightIdx.toString()].length} cards</p>
                    )}
                  </div>

                </div>

                {/* SOUTH PLAYER SEAT (CLIENT ACTIVE TURN INDICATOR) */}
                <div className="text-center z-10 space-y-1">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-tight ${
                    thuneeCurrentTurnIndex === myIdx ? "bg-emerald-500 text-black border border-emerald-400 shadow-md animate-pulse" : "bg-black/70 text-zinc-400"
                  }`}>
                    👇 SOUTH (YOU: {currentPlayerName})
                  </span>
                  <div className="flex gap-2.5 items-center justify-center text-[9px] font-mono text-zinc-400">
                    <span>Round tricks won: <strong className="text-white">{thuneeTricksWon.ourTeam} Tricks</strong></span>
                    <span>•</span>
                    <span>Round Points: <strong className="text-emerald-400">{thuneeRoundScores.ourTeam} Pts</strong></span>
                  </div>
                </div>

              </div>

              {/* HAND & MAIN CONTROL CONSOLE BAR */}
              {thuneeStage === "PLAY" && (
                <div className="space-y-3 shrink-0">
                  <div className="bg-black/50 p-3 rounded-2xl border border-zinc-900">
                    <div className="flex justify-between items-center px-1 mb-2">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black">YOUR HAND ({thuneeHand.length} CLASH CARDS CAPABLE)</span>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${thuneeCurrentTurnIndex === myIdx ? "bg-emerald-400 animate-ping" : "bg-zinc-600"}`} />
                        <span className="text-[8.5px] font-mono uppercase text-zinc-400">
                          {thuneeCurrentTurnIndex === myIdx ? "YOUR TURN - THROW NOW!" : "⏳ Opponent deciding..."}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 justify-center py-1">
                      {thuneeHand.map((card) => {
                        const isRuby = card.suit === "HEARTS" || card.suit === "DIAMONDS";
                        const suitSymbol = card.suit === "HEARTS" ? "♥️" : card.suit === "DIAMONDS" ? "♦️" : card.suit === "CLUBS" ? "♣️" : "♠️";
                        const isTurn = thuneeCurrentTurnIndex === myIdx;
                        
                        // Suggestion highlighted indicator check
                        const isSuggested = card.id === thuneeSuggestedCardId;

                        return (
                          <button
                            key={card.id}
                            disabled={!isTurn}
                            onClick={() => {
                              setThuneeSuggestedCardId(null);
                              handleUserPlayThuneeCard(card);
                            }}
                            className={`flex flex-col justify-between p-1.5 xs:p-2 w-[44px] xs:w-[52px] sm:w-[55px] h-[64px] xs:h-[74px] sm:h-[78px] border rounded-lg xs:rounded-xl font-mono transition-all duration-200 shadow-sm bg-white text-zinc-900 select-none cursor-pointer ${
                              isSuggested 
                                ? "ring-4 ring-amber-400 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse scale-105"
                                : isTurn
                                  ? "hover:-translate-y-2 hover:shadow-xl hover:border-emerald-500 ring-2 ring-emerald-500/5 hover:scale-105 active:scale-95"
                                  : "opacity-40 grayscale cursor-not-allowed hover:scale-100"
                            }`}
                          >
                            <div className="flex justify-between items-center w-full leading-none">
                              <span className={`text-xs xs:text-sm font-black tracking-tight ${isRuby ? "text-red-600" : "text-zinc-900"}`}>{card.rank}</span>
                              <span className={`text-[8px] xs:text-[10px] ${isRuby ? "text-red-500" : "text-zinc-900"}`}>{suitSymbol}</span>
                            </div>
                            <div className={`text-xs xs:text-base font-black text-center leading-none -mt-1 w-full ${isRuby ? "text-red-500" : "text-zinc-900"}`}>
                              {suitSymbol}
                            </div>
                            <div className="text-[5px] xs:text-[6.5px] font-mono text-zinc-450 uppercase leading-none font-bold text-center w-full block border-t border-zinc-100 pt-0.5">
                              {card.points} PTS
                            </div>
                          </button>
                        );
                      })}

                      {thuneeHand.length === 0 && (
                        <div className="py-4 text-center font-mono text-[10px] text-zinc-500 uppercase italic">
                          Wait for standard trick resolution complete to process scores...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BOTTOM DECLARATION OPERATOR WRAPPER PANEL */}
                  <div className="flex gap-3 w-full items-stretch">
                    {!thuneeCallThunee && thuneeHand.length > 0 && (
                      <button
                        onClick={() => {
                          playBeep(980, "sine", 0.15);
                          updateThuneeGame({
                            caller: currentPlayerName,
                            callThuneeFlag: true,
                            statusText: `🔥 ${currentPlayerName} SHOUTED THUNEE! Durban Sweep rule applied! 6/6 tricks required!`
                          });
                          triggerToast("🚨 THUNEE DECLARED! ALL 6 TRICKS MANDATORY!", "success");
                        }}
                        className="flex-1 py-3 bg-gradient-to-b from-[#1c0809] to-[#120405] hover:from-[#2a0e10] hover:to-[#1a0607] border border-red-500/20 hover:border-red-500/40 text-red-500 hover:text-red-400 font-sans font-black text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-widest rounded-xl cursor-pointer duration-150 flex flex-col sm:flex-row items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(239,68,68,0.05)] hover:shadow-[0_4px_16px_rgba(239,68,68,0.15)] transition-all font-bold"
                      >
                        <span className="inline-block animate-pulse text-red-500 text-xs sm:text-sm">🚨</span>
                        <span className="font-bold tracking-widest">THUNEE SWEEP</span>
                      </button>
                    )}

                    {thuneePlayedCardsNew.length === 4 && (
                      <button
                        onClick={() => {
                          setThuneeSuggestedCardId(null);
                          collectThuneeTrick();
                        }}
                        className={`${!thuneeCallThunee && thuneeHand.length > 0 ? "flex-[2_2_0%]" : "w-full"} py-3.5 bg-gradient-to-b from-[#0c2214] to-[#04120a] hover:from-[#12301d] hover:to-[#081b0f] border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 font-sans font-black text-[9px] xs:text-[10.5px] xs:tracking-wider sm:text-xs uppercase rounded-xl cursor-pointer duration-200 shadow-[0_4px_12px_rgba(16,185,129,0.05)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 transition-all`}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          <span className="font-bold tracking-widest text-center">COLLECT ACTIVE TRICK</span>
                        </div>
                        <span className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] font-mono px-2 py-0.5 bg-black/60 rounded-full border border-emerald-500/15 text-emerald-400/80">
                          TRICK #{6 - thuneeHand.length} COMPLETE
                        </span>
                      </button>
                    )}
                  </div>

                </div>
              )}

              {/* D. ROUND OVER RESOLUTION PANEL */}
              {thuneeStage === "ROUND_OVER" && (
                <div className="flex flex-col items-center gap-3 bg-[#111914] p-5 rounded-3xl border border-emerald-900/35 text-center max-w-md mx-auto w-full relative z-10 shadow-lg">
                  <div>
                    <span className="text-2xl">🏆</span>
                    <h5 className="font-display font-black text-emerald-400 text-xs xs:text-sm uppercase tracking-widest mt-1">
                      ROUND COMPILATION ANALYSIS
                    </h5>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">Calculating trick point value summation</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 w-full py-2 font-mono">
                    <div className="bg-black/40 p-3 rounded-2xl border border-zinc-900">
                      <p className="text-[8px] text-zinc-500 uppercase font-black">Your Team (South/North)</p>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">{thuneeTricksWon.ourTeam} Tricks</p>
                      <p className="text-xs font-black text-white">{thuneeRoundScores.ourTeam} Round Pts</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-2xl border border-zinc-900">
                      <p className="text-[8px] text-zinc-500 uppercase font-black">Opponent Team</p>
                      <p className="text-sm font-bold text-zinc-400 mt-0.5">{thuneeTricksWon.enemyTeam} Tricks</p>
                      <p className="text-xs font-black text-zinc-300">{thuneeRoundScores.enemyTeam} Round Pts</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setThuneeSuggestedCardId(null);
                      resolveThuneeRound();
                    }}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-bold text-xs uppercase rounded-xl tracking-wider cursor-pointer duration-150 active:scale-95 shadow-md"
                  >
                    🏆 COMPUTE & UPDATE MATCH SCORES
                  </button>
                </div>
              )}

              {/* E. GAME OVER GRAND RESUOLUTION PANEL */}
              {thuneeStage === "GAME_OVER" && (
                <div className="flex flex-col items-stretch gap-4 bg-black/75 p-6 rounded-3xl border border-[#3E5E93]/25 text-center max-w-md mx-auto w-full relative z-10 shadow-2xl">
                  <span className="text-4xl animate-bounce">👑</span>
                  <div>
                    <h4 className="font-display font-black text-white text-sm uppercase tracking-widest">
                      CHAMPIONSHIP MATCH TERMINATED!
                    </h4>
                    <p className="text-[10px] text-zinc-500 italic mt-1 font-mono">First team to win 4 championship series claims victory</p>
                  </div>
                  
                  <div className="bg-[#121915] border border-emerald-500/15 py-3 rounded-2xl">
                    <p className="text-xs font-mono text-zinc-300">
                      GRAND WINNING TEAM: <span className="text-emerald-400 font-black">{thuneeGameScores.ourTeam >= 4 ? "YOUR TEAM" : "THE OPPOSITION CLUB"}</span>
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Final scores metrics: {thuneeGameScores.ourTeam} - {thuneeGameScores.enemyTeam}</p>
                  </div>

                  <button
                    onClick={() => {
                      playBeep(450, "sine", 0.05);
                      setThuneeSuggestedCardId(null);
                      setThuneeGameMode(null);
                    }}
                    className="w-full py-3 bg-[#3E5E93] hover:bg-orange-400 text-black font-sans font-bold text-xs uppercase rounded-xl cursor-pointer duration-150 text-center shadow-md font-black"
                  >
                    🃏 RETURN TO MODE LOBBY SELECTION
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR: INTELLIGENT HELP DESK & CHEAT SHEET VIEWPORTS */}
        <aside className={`w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l border-zinc-900 bg-zinc-950 p-4 overflow-y-auto flex flex-col justify-start space-y-4 shrink-0 shadow-2xl relative z-10 ${mobileActiveTab === "COACH" ? "flex" : "hidden lg:flex"}`}>
          
          {/* A. GRILL BOSS STRATEGY DESK */}
          <div className="bg-emerald-950/25 border border-emerald-900/35 p-4 rounded-2xl flex flex-col gap-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🧑‍🍳</span>
              <div>
                <h5 className="font-display font-black text-xs text-emerald-400 uppercase tracking-widest">
                  Grill Boss Advice Bureau
                </h5>
                <p className="text-[8px] font-mono text-zinc-400 uppercase">
                  Durban Tactical Expert Bot
                </p>
              </div>
            </div>

            <div className="bg-black/85 border border-zinc-900 rounded-xl p-3 min-h-[90px] flex items-center justify-center shadow-inner">
              {thuneeAdviceText ? (
                <p className="text-[11px] font-mono text-emerald-350 leading-relaxed antialiased">
                  {thuneeAdviceText}
                </p>
              ) : (
                <p className="text-[10.5px] font-mono text-zinc-500 italic text-center leading-relaxed">
                  Stuck or confused by the complex Durban rules? Press the Suggestion button to let Coach scan your deck and spotlight the optimal card!
                </p>
              )}
            </div>

            <button
              onClick={() => {
                playBeep(520, "sine", 0.05);
                const advice = getThuneeCoachAdviceMessage();
                setThuneeAdviceText(advice.text);
                setMobileActiveTab("COACH");
                if (advice.recoCard) {
                  setThuneeSuggestedCardId(advice.recoCard.id);
                  triggerToast(`💡 Reco: Play ${advice.recoCard.rank}!`, "stamp");
                } else {
                  setThuneeSuggestedCardId(null);
                }
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-black text-[10px] uppercase rounded-xl tracking-wider cursor-pointer font-bold duration-150 text-center"
            >
              💡 Ask Coach Grill Boss
            </button>
          </div>

          {/* B. DURBAN CHAMPION CHEAT DECK SHEET */}
          <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl flex flex-col gap-2.5">
            <h5 className="font-display font-black text-zinc-300 text-xs uppercase tracking-wider">
              🏆 DECK POINT VALUATIONS
            </h5>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex justify-between border-b border-zinc-900/60 pb-1.5 px-2 bg-black/45 rounded">
                <span className="text-emerald-400 font-bold">👑 JACK (J):</span>
                <span className="text-yellow-400 font-black">30 PTS</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/60 pb-1.5 px-2 bg-black/45 rounded">
                <span className="text-emerald-400 font-bold">♦️ NINE (9):</span>
                <span className="text-yellow-400 font-black">20 PTS</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/60 pb-1.5 px-2 bg-black/45 rounded">
                <span className="text-emerald-400 font-bold">♥️ ACE (A):</span>
                <span className="text-yellow-400 font-black">11 PTS</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/60 pb-1.5 px-2 bg-black/45 rounded">
                <span className="text-emerald-400 font-bold">♣️ TEN (10):</span>
                <span className="text-yellow-400 font-black">10 PTS</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/60 pb-1.5 px-2 bg-black/45 rounded font-bold">
                <span className="text-zinc-500">♠️ KING (K):</span>
                <span className="text-zinc-300">3 PTS</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/60 pb-1.5 px-2 bg-black/45 rounded font-bold">
                <span className="text-zinc-500">🌸 QUEEN (Q):</span>
                <span className="text-zinc-300">2 PTS</span>
              </div>
            </div>
            <p className="text-[9px] text-zinc-500 font-mono leading-relaxed mt-1">
              Entire card points sums up to <span className="text-zinc-300 font-bold">304 PTS</span>. Trick sweeps compile scores; first team to reach <span className="text-emerald-400 font-bold">151 PTS</span> conquers the round!
            </p>
          </div>

          {/* C. HOW TO PLAY DURBAN TUTORIAL CARDS */}
          {thuneeShowHelpSheet && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#121212]/95 border-2 border-[#3E5E93]/40 p-4 rounded-2xl space-y-3.5 relative shadow-2xl"
            >
              <button 
                onClick={() => setThuneeShowHelpSheet(false)}
                className="absolute top-3 right-3 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer text-[10px] uppercase font-black"
              >
                ✕ Close
              </button>
              
              <div>
                <span className="text-[#3E5E93] font-mono text-[8px] font-black uppercase tracking-wider block">OFFICIAL TOURNAMENT EDITION</span>
                <h6 className="font-display font-black text-white text-xs uppercase tracking-widest">
                  THE DURBAN THUNEE RULEBOOK & MANUAL
                </h6>
              </div>

              {/* Tabs selector */}
              <div className="flex gap-1 border-b border-zinc-900 pb-2 overflow-x-auto">
                {[
                  { id: "basics", label: "01. BASICS" },
                  { id: "pointvals", label: "02. SCORING" },
                  { id: "trumps", label: "03. SUITING & TRUMPS" },
                  { id: "calls", label: "04. JORI & THUNEE" }
                ].map((thb) => (
                  <button
                    key={thb.id}
                    onClick={() => {
                      playBeep(450, "sine", 0.05);
                      setManualTab(thb.id as any);
                    }}
                    className={`px-2 py-1 text-[8.5px] font-mono rounded border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      manualTab === thb.id 
                        ? "bg-[#3E5E93] border-[#3E5E93] text-black font-black" 
                        : "bg-black/60 border-zinc-850 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {thb.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Tab Content rendering */}
              <div className="text-[9.5px] text-zinc-300 font-mono leading-relaxed bg-black/60 p-3 rounded-xl border border-zinc-900 space-y-2 max-h-[190px] overflow-y-auto">
                {manualTab === "basics" && (
                  <div className="space-y-1.5">
                    <p className="text-[#3E5E93] font-bold uppercase text-[9px]">📍 THE CRITICAL CORE GOAL:</p>
                    <p>Thunee is a trick-taking card game played by <strong className="text-white">4 players in 2 competing partnership teams</strong>. It uses 24 cards (from Nine to Ace of all suits).</p>
                    <p>First team to secure <strong className="text-yellow-400">151 trick points</strong> during played hands wins the active round. Round victories reward match points; series is completed once a team reaches 4 match points first!</p>
                  </div>
                )}

                {manualTab === "pointvals" && (
                  <div className="space-y-1.5">
                    <p className="text-[#3E5E93] font-bold uppercase text-[9px]">🏆 DURBAN CARD EVALUATIONS (NOT STANDARD HIERARCHY):</p>
                    <div className="grid grid-cols-2 gap-1.5 border-y border-zinc-900 py-1.5 text-[9px]">
                      <p>✨ <strong className="text-white">JACK:</strong> 30 PTS (highest rank)</p>
                      <p>⚡ <strong className="text-white">NINE:</strong> 20 PTS</p>
                      <p>💎 <strong className="text-white">ACE:</strong> 11 PTS</p>
                      <p>🔥 <strong className="text-white">TEN:</strong> 10 PTS</p>
                      <p>👑 <strong className="text-zinc-500">KING:</strong> 3 PTS</p>
                      <p>🌸 <strong className="text-zinc-500">QUEEN:</strong> 2 PTS</p>
                    </div>
                    <p className="text-[8.5px] text-zinc-550 leading-tight">Total playable point volume adds strictly to 304. Swept cards are accumulated to calculate team scores instantly.</p>
                  </div>
                )}

                {manualTab === "trumps" && (
                  <div className="space-y-1.5">
                    <p className="text-[#3E5E93] font-bold uppercase text-[9px]">🛡️ SUITING, LEADING & TRUMP CUTTING LAWS:</p>
                    <p>1. <strong className="text-white">The Lead Suit:</strong> The first thrown card in a round trick sets the "lead suit". All following players MUST match this suit if they have it.</p>
                    <p>2. <strong className="text-white">Hold Suit mandate:</strong> If you are holding cards of the trick's lead suit, throwing them is obligatory. Throwing another suit while matching is cheating.</p>
                    <p>3. <strong className="text-white">Elective Trump Cutting:</strong> If you are clean out of matching lead suit cards, you can throw a "TRUMP CARD" to CUT the trick and win it, or discard a low value spacer.</p>
                  </div>
                )}

                {manualTab === "calls" && (
                  <div className="space-y-1.5">
                    <p className="text-[#3E5E93] font-bold uppercase text-[9px]">📣 CHAMPIONSHIP CALL MECHANICS:</p>
                    <p>• <strong className="text-white">JORI (Double points):</strong> If you hold both Jack and Nine of the Trump suit, declaring Jori doubles match scores at the end of matches.</p>
                    <p>• <strong className="text-white">THUNEE (Trick Sweep):</strong> If you nominate yourself to sweeps ALL tricks single-handedly without partner assistance, call "Thunee". Successfully sweep the table to gain 4 instant match points!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* D. SEED RESTART CONTROL */}
          <div className="border-t border-zinc-900 pt-4 mt-auto flex flex-col gap-2 shrink-0">
            <button
              onClick={() => {
                if (window.confirm("Do you want to re-deal hands and reset scores? This will restart the current table match series!")) {
                  triggerLobbyReset();
                }
              }}
              className="w-full py-2.5 bg-zinc-900/50 hover:bg-zinc-850 text-zinc-400 hover:text-red-400 border border-zinc-900 text-[9px] font-mono uppercase tracking-widest rounded-lg cursor-pointer transition-all duration-150 text-center font-bold"
            >
              ⚠️ Restart Match Series
            </button>
          </div>

        </aside>

      </div>
    </div>
  );
}
