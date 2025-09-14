// 等待文档加载完毕后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面上的所有元素
    const urlInput = document.getElementById('m3u8-url');
    const playBtn = document.getElementById('play-btn');
    const closeBtn = document.getElementById('close-btn');
    const videoPlayer = document.getElementById('video-player');
    const playerWrapper = document.getElementById('player-wrapper');

    // 初始化一个 hls 实例变量
    let hls = null;

    // "播放" 按钮的点击事件
    playBtn.addEventListener('click', playVideo);

    // "关闭" 按钮的点击事件
    closeBtn.addEventListener('click', closeVideo);

    // 允许在输入框中按回车键来触发播放
    urlInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            playVideo();
        }
    });

    /**
     * 播放视频的函数
     */
    function playVideo() {
        const m3u8Url = urlInput.value.trim();

        // 检查URL是否为空
        if (!m3u8Url) {
            alert('请输入有效的 M3U8 链接！');
            return;
        }

        // 销毁上一个 hls 实例（如果存在），以便播放新的视频流
        if (hls) {
            hls.destroy();
        }

        // 检查浏览器是否支持 HLS
        if (Hls.isSupported()) {
            // 创建新的 Hls 实例
            hls = new Hls();
            // 加载 m3u8 链接
            hls.loadSource(m3u8Url);
            // 将 Hls 实例附加到 video 元素上
            hls.attachMedia(videoPlayer);
            // 当清单解析成功后，自动播放视频
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoPlayer.play();
                console.log('视频开始播放');
            });
            // 监听错误事件
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error('发生致命错误:', data.type);
                    alert(`加载视频失败: ${data.details}`);
                }
            });
        }
        // 对于原生支持 HLS 的设备（如 Safari）
        else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = m3u8Url;
            videoPlayer.addEventListener('loadedmetadata', () => {
                videoPlayer.play();
                console.log('视频开始播放 (原生支持)');
            });
        } else {
            alert('您的浏览器不支持 HLS 播放。');
        }
    }

    /**
     * 关闭视频的函数
     */
    function closeVideo() {
        // 暂停视频
        videoPlayer.pause();
        // 清空视频源
        videoPlayer.src = '';

        // 如果存在 hls 实例，销毁它以释放资源
        if (hls) {
            hls.destroy();
            hls = null; // 将实例设为 null
        }

        console.log('视频已关闭');
    }
});