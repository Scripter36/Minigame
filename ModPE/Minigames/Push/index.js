/*jshint esversion: 6 */
exports = (function() {
    var PlayerData = [];
    var started = false;
    var startCool = 200;
    var backPosition = [];
    var backBlock = [];
    var gamePosition = [];
    var teleportCool = 0;
    var removeCool = 0;
    var removeBlock = [];
    var removeVector = [];
    var helpMessage = [/*밀치기*/"[PVP " + S.T[3] + "가능" + S.T[0] + ", 블럭 캐기 " + S.T[2] + "불가능" + S.T[0] + "]", "점점 작아지는 발판 위에서 적을 떨어뜨리세요.", "떨어지면 탈락이며, 1명이 남을 때까지 진행됩니다."];
    return {
        ended: false,
        onLoad: function() {
            R_Server.sendChat(S.T[1] + "밀치기" + S.T[0] + "를 시작합니다.", false, true);
            for (var i in helpMessage) R_Server.sendChat(helpMessage[i], false, true);
            R_Server.sendChat(S.T[0] + "게임에 참여하실 분은 " + S.T[1] + "바닥을 터치" + S.T[0] + "하여 주세요. 10초 후에 게임이 시작됩니다.", false, true);
            R_Server.protectBlock(true);
        },
        modTick: function() {
            if (this.ended) return;
            for (var i = PlayerData.length - 1 ; i >= 0 ; i--){
                if (!Player.isPlayer(PlayerData[i].id)) {
                    PlayerData.splice(i, 1);
                    continue;
                }
            }
            if (!started) {
                R_Server.sendPopupMessage(S.T[0] + "게임에 참여하시려면 바닥을 터치하세요!");
                for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                    if (!Player.isPlayer(PlayerData[i].id)){
                        PlayerData.splice(i, 1);
                        continue;
                    }
                    if (PlayerData[i].alive) R_Server.sendPrivatePopup(PlayerData[i].name, S.T[0] + "게임에 참여하셨습니다.");
                    else R_Server.sendPrivatePopup(PlayerData[i].name, S.T[0] + "게임에 관전으로 참여하셨습니다.");
                }
                startCool--;
                if (startCool <= 0) {
                    started = true;
                    var px = Player.getX();
                    var py = Player.getY();
                    var pz = Player.getZ();
                    backPosition = [px, py, pz];
                    backBlock = [];
                    gamePosition = [px - px % 16, px - px % 16 + 16 + 8 * PlayerData.length, pz - pz % 16, pz - pz % 16 + 16 + 8 * PlayerData.length];
                    removeBlock = [gamePosition[0] + 1, gamePosition[2] + 1];
                    removeVector = [1, 0];
                    for (var x = gamePosition[0] ; x < gamePosition[1] ; x++) {
                        for (var y = 0; y <= 10; y++) {
                            for (var z = gamePosition[2] ; z < gamePosition[3] ; z++) {
                                if (y === 0) {
                                    if (x === gamePosition[0] || x === gamePosition[1] - 1 || z === gamePosition[2] || z === gamePosition[3] - 1) {
                                        backBlock.push({
                                            x: x,
                                            y: y,
                                            z: z,
                                            b: Level.getTile(x, y, z),
                                            bd: Level.getData(x, y, z)
                                        });
                                        Level.setBlock(x, y, z, 95);
                                    } else {
                                        backBlock.push({
                                            x: x,
                                            y: y,
                                            z: z,
                                            b: Level.getTile(x, y, z),
                                            bd: Level.getData(x, y, z)
                                        });
                                        Level.setBlock(x, y, z, 7);
                                    }
                                } else if (y >= 1 && y <= 4) {
                                    if (x === gamePosition[0] || x === gamePosition[1] - 1 || z === gamePosition[2] || z === gamePosition[3] - 1) {
                                        backBlock.push({
                                            x: x,
                                            y: y,
                                            z: z,
                                            b: Level.getTile(x, y, z),
                                            bd: Level.getData(x, y, z)
                                        });
                                        Level.setBlock(x, y, z, 95);
                                    } else {
                                        backBlock.push({
                                            x: x,
                                            y: y,
                                            z: z,
                                            b: Level.getTile(x, y, z),
                                            bd: Level.getData(x, y, z)
                                        });
                                        Level.setBlock(x, y, z, 0);
                                    }
                                } else if (y === 5) {
                                    backBlock.push({
                                        x: x,
                                        y: y,
                                        z: z,
                                        b: Level.getTile(x, y, z),
                                        bd: Level.getData(x, y, z)
                                    });
                                    Level.setBlock(x, y, z, 95);
                                } else if (y >= 6 && y <= 9) {
                                    if (x === gamePosition[0] || x === gamePosition[1] - 1 || z === gamePosition[2] || z === gamePosition[3] - 1) {
                                        backBlock.push({
                                            x: x,
                                            y: y,
                                            z: z,
                                            b: Level.getTile(x, y, z),
                                            bd: Level.getData(x, y, z)
                                        });
                                        Level.setBlock(x, y, z, 95);
                                    } else {
                                        backBlock.push({
                                            x: x,
                                            y: y,
                                            z: z,
                                            b: Level.getTile(x, y, z),
                                            bd: Level.getData(x, y, z)
                                        });
                                        Level.setBlock(x, y, z, 0);
                                    }
                                } else if (y === 10) {
                                    backBlock.push({
                                        x: x,
                                        y: y,
                                        z: z,
                                        b: Level.getTile(x, y, z),
                                        bd: Level.getData(x, y, z)
                                    });
                                    Level.setBlock(x, y, z, 95);
                                }
                            }
                        }
                    }
                    Level.setBlock(removeBlock[0], 0, removeBlock[1], 0);
                    for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                        if (PlayerData[i].alive){
                            Player.teleport(PlayerData[i].id, (gamePosition[0] + gamePosition[1]) / 2, 3, (gamePosition[2] + gamePosition[3]) / 2);
                        }else{
                            Player.teleport(PlayerData[i].id, (gamePosition[0] + gamePosition[1]) / 2, 8, (gamePosition[2] + gamePosition[3]) / 2);
                        }
                    }
                    teleportCool = 100;
                    level = 0;
                }
            } else {
                if (teleportCool > 0) {
                    teleportCool--;
                    if (teleportCool === 0) removeCool = 3;
                    else return;
                }
                if (removeCool > 0){
                    removeCool--;
                    if (removeCool === 0){
                        removeCool = 3;
                        var expectedBlock = [removeBlock[0] + removeVector[0], removeBlock[1] + removeVector[1]];
                        if (Level.getTile(expectedBlock[0], 0, expectedBlock[1]) === 7){
                            removeBlock[0] = expectedBlock[0];
                            removeBlock[1] = expectedBlock[1];
                            Level.setBlock(expectedBlock[0], 0, expectedBlock[1], 0);
                        }else{
                            //01 10 0-1 -10
                            if (removeVector[0] === 0){
                                var temp = removeVector[0];
                                removeVector[0] = -1 * removeVector[1];
                                removeVector[1] = -1 * temp;
                            }else{
                                var temp = removeVector[0];
                                removeVector[0] = removeVector[1];
                                removeVector[1] = temp;
                            }
                            expectedBlock = [removeBlock[0] + removeVector[0], removeBlock[1] + removeVector[1]];
                            if (Level.getTile(expectedBlock[0], 0, expectedBlock[1]) === 7){
                                removeBlock[0] = expectedBlock[0];
                                removeBlock[1] = expectedBlock[1];
                                Level.setBlock(expectedBlock[0], 0, expectedBlock[1], 0);
                            }else{
                                removeCool = 0;
                            }
                        }
                    }
                }
                var alive = 0;
                var aliveNum;
                for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                    if (Entity.getY(PlayerData[i].id) <= 1.5) {
                        PlayerData[i].alive = false;
                        Player.teleport(PlayerData[i].id, (gamePosition[0] + gamePosition[1]) / 2, 8, (gamePosition[2] + gamePosition[3]) / 2);
                        R_Server.sendChat(S.T[1] + PlayerData[i].name + S.T[0] + " 님이 탈락하셨습니다.");
                    }
                    if (PlayerData[i].alive) {
                        alive++;
                        aliveNum = i;
                    }
                    Entity.addEffect(PlayerData[i].id, 16, 20, 0);
                    Entity.addEffect(PlayerData[i].id, 6, 20, 4);
                }
                if (alive <= 1) {
                    if (aliveNum === undefined) R_Server.sendChat("게임이 끝났습니다! 우승자: 없음");
                    else R_Server.sendChat("게임이 끝났습니다! 우승자: " + S.T[1] + PlayerData[aliveNum].name);
                    for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                        Player.teleport(PlayerData[i].id, backPosition[0], backPosition[1], backPosition[2]);
                    }
                    for (var i = backBlock.length - 1 ; i >= 0 ; i--) Level.setBlock(backBlock[i].x, backBlock[i].y, backBlock[i].z, backBlock[i].b, backBlock[i].bd);
                    this.ended = true;
                    R_Server.protectBlock(false);
                    return;
                }
            }
        },
        useItem: function(x, y, z, item, b, s, id, bd) {
            if (this.ended) return;
            var p = Player.getEntity();
            var name = Player.getName(p);
            if (!started) {
                for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                    if (PlayerData[i].id === p) {
                        R_Server.sendPrivateChat(name, S.T[2] + "이미 참여하셨습니다.");
                        return;
                    } else if (PlayerData[i].name === name) {
                        R_Server.sendPrivateChat(name, S.T[2] + "이름이 겹칩니다.");
                        return;
                    }
                }
                PlayerData.push({
                    id: p,
                    name: name,
                    alive: !Entity.isSneaking(p)
                });
                R_Server.sendChat(S.T[1] + name + S.T[0] + " 님이 게임에 참가하셨습니다.");
            }
        },
        finish: function(){
            R_Server.sendChat("서버 관리자에 의해 게임이 종료되었습니다.", false, true);
            var names = [];
            for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                if (PlayerData[i].alive) names.push(PlayerData[i].name);
            }
            R_Server.sendChat("생존자: " + S.T[1] + names.join(S.T[0] + ", " + S.T[1]) + S.T[0] + ".");
            for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                Player.teleport(PlayerData[i].id, backPosition[0], backPosition[1], backPosition[2]);
            }
            for (var i = backBlock.length - 1 ; i >= 0 ; i--) Level.setBlock(backBlock[i].x, backBlock[i].y, backBlock[i].z, backBlock[i].b, backBlock[i].bd);
            this.ended = true;
            R_Server.protectBlock(false);
            return;
        }
    };
})();
