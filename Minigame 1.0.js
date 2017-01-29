/*jshint esversion: 6 */

/* Minigame Script 2.0 (Core Script)
 * Copyright 2017. Scripter36 all rights reserved.
 * @author Scripter36(1350adwx)
 */

const ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
const Runnable = java.lang.Runnable;
const Button = android.widget.Button;
const TextView = android.widget.TextView;
const ToggleButton = android.widget.ToggleButton;
const CheckBox = android.widget.CheckBox;
const Switch = android.widget.Switch;
const SeekBar = android.widget.SeekBar;
const ProgressBar = android.widget.ProgressBar;
const PopupWindow = android.widget.PopupWindow;
const Toast = android.widget.Toast;
const EditText = android.widget.EditText;
const OnCheckedChangeListener = android.widget.CompoundButton.OnCheckedChangeListener;
const OnTouchListener = android.view.View.OnTouchListener;
const OnClickListener = android.view.View.OnClickListener;
const MotionEvent = android.view.MotionEvent;
const Gravity = android.view.Gravity;
const ScrollView = android.widget.ScrollView;
const LinearLayout = android.widget.LinearLayout;
const horizontalScrollView = android.widget.HorizontalScrollView;
const FrameLayout = android.widget.FrameLayout;
const Width = ctx.getScreenWidth();
const Height = ctx.getScreenHeight();
const Bitmap = android.graphics.Bitmap;
const BitmapFactory = android.graphics.BitmapFactory;
const BitmapDrawable = android.graphics.drawable.BitmapDrawable;
const Drawable = android.graphics.drawable.Drawable;
const drawable = android.graphics.drawable;
const ColorDrawable = android.graphics.drawable.ColorDrawable;
const Color = android.graphics.Color;
const Canvas = android.graphics.Canvas;
const Paint = android.graphics.Paint;
const Typeface = android.graphics.Typeface;
const ScriptManager = net.zhuoweizhang.mcpelauncher.ScriptManager;
const Thread = java.lang.Thread;
const File = java.io.File;
const OutputStreamWriter = java.io.OutputStreamWriter;
const FileOutputStream = java.io.FileOutputStream;
const FileInputStream = java.io.FileInputStream;
const BufferedReader = java.io.BufferedReader;
const BufferedInputStream = java.io.BufferedInputStream;
const BufferedOutputStream = java.io.BufferedOutputStream;
const InputStreamReader = java.io.InputStreamReader;
const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
const LayoutParams = android.widget.RelativeLayout.LayoutParams;
const blockLauncher = android.os.Environment.getDataDirectory().getAbsolutePath();
let S = {
    T: ["§f", "§b", "§c", "§a"],
    rethodLoaded: false,
    modules: [],
    playing: false
};
let screenWindow;
let blocks = [];

function makeToast(message, length) {
    if (isNaN(length)) length = 2000;
    ctx.runOnUiThread(new Runnable({
        run: function() {
            try {
                Toast.makeText(ctx, message.toString(), parseInt(length)).show();
            } catch (e) {
                print("Error at " + e.lineNumber + ".\n Reason: " + e);
            }
        }
    }));
}

Player.teleport = function(e, x, y, z){
    // TODO: RethodPE 업뎃시 R_Player.setPosition(Player.getName(e), x, y, z) 형식으로 바꿀 것
    Entity.setPosition(e, x, y, z);
    //let entity = Level.spawnMob(x, y, z, 10);
    //Entity.rideAnimal(e, entity);
};

Level.setBlock = function(x, y, z, b, bd){
    Level.setTile(x, y, z, b, bd);
    if (Level.getTile(x, y, z) != b) blocks.push({
        x: x,
        y: y,
        z: z,
        b: b,
        bd: bd
    });
};

function onRethodPELoaded() {
    S.rethodLoaded = true;
    makeToast("RethodPE Loaded!");
}

function readFile(file) {
    let ans = [];
    let br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
    let temp;
    while ((temp = br.readLine()) !== null) {
        ans.push(temp);
    }
    return ans.join('\n');
}

function loadModuleList() {
    let file = new File(sdcard + "/games/com.mojang/minigames");
    if (!file.exists()) file.mkdirs();
    let ans = [];
    for (let i of file.listFiles()) {
        if (i.isDirectory()) {
            try {
                let jsonFile = new File(i.absolutePath + "/info.json");
                ans.push(JSON.parse(readFile(jsonFile)));
            } catch (e) {
                print("Error at " + e.lineNumber + ".\n Reason: " + e);
            }
        }
    }
    return ans;
}

function loadModule(title) {
    let file = new File(sdcard + "/games/com.mojang/minigames");
    if (!file.exists()) file.mkdirs();
    for (let i of file.listFiles()) {
        if (i.isDirectory()) {
            try {
                let jsonFile = new File(i.absolutePath + "/info.json");
                if (JSON.parse(readFile(jsonFile)).title === title) {
                    let scriptFile = new File(i.absolutePath + "/index.js");
                    let exports = [];
                    eval(readFile(scriptFile));
                    return exports;
                }
            } catch (e) {
                print("Error at Loading Modules (Line " + e.lineNumber + ".)\n Reason: " + e);
            }
        }
    }
}

function getOnlineModules(finishdo) {
    S.modules = loadModuleList();
    readFromUrl("https://raw.githubusercontent.com/Scripter36/Minigame/master/MinigameList.json", finishdo);
}

let downloading = [];

function download(path, file, progressbar, textview, finishdo) {
    downloading.push({
        path: path,
        textView: textview,
        progressBar: progressbar
    });
    let index = downloading.length - 1;
    var thread = new java.lang.Thread(new java.lang.Runnable({
        run: function() {
            try {
                var url = new java.net.URL(path);
                var urlConn = url.openConnection();
                let FileLength = urlConn.getContentLength();
                progressbar.setMax(FileLength);
                var bis = new java.io.BufferedInputStream(url.openStream());
                var bos = new java.io.BufferedOutputStream(new java.io.FileOutputStream(file));
                var len;
                let updateRunnable = new Runnable({
                    run: function() {
                        try {
                            downloading[index].progressBar.setProgress(file.length());
                            downloading[index].textView.setText(Math.floor(file.length() / FileLength * 100) + "% (" + Math.floor(file.length() / 1024) + " KB)");
                        } catch (e) {

                        }
                    }
                });
                let updateThread = new Thread(new Runnable({
                    run: function() {
                        try {
                            while (!Thread.currentThread().isInterrupted()) {
                                Thread.sleep(250);
                                ctx.runOnUiThread(updateRunnable);
                            }
                        } catch (e) {
                        }
                    }
                }));
                updateThread.start();
                while ((len = bis.read()) != -1) {
                    bos.write(len);
                }
                updateThread.interrupt();
                bos.flush();
                bis.close();
                bos.close();
                finishdo();
                downloading.splice(downloading.indexOf(path), 1);
            } catch (e) {
                print(e);
                downloading.splice(downloading.indexOf(path), 1);
            }
        }
    }));
    thread.start();
}

function readFromUrl(u, finishdo) {
    var thread = new java.lang.Thread(new java.lang.Runnable({
        run: function() {
            try {
                let ans = [];
                var url = new java.net.URL(u);
                var urlConn = url.openConnection();
                var inputStream = url.openStream();
                let br = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
                let temp;
                while ((temp = br.readLine()) !== null) {
                    ans.push(temp);
                }
                finishdo(ans.join('\n'));
            } catch (e) {
                print(e);
            }
        }
    }));
    thread.start();
}

function installAPK(path) {
    var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
    intent.setDataAndType(new android.net.Uri.parse("file://" + path), "application/vnd.android.package-archive");
    ctx.startActivity(intent);
}

function showButton() {
    if (screenWindow !== undefined) return;
    ctx.runOnUiThread(new Runnable({
        run: function() {
            try {
                if (screenWindow !== undefined) return;
                let button = new Button(ctx);
                button.setText("M");
                button.setTextColor(Color.BLACK);
                button.setOnClickListener(new OnClickListener({
                    onClick: function(v) {
                        showWindow();
                    }
                }));
                button.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(Height / 8, Height / 8));
                screenWindow = new PopupWindow(button, -2, -2, false);
                screenWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                screenWindow.showAtLocation(ctx.getWindow().getDecorView(), Gravity.CENTER | Gravity.RIGHT, 0, 0);
            } catch (e) {
                print("Error at " + e.lineNumber + ".\n Reason: " + e);
            }
        }
    }));
}

function showWindow() {
    ctx.runOnUiThread(new Runnable({
        run: function() {
            try {
                let outValue = new android.util.TypedValue();
                ctx.getTheme().resolveAttribute(android.R.attr.selectableItemBackground, outValue, true);
                let resourceId = outValue.resourceId;
                let divider = ctx.obtainStyledAttributes([android.R.attr.listDivider]).getDrawable(0);
                let verticalDivider = ctx.obtainStyledAttributes([android.R.attr.dividerVertical]).getDrawable(0);
                let scale = 1.5;
                let width = Width / 16;
                let height = Height / 16;
                let layout = new LinearLayout(ctx);
                let window = new PopupWindow(layout, width * 12, height * 12, true);
                layout.setOrientation(1);
                let titleLayout = new LinearLayout(ctx);
                titleLayout.setBackgroundColor(Color.parseColor("#2196F3"));
                let title = new TextView(ctx);
                title.setText(" Minigame 1.0");
                title.setTextColor(Color.WHITE);
                title.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 12 - height * 2, height * 2));
                let closeButton = new Button(ctx);
                closeButton.setText("X");
                closeButton.setTextColor(Color.WHITE);
                closeButton.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(height * 2, height * 2));
                closeButton.setBackgroundResource(resourceId);
                closeButton.setOnClickListener(new OnClickListener({
                    onClick: function() {
                        try {
                            if (window !== undefined) {
                                window.dismiss();
                                window = undefined;
                            }
                        } catch (e) {
                            print("Error at " + e.lineNumber + "\n Reason: " + e);
                        }
                    }
                }));
                titleLayout.addView(title);
                titleLayout.addView(closeButton);
                layout.addView(titleLayout);
                let mainLayout = new LinearLayout(ctx);
                mainLayout.setShowDividers(LinearLayout.SHOW_DIVIDER_MIDDLE);
                mainLayout.setDividerDrawable(verticalDivider);
                let selectLayout = new LinearLayout(ctx);
                selectLayout.setOrientation(1);
                let gameMenuButton = new Button(ctx);
                gameMenuButton.setText("게임 선택");
                gameMenuButton.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 2, height * 2));
                gameMenuButton.setOnClickListener(new OnClickListener({
                    onClick: function() {
                        try {
                            let gameMenuScroll = new ScrollView(ctx);
                            S.modules = loadModuleList();
                            if (S.modules.length === 0) {
                                let downloadText = new TextView(ctx);
                                downloadText.setText("사용 가능한 미니게임이 없습니다. 다운로드 탭에서 미니게임을 다운로드 받아 보는 건 어떨까요?");
                                gameMenuScroll.addView(downloadText);
                            } else {
                                let gameMenuLayout = new LinearLayout(ctx);
                                gameMenuLayout.setOrientation(1);
                                gameMenuLayout.setShowDividers(LinearLayout.SHOW_DIVIDER_MIDDLE);
                                gameMenuLayout.setDividerDrawable(divider);
                                for (let i = 0, leng = S.modules.length; i < leng; i++) {
                                    let moduleLayout = new LinearLayout(ctx);
                                    let moduleTitleLayout = new LinearLayout(ctx);
                                    moduleTitleLayout.setOrientation(1);
                                    let moduleTitle = new TextView(ctx);
                                    moduleTitle.setText(S.modules[i].title);
                                    moduleTitle.setTextColor(Color.BLACK);
                                    moduleTitle.setTextSize(15);
                                    moduleTitle.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 10 - height * 2, height));
                                    moduleTitleLayout.addView(moduleTitle);
                                    let moduleSubTitle = new TextView(ctx);
                                    moduleSubTitle.setText(S.modules[i].subtitle);
                                    moduleSubTitle.setSingleLine(true);
                                    moduleSubTitle.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 10 - height * 2, height));
                                    moduleTitleLayout.addView(moduleSubTitle);
                                    moduleLayout.addView(moduleTitleLayout);
                                    let moduleStartButton = new Button(ctx);
                                    moduleStartButton.setText("시작");
                                    let nowNum = i;
                                    moduleStartButton.setOnClickListener(new OnClickListener({
                                        onClick: function(v) {
                                            try {
                                                startGame(nowNum);
                                            } catch (e) {
                                                print("Error at " + e.lineNumber + "\n Reason: " + e);
                                            }
                                        }
                                    }));
                                    moduleStartButton.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(height * 2, height * 2));
                                    moduleLayout.addView(moduleStartButton);
                                    gameMenuLayout.addView(moduleLayout);
                                }
                                gameMenuScroll.addView(gameMenuLayout);
                            }
                            mainLayout.removeViewAt(1);
                            mainLayout.addView(gameMenuScroll);
                        } catch (e) {
                            print("Error at " + e.lineNumber + "\n Reason: " + e);
                        }
                    }
                }));
                gameMenuButton.setBackgroundResource(resourceId);
                selectLayout.addView(gameMenuButton);
                let downloadMenuButton = new Button(ctx);
                downloadMenuButton.setText("게임 관리");
                downloadMenuButton.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 2, height * 2));
                downloadMenuButton.setBackgroundResource(resourceId);
                downloadMenuButton.setOnClickListener(new OnClickListener({
                    onClick: function() {
                        try {
                            let downloadScroll = new ScrollView(ctx);
                            let downloadLayout = new LinearLayout(ctx);
                            downloadLayout.setOrientation(1);
                            let addonLayout = new LinearLayout(ctx);
                            let addonTitleLayout = new LinearLayout(ctx);
                            addonTitleLayout.setOrientation(1);
                            let addonTitle = new TextView(ctx);
                            addonTitle.setText("RethodPE");
                            addonTitle.setTextColor(Color.BLACK);
                            addonTitle.setTextSize(15);
                            addonTitle.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 6, height));
                            addonTitleLayout.addView(addonTitle);
                            let addonSubtitle = new TextView(ctx);
                            addonSubtitle.setText("RethodPE를 다운로드합니다. (필수)");
                            addonSubtitle.setSingleLine(true);
                            addonSubtitle.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 6, height));
                            addonTitleLayout.addView(addonSubtitle);
                            addonLayout.addView(addonTitleLayout);
                            let addonControlLayout = new LinearLayout(ctx);
                            let addonProgressLayout = new LinearLayout(ctx);
                            addonProgressLayout.setOrientation(1);
                            let addonProgress = new ProgressBar(ctx, null, android.R.attr.progressBarStyleHorizontal);
                            addonProgress.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 4 - height * 2, height));
                            addonProgressLayout.addView(addonProgress);
                            let addonProgressText = new TextView(ctx);
                            if (S.rethodLoaded) addonProgressText.setText("설치 완료");
                            else {
                                addonProgressText.setText("설치 필요");
                                addonProgressText.setTextColor(Color.parseColor("#FF4081"));
                            }
                            addonProgressText.setSingleLine(true);
                            addonProgressText.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 4 - height * 2, height));
                            addonProgressLayout.addView(addonProgressText);
                            addonControlLayout.addView(addonProgressLayout);
                            let addonButton = new Button(ctx);
                            addonButton.setText("설치");
                            if (S.rethodLoaded) addonButton.setEnabled(false);
                            for (let i in downloading) {
                                if (downloading[i].path === "https://www.dropbox.com/s/najcmuwwghpql0f/RethodPE%20for%20PRO-u.apk?dl=1") {
                                    downloading[i].textView = addonProgressText;
                                    downloading[i].progressBar = addonProgress;
                                    addonButton.setEnabled(false);
                                }
                            }
                            addonButton.setOnClickListener(new OnClickListener({
                                onClick: function() {
                                    try {
                                        addonProgressText.setTextColor(Color.BLACK);
                                        addonProgressText.setText("준비 중...");
                                        download("https://www.dropbox.com/s/najcmuwwghpql0f/RethodPE%20for%20PRO-u.apk?dl=1", new File(sdcard + "/RethodPE.apk"), addonProgress, addonProgressText, function() {
                                            ctx.runOnUiThread(new Runnable({
                                                run: function() {
                                                    try {
                                                        addonProgressText.setText("설치 완료.");
                                                        installAPK(sdcard + "/RethodPE.apk");
                                                    } catch (e) {
                                                        print(e);
                                                    }
                                                }
                                            }));
                                        });
                                    } catch (e) {
                                        print("Error at " + e.lineNumber + "\n Reason: " + e);
                                    }
                                }
                            }));
                            addonButton.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(height * 2, height * 2));
                            addonControlLayout.addView(addonButton);
                            addonLayout.addView(addonControlLayout);
                            downloadLayout.addView(addonLayout);
                            let useableModules = getOnlineModules(function(text) {
                                ctx.runOnUiThread(new java.lang.Runnable({
                                    run: function() {
                                        try {
                                            let json = JSON.parse(text);
                                            for (let i = 0; i < json.length; i++) {
                                                let index = i;
                                                let scriptLayout = new LinearLayout(ctx);
                                                let scriptTitleLayout = new LinearLayout(ctx);
                                                scriptTitleLayout.setOrientation(1);
                                                let scriptTitle = new TextView(ctx);
                                                scriptTitle.setText(json[index].title);
                                                scriptTitle.setTextColor(Color.BLACK);
                                                scriptTitle.setTextSize(15);
                                                scriptTitle.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 6, height));
                                                scriptTitleLayout.addView(scriptTitle);
                                                let scriptSubtitle = new TextView(ctx);
                                                scriptSubtitle.setText(json[index].subtitle);
                                                scriptSubtitle.setSingleLine(true);
                                                scriptSubtitle.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 6, height));
                                                scriptTitleLayout.addView(scriptSubtitle);
                                                scriptLayout.addView(scriptTitleLayout);
                                                let scriptControlLayout = new LinearLayout(ctx);
                                                let scriptProgressLayout = new LinearLayout(ctx);
                                                scriptProgressLayout.setOrientation(1);
                                                let scriptProgress = new ProgressBar(ctx, null, android.R.attr.progressBarStyleHorizontal);
                                                scriptProgress.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 4 - height * 2, height));
                                                scriptProgressLayout.addView(scriptProgress);
                                                let scriptProgressText = new TextView(ctx);
                                                scriptProgressText.setSingleLine(true);
                                                scriptProgressText.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 4 - height * 2, height));
                                                scriptProgressLayout.addView(scriptProgressText);
                                                scriptControlLayout.addView(scriptProgressLayout);
                                                let scriptButton = new Button(ctx);
                                                let found = false;
                                                for (let j in S.modules) {
                                                    if (S.modules[j].name === json[index].name) found = true;
                                                }
                                                if (found) {
                                                    scriptProgressText.setText("설치 완료");
                                                } else {
                                                    scriptProgressText.setText("설치 필요");
                                                }
                                                scriptButton.setText("설치");
                                                for (let j in downloading) {
                                                    if (downloading[j].path === json[index].path1) {
                                                        downloading[j].textView = scriptProgressText;
                                                        downloading[j].progressBar = scriptProgress;
                                                        scriptButton.setEnabled(false);
                                                    }
                                                    if (downloading[j].path === json[index].path2) {
                                                        downloading[j].textView = scriptProgressText;
                                                        downloading[j].progressBar = scriptProgress;
                                                        scriptButton.setEnabled(false);
                                                    }
                                                }
                                                scriptButton.setOnClickListener(new OnClickListener({
                                                    onClick: function() {
                                                        try {
                                                            scriptProgressText.setTextColor(Color.BLACK);
                                                            scriptProgressText.setText("준비 중...");
                                                            new File(blockLauncher + "/Minigames/" + json[index].name).mkdirs();
                                                            download(json[index].path1, new File(blockLauncher + "/Minigames/" + json[index].name + "/index.js"), scriptProgress, scriptProgressText, function() {
                                                                download(json[index].path2, new File(blockLauncher + "/Minigames/" + json[index].name + "/info.json"), scriptProgress, scriptProgressText, function() {
                                                                    ctx.runOnUiThread(new Runnable({
                                                                        run: function() {
                                                                            try {
                                                                                scriptProgressText.setText("설치 완료!");
                                                                            } catch (e) {
                                                                                print(e);
                                                                            }
                                                                        }
                                                                    }));
                                                                });
                                                            });
                                                        } catch (e) {
                                                            print("Error at " + e.lineNumber + "\n Reason: " + e);
                                                        }
                                                    }
                                                }));
                                                scriptButton.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(height * 2, height * 2));
                                                scriptControlLayout.addView(scriptButton);
                                                scriptLayout.addView(scriptControlLayout);
                                                downloadLayout.addView(scriptLayout);
                                            }
                                        } catch (e) {
                                            print("Error at " + e.lineNumber + "\n Reason: " + e);
                                        }
                                    }
                                }));
                            });
                            downloadLayout.setShowDividers(LinearLayout.SHOW_DIVIDER_MIDDLE);
                            downloadLayout.setDividerDrawable(divider);
                            downloadScroll.addView(downloadLayout);
                            mainLayout.removeViewAt(1);
                            mainLayout.addView(downloadScroll);
                        } catch (e) {
                            print("Error at " + e.lineNumber + "\n Reason: " + e);
                        }
                    }
                }));
                selectLayout.addView(downloadMenuButton);
                let settingButton = new Button(ctx);
                settingButton.setText("게임 설정");
                settingButton.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 2, height * 2));
                settingButton.setBackgroundResource(resourceId);
                settingButton.setOnClickListener(new OnClickListener({
                    onClick: function() {
                        try {

                        } catch (e) {
                            print("Error at " + e.lineNumber + "\n Reason: " + e);
                        }
                    }
                }));
                selectLayout.addView(settingButton);
                selectLayout.setShowDividers(LinearLayout.SHOW_DIVIDER_MIDDLE);
                selectLayout.setDividerDrawable(divider);
                mainLayout.addView(selectLayout);
                let gameMenuScroll = new ScrollView(ctx);
                S.modules = loadModuleList();
                if (S.modules.length === 0) {
                    let downloadText = new TextView(ctx);
                    downloadText.setText("사용 가능한 미니게임이 없습니다. 다운로드 탭에서 미니게임을 다운로드 받아 보는 건 어떨까요?");
                    gameMenuScroll.addView(downloadText);
                } else {
                    let gameMenuLayout = new LinearLayout(ctx);
                    gameMenuLayout.setOrientation(1);
                    gameMenuLayout.setShowDividers(LinearLayout.SHOW_DIVIDER_MIDDLE);
                    gameMenuLayout.setDividerDrawable(divider);
                    for (let i = 0, leng = S.modules.length; i < leng; i++) {
                        let moduleLayout = new LinearLayout(ctx);
                        let moduleTitleLayout = new LinearLayout(ctx);
                        moduleTitleLayout.setOrientation(1);
                        let moduleTitle = new TextView(ctx);
                        moduleTitle.setText(S.modules[i].title);
                        moduleTitle.setTextColor(Color.BLACK);
                        moduleTitle.setTextSize(15);
                        moduleTitle.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 10 - height * 2, height));
                        moduleTitleLayout.addView(moduleTitle);
                        let moduleSubTitle = new TextView(ctx);
                        moduleSubTitle.setText(S.modules[i].subtitle);
                        moduleSubTitle.setSingleLine(true);
                        moduleSubTitle.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(width * 10 - height * 2, height));
                        moduleTitleLayout.addView(moduleSubTitle);
                        moduleLayout.addView(moduleTitleLayout);
                        let moduleStartButton = new Button(ctx);
                        moduleStartButton.setText("시작");
                        let nowNum = i;
                        moduleStartButton.setOnClickListener(new OnClickListener({
                            onClick: function(v) {
                                startGame(nowNum);
                            }
                        }));
                        moduleStartButton.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(height * 2, height * 2));
                        moduleLayout.addView(moduleStartButton);
                        gameMenuLayout.addView(moduleLayout);
                    }
                    gameMenuScroll.addView(gameMenuLayout);
                }
                mainLayout.addView(gameMenuScroll);
                layout.addView(mainLayout);
                window.setBackgroundDrawable(new ColorDrawable(Color.WHITE));
                window.showAtLocation(ctx.getWindow().getDecorView(), Gravity.CENTER | Gravity.CENTER, 0, 0);
            } catch (e) {
                print("Error at " + e.lineNumber + "\n Reason: " + e);
            }
        }
    }));
}

function startGame(num) {
    if (S.module !== undefined && S.module.finish !== undefined && !S.module.ended){
        S.module.finish();
        return;
    }
    S.module = loadModule(S.modules[num].title);
    try {
        S.module.onLoad();
    } catch (e) {
        print("Error at " + e.lineNumber + "\n Reason: " + e);
    }
}

function newLevel() {
    S.playing = true;
}

function leaveGame() {
    S.playing = false;
}

function modTick() {
    if (S.module !== undefined && S.module.modTick !== undefined) S.module.modTick();
    for (let i = blocks.length - 1 ; i >= 0 ; i--){
        Level.setTile(blocks[i].x, blocks[i].y, blocks[i].z, blocks[i].b, blocks[i].bd);
        if (Level.getTile(blocks[i].x, blocks[i].y, blocks[i].z) == blocks[i].b){
            blocks.splice(i, 1);
        }
    }
}

function entityHurtHook(a, v, h) {
    if (S.module !== undefined && S.module.entityHurtHook !== undefined){
        let result = S.module.entityHurtHook(a, v, h);
        if (result) preventDefault();
    }
}

function deathHook(m, v) {
    if (S.module !== undefined && S.module.deathHook !== undefined){
        let result = S.module.deathHook(m, v);
        if (result) preventDefault();
    }
}

function entityAddedHook(e) {
    if (S.module !== undefined && S.module.entityAddedHook !== undefined){
        let result = S.module.entityAddedHook(e);
        if (result) preventDefault();
    }
}

function useItem(x, y, z, i, b, s, id, bd) {
    if (S.module !== undefined && S.module.useItem !== undefined){
        let result = S.module.useItem(x, y, z, i, b, s, id, bd);
        if (result) preventDefault();
    }
}
showButton();
