// 测试火山喷发效果
console.log('火山喷发测试脚本加载');

// 在游戏初始化完成后执行
tt.onShow(() => {
    // 等待游戏完全初始化
    setTimeout(() => {
        // 确保游戏实例已存在
        if (!game) {
            console.error('游戏实例未初始化');
            return;
        }
        
        console.log('添加火山喷发测试按钮');
        
        // 添加测试按钮回调
        game.testVolcanoButton = {
            x: 160,
            y: 70,
            width: 160,
            height: 40,
            text: '触发火山喷发',
            onClick: () => {
                // 创建火山喷发效果
                console.log('触发火山喷发');
                
                // 在屏幕中心位置创建火山喷发
                const x = config.width / 2;
                const y = config.height / 2 + 100;
                
                // 创建火山喷发效果
                game.createVolcano(x, y, 8000, 'high');
            }
        };
        
        // 扩展Game类的drawUI方法以绘制测试按钮
        const originalDrawUI = game.drawUI;
        game.drawUI = function() {
            // 调用原始方法
            originalDrawUI.call(this);
            
            // 如果存在测试按钮配置，绘制测试按钮
            if (this.testVolcanoButton) {
                const btn = this.testVolcanoButton;
                
                // 绘制按钮背景
                this.ctx.fillStyle = '#fe5722';
                this.ctx.beginPath();
                this.drawRoundRect(btn.x, btn.y, btn.width, btn.height, 8);
                this.ctx.fill();
                
                // 绘制按钮描边
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // 绘制按钮文字
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 18px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(btn.text, btn.x + btn.width/2, btn.y + btn.height/2);
            }
        };
        
        // 扩展触摸事件处理以检测按钮点击
        const originalTouchStart = tt.onTouchStart;
        tt.onTouchStart = function(callback) {
            return originalTouchStart((event) => {
                // 执行原始回调
                callback(event);
                
                // 检查是否点击了测试按钮
                const touch = event.touches[0];
                const touchX = touch.clientX;
                const touchY = touch.clientY;
                
                // 如果游戏实例和测试按钮存在
                if (game && game.testVolcanoButton) {
                    const btn = game.testVolcanoButton;
                    
                    // 检查点击是否在按钮范围内
                    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
                        touchY >= btn.y && touchY <= btn.y + btn.height) {
                        // 触发按钮点击
                        btn.onClick();
                    }
                }
            });
        };
        
        console.log('火山喷发测试脚本初始化完成');
    }, 2000);
});
