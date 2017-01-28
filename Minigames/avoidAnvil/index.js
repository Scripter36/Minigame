exports = (function() {
    var PlayerData = [];
    var started = false;
    var startCool = 200;
    var backPosition = [];
    var backBlock = [];
    var gamePosition = [];
    var teleportCool = 0;
    var helpMessage = [/*모루피하기*/"[PVP " + S.T[3] + "가능" + S.T[0] + ", 블럭 캐기 " + S.T[2] + "불가능" + S.T[0] + "]", "하늘에서 모루가 떨어집니다!", "모루에 맞으면 탈락이며, 1명이 남을 때까지 진행됩니다."];
    return {
        ended: false,
        onLoad: function() {
            R_Server.sendChat(S.T[1] + "모루피하기" + S.T[0] + "을 시작합니다.", false, true);
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
                    gamePosition = [px - px % 16, px - px % 16 + 16, pz - pz % 16, pz - pz % 16 + 16];
                    for (var x = gamePosition[0]; x < gamePosition[1]; x++) {
                        for (var y = 0; y <= 22; y++) {
                            for (var z = gamePosition[2]; z < gamePosition[3]; z++) {
                                if (y === 0 || y === 16 || y === 22) {
                                    backBlock.push({
                                        x: x,
                                        y: y,
                                        z: z,
                                        b: Level.getTile(x, y, z),
                                        bd: Level.getData(x, y, z)
                                    });
                                    if (y === 0) Level.setTile(x, y, z, 7);
                                    else Level.setBlock(x, y, z, 95);
                                } else if ((y >= 1 && y <= 15) || (y >= 17 && y <= 21)) {
                                    if (x === gamePosition[0] || x === gamePosition[1] - 1 || z === gamePosition[2] || z === gamePosition[3] - 1) {
                                        backBlock.push({
                                            x: x,
                                            y: y,
                                            z: z,
                                            b: Level.getTile(x, y, z),
                                            bd: Level.getData(x, y, z)
                                        });
                                        if (y === 13) Level.setBlock(x, y, z, 7);
                                        else Level.setBlock(x, y, z, 95);
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
                                }
                            }
                        }
                    }
                    for (var i = PlayerData.length - 1; i >= 0; i--) {
                        if (PlayerData[i].alive) {
                            Player.teleport(PlayerData[i].id, (gamePosition[0] + gamePosition[1]) / 2, 3, (gamePosition[2] + gamePosition[3]) / 2);
                        } else {
                            Player.teleport(PlayerData[i].id, (gamePosition[0] + gamePosition[1]) / 2, 18, (gamePosition[2] + gamePosition[3]) / 2);
                        }
                    }
                    teleportCool = 100;
                }
            } else {
                if (teleportCool > 0) {
                    teleportCool--;
                    return;
                }
                Level.setBlock(gamePosition[0] + 1 + (gamePosition[1] - gamePosition[0] - 2) * Math.random(), 15, gamePosition[2] + 1 + (gamePosition[3] - gamePosition[2] - 2) * Math.random(), 145, 2);
                for (var i = PlayerData.length - 1; i >= 0; i--) {
                    Entity.addEffect(PlayerData[i].id, 16, 20, 0);
                }
                for (var x = gamePosition[0]; x < gamePosition[1]; x++) for (var z = gamePosition[2]; z < gamePosition[3]; z++){
                    Level.setBlock(x, 1, z, 0);
                }
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
            for (var i = PlayerData.length - 1; i >= 0; i--) {
                if (a === PlayerData[i].id) an = i;
                else if (Player.getName(v) === PlayerData[i].name) vn = i;
            }
            if (vn !== undefined && an === undefined){
                PlayerData[vn].alive = false;
                Player.teleport(PlayerData[vn].id, (gamePosition[0] + gamePosition[1]) / 2, 19, (gamePosition[2] + gamePosition[3]) / 2);
                R_Server.sendChat(S.T[1] + PlayerData[vn].name + S.T[0] + " 님이 탈락하셨습니다.");
                var aliveNum;
                var alive = 0;
                for (var i in PlayerData){
                    if (PlayerData[i].alive){
                        alive++;
                        aliveNum = i;
                    }
                }
                if (/*alive <= 1*/false){
                    if (aliveNum === undefined) R_Server.sendChat("게임이 끝났습니다! 우승자: 없음");
                    else R_Server.sendChat("게임이 끝났습니다! 우승자: " + S.T[1] + PlayerData[aliveNum].name, false, true);

                    for (var j = PlayerData.length - 1 ; j >= 0 ; j--) {
                        Player.teleport(PlayerData[j].id, backPosition[0], backPosition[1], backPosition[2]);
                    }
                    for (var x = gamePosition[0] ; x < gamePosition[1] ; x++) {
                        for (var y = 0; y <= 22; y++) {
                            for (var z = gamePosition[2] ; z < gamePosition[3] ; z++){
                                if (Level.getTile(x, y, z) === 12) Level.setBlock(x, y, z, 0);
                            }
                        }
                    }
                    var entities = Entity.getAll();
                    for (var j in entities){
                        if (Entity.getEntityTypeId(entities[j]) === 66) Entity.remove(entities[j]);
                    }
                    for (var j in backBlock) Level.setBlock(backBlock[j].x, backBlock[j].y, backBlock[j].z, backBlock[j].b, backBlock[j].bd);
                    this.ended = true;
                    R_Server.protectBlock(false);
                }
                return true;
            }
            return true;
        },
        entityAddedHook: function(e){
            if (this.ended) return;
            if (Entity.getEntityTypeId(e) === 64) Entity.remove(e);
        },
        finish: function() {
            R_Server.sendChat("서버 관리자에 의해 게임이 종료되었습니다.", false, true);

            for (var j = PlayerData.length - 1 ; j >= 0 ; j--) {
                Player.teleport(PlayerData[j].id, backPosition[0], backPosition[1], backPosition[2]);
            }
            for (var x = gamePosition[0] ; x < gamePosition[1] ; x++) {
                for (var y = 0; y <= 22; y++) {
                    for (var z = gamePosition[2] ; z < gamePosition[3] ; z++){
                        if (Level.getTile(x, y, z) === 12) Level.setBlock(x, y, z, 0);
                    }
                }
            }
            var entities = Entity.getAll();
            for (var j in entities){
                if (Entity.getEntityTypeId(entities[j]) === 66) Entity.remove(entities[j]);
            }
            for (var j in backBlock) Level.setBlock(backBlock[j].x, backBlock[j].y, backBlock[j].z, backBlock[j].b, backBlock[j].bd);
            this.ended = true;
            R_Server.protectBlock(false);
            return;
        }
    };
})();
