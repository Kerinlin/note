/*
1.原理核心

赋值，执行，删除
obj.getName = getName;
obj.getName();
delete obj.getName;

2. 重新实现
见下面代码
*/
let obj = {
    name: 'oyc'
}

function getName(age, sex) {
    console.log(this.name, age, sex);
}

// 实现
// 挂载到函数原型上实现

!(function(prototype) {
    // 限制参数类型
    function checkDefaultType(context) {
        if (context === null) {
            // 如果未指定上下文，默认为全局对象
            context = window;
        }
        let types = ['string', 'number', 'symbol', 'boolean', 'undefined', 'bigint'];
        let contextType = typeof(context);

        // 如果context不是引用数据类型,将其转换成引用数据类型
        if (types.includes(contextType)) {
            context = Object(context);
        }
        return context;
    }

    // 重新实现call
    function reCall(context, ...args) {
        context = checkDefaultType(context);
        // 保证函数名的唯一
        let sym = Symbol('fn');

        // this指向函数的调用者(本例中的getName)
        context[sym] = this;
        context[sym](...args);
        delete context[sym];
    }

    // 重新实现apply
    // apply与call区别仅仅是传入参数类型不同，apply接受数组
    function reApply(context, args) {
        context = checkDefaultType(context);
        // 保证函数名的唯一
        let sym = Symbol('fn');

        // this指向函数的调用者(本例中的getName)
        context[sym] = this;
        context[sym](...args);
        delete context[sym];
    }

    //重新实现Bind
    function reBind(context, ...outArgs) {
        return (...args) => this.call(context, ...outArgs, ...args);
    }

    prototype.reCall = reCall;
    prototype.reApply = reApply;
    prototype.reBind = reBind;
})(Function.prototype)

getName.call(obj, 18, '男');
getName.apply(obj, [19, '男']);

// bind返回一个函数
const bindGetName = getName.bind(obj, 28);
bindGetName('男');

// 重新实现返回结果
getName.reCall(obj, 20, '男');
getName.reApply(obj, [21, '男']);
const bindGetName2 = getName.reBind(obj, 35);
bindGetName2('男');