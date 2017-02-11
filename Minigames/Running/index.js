/*jshint esversion: 6 */
exports = (function() {
    var PlayerData = [];
    var started = false;
    var startCool = 200;
    var backPosition = [];
    var backBlock = [];
    var gamePosition = [];
    var teleportCool = 0;
    var removeBlock = [];
    var itemCool = 0;
    var helpMessage = [/*런닝*/"[PVP " + S.T[3] + "가능" + S.T[0] + ", 블럭 캐기 " + S.T[2] + "불가능" + S.T[0] + "]", "유리를 밟으면 초록색에서 빨간색으로 변하다 사라집니다.", "10초마다 맵 위에 화염구가 떨어지며, 이것으로 터치 시 주변 5x5가 밟은 상태가 됩니다." ,"떨어지면 탈락이며, 1명이 남을 때까지 진행됩니다."];
    return {
        ended: false,
        onLoad: function() {
            R_Server.sendChat(S.T[1] + "런닝" + S.T[0] + "을 시작합니다.", false, true);
            for (var i in helpMessage) R_Server.sendChat(helpMessage[i], false, true);
            R_Server.sendChat(S.T[0] + "게임에 참여하실 분은 " + S.T[1] + "바닥을 터치" + S.T[0] + "하여 주세요. 10초 후에 게임이 시작됩니다.", false, true);
            R_Server.protectBlock(true);
        },
        modTick: function() {
            if (this.ended) return;
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
                    for (var x = gamePosition[0] ; x < gamePosition[1] ; x++) {
                        for (var y = 0; y <= 10; y++) {
                            for (var z = gamePosition[2] ; z < gamePosition[3] ; z++) {
                                if (y === 0) {
                                    backBlock.push({
                                        x: x,
                                        y: y,
                                        z: z,
                                        b: Level.getTile(x, y, z),
                                        bd: Level.getData(x, y, z)
                                    });
                                    Level.setBlock(x, y, z, 20);
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
                    if (teleportCool === 0){
                        itemCool = 100;
                    }else return;
                }
                if (itemCool > 0){
                    itemCool--;
                    if (itemCool === 0){
                        itemCool = 100;
                        Level.dropItem(gamePosition[0] + Math.random() * (gamePosition[1] - gamePosition[0]), 1, gamePosition[2] + Math.random() * (gamePosition[3] - gamePosition[2]), 0, 385, 1, 0);
                    }
                }
                for (var i = removeBlock.length - 1 ; i >= 0 ; i--){
                    if (removeBlock[i].time > 0){
                        removeBlock[i].time--;
                        if (removeBlock[i].time === 40){
                            Level.setBlock(removeBlock[i].x, removeBlock[i].y, removeBlock[i].z, 35, 1);
                        }else if (removeBlock[i].time === 20){
                            Level.setBlock(removeBlock[i].x, removeBlock[i].y, removeBlock[i].z, 35, 14);
                        }else if (removeBlock[i].time === 0){
                            Level.setBlock(removeBlock[i].x, removeBlock[i].y, removeBlock[i].z, 0);
                            removeBlock.splice(i, 1);
                            continue;
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
                        var px = Math.floor(Entity.getX(PlayerData[i].id));
                        var py = Math.floor(Entity.getY(PlayerData[i].id) - 2);
                        var pz = Math.floor(Entity.getZ(PlayerData[i].id));
                        if (Level.getTile(px, py, pz) === 20){
                            Level.setBlock(px, py, pz, 35, 5);
                            removeBlock.push({
                                x: px,
                                y: py,
                                z: pz,
                                time: 60
                            });
                        }
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
                    for (var i in backBlock) Level.setBlock(backBlock[i].x, backBlock[i].y, backBlock[i].z, backBlock[i].b, backBlock[i].bd);
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
            } else {
                for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                    if (PlayerData[i].name === name) {
                        PlayerData[i].id = p;
                        if (item === 385 && PlayerData[i].alive){
                            for (var X = x - 2; X <= x + 2 ; X++){
                                for (var Z = z - 2; Z <= z + 2 ; Z++){
                                    Level.setBlock(X, 0, Z, 35, 5);
                                    removeBlock.push({
                                        x: X,
                                        y: 0,
                                        z: Z,
                                        time: 60
                                    });
                                }
                            }
                        }
                    }
                }
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
            for (var i in backBlock) Level.setBlock(backBlock[i].x, backBlock[i].y, backBlock[i].z, backBlock[i].b, backBlock[i].bd);
            this.ended = true;
            R_Server.protectBlock(false);
            return;
        }
    };
})();
