exports = (function() {
    var S = {
        T: ["§f", "§b", "§c", "§a"]
    };
    var langData = {
        ko_KR: {
            readyTimeAnnounce: "숙주좀비가 탄생하기까지 " + S.T[1] + "%1" + S.T[0] + " 초 남았습니다.",
            gameTimeAnnounce: S.T[1] + "%0" + S.T[0] + "분 " + S.T[1] + "%1" + S.T[0] + "초 남음",
            gameNotStarted: "게임이 시작되지 않았습니다.",
            readyGame: S.T[0] + "게임을 시작합니다.",
            camein: S.T[1] + "%0" + S.T[0] + "님이 %1" + S.T[0] + "으로 참가하셨습니다.",
            pleaseTouch: "게임 참가: 블럭 터치, 관전: 웅크리고 블럭 터치",
            playerType: ["인간", "숙주좀비", "좀비", "관전자"],
            playerTypeColor: ["§f", "§c", "§6", "§b"],
            buttonName: ["즉시 시작", "종족 설정"],
            selectType: "종족 설정",
            closeDialog: "닫기",
            changetype: "어드민이 " + S.T[1] + "%0" + S.T[0] + " 님의 종족을 %1" + S.T[0] + "로 변경하셨습니다.",
            nopeople: "플레이어가 부족하여 게임이 불가능합니다.",
            finishMessage: S.T[1] + "게임이 종료되었습니다!" + "\n" +
                S.T[0] + "우승: %0 !" + "\n" +
                S.T[0] + "===== VIP =====" + "\n" +
                S.T[0] + "Kill: " + S.T[1] + "%1(%2)" + "\n" +
                S.T[0] + "Death: " + S.T[1] + "%3(%4)" + "\n" +
                S.T[0] + "가장 많이 감염: " + S.T[1] + "%5(%6)" + "\n" +
                S.T[0] + "숙주좀비 스크립트를 즐겨 주셔서 감사합니다!"
        },
        en_US: {
            readyTimeAnnounce: S.T[1] + "%1" + S.T[0] + " seconds left before the host zombie is born.",
            pleaseTouch: "Play the game: Touch Block, Watch the game: Shift + Touch Block",
            playerType: ["Human", "Host Zombie", "Zombie", "Spectator"],
            playerTypeColor: ["§f", "§c", "§6", "§b"],
            buttonName: ["Start now", "set Type", "see Player", "set Server Name", "set Notice"]
        }
    }; //언어 데이터. 한국어, 영어
    var lang = ModPE.getLanguage(); //현재 언어를 불러온다
    if (lang != "ko_KR") lang = "en_US"; //언어가 한국어가 아니면 영어로 한다(근데 일본사람이나 중국사람이 이걸 할리가...?)
    //변수.
    var PlayerData = []; //요새의 심장부터 이어져온 플레이어 저장 시스템.
    var gameData = {
        started: false,
        readyMaxTime: 1000,
        readyTime: 1000,
        ready: false,
        gameMaxTime: 6000,
        gameTime: 6000,
        reloadtag: false
    }; //게임의 데이터.
    var cm = clientMessage;

    function readyGame() {
        gameData.started = true;
        sendChat(langData[lang].readyGame);
        new Thread(new Runnable({
            run: function() {
                try {
                    while (!Thread.currentThread.isInterrupted && !gameData.ready) {
                        Thread.sleep(1000);
                        gameData.readyTime -= 20;
                        if (gameData.readyTime <= 0) break;
                        if (gameData.readyTime % 200 === 0) sendChat(langData[lang].readyTimeAnnounce.replace("%1", gameData.readyTime / 20));
                    }
                } catch (e) {

                }
                gameData.ready = true;
                startGame();
            }
        })).start();
    }

    function startGame() {
        if (PlayerData.length < 2) {
            sendChat(langData[lang].nopeople);
            return;
        }
        var random = Math.floor(Math.random() * PlayerData.length);
        PlayerData[random].type = 1;
        sendChat(PlayerDatatoString());
        for (var i in PlayerData) if (PlayerData[i].type !== 0) Entity.addEffect(PlayerData[i].id, 7, 20, 4);
        new Thread(new Runnable({
            run: function() {
                try {
                    while (!Thread.currentThread.isInterrupted && gameData.ready) {
                        Thread.sleep(1000);
                        gameData.gameTime -= 20;
                        if (gameData.gameTime <= 0) break;
                    }
                } catch (e) {
                    print(e);
                }
                if (gameData.ready) stopGame(true, 0);
            }
        })).start();
    }

    function stopGame(isAnnounce, winner) {
        if (isAnnounce) {
            var killVIP = [0],
                deathVIP = [0],
                infectionVIP = [0],
                killVIPName = [PlayerData[0].name],
                deathVIPName = [PlayerData[0].name],
                infectionVIPName = [PlayerData[0].name];
            for (var i = 1, leng = PlayerData.length; i < leng; i++) {
                if (PlayerData[i].kill > PlayerData[killVIP[0]].kill) {
                    killVIP = [i];
                    killVIPName = [PlayerData[i].name];
                } else if (PlayerData[i].kill == PlayerData[killVIP[0]].kill) {
                    killVIP.push(i);
                    killVIPName.push(PlayerData[i].name);
                }

                if (PlayerData[i].death > PlayerData[deathVIP[0]].death) {
                    deathVIP = [i];
                    deathVIPName = [PlayerData[i].name];
                } else if (PlayerData[i].death == PlayerData[deathVIP[0]].death) {
                    deathVIP.push(i);
                    deathVIPName.push(PlayerData[i].name);
                }

                if (PlayerData[i].infection > PlayerData[infectionVIP[0]].infection) {
                    infectionVIP = [i];
                    infectionVIPName = [PlayerData[i].name];
                } else if (PlayerData[i].infection == PlayerData[infectionVIP[0]].infection) {
                    infectionVIP.push(i);
                    infectionVIPName.push(PlayerData[i].name);
                }
            }
            sendChat(langData[lang].finishMessage.replace("%0", langData[lang].playerTypeColor[winner] + langData[lang].playerType[winner] + S.T[0]).replace("%1", killVIPName.join(S.T[0] + ", " + S.T[1])).replace("%2", PlayerData[killVIP[0]].kill).replace("%3", deathVIPName.join(S.T[0] + ", " + S.T[1])).replace("%4", PlayerData[deathVIP[0]].death).replace("%5", infectionVIPName.join(S.T[0] + ", " + S.T[1])).replace("%6", PlayerData[infectionVIP[0]].infection));
            gameData.finishString = langData[lang].finishMessage.replace("%0", langData[lang].playerTypeColor[winner] + langData[lang].playerType[winner] + S.T[0]).replace("%1", killVIPName.join(S.T[0] + ", " + S.T[1])).replace("%2", PlayerData[killVIP[0]].kill).replace("%3", deathVIPName.join(S.T[0] + ", " + S.T[1])).replace("%4", PlayerData[deathVIP[0]].death).replace("%5", infectionVIPName.join(S.T[0] + ", " + S.T[1])).replace("%6", PlayerData[infectionVIP[0]].infection);
        }
        for (var i in PlayerData) Entity.addEffect(PlayerData[i].id, 7, 20, 4);
        gameData.reloadtag = true;
    }

    function PlayerDatatoString() {
        var hostzombie = [];
        var zombie = [];
        var human = [];
        for (var i in PlayerData) {
            if (PlayerData[i].type === 0) {
                human.push(PlayerData[i].name);
            } else if (PlayerData[i].type === 1) {
                hostzombie.push(PlayerData[i].name);
            } else if (PlayerData[i].type === 2) {
                zombie.push(PlayerData[i].name);
            }
        }
        return langData[lang].playerTypeColor[1] + langData[lang].playerType[1] + S.T[0] + ": " + S.T[1] + hostzombie.join(S.T[0] + ", " + S.T[1]) + "\n" +
            langData[lang].playerTypeColor[0] + langData[lang].playerType[0] + S.T[0] + ": " + S.T[1] + human.join(S.T[0] + ", " + S.T[1]) + "\n" +
            langData[lang].playerTypeColor[2] + langData[lang].playerType[2] + S.T[0] + ": " + S.T[1] + zombie.join(S.T[0] + ", " + S.T[1]);
    }
    return {
        ended: false,
        onLoad: function() {
            var lang = ModPE.getLanguage(); //현재 언어를 불러온다
            if (lang != "ko_KR") lang = "en_US"; //언어가 한국어가 아니면 영어로 한다(근데 일본사람이나 중국사람이 이걸 할리가...?)
            cm(S.T[0] + "Zombie Minigame Script 2.0");
            cm(S.T[0] + "© 2017. Scripter All Rights Reserved.");
            addonInstalled = true;
            admin = Player.getEntity();
            readyGame();
        },
        useItem: function(x, y, z, i, b, s, id, bd) {
            var player = Player.getEntity();
            if (gameData.started && !gameData.ready && Entity.isSneaking(player)) {
                for (var i in PlayerData)
                    if (PlayerData[i].name == Player.getName(player)) PlayerData.splice(i, 1);
                PlayerData.push({
                    id: player,
                    name: Player.getName(player),
                    type: 3
                });
                R_Server.sendTipMessage(langData[lang].camein.replace("%0", Player.getName(player)).replace("%1", langData[lang].playerTypeColor[3] + langData[lang].playerType[3]));
            } else if (gameData.started && !gameData.ready && !Entity.isSneaking(player)) {
                for (var i in PlayerData)
                    if (PlayerData[i].name == Player.getName(player)) PlayerData.splice(i, 1);
                PlayerData.push({
                    id: player,
                    name: Player.getName(player),
                    type: 0,
                    kill: 0,
                    death: 0,
                    infection: 0
                });
                sendChat(langData[lang].camein.replace("%0", Player.getName(player)).replace("%1", langData[lang].playerTypeColor[0] + langData[lang].playerType[0]));
            } else if (gameData.ready && Entity.isSneaking(player)) {
                for (var i in PlayerData) {
                    if (PlayerData[i].type !== 0) continue;
                    if (PlayerData[i].name == Player.getName(player) || PlayerData[i].name == Player.getName(player).split("] ")[1]) {
                        Level.dropItem(x, y + 1, z, 0, 262, 64, 0);
                        Level.dropItem(x, y + 1.1, z, 0, 262, 64, 0);
                        Level.dropItem(x, y + 1.2, z, 0, 262, 64, 0);
                        Level.dropItem(x, y + 1.3, z, 0, 262, 64, 0);
                        Level.dropItem(x, y + 1.4, z, 0, 262, 64, 0);
                        Level.dropItem(x, y + 1.5, z, 0, 262, 64, 0);
                        Level.dropItem(x, y + 1.6, z, 0, 262, 1, 0);
                        Level.dropItem(x, y + 1.7, z, 0, 261, 1, 0);
                    }
                }
            }
        },
        modTick: function() {
            if (!gameData.ready) {
                if (!gameData.started) {
                    R_Server.sendTipMessage(langData[lang].gameNotStarted);
                    return;
                }
                R_Server.sendTipMessage(langData[lang].pleaseTouch);
                return;
            }
            if (gameData.reloadtag) {
                if (PlayerData.length === 0) {
                    sendChat(gameData.finishString);
                    gameData = {
                        started: false,
                        readyMaxTime: 1000,
                        readyTime: 1000,
                        ready: false,
                        gameMaxTime: 6000,
                        gameTime: 6000,
                        reloadtag: false
                    };
                    return;
                }
                for (var i = PlayerData.length - 1; i >= 0; i--) {
                    if (PlayerData[i] === undefined) continue;
                    if (Entity.getHealth(PlayerData[i].id) < 1) {
                        Entity.setNameTag(PlayerData[i].id, PlayerData[i].name);
                        PlayerData.splice(i, 1);
                        continue;
                    }
                }
                return;
            }
            var human = 0;
            try {
                for (var i in PlayerData) {
                    if (PlayerData[i] === undefined) continue;
                    if (Entity.getHealth(PlayerData[i].id) < 1) {
                        Entity.setNameTag(PlayerData[i].id, "[" + langData[lang].playerTypeColor[PlayerData[i].type] + langData[lang].playerType[PlayerData[i].type] + S.T[0] + "] " + PlayerData[i].name);
                        continue;
                    }
                    if (PlayerData[i].type === 0) human++;
                    else if (PlayerData[i].type === 1) {
                        Entity.addEffect(PlayerData[i].id, 1, 20, 2);
                        Entity.addEffect(PlayerData[i].id, 10, 20, 4);
                        Entity.addEffect(PlayerData[i].id, 11, 20, 1);
                    } else if (PlayerData[i].type === 2) {
                        Entity.addEffect(PlayerData[i].id, 1, 20, 0);
                        Entity.addEffect(PlayerData[i].id, 10, 20, 2);
                        Entity.addEffect(PlayerData[i].id, 11, 20, 0);
                    }
                }
            } catch (e) {}
            if (human === 0) {
                stopGame(true, 2);
            }
            var time = gameData.gameTime / 20;
            R_Server.sendTipMessage(PlayerDatatoString() + "\n" + langData[lang].gameTimeAnnounce.replace("%0", Math.floor(time / 60)).replace("%1", time % 60));
        },
        entityHurtHook: function(a, v, h) {
            if (!gameData.ready) return;
            var attacker, victor;
            for (var i in PlayerData) {
                if (PlayerData[i].name === Player.getName(a) || PlayerData[i].name === Player.getName(a).split("] ")[1]) {
                    attacker = i;
                } else if (PlayerData[i].name === Player.getName(v) || PlayerData[i].name === Player.getName(v).split("] ")[1]) {
                    victor = i;
                }
            }
            if (attacker === undefined || victor === undefined) return;
            if (victor === undefined || PlayerData[victor].type === 3) {
                preventDefault();
                return;
            }
            if (attacker === undefined) return;
            var human = [0];
            var zombie = [1, 2];
            if (human.indexOf(PlayerData[attacker].type) != -1 && human.indexOf(PlayerData[victor].type) != -1) {
                preventDefault();
            } else if (zombie.indexOf(PlayerData[attacker].type) != -1 && zombie.indexOf(PlayerData[victor].type) != -1) {
                preventDefault();
            }
            if ((PlayerData[attacker].type === 1 || PlayerData[attacker].type === 2) && PlayerData[victor].type === 0) {
                Entity.addEffect(PlayerData[victor].id, 7, 20, 4);
                sendChat(langData[lang].playerTypeColor[PlayerData[attacker].type] + langData[lang].playerType[PlayerData[attacker].type] + S.T[0] + " " + PlayerData[attacker].name + " 님이 " + langData[lang].playerTypeColor[PlayerData[victor].type] + langData[lang].playerType[PlayerData[victor].type] + S.T[0] + " " + PlayerData[victor].name + " 님을 감염시켰습니다.");
                PlayerData[victor].type = 2;
                PlayerData[attacker].infection++;
            }
        },
        deathHook: function(m, v) {
            var murder, victor;
            for (var i in PlayerData) {
                if (PlayerData[i].name === Player.getName(m).split("] ")[1] || PlayerData[i].name === Player.getName(m)) {
                    murder = i;
                } else if (PlayerData[i].name === Player.getName(v).split("] ")[1] || PlayerData[i].name === Player.getName(v)) {
                    victor = i;
                }
            }
            if (murder === undefined || victor === undefined) return;
            sendChat(langData[lang].playerTypeColor[PlayerData[murder].type] + langData[lang].playerType[PlayerData[murder].type] + S.T[0] + " " + PlayerData[murder].name + " 님이 " + langData[lang].playerTypeColor[PlayerData[victor].type] + langData[lang].playerType[PlayerData[victor].type] + S.T[0] + " " + PlayerData[victor].name + " 님을 죽였습니다.");
            if (PlayerData[murder].type === 0) {
                PlayerData[murder].kill++;
                PlayerData[victor].death++;
            }
        }
    };
})();
