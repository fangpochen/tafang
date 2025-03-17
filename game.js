console.log('使用抖音开发者工具开发过程中可以参考以下文档:');
console.log(
  'https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/guide/minigame/introduction',
);

// 游戏主要配置
const config = {
  width: 375,  // 适配手机屏幕
  height: 667,
  backgroundColor: '#ffffff',
  playerSpeed: 8,
  maxLives: 3,  // 最大复活次数
  reviveDelay: 2000,  // 复活等待时间(毫秒)
};

// 游戏常量
const ENEMY_TYPES = {
    NORMAL: { health: 60, speed: 0.8, value: 50, type: 'NORMAL' },  // 降低生命值和速度
    FAST: { health: 40, speed: 1.2, value: 15, type: 'FAST' },      // 降低生命值和速度
    TANK: { health: 100, speed: 0.6, value: 20, type: 'TANK' },     // 降低生命值和速度
    BOSS: { health: 600, speed: 0.4, value: 100, type: 'BOSS' }     // 降低生命值和速度
};

const TOWER_TYPES = {
    TOWER1: { 
        damage: 30,     // 提高伤害
        range: 150,     // 提高射程
        cost: 30,       // 降低成本
        color: '#666666', 
        fireRate: 1.2,  // 提高攻击速度
        image: 'pao',
        name: '基础炮台'
    },
    TOWER2: { 
        damage: 45,     // 提高伤害
        range: 180,     // 提高射程
        cost: 70,       // 降低成本
        color: '#886644', 
        fireRate: 1.0,  // 提高攻击速度
        image: 'mofa',
        name: '魔法塔'
    },
    TOWER3: { 
        damage: 60,     // 提高伤害
        range: 200,     // 提高射程
        cost: 120,      // 降低成本
        color: '#448866', 
        fireRate: 1.5,  // 提高攻击速度
        image: 'yingxiong',
        name: '英雄塔'
    }
};

// 添加视觉配置
const VISUAL_CONFIG = {
    // 敌人外观
    enemies: {
        NORMAL: {
            color: '#ff4444',
            borderColor: '#cc0000',
            shadowColor: 'rgba(255, 0, 0, 0.3)',
            size: 20,
            pulseSpeed: 0.5
        },
        FAST: {
            color: '#44ff44',
            borderColor: '#00cc00',
            shadowColor: 'rgba(0, 255, 0, 0.3)',
            size: 15,
            pulseSpeed: 1
        },
        TANK: {
            color: '#4444ff',
            borderColor: '#0000cc',
            shadowColor: 'rgba(0, 0, 255, 0.3)',
            size: 25,
            pulseSpeed: 0.3
        }
    },
    // 防御塔外观
    towers: {
        KNIGHT1: {
            color: '#666666',
            topColor: '#888888',
            barrelColor: '#444444',
            baseColor: '#555555',
            shadowColor: 'rgba(0, 0, 0, 0.2)'
        },
        KNIGHT2: {
            color: '#886644',
            topColor: '#aa8866',
            barrelColor: '#664422',
            baseColor: '#775533',
            shadowColor: 'rgba(136, 102, 68, 0.2)'
        },
        KNIGHT3: {
            color: '#448866',
            topColor: '#66aa88',
            barrelColor: '#226644',
            baseColor: '#337755',
            shadowColor: 'rgba(68, 136, 102, 0.2)'
        }
    },
    // 子弹效果
    projectiles: {
        BASIC: {
            color: '#ffff00',
            tailColor: 'rgba(255, 255, 0, 0.3)',
            size: 4
        },
        SNIPER: {
            color: '#ff8800',
            tailColor: 'rgba(255, 136, 0, 0.3)',
            size: 6
        },
        RAPID: {
            color: '#00ffff',
            tailColor: 'rgba(0, 255, 255, 0.3)',
            size: 3
        }
    },
    // 特效
    effects: {
        explosion: {
            colors: ['#ff0000', '#ff8800', '#ffff00'],
            duration: 500,
            particleCount: 10
        },
        heal: {
            color: '#00ff00',
            duration: 300
        }
    }
};

// 添加环境检测和路径处理工具
const isDevTool = tt.getSystemInfoSync().platform === 'devtools';
const getResourcePath = (path) => {
    // 移除开头的斜杠，避免路径错误
    return path.replace(/^\/+/, '');
};

// 修改音频配置，添加更多选项和备用格式
const AUDIO_CONFIG = {
    bgm: {
        url: getResourcePath('assets/audio/bgm.mp3'),
        // 添加备用格式，以防主格式不支持
        backupUrl: getResourcePath('assets/audio/bgm.mp3'), // 实际项目中可以提供不同格式如wav
        volume: 0.5,
        loop: true,
        autoplay: false, // 不自动播放，等待用户交互
        useWebAudio: true // 如果平台支持，优先使用WebAudio
    }
};

// 修改资源配置
const RESOURCE_CONFIG = {
    images: {
        background: getResourcePath('assets/images/background.png'),
        pao: getResourcePath('assets/images/pao.png'),
        mofa: getResourcePath('assets/images/mofa.png'),
        yingxiong: getResourcePath('assets/images/yingxiong.png'),
        knight1_walk0: getResourcePath('assets/images/1_KNIGHT/_WALK/_WALK_000.png'),
        knight1_walk1: getResourcePath('assets/images/1_KNIGHT/_WALK/_WALK_001.png'),
        knight1_walk2: getResourcePath('assets/images/1_KNIGHT/_WALK/_WALK_002.png'),
        knight1_walk3: getResourcePath('assets/images/1_KNIGHT/_WALK/_WALK_003.png'),
        knight1_walk4: getResourcePath('assets/images/1_KNIGHT/_WALK/_WALK_004.png'),
        knight1_walk5: getResourcePath('assets/images/1_KNIGHT/_WALK/_WALK_005.png'),
        knight1_walk6: getResourcePath('assets/images/1_KNIGHT/_WALK/_WALK_006.png'),
        knight2_walk0: getResourcePath('assets/images/2_KNIGHT/_WALK/_WALK_000.png'),
        knight2_walk1: getResourcePath('assets/images/2_KNIGHT/_WALK/_WALK_001.png'),
        knight2_walk2: getResourcePath('assets/images/2_KNIGHT/_WALK/_WALK_002.png'),
        knight2_walk3: getResourcePath('assets/images/2_KNIGHT/_WALK/_WALK_003.png'),
        knight2_walk4: getResourcePath('assets/images/2_KNIGHT/_WALK/_WALK_004.png'),
        knight2_walk5: getResourcePath('assets/images/2_KNIGHT/_WALK/_WALK_005.png'),
        knight2_walk6: getResourcePath('assets/images/2_KNIGHT/_WALK/_WALK_006.png'),
        knight3_walk0: getResourcePath('assets/images/3_KNIGHT/_WALK/_WALK_000.png'),
        knight3_walk1: getResourcePath('assets/images/3_KNIGHT/_WALK/_WALK_001.png'),
        knight3_walk2: getResourcePath('assets/images/3_KNIGHT/_WALK/_WALK_002.png'),
        knight3_walk3: getResourcePath('assets/images/3_KNIGHT/_WALK/_WALK_003.png'),
        knight3_walk4: getResourcePath('assets/images/3_KNIGHT/_WALK/_WALK_004.png'),
        knight3_walk5: getResourcePath('assets/images/3_KNIGHT/_WALK/_WALK_005.png'),
        knight3_walk6: getResourcePath('assets/images/3_KNIGHT/_WALK/_WALK_006.png'),
        // 添加侧边栏引导图片
        sidebarGuide: getResourcePath('assets/images/sidebar_guide.jpg'),
        sidebarGuide2: getResourcePath('assets/images/sidebar_guide2.jpg')
    }
};

// 添加骑士动画配置
const KNIGHT_CONFIG = {
    frameWidth: 128,
    frameHeight: 128,
    scale: 0.4,  // 减小缩放比例，使塔防更容易看到
    walkFrames: 7,  // 7帧行走动画
    frameDelay: 80,
    types: {
        KNIGHT1: {
            animations: {
                walk: [
                    'knight1_walk0', 'knight1_walk1', 'knight1_walk2', 'knight1_walk3',
                    'knight1_walk4', 'knight1_walk5', 'knight1_walk6'
                ]
            }
        },
        KNIGHT2: {
            animations: {
                walk: [
                    'knight2_walk0', 'knight2_walk1', 'knight2_walk2', 'knight2_walk3',
                    'knight2_walk4', 'knight2_walk5', 'knight2_walk6'
                ]
            }
        },
        KNIGHT3: {
            animations: {
                walk: [
                    'knight3_walk0', 'knight3_walk1', 'knight3_walk2', 'knight3_walk3',
                    'knight3_walk4', 'knight3_walk5', 'knight3_walk6'
                ]
            }
        }
    }
};

// 添加精灵图配置
const SPRITE_CONFIG = {
    NORMAL: {
        image: 'knight1',
        frameWidth: 128,
        frameHeight: 128,
        size: 50,
        animations: {
            walk: KNIGHT_CONFIG.types.KNIGHT1.animations.walk,
            frames: KNIGHT_CONFIG.walkFrames
        }
    },
    FAST: {
        image: 'knight2',
        frameWidth: 128,
        frameHeight: 128,
        size: 40,
        animations: {
            walk: KNIGHT_CONFIG.types.KNIGHT2.animations.walk,
            frames: KNIGHT_CONFIG.walkFrames
        }
    },
    TANK: {
        image: 'knight3',
        frameWidth: 128,
        frameHeight: 128,
        size: 60,
        animations: {
            walk: KNIGHT_CONFIG.types.KNIGHT3.animations.walk,
            frames: KNIGHT_CONFIG.walkFrames
        }
    },
    BOSS: {
        image: 'knight3',
        frameWidth: 128,
        frameHeight: 128,
        size: 100,
        animations: {
            walk: KNIGHT_CONFIG.types.KNIGHT3.animations.walk,
            frames: KNIGHT_CONFIG.walkFrames
        },
        isBoss: true
    }
};

// 添加关卡配置
const LEVEL_CONFIG = {
    1: {  // 第一关：新手关
        waves: [
            { type: 'NORMAL', count: 5, interval: 1000 },  // 第1波：5个普通怪
            { type: 'FAST', count: 3, interval: 800 },     // 第2波：3个快速怪
            { type: 'NORMAL', count: 8, interval: 800 },   // 第3波：8个普通怪
            { type: 'FAST', count: 6, interval: 700 },     // 第4波：6个快速怪(新增)
            { type: 'NORMAL', count: 10, interval: 700 }   // 第5波：10个普通怪(新增)
        ],
        startMoney: 250,  // 增加初始金钱，给玩家更多资源
        waveInterval: 9000  // 增加波次间隔，让玩家有更多时间准备
    },
    2: {  // 第二关：中等难度
        waves: [
            { type: 'NORMAL', count: 8, interval: 800 },   // 第1波：8个普通怪
            { type: 'FAST', count: 5, interval: 700 },     // 第2波：5个快速怪
            { type: 'TANK', count: 3, interval: 1000 },    // 第3波：3个坦克怪
            { type: 'FAST', count: 7, interval: 600 },     // 第4波：7个快速怪
            { type: 'NORMAL', count: 12, interval: 700 },  // 第5波：12个普通怪(新增)
            { type: 'TANK', count: 4, interval: 900 },     // 第6波：4个坦克怪(新增)
            { type: 'FAST', count: 9, interval: 500 }      // 第7波：9个快速怪(新增)
        ],
        startMoney: 350,  // 增加初始金钱
        waveInterval: 8000  // 增加波次间隔
    },
    3: {  // 第三关：高难度
        waves: [
            { type: 'TANK', count: 5, interval: 900 },     // 第1波：5个坦克怪
            { type: 'FAST', count: 8, interval: 500 },     // 第2波：8个快速怪
            { type: 'NORMAL', count: 12, interval: 600 },  // 第3波：12个普通怪
            { type: 'TANK', count: 4, interval: 800 },     // 第4波：4个坦克怪
            { type: 'NORMAL', count: 15, interval: 550 },  // 第5波：15个普通怪(新增)
            { type: 'FAST', count: 10, interval: 450 },    // 第6波：10个快速怪(新增)
            { type: 'TANK', count: 6, interval: 750 },     // 第7波：6个坦克怪(新增)
            { type: 'NORMAL', count: 20, interval: 500 },  // 第8波：20个普通怪(新增)
            { type: 'BOSS', count: 1, interval: 0 }        // 第9波：1个BOSS
        ],
        startMoney: 450,  // 增加初始金钱
        waveInterval: 7000  // 增加波次间隔
    }
};

// 添加侧边栏复访配置
const SIDEBAR_CONFIG = {
    enabled: true,  // 启用侧边栏功能
    icon: {
        x: 60,       // 图标X坐标
        y: 180,      // 图标Y坐标
        size: 50     // 图标大小
    }
};

// 增强版音频系统，严格按照抖音小游戏官方文档实现
class AudioSystem {
    constructor() {
        this.bgm = null;
        this.isMuted = false;
        this.hasBeenInitialized = false;
        this.isPending = false;
        this.retryCount = 0;
        this.maxRetries = 5;
        this.isPlaying = false;
        this.wasPlayingBeforeMute = false; // 添加状态记录变量
        this.lastError = null;
        
        // 不在构造函数中初始化
        console.log('音频系统已创建，等待用户交互后初始化');
        
        // 由于抖音小游戏音频需要用户交互，在constructor中只进行最基本的初始化
        try {
            // 提前创建音频上下文，但不加载和播放
            this.bgm = tt.createInnerAudioContext();
            
            // 设置基本属性但不设置src
            if (this.bgm) {
                this.bgm.autoplay = false;  // 确保不自动播放
                if (this.bgm.obeyMuteSwitch !== undefined) {
                    this.bgm.obeyMuteSwitch = false;  // 不遵循系统静音开关
                }
                console.log('音频上下文预创建成功');
            }
        } catch (e) {
            console.error('预创建音频上下文失败:', e);
        }
    }
    
    // 初始化背景音乐，仅在用户交互后调用
    initBGM() {
        console.log('开始初始化背景音乐...');
        
        if (this.hasBeenInitialized && this.bgm) {
            console.log('BGM已经初始化过，重置状态');
            try {
                this.bgm.stop();
            } catch (e) {
                console.error('停止现有音频失败:', e);
            }
        }
        
        this.hasBeenInitialized = true;
        this.retryCount = 0;
        this.isPlaying = false;
        this.isPending = false;
        
        // 创建新的音频上下文
        this.createAudioContext();
    }
    
    // 创建音频上下文 - 严格按照抖音官方文档实现
    createAudioContext() {
        console.log('创建音频上下文');
        
        try {
            // 销毁旧的音频上下文
            if (this.bgm) {
                try {
                    this.bgm.destroy();
                } catch (e) {
                    console.error('销毁旧音频上下文失败:', e);
                }
            }
            
            // 创建新的音频上下文
            this.bgm = tt.createInnerAudioContext();
            
            if (!this.bgm) {
                console.error('创建音频上下文失败');
                return;
            }
            
            // 配置音频上下文
            this.bgm.src = AUDIO_CONFIG.bgm.url;  // 设置音频源
            this.bgm.loop = true;  // 循环播放
            this.bgm.volume = 0.5;  // 音量
            this.bgm.autoplay = false;  // 不自动播放
            
            if (this.bgm.obeyMuteSwitch !== undefined) {
                this.bgm.obeyMuteSwitch = false;  // 不遵循系统静音开关
            }
            
            console.log('音频上下文配置完成:', {
                src: this.bgm.src,
                loop: this.bgm.loop,
                volume: this.bgm.volume,
                autoplay: this.bgm.autoplay
            });
            
            // 设置事件监听
            this.setupEventListeners();
            
        } catch (e) {
            console.error('创建音频上下文失败:', e);
            this.retryCreateAudio();
        }
    }
    
    // 设置事件监听
    setupEventListeners() {
        if (!this.bgm) return;
        
        // 音频加载完成事件
        this.bgm.onCanplay(() => {
            console.log('音频加载完成，可以播放');
            
            // 如果有待播放请求，开始播放
            if (this.isPending && !this.isMuted) {
                console.log('执行待播放请求');
                setTimeout(() => {
                    this.playBGMInternal();
                }, 200);
            }
        });
        
        // 播放开始事件
        this.bgm.onPlay(() => {
            console.log('音频开始播放');
            this.isPlaying = true;
            this.isPending = false;
            
            // 检查播放状态
            setTimeout(() => {
                this.checkPlaybackState();
            }, 500);
        });
        
        // 播放错误事件
        this.bgm.onError((res) => {
            console.error('音频播放错误:', res);
            this.isPlaying = false;
            
            let errorMsg = '未知错误';
            if (res && res.errMsg) {
                errorMsg = res.errMsg;
            } else if (res && res.errCode) {
                // 错误码对应的错误信息
                switch(res.errCode) {
                    case 10001: errorMsg = '系统错误'; break;
                    case 10002: errorMsg = '网络错误'; break;
                    case 10003: errorMsg = '文件错误'; break;
                    case 10004: errorMsg = '格式错误'; break;
                    default: errorMsg = `错误码: ${res.errCode}`;
                }
            }
            
            console.error('音频错误详情:', errorMsg);
            
            // 重试播放
            this.retryCreateAudio();
        });
        
        // 播放结束事件
        this.bgm.onEnded(() => {
            console.log('音频播放结束');
            this.isPlaying = false;
            
            // 理论上不应该触发，因为设置了loop
            if (!this.isMuted) {
                console.log('音频播放结束但设置了循环，手动重新开始');
                this.playBGMInternal();
            }
        });
        
        // 暂停事件
        this.bgm.onPause(() => {
            console.log('音频已暂停');
            this.isPlaying = false;
        });
        
        // 停止事件
        if (this.bgm.onStop) {
            this.bgm.onStop(() => {
                console.log('音频已停止');
                this.isPlaying = false;
            });
        }
    }
    
    // 内部重试方法
    retryCreateAudio() {
        this.retryCount++;
        
        if (this.retryCount < this.maxRetries) {
            console.log(`创建音频失败，${this.retryCount}秒后重试 (${this.retryCount}/${this.maxRetries})`);
            
            setTimeout(() => {
                this.createAudioContext();
            }, this.retryCount * 1000);
        } else {
            console.error(`重试次数已达上限(${this.maxRetries})，放弃创建音频`);
        }
    }
    
    // 检查播放状态
    checkPlaybackState() {
        if (!this.bgm) return;
        
        try {
            const currentTime = this.bgm.currentTime || 0;
            const duration = this.bgm.duration || 0;
            
            console.log('音频播放状态:', {
                currentTime: currentTime,
                duration: duration,
                isPlaying: this.isPlaying
            });
            
            // 如果播放时间没有前进，可能是播放失败
            if (this.isPlaying && currentTime === 0 && this.lastPlaybackTime === 0) {
                console.warn('检测到音频播放可能失败，尝试重新播放');
                this.playBGMInternal();
            }
            
            this.lastPlaybackTime = currentTime;
        } catch (e) {
            console.error('检查播放状态失败:', e);
        }
    }
    
    // 播放背景音乐 - 公共方法
    playBGM() {
        console.log('请求播放背景音乐');
        
        // 如果静音状态，不播放
        if (this.isMuted) {
            console.log('静音状态，不播放音频');
            return;
        }
        
        // 如果未初始化，先初始化
        if (!this.hasBeenInitialized || !this.bgm) {
            console.log('音频未初始化，标记为待播放');
            this.isPending = true;
            this.initBGM();
            return;
        }
        
        // 播放音频
        this.playBGMInternal();
    }
    
    // 内部播放方法
    playBGMInternal() {
        if (!this.bgm || this.isMuted) return;
        
        try {
            console.log('开始播放背景音乐');
            this.bgm.play();
            this.isPlaying = true; // 显式设置播放状态
            
            // 可能需要检查播放是否真的开始了
            setTimeout(() => {
                if (this.bgm && this.bgm.paused) {
                    console.warn('检测到音频未开始播放，再次尝试');
                    this.bgm.play();
                    this.isPlaying = true; // 确保状态正确
                }
            }, 300);
        } catch (e) {
            console.error('播放背景音乐失败:', e);
            this.isPlaying = false; // 播放失败时重置状态
            
            // 重试
            setTimeout(() => {
                this.retryCreateAudio();
            }, 1000);
        }
    }
    
    // 暂停背景音乐
    pauseBGM() {
        if (!this.bgm) return;
        
        try {
            console.log('暂停背景音乐');
            this.bgm.pause();
            this.isPlaying = false; // 设置为非播放状态
        } catch (e) {
            console.error('暂停背景音乐失败:', e);
        }
    }
    
    // 设置静音
    setMute(muted) {
        console.log('设置静音:', muted);
        
        if (!this.bgm) return;
        
        if (muted) {
            // 静音前保存当前播放状态
            this.wasPlayingBeforeMute = this.isPlaying;
            console.log('静音前状态:', this.wasPlayingBeforeMute ? '正在播放' : '未播放');
            
            // 设置为静音
            this.isMuted = true;
            
            // 暂停播放
            this.pauseBGM();
        } else {
            // 取消静音
            this.isMuted = false;
            
            // 如果之前是播放状态或有待播放请求，则恢复播放
            if (this.wasPlayingBeforeMute || this.isPending) {
                console.log('取消静音，恢复之前的播放状态');
                this.playBGM();
            } else {
                console.log('取消静音，但保持暂停状态');
            }
        }
    }
    
    // 释放资源
    dispose() {
        if (!this.bgm) return;
        
        try {
            console.log('释放音频资源');
            this.bgm.destroy();
            this.bgm = null;
            this.hasBeenInitialized = false;
            this.isPlaying = false;
            this.isPending = false;
        } catch (e) {
            console.error('释放音频资源失败:', e);
            this.bgm = null;
        }
    }
}

// 资源加载系统
class ResourceLoader {
    constructor() {
        this.images = new Map();
        this.imageInfos = new Map();  // 存储图片信息
        this.loadedCount = 0;
        this.totalCount = Object.keys(RESOURCE_CONFIG.images).length;
        this.maxRetries = 3;
    }

    loadAll() {
        return new Promise((resolve, reject) => {
            if (this.totalCount === 0) {
                resolve();
                return;
            }

            let loadedCount = 0;
            const errors = [];

            console.log('正在加载的图片资源列表:', Object.entries(RESOURCE_CONFIG.images));

            Object.entries(RESOURCE_CONFIG.images).forEach(([key, path]) => {
                this.loadImageWithRetry(key, path, 0)
                    .then(() => {
                        loadedCount++;
                        if (loadedCount === this.totalCount) {
                            if (errors.length > 0) {
                                console.warn('部分资源加载失败:', errors);
                            }
                            
                            // 特殊处理，在所有资源加载完成后，创建一个专用的背景Canvas
                            this.createCustomBackground();
                            
                            resolve();
                        }
                    })
                    .catch(error => {
                        errors.push({ key, error });
                        loadedCount++;
                        if (loadedCount === this.totalCount) {
                            if (errors.length === this.totalCount) {
                                reject(new Error('所有资源加载失败'));
                            } else {
                                console.warn('部分资源加载失败:', errors);
                                
                                // 即使有错误，也尝试创建背景
                                this.createCustomBackground();
                                
                                resolve();
                            }
                        }
                    });
            });
        });
    }

    // 添加创建专用背景的方法
    createCustomBackground() {
        try {
            console.log('创建专用背景Canvas');
            
            // 获取背景图
            const bgImage = this.images.get('background');
            const bgInfo = this.imageInfos.get('background');
            
            if (!bgImage || !bgInfo) {
                console.error('背景图不可用，无法创建专用背景');
                return;
            }
            
            // 创建一个离屏Canvas来渲染背景
            const offscreenCanvas = tt.createCanvas();
            offscreenCanvas.width = config.width;
            offscreenCanvas.height = config.height;
            
            const ctx = offscreenCanvas.getContext('2d');
            
            // 确保Canvas是完全清除的
            ctx.clearRect(0, 0, config.width, config.height);
            
            // 不要绘制任何纯色背景，直接使用背景图像
            try {
                // 尝试绘制背景图 - 缩放以适应屏幕
                ctx.drawImage(
                    bgImage,
                    0, 0,
                    bgInfo.width, bgInfo.height,
                    0, 0,
                    config.width, config.height
                );
                
                // 不添加任何额外的遮罩，保持背景原样
                console.log('专用背景创建成功');
            } catch (error) {
                console.error('绘制背景图到专用Canvas失败:', error);
                
                // 如果背景图绘制失败，使用渐变背景
                const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
                gradient.addColorStop(0, '#c8f7d6');  // 天空蓝
                gradient.addColorStop(0.6, '#a8d7ff');  // 淡蓝色
                gradient.addColorStop(1, '#8fbee7');  // 深蓝色
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, config.width, config.height);
            }
            
            // 存储专用背景Canvas
            this.customBackground = offscreenCanvas;
            
        } catch (error) {
            console.error('创建专用背景失败:', error);
        }
    }

    loadImageWithRetry(key, path, retryCount) {
        return new Promise((resolve, reject) => {
            const tryLoad = () => {
                console.log(`尝试加载图片: ${key}, 路径: ${path}, 重试次数: ${retryCount}`);
                
                // 如果是背景图，添加特殊日志
                if (key === 'background') {
                    console.log('正在加载背景图片，详细路径信息:', {
                        fullPath: path,
                        exists: '检查文件是否存在需要在实际环境中验证'
                    });
                }
                
                // 创建图片对象
                const image = tt.createImage();
                
                // 获取图片信息
                tt.getImageInfo({
                    src: path,
                    success: (res) => {
                        console.log(`获取图片信息成功: ${key}`, {
                            width: res.width,
                            height: res.height,
                            path: res.path,
                            type: res.type
                        });
                        
                        // 存储图片信息
                        this.imageInfos.set(key, {
                            width: res.width,
                            height: res.height,
                            type: res.type
                        });
                        
                        // 设置图片源
                        image.onload = () => {
                            console.log(`图片加载成功: ${key}`);
                            
                            // 特殊处理背景图
                            if (key === 'background') {
                                // 尝试预渲染背景图到一个临时的离屏canvas
                                try {
                                    console.log('预渲染背景图到离屏Canvas');
                                    const tempCanvas = tt.createCanvas();
                                    tempCanvas.width = res.width;
                                    tempCanvas.height = res.height;
                                    const tempCtx = tempCanvas.getContext('2d');
                                    tempCtx.drawImage(image, 0, 0, res.width, res.height);
                                    
                                    // 将预渲染的canvas作为背景图
                                    this.images.set(key, tempCanvas);
                                } catch (error) {
                                    console.error('背景图预渲染失败:', error);
                                    // 如果预渲染失败，还是使用原始图像
                                    this.images.set(key, image);
                                }
                            } else {
                                this.images.set(key, image);
                            }
                            resolve();
                        };
                        
                        image.onerror = (error) => {
                            console.error(`图片加载失败详情: ${key}`, {
                                error: error,
                                path: path,
                                retryCount: retryCount,
                                device: tt.getSystemInfoSync()
                            });
                            
                            // 对于背景图特别处理
                            if (key === 'background') {
                                console.error('背景图加载失败，详细错误:', error);
                                // 尝试使用备用方式加载背景
                                if (retryCount === 0) {
                                    console.log('尝试使用备用方式加载背景图');
                                    // 直接使用一个纯色的canvas作为背景
                                    try {
                                        const tempCanvas = tt.createCanvas();
                                        tempCanvas.width = 800;
                                        tempCanvas.height = 1400;
                                        const tempCtx = tempCanvas.getContext('2d');
                                        
                                        // 绘制渐变背景
                                        const gradient = tempCtx.createLinearGradient(0, 0, 0, tempCanvas.height);
                                        gradient.addColorStop(0, '#5D4037'); // 棕色
                                        gradient.addColorStop(1, '#3E2723'); // 深棕色
                                        tempCtx.fillStyle = gradient;
                                        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                                        
                                        // 绘制网格
                                        tempCtx.strokeStyle = 'rgba(255,255,255,0.1)';
                                        tempCtx.lineWidth = 1;
                                        const gridSize = 40;
                                        
                                        for (let x = 0; x < tempCanvas.width; x += gridSize) {
                                            tempCtx.beginPath();
                                            tempCtx.moveTo(x, 0);
                                            tempCtx.lineTo(x, tempCanvas.height);
                                            tempCtx.stroke();
                                        }
                                        
                                        for (let y = 0; y < tempCanvas.height; y += gridSize) {
                                            tempCtx.beginPath();
                                            tempCtx.moveTo(0, y);
                                            tempCtx.lineTo(tempCanvas.width, y);
                                            tempCtx.stroke();
                                        }
                                        
                                        this.images.set(key, tempCanvas);
                                        this.imageInfos.set(key, {
                                            width: tempCanvas.width,
                                            height: tempCanvas.height,
                                            type: 'canvas'
                                        });
                                        console.log('使用自生成的背景替代真实背景');
                                        resolve();
                                        return;
                                    } catch (err) {
                                        console.error('创建备用背景失败:', err);
                                    }
                                }
                            }
                            
                            if (retryCount < this.maxRetries) {
                                setTimeout(() => {
                                    this.loadImageWithRetry(key, path, retryCount + 1)
                                        .then(resolve)
                                        .catch(reject);
                                }, 1000);
                            } else {
                                reject(new Error(`图片加载失败，已重试${this.maxRetries}次: ${path}`));
                            }
                        };
                        
                        image.src = res.path; // 使用临时文件路径
                    },
                    fail: (error) => {
                        console.error(`获取图片信息失败: ${key}`, error);
                        
                        // 对于背景图特别处理
                        if (key === 'background') {
                            console.error('获取背景图信息失败，详细错误:', error);
                            
                            // 尝试使用备用加载方式
                            if (retryCount === 0) {
                                // 尝试直接加载图片，不获取信息
                                image.onload = () => {
                                    console.log(`背景图直接加载成功: ${key}`);
                                    this.images.set(key, image);
                                    this.imageInfos.set(key, {
                                        width: 800,  // 假设宽度
                                        height: 1400  // 假设高度
                                    });
                                    resolve();
                                };
                                
                                image.onerror = () => {
                                    // 如果直接加载也失败，则继续重试
                                    if (retryCount < this.maxRetries) {
                                        setTimeout(() => {
                                            this.loadImageWithRetry(key, path, retryCount + 1)
                                                .then(resolve)
                                                .catch(reject);
                                        }, 1000);
                                    } else {
                                        reject(new Error(`背景图直接加载也失败: ${path}`));
                                    }
                                };
                                
                                // 直接设置src
                                console.log('尝试直接设置背景图src:', path);
                                image.src = path;
                                return;
                            }
                        }
                        
                        if (retryCount < this.maxRetries) {
                            setTimeout(() => {
                                this.loadImageWithRetry(key, path, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 1000);
                        } else {
                            reject(new Error(`获取图片信息失败，已重试${this.maxRetries}次: ${path}`));
                        }
                    }
                });
            };
            
            tryLoad();
        });
    }

    getImage(key) {
        return this.images.get(key);
    }

    getImageInfo(key) {
        return this.imageInfos.get(key);
    }
}

class Game {
    constructor() {
        console.log('初始化游戏...');
        
        // 创建画布和获取上下文
        this.canvas = tt.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        
        // 获取系统信息以适配屏幕
        const systemInfo = tt.getSystemInfoSync();
        const pixelRatio = systemInfo.pixelRatio || 1;
        
        // 设置画布尺寸为屏幕大小 * 像素比
        this.canvas.width = systemInfo.windowWidth * pixelRatio;
        this.canvas.height = systemInfo.windowHeight * pixelRatio;
        
        // 更新配置尺寸（保持逻辑尺寸不变）
        config.width = systemInfo.windowWidth;
        config.height = systemInfo.windowHeight;
        
        // 根据像素比缩放画布上下文
        this.ctx.scale(pixelRatio, pixelRatio);
        
        // 初始化其他系统
        this.resourceLoader = new ResourceLoader();
        this.audioSystem = null;
        this.isMuted = false;
        this.gameState = 'LOADING';
        this.loadingProgress = 0;
        this.currentLevel = 1;
        
        // 输出当前环境信息和资源路径
        console.log('游戏初始化:', {
            systemInfo: tt.getSystemInfoSync(),
            backgroundPath: getResourcePath('assets/images/background.png'),
            resourceConfig: RESOURCE_CONFIG
        });
        
        // 预加载资源
        this.preloadResources();

        // 简化侧边栏相关变量
        this.isFromSidebar = false;         // 是否从侧边栏进入
        
        // 介绍界面相关状态
        this.showIntroduction = false;     // 是否显示介绍界面
        this.introductionAlpha = 0;        // 介绍界面的透明度，用于淡入效果
        this.returnedFromSidebar = false;  // 是否从侧边栏返回
        this.rewardCollected = false;      // 是否已领取奖励
    }

    preloadResources() {
        console.log('开始加载游戏资源...');
        
        // 显示加载进度
        this.showLoadingProgress();
        
        // 加载资源
        this.resourceLoader.loadAll()
            .then(() => {
                console.log('资源加载完成');
                this.audioSystem = new AudioSystem();
                this.gameState = 'READY';
                this.initGame();
            })
            .catch(error => {
                console.error('资源加载失败:', error);
                this.gameState = 'ERROR';
                this.showErrorMessage('资源加载失败，请重试');
            });
    }
    
    showLoadingProgress() {
        // 实现加载进度显示逻辑
        const totalResources = Object.keys(RESOURCE_CONFIG.images).length;
        let loadedResources = 0;
        
        const updateProgress = () => {
            loadedResources = this.resourceLoader.loadedCount;
            this.loadingProgress = Math.floor((loadedResources / totalResources) * 100);
            
            // 在画布上显示加载进度
            if (this.ctx) {
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(0, 0, config.width, config.height);
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '24px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`加载中... ${this.loadingProgress}%`, config.width / 2, config.height / 2);
            }
            
            if (this.gameState === 'LOADING') {
                requestAnimationFrame(updateProgress);
            }
        };
        
        updateProgress();
    }
    
    showErrorMessage(message) {
        if (this.ctx) {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, config.width, config.height);
            this.ctx.fillStyle = '#FF0000';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(message, config.width / 2, config.height / 2);
        }
    }

    initGame() {
        console.log('初始化游戏状态...');
        
        // 游戏状态初始化
        this.health = 100;
        this.money = LEVEL_CONFIG[this.currentLevel].startMoney;
        this.wave = 0;
        this.currentWave = 0;
        this.levelCompleted = false;
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.path = this.generatePath();
        this.gameOver = false;
        this.effectSystem = new EffectSystem();
        this.castleHealth = 100;
        this.isPaused = false;
        this.selectedTowerType = 'TOWER1';
        
        // 初始化触摸事件
        this.initTouchEvents();
        
        // 开始游戏循环
        this.gameLoop();
    }

    generatePath() {
        const gridSize = 40;
        const pathPoints = [
            {x: 6, y: 0},            // 起点（从中间石墙出来）
            {x: 6, y: 5},            // 向下
            {x: 2, y: 5},            // 向左
            {x: 2, y: 10},           // 向下
            {x: 8, y: 10}            // 终点（城堡位置）
        ];

        // 计算屏幕中心偏移
        const offsetX = Math.max(gridSize * 2, (config.width - 12 * gridSize) / 2);  // 水平居中
        const offsetY = Math.max(gridSize * 2, (config.height - 14 * gridSize) / 2);  // 垂直空间稍微减少

        // 应用偏移到所有路径点
        return pathPoints.map(point => ({
            x: point.x * gridSize + offsetX,
            y: point.y * gridSize + offsetY
        }));
    }

    initTouchEvents() {
        let audioUnlockAttempted = false;
    
        tt.onTouchStart(event => {
            const touch = event.touches[0];
            const touchX = touch.clientX;
            const touchY = touch.clientY;
            
            // 调试信息
            console.log('触摸坐标:', touchX, touchY);
            
            // 尝试解锁音频API - 只在第一次触摸时执行
            if (!audioUnlockAttempted) {
                audioUnlockAttempted = true;
                console.log('首次用户交互，尝试解锁音频API');
                
                try {
                    // 创建临时音频以解锁API
                    this.unlockAudio();
                } catch (e) {
                    console.error('解锁音频API失败:', e);
                }
            }
            
            // 如果介绍界面正在显示，优先处理介绍界面上的交互
            if (this.showIntroduction) {
                // 检查是否点击了介绍界面上的按钮
                if (this.isClickIntroductionButton(touchX, touchY)) {
                    if (this.returnedFromSidebar) {
                        // 如果是从侧边栏返回后，点击按钮领取奖励
                        this.collectReward();
                    } else {
                        // 如果是首次显示引导，点击按钮跳转到侧边栏
                        this.showIntroduction = false; // 关闭介绍界面
                        this.navigateToSidebar(); // 跳转到侧边栏
                    }
                    return;
                }
                
                // 检查是否点击了介绍界面上的关闭按钮
                if (this.isClickIntroductionCloseButton(touchX, touchY)) {
                    this.showIntroduction = false; // 仅关闭介绍界面
                    return;
                }
                
                // 如果介绍界面正在显示，阻止其他交互
                return;
            }
            
            // 检查是否点击了侧边栏奖励按钮
            if (this.isClickSidebarRewardButton(touchX, touchY)) {
                this.handleSidebarReward();
                return;
            }
            
            // 检查是否点击了静音按钮
            if (this.isClickMuteButton(touchX, touchY)) {
                this.toggleMute();
                return;
            }

            // 检查是否点击了暂停按钮
            if (this.isClickPauseButton(touchX, touchY)) {
                this.togglePause();
                return;
            }

            // 检查是否点击了开始/重新开始按钮
            if (this.isClickStartButton(touchX, touchY)) {
                if (this.gameState === 'READY') {
                    this.startGame();
                } else if (this.gameState === 'OVER') {
                    this.resetGame();
                }
                return;
            }
            
            // 检查是否点击了塔类型按钮
            if (this.isClickTowerButton(touchX, touchY)) {
                return;
            }
            
            // 只在游戏进行中且未暂停时才处理塔的建造
            if (this.gameState === 'PLAYING' && !this.isPaused) {
                const gridSize = 40;
                const offsetX = Math.max(gridSize * 2, (config.width - 12 * gridSize) / 2);
                const offsetY = Math.max(gridSize * 2, (config.height - 14 * gridSize) / 2);
                
                // 计算网格位置
                const gridX = Math.floor((touchX - offsetX) / gridSize) * gridSize + offsetX + gridSize / 2;
                const gridY = Math.floor((touchY - offsetY) / gridSize) * gridSize + offsetY + gridSize / 2;
                
                // 尝试建造防御塔
                this.addTower(gridX, gridY, this.selectedTowerType);
            }
        });
    }
    
    // 解锁音频API的方法
    unlockAudio() {
        console.log('尝试解锁音频API');
        
        // 显示加载中提示
        tt.showToast({
            title: '初始化音频...',
            icon: 'none',
            duration: 1000
        });
        
        // 创建临时音频（1秒静音）用于解锁
        try {
            const unlockSound = tt.createInnerAudioContext();
            unlockSound.autoplay = false;
            
            // 重要：设置src为实际的音频文件，但音量为0
            unlockSound.src = AUDIO_CONFIG.bgm.url;
            unlockSound.volume = 0;
            
            // 播放并立即暂停，这样可以解锁音频API
            unlockSound.play();
            
            setTimeout(() => {
                unlockSound.stop();
                unlockSound.destroy();
                
                // 解锁成功后，初始化游戏音频
                console.log('音频API解锁成功，初始化游戏音频');
                if (this.audioSystem) {
                    this.audioSystem.initBGM();
                }
                
                tt.hideToast();
            }, 300);
        } catch (e) {
            console.error('创建解锁音频失败:', e);
            tt.hideToast();
        }
    }

    isClickStartButton(x, y) {
        const buttonX = config.width / 2;
        const buttonY = config.height / 2;
        const buttonWidth = 200;
        const buttonHeight = 60;
        
        return x >= buttonX - buttonWidth/2 && 
               x <= buttonX + buttonWidth/2 && 
               y >= buttonY - buttonHeight/2 && 
               y <= buttonY + buttonHeight/2;
    }

    isClickMuteButton(x, y) {
        const buttonX = config.width - 50;  // 按钮位置X
        const buttonY = 30;                 // 按钮位置Y
        const buttonSize = 30;              // 按钮大小
        
        return x >= buttonX - buttonSize/2 && 
               x <= buttonX + buttonSize/2 && 
               y >= buttonY - buttonSize/2 && 
               y <= buttonY + buttonSize/2;
    }

    isClickPauseButton(x, y) {
        const buttonX = config.width - 90;  // 暂停按钮位置X（在静音按钮左边）
        const buttonY = 30;                 // 与静音按钮同一高度
        const buttonSize = 30;              // 与静音按钮同样大小
        
        return x >= buttonX - buttonSize/2 && 
               x <= buttonX + buttonSize/2 && 
               y >= buttonY - buttonSize/2 && 
               y <= buttonY + buttonSize/2;
    }

    toggleMute() {
        // 反转静音状态
        this.isMuted = !this.isMuted;
        
        console.log(`${this.isMuted ? '开启' : '关闭'}静音模式`);
        
        // 通知音频系统
        if (this.audioSystem) {
            this.audioSystem.setMute(this.isMuted);
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.audioSystem.pauseBGM();
      } else {
            if (!this.isMuted) {
                this.audioSystem.playBGM();
            }
        }
    }

    startGame() {
        console.log('游戏启动...');
        this.gameState = 'PLAYING';
        
        // 确保音频系统已初始化
        if (this.audioSystem) {
            // 显示提示，帮助用户理解音频初始化过程
            tt.showToast({
                title: '正在加载音乐...',
                icon: 'none',
                duration: 1500
            });
            
            // 延迟播放，给予足够时间进行初始化
            setTimeout(() => {
                console.log('开始播放背景音乐');
                
                // 尝试播放背景音乐
                try {
                    this.audioSystem.playBGM();
                } catch (e) {
                    console.error('播放背景音乐失败:', e);
                }
                
                tt.hideToast();
            }, 1000);
        }
        
        this.currentLevel = 1;  // 从第一关开始
        this.currentWave = 0;
        this.wave = 1;
        this.spawnWave();
    }

    spawnWave() {
        const levelConfig = LEVEL_CONFIG[this.currentLevel];
        if (!levelConfig || this.currentWave >= levelConfig.waves.length) {
            // 当前关卡的所有波次都完成了
            if (this.currentLevel < 3) {
                // 还有下一关
                this.levelCompleted = true;
                this.showLevelComplete();
                return;
            } else if (this.currentLevel === 3 && !this.gameOver) {
                // 通关了！
                this.showGameComplete();
                return;
            }
            return;
        }

        const waveConfig = levelConfig.waves[this.currentWave];
        let spawnedCount = 0;

        // 立即生成第一个怪物
        this.spawnEnemy(waveConfig.type);
        spawnedCount++;

        // 生成剩余怪物
        const spawnInterval = setInterval(() => {
            if (spawnedCount < waveConfig.count) {
                this.spawnEnemy(waveConfig.type);
                spawnedCount++;
            } else {
                clearInterval(spawnInterval);
                // 如果不是最后一波，设置下一波的定时器
                if (!this.gameOver && this.currentWave < levelConfig.waves.length - 1) {
                    setTimeout(() => {
                        this.currentWave++;
                        this.wave++;
                        this.spawnWave();
                    }, levelConfig.waveInterval);
                }
            }
        }, waveConfig.interval);
    }

    spawnEnemy(type) {
        const enemyConfig = ENEMY_TYPES[type];
        enemyConfig.type = type;  // 确保type被正确传递
        const enemy = new Enemy(
            this.path[0].x,
            this.path[0].y,
            enemyConfig,
            [...this.path]
        );
        this.enemies.push(enemy);
    }

    resetGame() {
        this.castleHealth = 100;  // 重置城堡生命值
        this.health = 100;
        this.money = LEVEL_CONFIG[this.currentLevel].startMoney;
        this.wave = 1;
        this.currentWave = 0;
        this.levelCompleted = false;
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.gameOver = false;
        this.gameState = 'PLAYING';
        this.audioSystem.playBGM();
        this.spawnWave();
    }

    update() {
        if (this.gameState !== 'PLAYING' || this.isPaused) return;

        // 更新敌人
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.reachedEnd) {
                this.castleHealth -= enemy.damage || 10;  // 对城堡造成伤害
                this.enemies.splice(index, 1);
                if (this.castleHealth <= 0) {
                    this.gameOver = true;
                    this.gameState = 'OVER';
                }
            }
        });

        // 更新防御塔
        this.towers.forEach(tower => {
            tower.update(this.enemies);
        });

        // 更新子弹
        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            if (projectile.hit || this.isOutOfBounds(projectile)) {
                this.projectiles.splice(index, 1);
            }
        });

        this.effectSystem.update();
    }

    isOutOfBounds(obj) {
        return obj.x < 0 || obj.x > config.width || obj.y < 0 || obj.y > config.height;
    }

    render() {
        // 完全清除画布
        this.ctx.clearRect(0, 0, config.width, config.height);
        
        // 先重置所有绘图状态
        this.ctx.globalAlpha = 1.0;
        this.ctx.globalCompositeOperation = 'source-over';
        
        // 1. 首先绘制背景
        this.drawBackground();
        
        // 绘制半透明的网格区域覆盖层
        this.drawGridAreaOverlay();
        
        // 保存当前状态以便后续绘制能保留背景和覆盖层
        this.ctx.save();
        
        // 2. 不再绘制原始网格，因为我们已经有了覆盖层
        // this.drawGrid();
        
        // 3. 绘制路径（在网格之上）- 将路径设置为更明显的颜色
        this.drawPath();
        
        // 4. 绘制城堡（在路径之上）
        this.drawCastle();
        
        // 5. 绘制防御塔（在城堡之上）
        this.towers.forEach(tower => {
            tower.draw(this.ctx);
        });
        
        // 6. 绘制敌人（在防御塔之上）
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });
        
        // 7. 绘制子弹（在敌人之上）
        this.projectiles.forEach(projectile => {
            projectile.draw(this.ctx);
        });
        
        // 8. 绘制特效（在子弹之上）
        this.effectSystem.draw(this.ctx);
        
        // 9. 恢复状态并绘制UI（在所有游戏元素之上）
        this.ctx.restore();
        this.drawUI();
        
        // 10. 根据游戏状态绘制不同的屏幕
        if (this.gameState === 'READY') {
            // 显示开始按钮
            // ... 现有代码 ...
        } else if (this.gameState === 'OVER') {
            this.drawGameOver();
        }
        
        // 11. 绘制介绍界面（最上层）
        if (this.showIntroduction) {
            this.drawIntroduction();
        }
    }

    drawBackground() {
        // 移除冗余日志
        /*
        console.log('尝试绘制背景图片, 详细信息:', {
            bgImageAvailable: !!this.resourceLoader.getImage('background'),
            bgPath: RESOURCE_CONFIG.images.background,
            deviceInfo: tt.getSystemInfoSync(),
            customBgAvailable: !!this.resourceLoader.customBackground
        });
        */
        
        // 首先尝试使用专用背景Canvas
        if (this.resourceLoader.customBackground) {
            try {
                // 移除冗余日志
                // console.log('使用专用背景Canvas绘制');
                
                // 保存当前上下文状态
                this.ctx.save();
                
                // 设置合适的绘制属性
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.globalAlpha = 1.0;
                
                // 绘制专用背景
                this.ctx.drawImage(
                    this.resourceLoader.customBackground,
                    0, 0,
                    config.width, config.height
                );
                
                // 恢复上下文状态
                this.ctx.restore();
                
                // 移除冗余日志
                // console.log('使用专用背景Canvas绘制成功');
                return;
            } catch (error) {
                console.error('使用专用背景Canvas绘制失败:', error);
                // 如果失败，继续使用常规方法
            }
        }
        
        // 以下是原来的背景绘制逻辑，作为备选
        const bgImage = this.resourceLoader.getImage('background');
        const bgInfo = this.resourceLoader.getImageInfo('background');
        
        // 移除冗余日志
        /*
        console.log('背景图片信息:', {
            bgImage: bgImage ? '已加载' : '未加载',
            bgInfo: bgInfo,
            allImages: Array.from(this.resourceLoader.images.keys()),
            allImageInfos: Array.from(this.resourceLoader.imageInfos.keys())
        });
        */
        
        if (bgImage && bgInfo) {
            try {
                // 保存当前上下文状态
                this.ctx.save();
                
                // 设置源图像混合模式
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.globalAlpha = 1.0;
                
                // 清除特定区域，确保背景能正确绘制
                this.ctx.clearRect(0, 0, config.width, config.height);
                
                // 使用新的绘制方法 - 先缩放画布以适应图像
                const sourceWidth = bgInfo.width || 900;
                const sourceHeight = bgInfo.height || 1600;
                // console.log(`使用完整drawImage参数: 源尺寸=${sourceWidth}x${sourceHeight}, 目标尺寸=${config.width}x${config.height}`);
                
                // 绘制背景 - 尝试直接绘制
                this.ctx.drawImage(
                    bgImage,           // 图像对象
                    0, 0,              // 源图像的起始点
                    sourceWidth, sourceHeight,  // 源图像的宽高
                    0, 0,              // 目标图像的起始点
                    config.width, config.height // 目标图像的宽高
                );
                
                // 恢复上下文状态
                this.ctx.restore();
                
                // 打印更详细的成功信息
                // console.log(`背景绘制成功: 宽度=${config.width}, 高度=${config.height}`);
                
                // 不要添加任何半透明遮罩，让背景保持原样
            } catch (error) {
                console.error('背景绘制异常:', error);
                this.drawFallbackBackground();
            }
        } else {
            console.log('无法绘制背景图片，使用纯色背景替代');
            console.error('背景加载失败原因分析:', {
                bgImageExists: !!bgImage,
                bgInfoExists: !!bgInfo,
                filePathChecked: RESOURCE_CONFIG.images.background
            });
            this.drawFallbackBackground();
        }
    }

    drawFallbackBackground() {
        // 绘制更好看的备用背景，而不是纯色
        console.log('使用备用背景绘制方法');
        
        // 创建渐变背景 - 使用自然的天空和地面色调
        const gradient = this.ctx.createLinearGradient(0, 0, 0, config.height);
        gradient.addColorStop(0, '#c8f7d6');  // 天空蓝
        gradient.addColorStop(0.6, '#a8d7ff');  // 淡蓝色
        gradient.addColorStop(1, '#8fbee7');  // 深蓝色
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, config.width, config.height);
        
        // 绘制简单的装饰性云朵
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        // 云朵 1
        this.drawCloud(100, 80, 60, 30);
        // 云朵 2
        this.drawCloud(300, 50, 80, 40);
        // 云朵 3
        this.drawCloud(180, 120, 70, 35);
        
        // 绘制地面
        this.ctx.fillStyle = '#78b755';  // 草地绿色
        this.ctx.fillRect(0, config.height * 0.8, config.width, config.height * 0.2);
        
        // 添加游戏标题
        this.ctx.font = 'bold 30px Arial';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('五星级塔防', config.width / 2, config.height / 3);
    }
    
    // 辅助方法：绘制一朵云
    drawCloud(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, height * 0.5, 0, Math.PI * 2);
        this.ctx.arc(x + width * 0.3, y - height * 0.2, height * 0.6, 0, Math.PI * 2);
        this.ctx.arc(x + width * 0.6, y, height * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawGrid() {
        // 完全不绘制任何内容，使用drawGridAreaOverlay代替
        // 这个方法保留但不执行任何操作，防止破坏游戏逻辑
        return;
    }

    drawPath() {
        // 绘制路径阴影 - 深色背景上使用更明显的阴影
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.stroke();

        // 绘制路径主线 - 使用更明亮的金色
        this.ctx.strokeStyle = '#ffeb3b'; // 亮黄色
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.stroke();
    }

    // 添加绘制圆角矩形的辅助方法
    drawRoundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    drawUI() {
        // 只在游戏进行中显示游戏状态
        if (this.gameState === 'PLAYING') {
            // 设置文字样式
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'left';
            
            // 添加文字描边效果函数
            const drawTextWithStroke = (text, x, y, fillStyle = '#ffffff', strokeStyle = '#000000') => {
                this.ctx.strokeStyle = strokeStyle;
                this.ctx.lineWidth = 3;
                this.ctx.strokeText(text, x, y);
                this.ctx.fillStyle = fillStyle;
                this.ctx.fillText(text, x, y);
            };

            // 使用描边效果绘制文字
            drawTextWithStroke(`城堡生命值: ${this.castleHealth}`, 20, 30);
            drawTextWithStroke(`金钱: ${this.money}`, 20, 60);
            drawTextWithStroke(`波数: ${this.wave}`, 20, 90);
            drawTextWithStroke(`关卡: ${this.currentLevel}`, 20, 120);
            
            // 绘制简化的侧边栏图标
            if (SIDEBAR_CONFIG.enabled) {
                const { x: iconX, y: iconY, size: iconSize } = SIDEBAR_CONFIG.icon;
                
                // 图标背景
                this.ctx.fillStyle = '#4285f4';  // 使用蓝色背景
                this.ctx.beginPath();
                this.drawRoundRect(iconX - iconSize/2, iconY - iconSize/2, iconSize, iconSize, 10);
                this.ctx.fill();
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // 绘制侧边栏图标（三条横线）
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 3;
                
                // 绘制三条横线表示侧边栏
                for (let i = -10; i <= 10; i += 10) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(iconX - 15, iconY + i);
                    this.ctx.lineTo(iconX + 15, iconY + i);
                    this.ctx.stroke();
                }
                
                // 添加侧边栏文字标签
                this.ctx.fillStyle = '#ff0000';  // 改为红色
                this.ctx.font = '16px Arial';    // 增大字体
                this.ctx.textAlign = 'center';
                this.ctx.fillText('入口有礼', iconX, iconY + 35);
            }
        }

        // 绘制静音按钮
        const buttonX = config.width - 50;
        const buttonY = 30;
        const buttonSize = 30;

        // 绘制按钮背景
        this.ctx.beginPath();
        this.ctx.arc(buttonX, buttonY, buttonSize/2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 绘制静音图标
        this.ctx.beginPath();
        if (this.isMuted) {
            // 绘制静音图标 (X)
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.moveTo(buttonX - 8, buttonY - 8);
            this.ctx.lineTo(buttonX + 8, buttonY + 8);
            this.ctx.moveTo(buttonX + 8, buttonY - 8);
            this.ctx.lineTo(buttonX - 8, buttonY + 8);
        } else {
            // 绘制声音图标 (喇叭)
            this.ctx.fillStyle = '#ffffff';
            this.ctx.moveTo(buttonX - 8, buttonY - 5);
            this.ctx.lineTo(buttonX - 3, buttonY - 5);
            this.ctx.lineTo(buttonX + 3, buttonY - 8);
            this.ctx.lineTo(buttonX + 3, buttonY + 8);
            this.ctx.lineTo(buttonX - 3, buttonY + 5);
            this.ctx.lineTo(buttonX - 8, buttonY + 5);
            this.ctx.closePath();
        }
        this.ctx.fill();
        this.ctx.stroke();

        // 绘制暂停按钮
        const pauseButtonX = config.width - 90;
        const pauseButtonY = 30;
        const pauseButtonSize = 30;

        // 绘制暂停按钮背景
        this.ctx.beginPath();
        this.ctx.arc(pauseButtonX, pauseButtonY, pauseButtonSize/2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 绘制暂停/继续图标
        this.ctx.beginPath();
        if (this.isPaused) {
            // 绘制继续图标（三角形）
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.moveTo(pauseButtonX - 5, pauseButtonY - 8);
            this.ctx.lineTo(pauseButtonX - 5, pauseButtonY + 8);
            this.ctx.lineTo(pauseButtonX + 8, pauseButtonY);
            this.ctx.closePath();
        } else {
            // 绘制暂停图标（两条竖线）
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(pauseButtonX - 7, pauseButtonY - 8, 4, 16);
            this.ctx.fillRect(pauseButtonX + 3, pauseButtonY - 8, 4, 16);
        }
        this.ctx.fill();

        // 如果游戏暂停，绘制暂停菜单
        if (this.isPaused && this.gameState === 'PLAYING') {
            // 半透明背景
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, config.width, config.height);

            // 暂停文字
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('游戏暂停', config.width/2, config.height/2 - 40);

            // 提示文字
            this.ctx.font = '24px Arial';
            this.ctx.fillText('点击暂停按钮继续游戏', config.width/2, config.height/2 + 20);
        }

        // 绘制开始/重新开始按钮
        if (this.gameState === 'READY' || this.gameState === 'OVER') {
            const buttonX = config.width / 2;
            const buttonY = config.height / 2;
            const buttonWidth = 200;
            const buttonHeight = 60;

            // 绘制按钮背景
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(
                buttonX - buttonWidth/2,
                buttonY - buttonHeight/2,
                buttonWidth,
                buttonHeight
            );

            // 绘制按钮边框
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                buttonX - buttonWidth/2,
                buttonY - buttonHeight/2,
                buttonWidth,
                buttonHeight
            );

            // 绘制按钮文字
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            const buttonText = this.gameState === 'READY' ? '开始游戏' : '重新开始';
            this.ctx.fillText(buttonText, buttonX, buttonY);

            // 如果是游戏结束状态，显示得分
            if (this.gameState === 'OVER') {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '36px Arial';
                this.ctx.fillText('游戏结束', buttonX, buttonY - 100);
                this.ctx.font = '24px Arial';
                this.ctx.fillText(`坚持了 ${this.wave} 波`, buttonX, buttonY - 50);
            }

            // 如果是准备状态，显示游戏标题
            if (this.gameState === 'READY') {
                // 添加标题阴影效果
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.font = '48px Arial';
                this.ctx.fillText('五星级塔防', buttonX + 2, buttonY - 98);

                // 绘制主标题
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '48px Arial';
                this.ctx.fillText('五星级塔防', buttonX, buttonY - 100);

                // 添加副标题阴影
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.font = '24px Arial';
                this.ctx.fillText('点击开始游戏', buttonX + 1, buttonY + 101);

                // 绘制副标题
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '24px Arial';
                this.ctx.fillText('点击开始游戏', buttonX, buttonY + 100);
            }
        }

        // 修改塔防按钮位置到屏幕右侧
        const towerButtonSize = 50;
        const padding = 10;
        const startX = config.width - (Object.keys(TOWER_TYPES).length * (towerButtonSize + padding));
        const startY = config.height - towerButtonSize - 20;

        // 绘制塔防按钮
        Object.entries(TOWER_TYPES).forEach(([type, config], index) => {
            const x = startX + (towerButtonSize + padding) * index;
            const y = startY;

            // 绘制按钮背景
            this.ctx.beginPath();
            this.ctx.arc(x + towerButtonSize/2, y + towerButtonSize/2, towerButtonSize/2, 0, Math.PI * 2);
            this.ctx.fillStyle = this.selectedTowerType === type ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
            this.ctx.fill();
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // 绘制塔的图标
            this.ctx.fillStyle = config.color;
            this.ctx.fillRect(x + towerButtonSize/4, y + towerButtonSize/4, towerButtonSize/2, towerButtonSize/2);

            // 绘制价格
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${config.cost}`, x + towerButtonSize/2, y + towerButtonSize + 15);
        });

        // 重置文字对齐方式
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'alphabetic';

        // 添加关卡完成提示
        if (this.levelCompleted) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, config.width, config.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`第 ${this.currentLevel} 关完成！`, config.width/2, config.height/2);
            this.ctx.font = '24px Arial';
            this.ctx.fillText('准备进入下一关...', config.width/2, config.height/2 + 50);
        }

        // 添加游戏通关提示
        if (this.gameState === 'COMPLETE') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, config.width, config.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('恭喜通关！', config.width/2, config.height/2);
            this.ctx.font = '24px Arial';
            this.ctx.fillText('你是最棒的！', config.width/2, config.height/2 + 50);
        }

        // 已删除侧边栏礼包按钮和任务指引绘制代码，不再显示每日任务黑色面板
    }

    drawGameOver() {
        // 移除原有的游戏结束画面绘制，现在通过drawUI处理
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    addTower(x, y, type) {
        const gridSize = 40;
        const offsetX = Math.max(gridSize * 2, (config.width - 12 * gridSize) / 2);
        const offsetY = Math.max(gridSize * 2, (config.height - 14 * gridSize) / 2);
        
        // 检查是否在有效的网格范围内
        if (x < offsetX || x > offsetX + 12 * gridSize || 
            y < offsetY || y > offsetY + 14 * gridSize) {
            console.log('超出有效范围');
            return false;
        }

        // 检查是否有足够的金钱
        const towerConfig = TOWER_TYPES[type];
        if (this.money < towerConfig.cost) {
            console.log('金钱不足');
            return false;
        }

        // 检查位置是否已经有塔
        const hasTower = this.towers.some(tower => {
            const dx = tower.x - x;
            const dy = tower.y - y;
            return Math.sqrt(dx * dx + dy * dy) < gridSize * 0.6; // 减小检测距离
        });
        if (hasTower) {
            console.log('该位置已有防御塔');
            return false;
        }

        // 检查是否在路径上或太靠近路径 - 减小安全距离使更多格子可放置
        const isOnPath = this.path.some(point => {
            const dx = point.x - x;
            const dy = point.y - y;
            return Math.sqrt(dx * dx + dy * dy) < gridSize * 0.5; // 从0.8减小到0.5
        });
        if (isOnPath) {
            console.log('不能在路径上放置防御塔');
            return false;
        }

        // 创建新塔
        const tower = new Tower(x, y, towerConfig);
        this.towers.push(tower);
        this.money -= towerConfig.cost;
        console.log('成功放置防御塔:', {x, y, type});
        return true;
    }

    isClickTowerButton(x, y) {
        const towerButtonSize = 50;
        const padding = 10;
        const startX = config.width - (Object.keys(TOWER_TYPES).length * (towerButtonSize + padding));
        const startY = config.height - towerButtonSize - 20;

        Object.keys(TOWER_TYPES).forEach((type, index) => {
            const buttonX = startX + (towerButtonSize + padding) * index;
            const buttonY = startY;
            
            if (x >= buttonX && x <= buttonX + towerButtonSize &&
                y >= buttonY && y <= buttonY + towerButtonSize) {
                this.selectedTowerType = type;
                return true;
            }
        });
        return false;
    }

    drawCastle() {
        const endpoint = this.path[this.path.length - 1];
        const castleSize = 100;  // 增大城堡尺寸
        
        // 保存当前上下文状态
        this.ctx.save();
        
        // 确保城堡绘制在最上层
        this.ctx.globalCompositeOperation = 'source-over';
        
        // 添加城堡发光效果
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 20;
        
        // 计算城堡位置，确保完全显示
        const castleX = Math.min(Math.max(endpoint.x, castleSize/2), config.width - castleSize/2);
        const castleY = Math.min(Math.max(endpoint.y, castleSize/2), config.height - castleSize/2);

        // 绘制城堡主体
        this.ctx.fillStyle = '#8B4513';  // 深棕色
        this.ctx.fillRect(castleX - castleSize/2, castleY - castleSize/2, castleSize, castleSize);

        // 绘制城堡顶部
        this.ctx.beginPath();
        this.ctx.moveTo(castleX - castleSize/2 - 15, castleY - castleSize/2);
        this.ctx.lineTo(castleX + castleSize/2 + 15, castleY - castleSize/2);
        this.ctx.lineTo(castleX, castleY - castleSize);
        this.ctx.closePath();
        this.ctx.fillStyle = '#A0522D';  // 褐色
        this.ctx.fill();

        // 绘制城堡窗户
        this.ctx.fillStyle = '#FFD700';  // 金色
        const windowSize = castleSize/5;
        this.ctx.fillRect(castleX - castleSize/3, castleY - castleSize/3, windowSize, windowSize);
        this.ctx.fillRect(castleX + castleSize/6, castleY - castleSize/3, windowSize, windowSize);
        this.ctx.fillRect(castleX - windowSize/2, castleY, windowSize, windowSize * 1.5);

        // 绘制城堡装饰
        this.ctx.fillStyle = '#CD853F';
        for(let i = 0; i < 3; i++) {
            this.ctx.fillRect(
                castleX - castleSize/2 + (i * castleSize/2) - 10,
                castleY - castleSize/2 - 15,
                20,
                20
            );
        }

        // 绘制城堡生命值条
        const healthBarWidth = castleSize * 1.2;
        const healthBarHeight = 15;
        const barX = castleX - healthBarWidth/2;
        const barY = castleY - castleSize - 30;

        // 绘制血条背景
        this.ctx.shadowBlur = 0;  // 移除发光效果
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        this.ctx.fillRect(barX, barY, healthBarWidth, healthBarHeight);

        // 绘制当前血量
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        this.ctx.fillRect(barX, barY, (this.castleHealth / 100) * healthBarWidth, healthBarHeight);

        // 绘制血条边框和描边
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(barX, barY, healthBarWidth, healthBarHeight);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(barX, barY, healthBarWidth, healthBarHeight);

        // 绘制血条数值
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(`${this.castleHealth}/100`, castleX, barY + healthBarHeight - 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`${this.castleHealth}/100`, castleX, barY + healthBarHeight - 2);

        // 恢复上下文状态
        this.ctx.restore();
    }

    showLevelComplete() {
        this.isPaused = true;
        setTimeout(() => {
            this.currentLevel++;
            this.currentWave = 0;
            this.wave = 1;
            this.money = LEVEL_CONFIG[this.currentLevel].startMoney;
            this.levelCompleted = false;
            this.isPaused = false;
            this.spawnWave();
        }, 3000);
    }

    showGameComplete() {
        this.gameState = 'COMPLETE';
    }

    // 以下方法不再使用，但保留以防其他代码引用
    isClickSidebarRewardButton(x, y) {
        if (!SIDEBAR_CONFIG.enabled) return false;
        
        const { x: buttonX, y: buttonY, size: buttonSize } = SIDEBAR_CONFIG.icon;
        
        return x >= buttonX - buttonSize/2 && 
               x <= buttonX + buttonSize/2 && 
               y >= buttonY - buttonSize/2 && 
               y <= buttonY + buttonSize/2;
    }

    handleSidebarReward() {
        if (!SIDEBAR_CONFIG.enabled) return;
        
        // 显示介绍界面，而不是直接跳转到侧边栏
        this.showIntroduction = true;
        this.introductionAlpha = 0;
        
        console.log('显示侧边栏介绍界面');
    }

    // 跳转到侧边栏方法
    navigateToSidebar() {
        if (!SIDEBAR_CONFIG.enabled) return;
        
        // 设置状态，表示即将从侧边栏返回
        this.returnedFromSidebar = true;
        
        // 跳转到侧边栏
        tt.navigateToScene({
            scene: "sidebar",
            success: () => {
                console.log('跳转侧边栏成功');
            },
            fail: (err) => {
                console.error('跳转侧边栏失败:', err);
                tt.showToast({
                    title: '跳转失败，请稍后重试',
                    icon: 'none',
                    duration: 2000
                });
                
                // 如果跳转失败，重置状态
                this.returnedFromSidebar = false;
            }
        });
    }
    
    // 用户领取奖励
    collectReward() {
        if (this.rewardCollected) {
            // 如果已经领取过奖励，提示用户
            tt.showToast({
                title: '您已领取过奖励',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        
        // 给玩家增加金钱
        this.money += 100;
        this.rewardCollected = true;
        
        // 显示获得奖励提示
        tt.showToast({
            title: '恭喜获得100金币!',
            icon: 'success',
            duration: 2000
        });
        
        // 关闭介绍界面
        this.showIntroduction = false;
    }

    // 添加一个新方法来绘制网格区域的半透明覆盖层
    drawGridAreaOverlay() {
        const gridSize = 40;
        const offsetX = Math.max(gridSize * 2, (config.width - 12 * gridSize) / 2);
        const offsetY = Math.max(gridSize * 2, (config.height - 14 * gridSize) / 2);
        const width = 12 * gridSize;
        const height = 14 * gridSize;
        
        // 保存当前上下文状态
        this.ctx.save();
        
        // 使用正确的合成模式 - 让新绘制的内容显示在上面
        this.ctx.globalCompositeOperation = 'source-over';
        
        // 绘制一个暗灰色半透明区域，可以看到下面的背景但不那么刺眼
        this.ctx.fillStyle = 'rgba(60, 60, 60, 0.6)';
        this.ctx.fillRect(offsetX, offsetY, width, height);
        
        // 绘制一个适当亮度的网格线
        this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        this.ctx.lineWidth = 0.5;
        
        // 绘制垂直线
        for (let x = 0; x <= width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX + x, offsetY);
            this.ctx.lineTo(offsetX + x, offsetY + height);
            this.ctx.stroke();
        }
        
        // 绘制水平线
        for (let y = 0; y <= height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX, offsetY + y);
            this.ctx.lineTo(offsetX + width, offsetY + y);
            this.ctx.stroke();
        }
        
        // 标记不可放置区域 - 在路径和已有塔附近的格子显示为红色半透明
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // 红色半透明
        
        // 遍历每个格子
        for (let x = 0; x < 12; x++) {
            for (let y = 0; y < 14; y++) {
                const centerX = offsetX + x * gridSize + gridSize / 2;
                const centerY = offsetY + y * gridSize + gridSize / 2;
                
                // 检查是否在路径上或太靠近路径
                const isOnPath = this.path.some(point => {
                    const dx = point.x - centerX;
                    const dy = point.y - centerY;
                    return Math.sqrt(dx * dx + dy * dy) < gridSize * 0.5; // 减小到0.5，与addTower保持一致
                });
                
                // 检查是否已经有塔
                const hasTower = this.towers.some(tower => {
                    const dx = tower.x - centerX;
                    const dy = tower.y - centerY;
                    return Math.sqrt(dx * dx + dy * dy) < gridSize * 0.6; // 减小到0.6，与addTower保持一致
                });
                
                // 如果不能放置，就填充红色
                if (isOnPath || hasTower) {
                    this.ctx.fillRect(
                        offsetX + x * gridSize, 
                        offsetY + y * gridSize, 
                        gridSize, 
                        gridSize
                    );
                }
            }
        }
        
        // 恢复上下文状态
        this.ctx.restore();
    }

    // 添加一个新方法来显示侧边栏指引
    showSidebarGuide() {
        // 简化的侧边栏引导功能
        this.showIntroduction = true;
        this.introductionAlpha = 0;
        
        console.log('显示侧边栏引导');
    }

    // 绘制介绍界面
    drawIntroduction() {
        if (!this.showIntroduction) return;
        
        // 如果正在显示介绍界面，更新透明度（淡入效果）
        if (this.introductionAlpha < 0.9) {
            this.introductionAlpha += 0.05;
        }
        
        const { width, height } = config;
        
        // 设置半透明黑色背景
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.introductionAlpha * 0.7})`;
        this.ctx.fillRect(0, 0, width, height);
        
        // 根据状态选择显示哪个引导图片
        let guideImageKey = this.returnedFromSidebar ? 'sidebarGuide2' : 'sidebarGuide';
        const guideImage = this.resourceLoader.getImage(guideImageKey);
        
        if (guideImage) {
            // 根据屏幕大小调整图片尺寸，保持原始比例
            const imgRatio = guideImage.width / guideImage.height;
            const cardWidth = width * 0.9; // 稍微扩大卡片宽度以适应图片
            const cardHeight = cardWidth / imgRatio;
            const cardX = (width - cardWidth) / 2;
            const cardY = (height - cardHeight) / 2;
            
            // 绘制图片，使用透明度过渡效果
            this.ctx.globalAlpha = this.introductionAlpha;
            this.ctx.drawImage(guideImage, cardX, cardY, cardWidth, cardHeight);
            this.ctx.globalAlpha = 1.0;
            
            // 根据状态选择按钮文本
            const buttonText = this.returnedFromSidebar ? '领取奖励' : '进入侧边栏';
            
            // 绘制按钮，放在图片下方
            const buttonWidth = cardWidth * 0.6;
            const buttonHeight = 60;
            const buttonX = (width - buttonWidth) / 2;
            const buttonY = cardY + cardHeight - buttonHeight - 40;
            
            // 按钮背景颜色根据状态改变
            this.ctx.fillStyle = this.returnedFromSidebar 
                ? `rgba(59, 230, 171, ${this.introductionAlpha})` // 第二张图片用绿色按钮
                : `rgba(59, 200, 171, ${this.introductionAlpha})`; // 第一张图片用浅绿色按钮
                
            this.ctx.beginPath();
            this.drawRoundRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
            this.ctx.fill();
            
            // 按钮文字
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.introductionAlpha})`;
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(buttonText, width / 2, buttonY + buttonHeight / 2 + 8);
            
            // 绘制关闭按钮
            const closeSize = 44;
            const closeX = cardX + cardWidth - 30;
            const closeY = cardY + 30;
            
            this.ctx.fillStyle = `rgba(0, 0, 0, ${this.introductionAlpha * 0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(closeX, closeY, closeSize / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(closeX - 12, closeY - 12);
            this.ctx.lineTo(closeX + 12, closeY + 12);
            this.ctx.moveTo(closeX + 12, closeY - 12);
            this.ctx.lineTo(closeX - 12, closeY + 12);
            this.ctx.stroke();
        } else {
            // 如果图片未加载，显示错误信息
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.introductionAlpha})`;
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('侧边栏引导图片加载失败，请重试', width / 2, height / 2);
        }
    }
    
    // 检查是否点击了介绍界面上的按钮
    isClickIntroductionButton(x, y) {
        if (!this.showIntroduction) return false;
        
        const { width, height } = config;
        
        // 获取引导图片
        const guideImage = this.resourceLoader.getImage('sidebarGuide') || this.resourceLoader.getImage('sidebarGuide2');
        
        if (guideImage) {
            // 计算图片尺寸和位置
            const imgRatio = guideImage.width / guideImage.height;
            const cardWidth = width * 0.9;
            const cardHeight = cardWidth / imgRatio;
            const cardX = (width - cardWidth) / 2;
            const cardY = (height - cardHeight) / 2;
            
            // 计算按钮的位置
            const buttonWidth = cardWidth * 0.6;
            const buttonHeight = 60;
            const buttonX = (width - buttonWidth) / 2;
            const buttonY = cardY + cardHeight - buttonHeight - 40;
            
            // 检查点击是否在按钮范围内
            return (
                x >= buttonX && 
                x <= buttonX + buttonWidth && 
                y >= buttonY && 
                y <= buttonY + buttonHeight
            );
        }
        
        return false;
    }
    
    // 检查是否点击了介绍界面的关闭按钮
    isClickIntroductionCloseButton(x, y) {
        if (!this.showIntroduction) return false;
        
        const { width, height } = config;
        
        // 获取引导图片
        const guideImage = this.resourceLoader.getImage('sidebarGuide') || this.resourceLoader.getImage('sidebarGuide2');
        
        if (guideImage) {
            // 计算图片尺寸和位置
            const imgRatio = guideImage.width / guideImage.height;
            const cardWidth = width * 0.9;
            const cardHeight = cardWidth / imgRatio;
            const cardX = (width - cardWidth) / 2;
            const cardY = (height - cardHeight) / 2;
            
            // 计算关闭按钮位置
            const closeSize = 44;
            const closeX = cardX + cardWidth - 30;
            const closeY = cardY + 30;
            
            // 检查与圆形关闭按钮的距离
            const distance = Math.sqrt(Math.pow(x - closeX, 2) + Math.pow(y - closeY, 2));
            return distance <= closeSize / 2;
        }
        
        return false;
    }
    
    start() {
        if (SIDEBAR_CONFIG.enabled) {
            // 仅检测是否从侧边栏进入
            tt.onShow((res) => {
                this.isFromSidebar = (res.launch_from === 'homepage' && res.location === 'sidebar_card');
                if (this.isFromSidebar) {
                    console.log('用户从侧边栏进入游戏');
                }
            });
        }
    }

    // 删除复杂的waitForSidebarReturn方法，不需要奖励逻辑
}

class Enemy {
    constructor(x, y, config, path) {
        this.x = x;
        this.y = y;
        this.health = config.health;
        this.maxHealth = config.health;
        this.speed = config.speed;
        this.value = config.value;
        this.path = path;
        this.currentPathIndex = 0;
        this.reachedEnd = false;
        this.type = config.type || Object.keys(ENEMY_TYPES)[Math.floor(Math.random() * Object.keys(ENEMY_TYPES).length)];
        
        // 获取精灵配置
        this.spriteConfig = SPRITE_CONFIG[this.type];
        this.size = this.spriteConfig.size || 40;  // BOSS使用特定大小
        
        // 动画相关属性
        if (!this.spriteConfig.isBoss) {
            this.currentFrame = 0;
            this.frameCount = this.spriteConfig.animations.frames;
            this.animationSpeed = 0.15;
            this.frameTime = 0;
        }
    }

    update() {
        if (this.currentPathIndex >= this.path.length) {
            this.reachedEnd = true;
        return;
      }

        const target = this.path[this.currentPathIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.speed) {
            this.currentPathIndex++;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }

        // 更新动画帧
        this.frameTime += this.animationSpeed;
        if (this.frameTime >= 1) {
            this.frameTime = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            game.effectSystem.addExplosion(this.x, this.y);
        }
        return this.health <= 0;
    }

    draw(ctx) {
        // 获取当前动画帧的图片
        const currentImage = game.resourceLoader.getImage(this.spriteConfig.animations.walk[this.currentFrame]);
        if (currentImage) {
            // 绘制怪物
            ctx.drawImage(
                currentImage,
                this.x - this.size/2,
                this.y - this.size/2,
                this.size,
                this.size
            );

            // 绘制血条背景
            const healthBarWidth = this.size;
            const healthBarHeight = this.spriteConfig.isBoss ? 8 : 4;  // BOSS血条更粗
            const barX = this.x - healthBarWidth/2;
            const barY = this.y - this.size/2 - 15;  // BOSS血条位置稍高

            // 绘制血条背景
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(barX, barY, healthBarWidth, healthBarHeight);

            // 绘制当前血量
            ctx.fillStyle = this.spriteConfig.isBoss ? '#ff0000' : '#00ff00';  // BOSS红色血条
            ctx.fillRect(barX, barY, (this.health / this.maxHealth) * healthBarWidth, healthBarHeight);

            // 如果是BOSS，添加特效
            if (this.spriteConfig.isBoss) {
                // 添加发光效果
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
}

class Tower {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.damage = config.damage;
        this.range = config.range;
        this.color = config.color;
        this.fireRate = config.fireRate;
        this.lastFireTime = 0;
        this.type = config.image;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.lastFrameUpdate = Date.now();
        this.isAttacking = false;
        this.target = null;
        this.direction = 1;
        this.size = 40; // 设置炮台大小
    }

    draw(ctx) {
        // 绘制攻击范围
        if (this.target) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.stroke();
        }

        // 根据塔的类型获取对应的图片
        const towerImage = game.resourceLoader.getImage(this.type);  // 使用this.type获取对应图片
        
        if (towerImage) {
            // 保存当前上下文状态
            ctx.save();
            
            // 移动到炮台中心点
            ctx.translate(this.x, this.y);
            
            // 如果有目标，计算旋转角度
            if (this.target) {
                const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
                ctx.rotate(angle);
            }
            
            // 绘制防御塔图片
            ctx.drawImage(
                towerImage,
                -this.size / 2,  // 使图片居中
                -this.size / 2,
                this.size,
                this.size
            );
            
            // 恢复上下文状态
            ctx.restore();
        }
    }

    update(enemies) {
        const now = Date.now();
        this.target = this.findTarget(enemies);
        
        if (this.target) {
            this.isAttacking = true;
            if (now - this.lastFireTime >= 1000 / this.fireRate) {
                this.shoot(this.target);
                this.lastFireTime = now;
            }
        } else {
            this.isAttacking = false;
            this.currentFrame = 0;
        }
    }

    findTarget(enemies) {
        return enemies.find(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= this.range;
        });
    }

    shoot(target) {
        const projectile = new Projectile(this.x, this.y, target, this.damage);
        game.projectiles.push(projectile);
    }
}

class Projectile {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 5;
        this.hit = false;
        this.type = Object.keys(VISUAL_CONFIG.projectiles)[Math.floor(Math.random() * Object.keys(VISUAL_CONFIG.projectiles).length)];
    }

    update() {
        if (this.hit) return;

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.speed) {
            this.hit = true;
            if (this.target.takeDamage(this.damage)) {
                const enemyIndex = game.enemies.indexOf(this.target);
                if (enemyIndex > -1) {
                    game.money += this.target.value;
                    game.enemies.splice(enemyIndex, 1);
                }
            }
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    draw(ctx) {
        const visual = VISUAL_CONFIG.projectiles[this.type || 'BASIC'];
        
        // 绘制尾迹
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        const tailLength = 15;
        ctx.lineTo(
            this.x - Math.cos(angle) * tailLength,
            this.y - Math.sin(angle) * tailLength
        );
        ctx.strokeStyle = visual.tailColor;
        ctx.lineWidth = visual.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 绘制子弹
        ctx.beginPath();
        ctx.arc(this.x, this.y, visual.size, 0, Math.PI * 2);
        ctx.fillStyle = visual.color;
        ctx.fill();
        
        // 绘制光晕效果
        ctx.beginPath();
        ctx.arc(this.x, this.y, visual.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = visual.tailColor;
        ctx.fill();
    }
}

class EffectSystem {
    constructor() {
        this.effects = [];
    }

    addExplosion(x, y) {
        const effect = VISUAL_CONFIG.effects.explosion;
        for (let i = 0; i < effect.particleCount; i++) {
            const angle = (Math.PI * 2 * i) / effect.particleCount;
            const speed = 2 + Math.random() * 2;
            this.effects.push({
                type: 'explosion',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: effect.colors[Math.floor(Math.random() * effect.colors.length)],
                size: 3 + Math.random() * 3,
                life: effect.duration,
                maxLife: effect.duration
            });
        }
    }

    update() {
        this.effects = this.effects.filter(effect => {
            effect.x += effect.vx;
            effect.y += effect.vy;
            effect.life -= 16; // 假设60fps
            return effect.life > 0;
        });
    }

    draw(ctx) {
        this.effects.forEach(effect => {
            const alpha = effect.life / effect.maxLife;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
            ctx.fillStyle = effect.color;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
}

let game = null;

function startGame() {
    if (!game) {
        game = new Game();
    }
    return game;
}

tt.onShow(() => {
    startGame();
});
