exports = (function() {
    var PlayerData = [];
    var started = false;
    var startCool = 200;
    var backPosition = [];
    var backBlock = [];
    var gamePosition = [];
    var teleportCool = 0;
    var TNTData = {
        id: null,
        owner: null,
        time: 100
    };
    var helpMessage = [/*폭탄 옮기기*/"[PVP " + S.T[3] + "가능" + S.T[0] + ", 블럭 캐기 " + S.T[2] + "불가능" + S.T[0] + "]", "랜덤한 상대에게 5초 후 터지는 TNT가 주어집니다.", "TNT는 때림으로서 옮길 수 있고, TNT가 터지면 갖고 있던 사람은 탈락입니다.", "1명이 남을 때까지 진행됩니다."];
    return {
        ended: false,
        onLoad: function() {
            R_Server.sendChat(S.T[1] + "폭탄 옮기기" + S.T[0] + "를 시작합니다.", false, true);
            for (var i in helpMessage) R_Server.sendChat(helpMessage[i], false, true);
            R_Server.sendChat(S.T[0] + "게임에 참여하실 분은 " + S.T[1] + "바닥을 터치" + S.T[0] + "하여 주세요. 10초 후에 게임이 시작됩니다.", false, true);
            R_Server.protectBlock(true);
        },
        modTick: function() {
            if (this.ended) return;
            if (!started) {
                R_Server.sendPopupMessage(S.T[0] + "게임에 참여하시려면 바닥을 터치하세요!");
                for (var i = PlayerData.length - 1; i >= 0; i--) {
                    if (!Player.isPlayer(PlayerData[i].id)) {
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
                    gamePosition = [px - px % 16, px - px % 16, pz - pz % 16, pz - pz % 16];
                    for (var x = gamePosition[0] ; x < gamePosition[1] - 1 ; x++) {
                        for (var y = 0; y <= 10; y++) {
                            for (var z = gamePosition[2] ; z < gamePosition[3] - 1 ; z++) {
                                if (y === 0) {
                                    backBlock.push({
                                        x: x,
                                        y: y,
                                        z: z,
                                        b: Level.getTile(x, y, z),
                                        bd: Level.getData(x, y, z)
                                    });
                                    Level.setBlock(x, y, z, 95);
                                } else if (y >= 1 && y <= 4) {
                                    if (x === px - px % 16 || x === px - px % 16 + 16 - 1 || z === pz - pz % 16 || z === pz - pz % 16 + 16 - 1) {
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
                                    if (x === px - px % 16 || x === px - px % 16 + 16 - 1 || z === pz - pz % 16 || z === pz - pz % 16 + 16 - 1) {
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
                    for (var i = PlayerData.length - 1; i >= 0; i--) {
                        if (PlayerData[i].alive) {
                            Player.teleport(PlayerData[i].id, (gamePosition[0] + gamePosition[1]) / 2, 3, (gamePosition[2] + gamePosition[3]) / 2);
                        } else {
                            Player.teleport(PlayerData[i].id, (gamePosition[0] + gamePosition[1]) / 2, 8, (gamePosition[2] + gamePosition[3]) / 2);
                        }
                    }
                    teleportCool = 100;
                }
            } else {
                if (teleportCool > 0) {
                    teleportCool--;
                    if (teleportCool === 0){
                        var owner = Math.floor(Math.random() * PlayerData.length);
                        TNTData.owner = owner;
                        TNTData.id = Level.spawnMob(Entity.getX(PlayerData[TNTData.owner].id), Entity.getY(PlayerData[TNTData.owner].id) + 1.5, Entity.getZ(PlayerData[TNTData.owner].id));
                        R_Server.sendChat(S.T[1] + PlayerData[TNTData.owner].name + S.T[0] + " 님께 폭탄이 주어졌습니다!");
                    }
                    return;
                }
                for (var i = PlayerData.length - 1; i >= 0; i--) {
                    Entity.addEffect(PlayerData[i].id, 16, 20, 0);
                    Entity.addEffect(PlayerData[i].id, 11, 20, 0);
                }
                TNTData.time--;
                if (TNTData.time === 0){
                    R_Server.sendChat(S.T[1] + PlayerData[TNTData.owner].name + S.T[0] + " 님이 탈락하셨습니다!");
                    PlayerData[TNTData.owner].alive = false;
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
                    var owner = Math.floor(Math.random() * PlayerData.length);
                    TNTData.owner = owner;
                    Entity.remove(TNTData.id);
                    TNTData.id = Level.spawnMob(Entity.getX(PlayerData[TNTData.owner].id), Entity.getY(PlayerData[TNTData.owner].id) + 1.5, Entity.getZ(PlayerData[TNTData.owner].id));
                    R_Server.sendChat(S.T[1] + PlayerData[TNTData.owner].name + S.T[0] + " 님께 폭탄이 주어졌습니다!");
                    TNTData.time = 100;
                    return;
                }
                Entity.remove(TNTData.id);
                TNTData.id = Level.spawnMob(Entity.getX(PlayerData[TNTData.owner].id), Entity.getY(PlayerData[TNTData.owner].id) + 1.5, Entity.getZ(PlayerData[TNTData.owner].id));
            }
        },
        useItem: function(x, y, z, item, b, s, id, bd) {
            if (this.ended) return;
            var p = Player.getEntity();
            var name = Player.getName(p);
            if (!started) {
                for (var i = PlayerData.length - 1; i >= 0; i--) {
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
        entityHurtHook: function(a, v, h) {
            if (this.ended) return;
            var an, vn;
            for (var i = PlayerData.length - 1 ; i >= 0 ; i--){
                if (a === PlayerData[i].id) an = i;
                else if (v === PlayerData[i].id) vn = i;
            }
            if (an === undefined || vn === undefined) return false;
            if (!PlayerData[an].alive || !PlayerData[vn].alive) return true;
            if (an === TNTData.owner){
                TNTData.owner = vn;
                R_Server.sendChat(S.T[1] + PlayerData[TNTData.owner].name + S.T[0] + " 님께 폭탄이 옮겨졌습니다!");
                Entity.remove(TNTData.id);
                TNTData.id = Level.spawnMob(Entity.getX(PlayerData[TNTData.owner].id), Entity.getY(PlayerData[TNTData.owner].id) + 1.5, Entity.getZ(PlayerData[TNTData.owner].id));
                return false;
            }
            return true;
        },
        finish: function() {
            R_Server.sendChat("서버 관리자에 의해 게임이 종료되었습니다.", false, true);
            for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                Player.teleport(PlayerData[i].id, backPosition[0], backPosition[1], backPosition[2]);
            }
            for (var i = backBlock.length - 1 ; i >= 0 ; i++) Level.setBlock(backBlock[i].x, backBlock[i].y, backBlock[i].z, backBlock[i].b, backBlock[i].bd);
            this.ended = true;
            R_Server.protectBlock(false);
            return;
        }
    };
})();
