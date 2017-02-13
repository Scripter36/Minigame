exports = (function() {
    var PlayerData = [];
    var started = false;
    var startCool = 200;
    var backPosition = [];
    var backBlock = [];
    var gamePosition = [];
    var teleportCool = 0;
    var explosion = [];
    var helpMessage = [/*등반*/"[PVP " + S.T[3] + "가능" + S.T[0] + ", 블럭 캐기 " + S.T[3] + "가능" + S.T[0] + "]", "위에서 내려오는 모래를 타고 기반암까지 올라가세요.", "모래를 부술 시 25% 확률로 눈덩이가, 5% 확률로 TNT가 나옵니다.", "TNT를 설치하면 5초 후에 폭발합니다.", "가장 먼저 기반암까지 올라가는 사람이 우승합니다."];
    return {
        ended: false,
        onLoad: function() {
            R_Server.sendChat(S.T[1] + "등반" + S.T[0] + "을 시작합니다.", false, true);
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
                    gamePosition = [px - px % 16, px - px % 16 + 16, pz - pz % 16, pz - pz % 16 + 16];
                    for (var x = gamePosition[0] ; x < gamePosition[1] ; x++) {
                        for (var y = 0; y <= 22; y++) {
                            for (var z = gamePosition[2] ; z < gamePosition[3] ; z++) {
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
                    for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                        if (PlayerData[i].alive){
                            Player.teleport(PlayerData[i].id, (gamePosition[0] + gamePosition[1]) / 2, 3, (gamePosition[2] + gamePosition[3]) / 2);
                        }else{
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
                for (var i = explosion.length - 1 ; i >= 0 ; i--){
                    if (explosion[i].time > 0){
                        explosion[i].time--;
                        if (explosion[i].time === 0){
                            for (var x = explosion[i].x - 2 ; x <= explosion[i].x + 2 ; x++){
                                for (var y = explosion[i].y - 2 ; y <= explosion[i].y + 2 ; y++){
                                    for (var z = explosion[i].z - 2 ; z <= explosion[i].z + 2 ; z++){
                                        if (Level.getTile(x, y, z) === 12)
                                        Level.setBlock(x, y, z, 0);
                                    }
                                }
                            }
                            Level.explode(explosion[i].x, explosion[i].y, explosion[i].z, 5);
                            explosion.splice(i, 1);
                        }
                    }
                }
                Level.setBlock(gamePosition[0] + 1 + (gamePosition[1] - gamePosition[0] - 2) * Math.random(), 15, gamePosition[2] + 1 + (gamePosition[3] - gamePosition[2] - 2) * Math.random(), 12);
                var alive = 0;
                var aliveNum;
                for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                    if (Entity.getY(PlayerData[i].id) >= 13) {
                        R_Server.sendChat("게임이 끝났습니다! 우승자: " + S.T[1] + PlayerData[i].name);
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
                    Entity.addEffect(PlayerData[i].id, 16, 20, 0);
                    Entity.addEffect(PlayerData[i].id, 6, 20, 4);
                    Entity.addEffect(PlayerData[i].id, 11, 20, 4);
                }
            }
        },
        entityAddedHook: function(e){
            if (this.ended) return;
            if (Entity.getEntityTypeId(e) === 64 && Entity.getItemEntityId(e) === 12){
                var random = Math.random();
                if (random < 0.25){
                    Level.dropItem(Entity.getX(e), Entity.getY(e), Entity.getZ(e), 0, 332, 1, 0);
                }else if (random >= 0.25 && random < 0.3){
                    Level.dropItem(Entity.getX(e), Entity.getY(e), Entity.getZ(e), 0, 385, 1, 0);
                }
                Entity.remove(e);
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
            }else{
                if (item === 385){
                    explosion.push({
                        x: x,
                        y: y,
                        z: z,
                        time: 100
                    });
                }
            }
        },
        finish: function(){
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
