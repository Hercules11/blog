var { spawn } = require('child_process');

hexo.on('new', function (data) {
    // spawn("D:\\Typora\\Typora.exe", [data.path]);
    spawn("D:/Typora/Typora.exe", [data.path]);
})