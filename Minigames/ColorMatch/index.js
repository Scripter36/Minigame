exports = (function() {
    var PlayerData = [];
    var colors = [{
        name: "흰색",
        code: "§f"
    }, {
        name: "주황색",
        code: "§6"
    }, {
        name: "자홍색",
        code: "§d"
    }, {
        name: "하늘색",
        code: "§b"
    }, {
        name: "노란색",
        code: "§e"
    }, {
        name: "연두색",
        code: "§a"
    }, {
        name: "분홍색",
        code: "§d"
    }, {
        name: "회색",
        code: "§8"
    }, {
        name: "밝은 회색",
        code: "§7"
    }, {
        name: "청록색",
        code: "§3"
    }, {
        name: "보라색",
        code: "§5"
    }, {
        name: "파란색",
        code: "§9"
    }, {
        name: "갈색",
        code: "§6"
    }, {
        name: "초록색",
        code: "§2"
    }, {
        name: "빨간색",
        code: "§4"
    }, {
        name: "검정색",
        code: "§0"
    }];
    var started = false;
    var startCool = 200;
    var backPosition = [];
    var backBlock = [];
    var gamePosition = [];
    var teleportCool = 0;
    var restartCool = 0;
    var removeCool = 0;
    var color;
    var helpMessage = [/*컬러 매치*/"[PVP " + S.T[2] + "불가능" + S.T[0] + ", 블럭 캐기 " + S.T[2] + "불가능" + S.T[0] + "]", "바닥이 랜덤하게 채워지며, 벽과 채팅으로 색을 알려드립니다.", "알려드린 색을 제외한 색의 양털은 사라집니다.", "떨어지면 탈락이며, 1명이 남을 때까지 진행됩니다."];
    return {
        ended: false,
        onLoad: function() {
            R_Server.sendChat(S.T[1] + "컬러매치" + S.T[0] + "를 시작합니다.", false, true);
            for (var i in helpMessage) R_Server.sendChat(helpMessage[i], false, true);
            R_Server.sendChat(S.T[0] + "게임에 참여하실 분은 " + S.T[1] + "바닥을 터치" + S.T[0] + "하여 주세요. 10초 후에 게임이 시작됩니다.", false, true);
            R_Server.protectBlock(true);
        },
        modTick: function() {
            if (this.ended) return;
            if (!started) {
                R_Server.sendPopupMessage(S.T[0] + "게임에 참여하시려면 바닥을 터치하세요!");
                for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
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
                                    Level.setBlock(x, y, z, 35);
                                } else if (y >= 1 && y <= 4) {
                                    if (x === gamePosition[0] || x === gamePosition[1] - 1 || z === gamePosition[2] || z === gamePosition[3] - 1) {
                                        backBlock.push({
                                            x: x,
                                            y: y,
                                            z: z,
                                            b: Level.getTile(x, y, z),
                                            bd: Level.getData(x, y, z)
                                        });
                                        Level.setBlock(x, y, z, 35);
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
                }
                if (alive <= 1) {
                    if (aliveNum === undefined) R_Server("게임이 끝났습니다! 우승자: 없음");
                    else R_Server("게임이 끝났습니다! 우승자: " + S.T[1] + PlayerData[aliveNum].name);
                    for (var i = PlayerData.length - 1 ; i >= 0 ; i--) {
                        Player.teleport(PlayerData[i].id, backPosition[0], backPosition[1], backPosition[2]);
                    }
                    for (var i in backBlock) Level.setBlock(backBlock[i].x, backBlock[i].y, backBlock[i].z, backBlock[i].b, backBlock[i].bd);
                    this.ended = true;
                    R_Server.protectBlock(false);
                    return;
                }
                if (teleportCool > 0) {
                    teleportCool--;
                    if (teleportCool === 0) {
                        removeCool = 100 - level * 5;
                        color = Math.floor(Math.random() * 15);
                        for (var x = gamePosition[0]; x < gamePosition[1]; x++) {
                            for (var z = gamePosition[2]; z < gamePosition[3]; z++) {
                                Level.setBlock(x, 0, z, 35, Math.floor(Math.random() * 15));
                                if (x === gamePosition[0] || x === gamePosition[1] - 1 || z === gamePosition[2] || z === gamePosition[3] - 1) {
                                    for (var y = 1; y <= 4; y++) Level.setBlock(x, y, z, 35, color);
                                }
                            }
                        }
                    }
                }
                if (restartCool > 0) {
                    restartCool--;
                    for (var i = PlayerData.length - 1 ; i >= 0 ; i--) R_Server.sendPrivatePopup(PlayerData[i].name, "제거 완료!");
                    if (restartCool === 0) {
                        level++;
                        if (level === 20) {
                            R_Server.sendChat("최대 레벨에 도달하여 게임이 종료되었습니다.", false, true);
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
                        removeCool = 100 - level * 5;
                        color = Math.floor(Math.random() * 15);
                        for (var x = gamePosition[0]; x < gamePosition[1]; x++) {
                            for (var z = gamePosition[2]; z < gamePosition[3]; z++) {
                                Level.setBlock(x, 0, z, 35, Math.floor(Math.random() * 15));
                                if (x === gamePosition[0] || x === gamePosition[1] - 1 || z === gamePosition[2] || z === gamePosition[3] - 1) {
                                    for (var y = 1; y <= 4; y++) Level.setBlock(x, y, z, 35, color);
                                }
                            }
                        }
                    }
                }
                if (removeCool > 0) {
                    removeCool--;
                    if (removeCool % 5 === 0) for (var i = PlayerData.length - 1 ; i >= 0 ; i--) R_Server.sendPrivatePopup(PlayerData[i].name, S.T[0] + "Lv " + S.T[1] + (level + 1) + S.T[0] + ". " + colors[color].code + colors[color].name + S.T[0] + " 양털 위에 서세요. 남은 시간: " + S.T[1] + Math.floor(removeCool / 2) / 10 + S.T[0] + "초");
                    if (removeCool === 0) {
                        for (var x = gamePosition[0]; x < gamePosition[1]; x++) {
                            for (var z = gamePosition[2]; z < gamePosition[3]; z++) {
                                if (Level.getData(x, 0, z) !== color) Level.setBlock(x, 0, z, 0);
                            }
                        }
                        restartCool = 40;
                    }
                }
            }
        },
        useItem: function(x, y, z, i, b, s, id, bd) {
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
        entityHurtHook: function(a, v, h){
            if (this.ended) return;
            return true;
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
