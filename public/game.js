/* =========================================================
   ☣️ VIRUS ESCAPE
   COMPLETE UPGRADED GAME.JS
========================================================= */

function get(id) {
    return document.getElementById(id);
}

const homeScreen = get("homeScreen");
const gameScreen = get("gameScreen");

const startMissionButton = get("startMissionButton");

const startButton = get("startButton");
const pauseButton = get("pauseButton");
const resetButton = get("resetButton");
const homeButton = get("homeButton");

const arena = get("arena");
const message = get("message");
const player = get("player");
const shield = get("shield");

const virus1 = get("virus1");
const virus2 = get("virus2");
const virus3 = get("virus3");

const coin1 = get("coin1");
const coin2 = get("coin2");

const power = get("power");
const boss = get("boss");

const scoreElement = get("score");
const bestElement = get("best");
const livesElement = get("lives");
const levelElement = get("level");

const timeText = get("timeText");
const timeFill = get("timeFill");

const result = get("result");

const gameOverScreen = get("gameOverScreen");
const gameOverMessage = get("gameOverMessage");
const gameOverScore = get("gameOverScore");
const gameOverLevel = get("gameOverLevel");

const retryButton = get("retryButton");
const gameOverHomeButton = get("gameOverHomeButton");

const levelCompleteScreen = get("levelCompleteScreen");
const levelCompleteTitle = get("levelCompleteTitle");
const levelCompleteMessage = get("levelCompleteMessage");
const levelCompleteScore = get("levelCompleteScore");
const nextLevelNumber = get("nextLevelNumber");

const nextLevelButton = get("nextLevelButton");
const levelCompleteHomeButton =
    get("levelCompleteHomeButton");

const leaderboardList = get("leaderboardList");
const clearLeaderboardButton =
    get("clearLeaderboardButton");

let score = 0;

let bestScore =
    Number(localStorage.getItem("virusBest") || 0);

let lives = 3;

let level = 1;

let timeLeft = 30;

let playerX = 0;

let running = false;

let paused = false;

let combo = 0;

let shieldActive = false;

let magnetActive = false;

let speedBoostActive = false;

let scoreBoostActive = false;

let bossHealth = 0;

let bossMaxHealth = 0;

let bossAttackCooldown = 0;

let hitCooldown = 0;

let animationFrame = null;

let timerInterval = null;

let powerTimer = null;

let playerName =
    localStorage.getItem("virusPlayerName") ||
    "PLAYER";

let audioContext = null;

let soundEnabled =
    localStorage.getItem("virusSound") !== "off";


function initAudio() {

    if (!soundEnabled) {
        return;
    }

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        audioContext =
            new AudioContext();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}


function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.05
) {

    if (!soundEnabled) {
        return;
    }

    initAudio();

    if (!audioContext) {
        return;
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type = type;

    oscillator.frequency.value =
        frequency;

    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration
    );
}


function playSound(name) {

    if (!soundEnabled) {
        return;
    }

    switch (name) {

        case "click":
            playTone(500, 0.08, "square", 0.035);
            break;

        case "coin":
            playTone(850, 0.08, "sine", 0.06);

            setTimeout(function () {
                playTone(
                    1100,
                    0.1,
                    "sine",
                    0.05
                );
            }, 60);

            break;

        case "hit":
            playTone(
                120,
                0.18,
                "sawtooth",
                0.08
            );
            break;

        case "shield":
            playTone(
                600,
                0.08,
                "triangle",
                0.06
            );

            setTimeout(function () {
                playTone(
                    950,
                    0.12,
                    "triangle",
                    0.05
                );
            }, 70);

            break;

        case "power":
            playTone(
                500,
                0.08,
                "square",
                0.05
            );

            setTimeout(function () {
                playTone(
                    750,
                    0.08,
                    "square",
                    0.05
                );
            }, 70);

            setTimeout(function () {
                playTone(
                    1050,
                    0.14,
                    "square",
                    0.05
                );
            }, 140);

            break;

        case "bossHit":
            playTone(
                180,
                0.12,
                "sawtooth",
                0.07
            );
            break;

        case "bossDefeat":
            playTone(
                300,
                0.12,
                "triangle",
                0.06
            );

            setTimeout(function () {
                playTone(
                    500,
                    0.12,
                    "triangle",
                    0.06
                );
            }, 100);

            setTimeout(function () {
                playTone(
                    800,
                    0.2,
                    "triangle",
                    0.07
                );
            }, 200);

            break;

        case "level":
            playTone(
                500,
                0.1,
                "sine",
                0.06
            );

            setTimeout(function () {
                playTone(
                    700,
                    0.1,
                    "sine",
                    0.06
                );
            }, 100);

            setTimeout(function () {
                playTone(
                    950,
                    0.2,
                    "sine",
                    0.07
                );
            }, 200);

            break;

        case "gameover":
            playTone(
                250,
                0.2,
                "sawtooth",
                0.07
            );

            setTimeout(function () {
                playTone(
                    130,
                    0.35,
                    "sawtooth",
                    0.06
                );
            }, 180);

            break;

        case "pause":
            playTone(
                350,
                0.08,
                "square",
                0.04
            );
            break;

        case "resume":
            playTone(
                650,
                0.08,
                "square",
                0.04
            );
            break;
    }
}

function createExtraUI() {

    /* Sound button */

    const soundButton =
        document.createElement("button");

    soundButton.id =
        "soundToggleButton";

    soundButton.textContent =
        soundEnabled
            ? "🔊 SOUND"
            : "🔇 SOUND OFF";

    soundButton.style.cssText = `
        position:absolute;
        top:12px;
        right:12px;
        z-index:50;
        border:1px solid #ffffff20;
        border-radius:10px;
        padding:7px 10px;
        background:#ffffff0c;
        color:#fff;
        cursor:pointer;
        font-weight:800;
        font-size:11px;
    `;

    arena.parentElement.style.position =
        "relative";

    arena.parentElement.appendChild(
        soundButton
    );

    soundButton.onclick = function () {

        soundEnabled =
            !soundEnabled;

        localStorage.setItem(
            "virusSound",
            soundEnabled
                ? "on"
                : "off"
        );

        soundButton.textContent =
            soundEnabled
                ? "🔊 SOUND"
                : "🔇 SOUND OFF";

        if (soundEnabled) {
            initAudio();
            playSound("click");
        }
    };


    /* Boss health bar */

    const bossBar =
        document.createElement("div");

    bossBar.id =
        "bossHealthContainer";

    bossBar.style.cssText = `
        display:none;
        position:absolute;
        top:12px;
        left:50%;
        transform:translateX(-50%);
        width:min(280px,70%);
        z-index:40;
        text-align:center;
    `;

    bossBar.innerHTML = `
        <div style="
            font-size:11px;
            font-weight:900;
            color:#ff7a18;
            margin-bottom:4px;
        ">
            👹 BOSS HEALTH
        </div>

        <div style="
            height:9px;
            border-radius:20px;
            background:#ffffff15;
            overflow:hidden;
            border:1px solid #ffffff15;
        ">
            <div id="bossHealthFill"
                style="
                    width:100%;
                    height:100%;
                    background:#ff426f;
                    transition:width .15s;
                ">
            </div>
        </div>
    `;

    arena.appendChild(bossBar);


    /* Power status */

    const powerStatus =
        document.createElement("div");

    powerStatus.id =
        "powerStatus";

    powerStatus.style.cssText = `
        position:absolute;
        left:50%;
        bottom:10px;
        transform:translateX(-50%);
        z-index:30;
        font-size:12px;
        font-weight:900;
        color:#56dfff;
        pointer-events:none;
        min-height:18px;
    `;

    arena.appendChild(
        powerStatus
    );


    /* Mobile controls */

    const mobileControls =
        document.createElement("div");

    mobileControls.id =
        "mobileControls";

    mobileControls.style.cssText = `
        display:flex;
        gap:12px;
        justify-content:center;
        margin-top:10px;
    `;

    mobileControls.innerHTML = `
        <button id="mobileLeft"
            style="
                flex:1;
                max-width:180px;
                border:1px solid #ffffff18;
                border-radius:14px;
                padding:15px;
                background:#ffffff0b;
                color:#fff;
                font-size:22px;
                font-weight:900;
                cursor:pointer;
            ">
            ◀
        </button>

        <button id="mobileRight"
            style="
                flex:1;
                max-width:180px;
                border:1px solid #ffffff18;
                border-radius:14px;
                padding:15px;
                background:#ffffff0b;
                color:#fff;
                font-size:22px;
                font-weight:900;
                cursor:pointer;
            ">
            ▶
        </button>
    `;

    gameScreen.appendChild(
        mobileControls
    );


    get("mobileLeft").addEventListener(
        "click",
        function () {

            if (!running || paused) {
                return;
            }

            playerX -=
                getMovementSpeed();

        }
    );


    get("mobileRight").addEventListener(
        "click",
        function () {

            if (!running || paused) {
                return;
            }

            playerX +=
                getMovementSpeed();

        }
    );
}

function getMovementSpeed() {

    if (speedBoostActive) {
        return 70;
    }

    return 45;
}

function getLeaderboard() {

    const data =
        localStorage.getItem(
            "virusLeaderboard"
        );

    if (!data) {
        return [];
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        return [];

    }
}


function saveLeaderboardScore() {

    let board =
        getLeaderboard();

    board.push({
        name: playerName,
        score: score,
        level: level,
        date:
            new Date().toLocaleDateString()
    });

    board.sort(function (a, b) {
        return b.score - a.score;
    });

    board =
        board.slice(0, 10);

    localStorage.setItem(
        "virusLeaderboard",
        JSON.stringify(board)
    );

    renderLeaderboard();
}


function renderLeaderboard() {

    if (!leaderboardList) {
        return;
    }

    const board =
        getLeaderboard();

    leaderboardList.innerHTML = "";


    if (board.length === 0) {

        leaderboardList.innerHTML = `
            <div class="rank">
                <span>—</span>
                <span>No scores yet</span>
                <strong>0</strong>
            </div>
        `;

        return;
    }


    board.forEach(function (entry, index) {

        const row =
            document.createElement("div");

        row.className =
            "rank";

        row.innerHTML = `
            <strong>
                #${index + 1}
            </strong>

            <span>
                ${escapeHTML(entry.name)}
                • Level ${entry.level}
            </span>

            <strong>
                ${entry.score}
            </strong>
        `;

        leaderboardList.appendChild(row);
    });
}


function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function askPlayerName() {

    const saved =
        localStorage.getItem(
            "virusPlayerName"
        );

    if (saved) {

        playerName =
            saved;

        return;
    }

    const name =
        prompt(
            "Enter your player name:",
            "PLAYER"
        );

    if (name && name.trim()) {

        playerName =
            name.trim().substring(0, 15);

    } else {

        playerName =
            "PLAYER";
    }

    localStorage.setItem(
        "virusPlayerName",
        playerName
    );
}

function updateBestScore() {

    if (score > bestScore) {

        bestScore =
            score;

        localStorage.setItem(
            "virusBest",
            bestScore
        );
    }
}

function setPosition(
    element,
    x,
    y
) {

    element.style.left =
        x + "px";

    element.style.top =
        y + "px";

    element.style.display =
        "block";
}

function randomX(width) {

    return Math.random() *
        Math.max(
            1,
            arena.clientWidth - width
        );
}

const viruses = [
    virus1,
    virus2,
    virus3
];

const coins = [
    coin1,
    coin2
];

const virusSpeed = [
    0,
    0,
    0
];

const coinSpeed = [
    0,
    0
];


function spawnObjects() {

    const enemyCount =
        Math.min(
            3,
            1 + Math.ceil(level / 3)
        );


    viruses.forEach(
        function (virus, index) {

            if (index < enemyCount) {

                setPosition(
                    virus,
                    randomX(40),
                    -80 -
                    Math.random() *
                    arena.clientHeight
                );

                virusSpeed[index] =
                    2 +
                    level * 0.65 +
                    Math.random() * 2;

            } else {

                virus.style.display =
                    "none";
            }
        }
    );


    coins.forEach(
        function (coin, index) {

            setPosition(
                coin,
                randomX(30),
                -100 -
                Math.random() *
                arena.clientHeight
            );

            coinSpeed[index] =
                2 +
                level * 0.3;
        }
    );


    setPosition(
        power,
        randomX(35),
        -500
    );

    power.style.display =
        "none";


    if (level >= 5) {

        setPosition(
            boss,
            randomX(80),
            -120
        );

        bossMaxHealth =
            3 +
            Math.floor(
                (level - 5) / 2
            );

        bossHealth =
            bossMaxHealth;

        bossAttackCooldown =
            0;

    } else {

        boss.style.display =
            "none";

        bossHealth = 0;
    }

    updateBossHealthBar();
}

function isColliding(
    first,
    second,
    firstSize,
    secondSize
) {

    return (
        Math.abs(
            first.x -
            second.x
        ) <
        (firstSize +
            secondSize) / 2

        &&

        Math.abs(
            first.y -
            second.y
        ) <
        (firstSize +
            secondSize) / 2
    );
}

function updatePlayer() {

    const playerWidth =
        player.offsetWidth ||
        32;

    playerX =
        Math.max(
            0,
            Math.min(
                arena.clientWidth -
                playerWidth,
                playerX
            )
        );

    const playerY =
        arena.clientHeight -
        52;


    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";


    shield.style.left =
        (playerX - 10) +
        "px";

    shield.style.top =
        (playerY - 10) +
        "px";

    shield.style.display =
        shieldActive
            ? "block"
            : "none";
}

function createEffect(
    x,
    y,
    emoji = "💥"
) {

    const effect =
        document.createElement("div");

    effect.textContent =
        emoji;

    effect.style.cssText = `
        position:absolute;
        left:${x}px;
        top:${y}px;
        z-index:60;
        pointer-events:none;
        font-size:25px;
        transform:scale(.5);
        opacity:1;
        transition:
            transform .45s ease,
            opacity .45s ease;
    `;

    arena.appendChild(effect);

    requestAnimationFrame(function () {

        effect.style.transform =
            "scale(1.5)";

        effect.style.opacity =
            "0";
    });

    setTimeout(function () {

        effect.remove();

    }, 500);
}

function updateViruses() {

    const playerY =
        arena.clientHeight -
        52;


    viruses.forEach(
        function (virus, index) {

            if (
                virus.style.display ===
                "none"
            ) {
                return;
            }


            let virusY =
                parseFloat(
                    virus.style.top
                );

            let virusX =
                parseFloat(
                    virus.style.left
                );


            virusY +=
                virusSpeed[index];


            if (
                virusY >
                arena.clientHeight + 40
            ) {

                virusY =
                    -60;

                virusX =
                    randomX(40);

                combo = 0;
            }


            virus.style.top =
                virusY + "px";

            virus.style.left =
                virusX + "px";


            if (hitCooldown > 0) {
                return;
            }


            const collision =
                isColliding(
                    {
                        x:
                            playerX + 16,

                        y:
                            playerY + 16
                    },

                    {
                        x:
                            virusX + 18,

                        y:
                            virusY + 18
                    },

                    32,
                    36
                );


            if (!collision) {
                return;
            }


            createEffect(
                playerX,
                playerY,
                shieldActive
                    ? "🛡️"
                    : "💥"
            );


            virus.style.top =
                "-70px";


            if (shieldActive) {

                shieldActive =
                    false;

                score += 10;

                result.textContent =
                    "🛡️ SHIELD BLOCKED VIRUS! +10";

                playSound("shield");

            } else {

                lives--;

                combo = 0;

                result.textContent =
                    "💥 VIRUS HIT!";

                playSound("hit");

                hitCooldown =
                    1000;
            }


            if (lives <= 0) {

                endGame(
                    "💀 YOU LOST ALL 3 LIVES!"
                );

            }
        }
    );
}

function updateCoins() {

    const playerY =
        arena.clientHeight -
        52;


    coins.forEach(
        function (coin, index) {

            let coinY =
                parseFloat(
                    coin.style.top
                );

            let coinX =
                parseFloat(
                    coin.style.left
                );


            coinY +=
                coinSpeed[index];


            if (magnetActive) {

                coinX +=
                    (
                        playerX -
                        coinX
                    ) * 0.055;
            }


            if (
                coinY >
                arena.clientHeight + 30
            ) {

                coinY =
                    -40;

                coinX =
                    randomX(30);
            }


            coin.style.top =
                coinY + "px";

            coin.style.left =
                coinX + "px";


            const collision =
                isColliding(
                    {
                        x:
                            playerX + 16,

                        y:
                            playerY + 16
                    },

                    {
                        x:
                            coinX + 13,

                        y:
                            coinY + 13
                    },

                    32,
                    26
                );


            if (!collision) {
                return;
            }


            combo++;


            let coinScore =
                25 +
                combo * 5;


            if (scoreBoostActive) {
                coinScore *= 2;
            }


            score +=
                coinScore;


            coin.style.top =
                "-50px";


            result.textContent =
                "🟡 +" +
                coinScore +
                " • 🔥 " +
                combo +
                "x COMBO";

            createEffect(
                coinX,
                coinY,
                "✨"
            );

            playSound("coin");
        }
    );
}

function updatePower() {

    if (
        power.style.display ===
        "none"
    ) {
        return;
    }


    const playerY =
        arena.clientHeight -
        52;


    let powerY =
        parseFloat(
            power.style.top
        );

    let powerX =
        parseFloat(
            power.style.left
        );


    powerY +=
        2 +
        level * 0.15;


    power.style.top =
        powerY + "px";


    if (
        powerY >
        arena.clientHeight + 30
    ) {

        power.style.display =
            "none";

        return;
    }


    const collision =
        isColliding(
            {
                x:
                    playerX + 16,

                y:
                    playerY + 16
            },

            {
                x:
                    powerX + 15,

                y:
                    powerY + 15
            },

            32,
            30
        );


    if (!collision) {
        return;
    }


    power.style.display =
        "none";


    activatePowerUp();

    createEffect(
        powerX,
        powerY,
        "⚡"
    );

    playSound("power");
}

function activatePowerUp() {

    const type =
        Math.floor(
            Math.random() * 3
        );


    clearTimeout(powerTimer);


    if (type === 0) {

        shieldActive =
            true;

        result.textContent =
            "🛡️ SHIELD ACTIVATED!";

        powerTimer =
            setTimeout(function () {

                shieldActive =
                    false;

            }, 9000);

    } else if (type === 1) {

        magnetActive =
            true;

        result.textContent =
            "🧲 COIN MAGNET ACTIVATED!";

        powerTimer =
            setTimeout(function () {

                magnetActive =
                    false;

            }, 9000);

    } else {

        speedBoostActive =
            true;

        result.textContent =
            "⚡ SPEED BOOST ACTIVATED!";

        powerTimer =
            setTimeout(function () {

                speedBoostActive =
                    false;

            }, 8000);
    }
}

function updateBoss() {

    if (level < 5) {
        return;
    }


    if (bossHealth <= 0) {

        boss.style.display =
            "none";

        return;
    }


    boss.style.display =
        "block";


    const playerY =
        arena.clientHeight -
        52;


    let bossY =
        parseFloat(
            boss.style.top
        );

    let bossX =
        parseFloat(
            boss.style.left
        );


    bossY +=
        1.2 +
        level * 0.12;


    bossX +=
        (
            playerX -
            bossX
        ) *
        (
            0.004 +
            level * 0.0005
        );


    boss.style.top =
        bossY + "px";

    boss.style.left =
        bossX + "px";


    if (
        bossY >
        arena.clientHeight + 30
    ) {

        bossY =
            -90;

        bossX =
            randomX(80);

        bossAttackCooldown++;
    }


    boss.style.top =
        bossY + "px";

    boss.style.left =
        bossX + "px";


    if (bossAttackCooldown > 5) {

        bossAttackCooldown = 0;

        if (bossHealth > 0) {

            bossHealth--;

            result.textContent =
                "👹 BOSS MISSED YOU!";

            updateBossHealthBar();

            if (bossHealth <= 0) {

                score +=
                    500 +
                    level * 100;

                result.textContent =
                    "💥 BOSS DEFEATED! +" +
                    (500 + level * 100);

                createEffect(
                    bossX,
                    bossY,
                    "💥"
                );

                playSound(
                    "bossDefeat"
                );

                boss.style.display =
                    "none";
            }
        }
    }


    if (hitCooldown > 0) {
        return;
    }


    const collision =
        isColliding(
            {
                x:
                    playerX + 16,

                y:
                    playerY + 16
            },

            {
                x:
                    bossX + 35,

                y:
                    bossY + 35
            },

            32,
            70
        );


    if (!collision) {
        return;
    }


    if (shieldActive) {

        shieldActive =
            false;

        bossHealth--;

        score += 100;

        result.textContent =
            "🛡️ BOSS HIT SHIELD! +100";

        playSound("bossHit");

        createEffect(
            bossX,
            bossY,
            "💥"
        );

        updateBossHealthBar();

        if (bossHealth <= 0) {

            score += 500;

            boss.style.display =
                "none";

            result.textContent =
                "👹 BOSS DEFEATED!";

            playSound(
                "bossDefeat"
            );
        }

    } else {

        lives = 0;

        playSound("hit");

        endGame(
            "👹 THE BOSS GOT YOU!"
        );
    }
}


function updateBossHealthBar() {

    const container =
        get("bossHealthContainer");

    const fill =
        get("bossHealthFill");


    if (!container || !fill) {
        return;
    }


    if (
        level < 5 ||
        bossHealth <= 0
    ) {

        container.style.display =
            "none";

        return;
    }


    container.style.display =
        "block";


    const percentage =
        Math.max(
            0,
            (
                bossHealth /
                bossMaxHealth
            ) * 100
        );


    fill.style.width =
        percentage + "%";
}

function render() {

    scoreElement.textContent =
        score;

    bestElement.textContent =
        bestScore;

    livesElement.textContent =
        "❤️".repeat(lives) +
        "🖤".repeat(
            Math.max(
                0,
                3 - lives
            )
        );

    levelElement.textContent =
        level;


    if (timeText) {

        timeText.textContent =
            timeLeft + "s";
    }


    if (timeFill) {

        timeFill.style.width =
            Math.max(
                0,
                (
                    timeLeft /
                    30
                ) * 100
            ) + "%";
    }


    if (combo > 1) {

        result.textContent =
            "🔥 " +
            combo +
            "x COMBO" +
            (
                shieldActive
                    ? " • 🛡️ SHIELD"
                    : ""
            );

    }


    const powerStatus =
        get("powerStatus");

    if (powerStatus) {

        const statuses = [];

        if (shieldActive) {
            statuses.push("🛡️ Shield");
        }

        if (magnetActive) {
            statuses.push("🧲 Magnet");
        }

        if (speedBoostActive) {
            statuses.push("⚡ Speed");
        }

        if (scoreBoostActive) {
            statuses.push("⭐ 2X Score");
        }

        powerStatus.textContent =
            statuses.join("  •  ");
    }


    updateBossHealthBar();
}

function gameLoop() {

    if (!running || paused) {
        return;
    }


    if (hitCooldown > 0) {

        hitCooldown -= 16;

        if (hitCooldown < 0) {
            hitCooldown = 0;
        }
    }


    updatePlayer();

    updateViruses();

    updateCoins();

    updatePower();

    updateBoss();

    render();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );
}

function hideObjects() {

    viruses.forEach(
        function (virus) {

            virus.style.display =
                "none";
        }
    );


    coins.forEach(
        function (coin) {

            coin.style.display =
                "none";
        }
    );


    power.style.display =
        "none";

    boss.style.display =
        "none";

    player.style.display =
        "none";

    shield.style.display =
        "none";


    const bossBar =
        get("bossHealthContainer");

    if (bossBar) {
        bossBar.style.display =
            "none";
    }
}

function clearGameTimers() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame =
            null;
    }


    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval =
            null;
    }


    if (powerTimer) {

        clearTimeout(
            powerTimer
        );

        powerTimer =
            null;
    }
}

function endGame(reason) {

    if (!running) {
        return;
    }


    running = false;

    paused = false;

    clearGameTimers();

    hideObjects();

    updateBestScore();

    saveLeaderboardScore();


    if (
        reason.indexOf(
            "COMPLETE"
        ) !== -1
    ) {

        playSound("level");

        levelCompleteTitle.textContent =
            "LEVEL " +
            level +
            " COMPLETE!";

        levelCompleteMessage.textContent =
            "🏆 Amazing " +
            playerName +
            "! You survived Level " +
            level +
            ".";

        levelCompleteScore.textContent =
            score;


        if (level < 10) {

            nextLevelNumber.textContent =
                level + 1;

            nextLevelButton.textContent =
                "🚀 NEXT LEVEL";

        } else {

            levelCompleteTitle.textContent =
                "🎉 ALL LEVELS COMPLETE!";

            levelCompleteMessage.textContent =
                "You conquered all 10 levels! Final score: " +
                score;

            nextLevelNumber.textContent =
                "🏆";

            nextLevelButton.textContent =
                "🔄 PLAY AGAIN";
        }


        levelCompleteScreen.classList.add(
            "show"
        );


    } else {

        playSound("gameover");

        gameOverMessage.textContent =
            reason +
            " Retry Level " +
            level +
            " and try again.";

        gameOverScore.textContent =
            score;

        gameOverLevel.textContent =
            level;


        gameOverScreen.classList.add(
            "show"
        );
    }


    render();
}

function startGame() {

    initAudio();

    playSound("click");

    clearGameTimers();


    running = true;

    paused = false;

    lives = 3;

    timeLeft = 30;

    combo = 0;

    shieldActive = false;

    magnetActive = false;

    speedBoostActive = false;

    scoreBoostActive = false;

    hitCooldown = 0;

    bossAttackCooldown = 0;


    playerX =
        arena.clientWidth / 2;


    message.style.display =
        "none";


    player.style.display =
        "block";


    startButton.textContent =
        "RESTART LEVEL";


    pauseButton.textContent =
        "⏸ PAUSE";


    result.textContent =
        "";


    spawnObjects();

    render();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );


    timerInterval =
        setInterval(
            function () {

                if (
                    !running ||
                    paused
                ) {
                    return;
                }


                timeLeft--;


                /*
                 * Power-up every 10 seconds
                 */

                if (
                    timeLeft === 25 ||
                    timeLeft === 20 ||
                    timeLeft === 15 ||
                    timeLeft === 10 ||
                    timeLeft === 5
                ) {

                    power.style.display =
                        "block";
                }


                if (
                    timeLeft <= 0
                ) {

                    endGame(
                        "🎉 LEVEL " +
                        level +
                        " COMPLETE!"
                    );

                    return;
                }


                render();

            },
            1000
        );
}

function resetToLevelOne() {

    playSound("click");

    clearGameTimers();


    running = false;

    paused = false;

    score = 0;

    lives = 3;

    level = 1;

    timeLeft = 30;

    playerX = 0;

    combo = 0;

    shieldActive = false;

    magnetActive = false;

    speedBoostActive = false;

    scoreBoostActive = false;

    bossHealth = 0;

    bossMaxHealth = 0;

    hitCooldown = 0;


    hideObjects();


    message.textContent =
        "Press START ESCAPE\nand survive 30 seconds 🧬";

    message.style.display =
        "grid";


    result.textContent =
        "Ready for Level 1";


    startButton.textContent =
        "START ESCAPE";


    pauseButton.textContent =
        "⏸ PAUSE";


    render();
}

pauseButton.addEventListener(
    "click",
    function () {

        if (!running) {
            return;
        }


        paused =
            !paused;


        if (paused) {

            pauseButton.textContent =
                "▶ RESUME";

            message.textContent =
                "⏸ GAME PAUSED";

            message.style.display =
                "grid";

            playSound("pause");


            if (animationFrame) {

                cancelAnimationFrame(
                    animationFrame
                );

                animationFrame =
                    null;
            }

        } else {

            pauseButton.textContent =
                "⏸ PAUSE";

            message.style.display =
                "none";

            playSound("resume");

            animationFrame =
                requestAnimationFrame(
                    gameLoop
                );
        }
    }
);

startMissionButton.addEventListener(
    "click",
    function () {

        initAudio();

        askPlayerName();

        playSound("click");


        homeScreen.classList.remove(
            "active"
        );

        gameScreen.classList.add(
            "active"
        );


        resetToLevelOne();
    }
);

startButton.addEventListener(
    "click",
    function () {

        initAudio();

        if (running) {

            startGame();

            return;
        }


        startGame();
    }
);


/* =========================================================
   RESET BUTTON
========================================================= */

resetButton.addEventListener(
    "click",
    function () {

        resetToLevelOne();
    }
);


/* =========================================================
   HOME BUTTON
========================================================= */

if (homeButton) {

    homeButton.addEventListener(
        "click",
        function () {

            playSound("click");

            goHome();
        }
    );
}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

window.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === " " ||
            event.code === "Space"
        ) {

            event.preventDefault();

            if (running) {
                pauseButton.click();
            }

            return;
        }


        if (
            !running ||
            paused
        ) {
            return;
        }


        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            playerX -=
                getMovementSpeed();

            event.preventDefault();
        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            playerX +=
                getMovementSpeed();

            event.preventDefault();
        }
    }
);


/* =========================================================
   MOUSE CONTROL
========================================================= */

arena.addEventListener(
    "mousemove",
    function (event) {

        if (
            !running ||
            paused
        ) {
            return;
        }


        const rect =
            arena.getBoundingClientRect();


        playerX =
            event.clientX -
            rect.left -
            15;
    }
);


/* =========================================================
   TOUCH CONTROL
========================================================= */

let touchStartX = null;


arena.addEventListener(
    "touchstart",
    function (event) {

        if (
            !running ||
            paused
        ) {
            return;
        }


        touchStartX =
            event.touches[0].clientX;
    },
    {
        passive: true
    }
);


arena.addEventListener(
    "touchmove",
    function (event) {

        if (
            !running ||
            paused
        ) {
            return;
        }


        const currentX =
            event.touches[0].clientX;


        if (touchStartX !== null) {

            playerX +=
                currentX -
                touchStartX;

            touchStartX =
                currentX;
        }
    },
    {
        passive: true
    }
);


arena.addEventListener(
    "touchend",
    function () {

        touchStartX =
            null;
    }
);


/* =========================================================
   RETRY
========================================================= */

retryButton.addEventListener(
    "click",
    function () {

        playSound("click");

        gameOverScreen.classList.remove(
            "show"
        );

        startGame();
    }
);


/* =========================================================
   NEXT LEVEL
========================================================= */

nextLevelButton.addEventListener(
    "click",
    function () {

        playSound("click");

        levelCompleteScreen.classList.remove(
            "show"
        );


        if (level >= 20) {

            score = 0;

            level = 1;

            startGame();

            return;
        }


        level++;

        startGame();
    }
);


/* =========================================================
   GAME OVER HOME
========================================================= */

gameOverHomeButton.addEventListener(
    "click",
    function () {

        playSound("click");

        gameOverScreen.classList.remove(
            "show"
        );

        goHome();
    }
);


/* =========================================================
   LEVEL COMPLETE HOME
========================================================= */

levelCompleteHomeButton.addEventListener(
    "click",
    function () {

        playSound("click");

        levelCompleteScreen.classList.remove(
            "show"
        );

        goHome();
    }
);


/* =========================================================
   GO HOME
========================================================= */

function goHome() {

    clearGameTimers();

    running = false;

    paused = false;

    hideObjects();


    gameScreen.classList.remove(
        "active"
    );

    homeScreen.classList.add(
        "active"
    );


    renderLeaderboard();
}


/* =========================================================
   CLEAR LEADERBOARD
========================================================= */

if (clearLeaderboardButton) {

    clearLeaderboardButton.addEventListener(
        "click",
        function () {

            const confirmClear =
                confirm(
                    "Clear the entire leaderboard?"
                );


            if (!confirmClear) {
                return;
            }


            localStorage.removeItem(
                "virusLeaderboard"
            );


            renderLeaderboard();

            playSound("click");
        }
    );
}


/* =========================================================
   PREVENT DOUBLE TAP ZOOM
========================================================= */

document.addEventListener(
    "dblclick",
    function (event) {

        if (
            event.target.closest(
                "button"
            )
        ) {

            event.preventDefault();
        }
    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

createExtraUI();

renderLeaderboard();

render();

resetToLevelOne();


console.log(
    "☣️ VIRUS ESCAPE upgraded game loaded successfully!"
);