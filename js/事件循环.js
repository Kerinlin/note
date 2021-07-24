/*
  1. 什么是事件循环机制？
  可以对同步事件以及异步事件进行调度的一种机制

  2.为什么需要事件循环？
    js单线程，代码由上至下执行，如果没有这个机制，容易阻塞，为了更好的执行效率，避免阻塞，达到非阻塞的功能。
  3. 两种任务？
    宏任务： setTimeout  setInterval
    微任务： promise.then()...
  4. node 与浏览器 事件循环机制区别

   跟node版本有关，v10版本之前，node是先执行完一个阶段中的所有任务，再执行微任务，比如下面例子，v10之前是s1=>s2=>n1=>n2,v10之后是s1=>n1=>s2=>n2

   setTimeout(function() {
    console.log('s1');
    new Promise(function(resolve) {
        resolve();
    }).then(() => {
        console.log('n1');
    })
  }, 0)

  setTimeout(function() {
    console.log('s2');
    new Promise(function(resolve) {
        resolve();
    }).then(() => {
        console.log('n2');
    })
}, 0)
*/




setTimeout(function() {
    console.log(" set1");
    new Promise(function(resolve) {
        resolve();
    }).then(function() {
        new Promise(function(resolve) {
            resolve();
        }).then(function() {
            console.log("then4");
        });
        console.log("then2 ");
    });
});

new Promise(function(resolve) {
    console.log("pr1");
    resolve();
}).then(function() {
    console.log("then1");
});

setTimeout(function() {
    console.log("set2");
});

console.log(2);

new Promise(function(resolve) {
    resolve();
}).then(function() {
    console.log("then3");
});

//开始执行，检测到第一个settimeout，将其放入宏任务队列（s1）

//然后向下执行发现Promise第一个函数内存在同步代码打印pr1,然后检测到应该打印then1的微任务，将其放入微任务队列（w1）

//pr1

//向下执行发现第二个宏任务，将其放入宏任务队列（s2）

//向下执行发现同步代码，打印2
//2

//再向下执行发现打印then3的微任务(w2),将其放入微任务队列，此时发现主线程为空，开始执行微任务

//执行微任务w1,打印then1
//then1

//执行微任务2
//then3

//第一轮微任务执行完毕，微任务队列为空，开始执行下一轮宏任务，进入s1

//发现同步代码 set1,执行
//set1

//发现2个微任务，分别为打印then2的w1,打印then4的w2

//主线程为空，开始执行微任务w1,w2，依次打印
//then2
//then4

//上一轮宏任务执行完毕，开始执行下一轮宏任务，进入s2

//打印set2
//set2



//pr1
//2
//then1
//then3
//set1
//then2
//then4
//set2

//注意点
//promise中.then，.catch属于微任务，但是promise内函数代码是属于同步代码